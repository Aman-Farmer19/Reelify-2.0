from flask import Flask, request, jsonify, send_from_directory
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import os
import openai
try:
    import google.generativeai as genai
except ImportError:
    genai = None
import requests
import json
from dotenv import load_dotenv

load_dotenv()

# ─── Paths ────────────────────────────────────────────────────────────────────
# The built React app lives at ../frontend/dist relative to this file
DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist")
DIST_DIR = os.path.normpath(DIST_DIR)

app = Flask(__name__, static_folder=None)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "reelify-secret-dev-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
jwt = JWTManager(app)

openai.api_key = os.getenv("OPENAI_API_KEY")

# ─── In-memory store (replace with MongoDB/PostgreSQL in production) ──────────
users_db = {}   # { email: { name, password_hash, email } }
videos_db = {}  # { user_email: [video, ...] }


# ─── Auth routes ─────────────────────────────────────────────────────────────
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not all([name, email, password]):
        return jsonify({"error": "All fields are required"}), 400
    if email in users_db:
        return jsonify({"error": "Email already registered"}), 409

    users_db[email] = {
        "name": name,
        "email": email,
        "password_hash": generate_password_hash(password),
    }
    videos_db[email] = []

    token = create_access_token(identity=email)
    return jsonify({
        "token": token,
        "user": {"name": name, "email": email},
        "message": "Account created successfully"
    }), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = users_db.get(email)
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=email)
    return jsonify({
        "token": token,
        "user": {"name": user["name"], "email": email},
        "message": "Login successful"
    }), 200


# ─── Video routes ─────────────────────────────────────────────────────────────
@app.route("/api/videos", methods=["GET"])
@jwt_required()
def get_videos():
    email = get_jwt_identity()
    return jsonify({"videos": videos_db.get(email, [])}), 200


@app.route("/api/generate", methods=["POST"])
def generate_video():
    """
    Main AI generation endpoint.
    Uses AI to generate a script and extracts keywords,
    then searches Pexels for a matching stock video.
    """
    data = request.get_json()
    prompt = data.get("prompt", "").strip()
    options = data.get("options", {})

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Generate script and search query
    script, search_query = generate_script_with_ai(prompt, options)

    # Fetch matching video from Pexels
    download_url = search_pexels_video(search_query)

    # Wrap the remote URL in our local streaming proxy to prevent CORS blocks
    import urllib.parse
    wrapped_url = f"/api/video_stream?url={urllib.parse.quote(download_url)}" if download_url.startswith("http") else download_url

    # Build result
    title = prompt[:50] + "..." if len(prompt) > 50 else prompt
    result = {
        "title": title,
        "script": script,
        "duration": options.get("duration", "60 seconds"),
        "format": options.get("format", "9:16"),
        "style": options.get("style", "Cinematic"),
        "status": "completed",
        "download_url": wrapped_url,
        "tags": extract_tags(prompt),
        "views": "0",
    }

    # Save to user's videos if authenticated
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        try:
            from flask_jwt_extended import decode_token
            token = auth_header.split(" ")[1]
            decoded = decode_token(token)
            email = decoded["sub"]
            videos_db.setdefault(email, []).insert(0, result)
        except Exception:
            pass

    return jsonify(result), 200


def parse_ai_json(text: str, default_query: str) -> tuple:
    """Safely parse AI JSON response for script and search query."""
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    try:
        data = json.loads(cleaned)
        return data.get("script", ""), data.get("search_query", default_query)
    except Exception:
        # Fallback if AI returned plain text instead of JSON
        return text, default_query


def search_pexels_video(query: str) -> str:
    """Search Pexels API for a matching stock video, with fallback to keyword-based stock links."""
    query_clean = query.strip().lower().replace('"', '').replace("'", "")

    # ─── Free Stock Video URLs Fallback (Mixkit) ─────────────────────────────
    fallback_map = {
        ("puppy", "dog", "animal", "pet", "cat"): "https://assets.mixkit.co/videos/preview/mixkit-dog-running-on-the-grass-in-slow-motion-42657-large.mp4",
        ("code", "dev", "tech", "laptop", "computer", "typing"): "https://assets.mixkit.co/videos/preview/mixkit-hand-typing-on-a-laptop-keyboard-41718-large.mp4",
        ("nature", "beach", "forest", "tree", "mountain", "ocean", "sea", "travel"): "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-thick-green-forest-42211-large.mp4",
        ("food", "cook", "kitchen", "chef", "bake", "eating", "recipe"): "https://assets.mixkit.co/videos/preview/mixkit-chopping-vegetables-on-a-cutting-board-41926-large.mp4",
        ("gym", "workout", "fitness", "pushup", "exercise", "run", "sport"): "https://assets.mixkit.co/videos/preview/mixkit-man-doing-push-ups-in-the-gym-42171-large.mp4"
    }

    # Check if query contains any of the target keywords
    matched_url = None
    for keywords, video_url in fallback_map.items():
        if any(kw in query_clean for kw in keywords):
            matched_url = video_url
            break

    pexels_key = os.getenv("PEXELS_API_KEY")
    if pexels_key:
        headers = {"Authorization": pexels_key}
        url = f"https://api.pexels.com/videos/search?query={query_clean}&per_page=3&size=medium"
        try:
            res = requests.get(url, headers=headers, timeout=8)
            if res.status_code == 200:
                data = res.json()
                videos = data.get("videos", [])
                if videos:
                    # Get the video files list
                    video_files = videos[0].get("video_files", [])
                    for vf in video_files:
                        # Prefer HD/SD quality mp4 files
                        if vf.get("quality") in ["hd", "sd"] and vf.get("file_type") == "video/mp4":
                            return vf.get("link")
                    if video_files:
                        return video_files[0].get("link")
        except Exception as e:
            print(f"[Pexels] Error searching '{query_clean}': {e}")

    # Fallback to matched keyword URL, otherwise use local demo video
    return matched_url if matched_url else "/demo.mp4"


