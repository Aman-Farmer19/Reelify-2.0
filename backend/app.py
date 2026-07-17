from flask import Flask, request, jsonify, send_from_directory
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import os
import openai
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
    Uses OpenAI to generate a script from the user's prompt.
    In production, this would also call a video generation API
    (e.g. RunwayML, Luma, Kling) and return a video URL.
    """
    data = request.get_json()
    prompt = data.get("prompt", "").strip()
    options = data.get("options", {})

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Generate script using OpenAI
    script = generate_script_with_ai(prompt, options)

    # Build result
    title = prompt[:50] + "..." if len(prompt) > 50 else prompt
    result = {
        "title": title,
        "script": script,
        "duration": options.get("duration", "60 seconds"),
        "format": options.get("format", "9:16"),
        "style": options.get("style", "Cinematic"),
        "status": "completed",
        "download_url": "#",   # Replace with real video URL after video gen API call
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


def generate_script_with_ai(prompt: str, options: dict) -> str:
    """Generate a short-form video script using OpenAI GPT."""
    if not openai.api_key:
        # Fallback demo script when no API key is set
        return (
            f"[HOOK] Did you know that {prompt[:60]}? "
            "Here's what you need to know in under 60 seconds. "
            "[POINT 1] First, start with the fundamentals. "
            "[POINT 2] Next, apply what you've learned consistently. "
            "[POINT 3] Finally, track your progress and iterate. "
            "[CTA] Follow for more content like this every day!"
        )

    style = options.get("style", "dynamic")
    duration = options.get("duration", "60 seconds")

    system_prompt = (
        "You are a world-class short-form video scriptwriter. "
        f"Write a {duration} video script in a {style} style. "
        "Structure: hook (first 3s) -> 3 key points -> strong CTA. "
        "Keep sentences short. Write ONLY the script, no scene directions."
    )

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
        return resp.choices[0].message.content.strip()
    except Exception as e:
        return f"Script generation failed: {str(e)}. Please check your OpenAI API key."


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