def generate_script_with_ai(prompt: str, options: dict) -> tuple:
    """Generate script and matching search query using Gemini or OpenAI."""
    style = options.get("style", "dynamic")
    duration = options.get("duration", "60 seconds")

    system_prompt = (
        "You are a world-class short-form video scriptwriter. "
        "You MUST return a JSON object with two keys: 'script' and 'search_query'.\n"
        f"'script': Write a {duration} video script in a {style} style. Structure: hook (first 3s) -> 3 key points -> strong CTA. Keep sentences short. Write ONLY the script, no scene directions.\n"
        "'search_query': A simple search query (2-3 words, like 'puppy running', 'beach sunset', 'coding laptop') matching the visual theme of the prompt."
    )

    # Use first 2 words of prompt as a basic query fallback
    words = [w for w in prompt.split() if w.isalnum()]
    default_query = " ".join(words[:2]) if words else "coding"

    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel(
                model_name="gemini-3.5-flash",
                system_instruction=system_prompt
            )
            resp = model.generate_content(f"Write a script about: {prompt}")
            return parse_ai_json(resp.text, default_query)
        except Exception as e:
            print(f"[Gemini] Generation failed: {e}")

    if openai.api_key:
        try:
            resp = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Write a script about: {prompt}"},
                ],
                max_tokens=400,
                temperature=0.8,
            )
            return parse_ai_json(resp.choices[0].message.content, default_query)
        except Exception as e:
            print(f"[OpenAI] Generation failed: {e}")

    # Offline/Demo Fallback
    fallback_script = (
        f"[HOOK] Did you know that {prompt[:60]}? "
        "Here's what you need to know in under 60 seconds. "
        "[POINT 1] First, start with the fundamentals. "
        "[POINT 2] Next, apply what you've learned consistently. "
        "[POINT 3] Finally, track your progress and iterate. "
        "[CTA] Follow for more content like this every day!"
    )
    return fallback_script, default_query


def extract_tags(prompt: str) -> list:
    """Simple keyword extraction for video tags."""
    keywords = ["AI", "Tech", "Life", "Code", "Health", "Money", "Growth", "Dev"]
    tags = ["AI Generated"]
    prompt_lower = prompt.lower()
    for kw in keywords:
        if kw.lower() in prompt_lower:
            tags.append(kw)
    return tags[:4]


# ─── Health check ─────────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "Reelify API"}), 200


# ─── Serve/Stream Remote Videos to Bypass CORS/Hotlinking ───────────────────
@app.route("/api/video_stream")
def stream_video():
    video_url = request.args.get("url")
    if not video_url or video_url.startswith("/") or "localhost" in video_url:
        return send_from_directory(DIST_DIR, "demo.mp4")

    try:
        # Stream the video from the remote URL (Pexels / Mixkit)
        req = requests.get(video_url, stream=True, timeout=10)
        
        # Prepare headers for the response
        response_headers = {
            "Content-Type": req.headers.get("Content-Type", "video/mp4"),
            "Content-Length": req.headers.get("Content-Length"),
            "Accept-Ranges": "bytes"
        }
        # Filter out None values
        response_headers = {k: v for k, v in response_headers.items() if v is not None}
        
        def generate():
            for chunk in req.iter_content(chunk_size=4096):
                yield chunk
                
        return app.response_class(generate(), headers=response_headers, status=req.status_code)
    except Exception as e:
        print(f"[Streaming] Failed to stream from {video_url}: {e}")
        return send_from_directory(DIST_DIR, "demo.mp4")


# ─── Serve React Frontend ────────────────────────────────────────────────────
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """Serve the React app. For any non-API route, return index.html
    so that React Router can handle client-side routing."""
    # If the file exists in the dist folder, serve it (JS, CSS, images, etc.)
    file_path = os.path.join(DIST_DIR, path)
    if path and os.path.isfile(file_path):
        return send_from_directory(DIST_DIR, path)
    # Otherwise, serve index.html for SPA client-side routing
    return send_from_directory(DIST_DIR, "index.html")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Run the Reelify server")
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.getenv("PORT", 5000)),
        help="Port to run the server on (default: 5000)",
    )
    args = parser.parse_args()

    # Check if frontend is built
    if not os.path.isdir(DIST_DIR):
        print(f"[WARNING] Frontend build not found at: {DIST_DIR}")
        print("  Run 'npm run build' in the frontend/ directory first.")
        print("  API routes will still work, but the UI won't load.")
    else:
        print(f">> Serving React frontend from: {DIST_DIR}")

    print(f">> Reelify running on http://localhost:{args.port}")
    app.run(debug=True, port=args.port)
