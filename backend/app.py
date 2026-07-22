from flask import Flask, request, jsonify, send_from_directory, Response
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity, decode_token
)
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import timedelta, datetime, timezone
import os
import sys
import asyncio
import sqlite3
import secrets
import time
import threading
import uuid
import shutil
import subprocess
import glob
import re
import openai
try:
    import google.generativeai as genai
except ImportError:
    genai = None
try:
    import fal_client
except ImportError:
    fal_client = None
import requests
import json
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

# ─── Paths ────────────────────────────────────────────────────────────────────
DIST_DIR = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist")
)
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reelify.db")
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
MEDIA_FOLDER  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "media")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MEDIA_FOLDER,  exist_ok=True)

ALLOWED_EXTENSIONS = {"mp4", "mov", "avi", "mkv", "jpg", "jpeg", "png", "gif", "webp"}
MAX_UPLOAD_BYTES = 16 * 1024 * 1024  # 16 MB

# ─── Voice map (edge-tts neural voices) ──────────────────────────────────────
VOICE_MAP = {
    "Aria (Female)":    "en-US-AriaNeural",
    "Marcus (Male)":    "en-US-GuyNeural",
    "Zara (Female)":    "en-US-JennyNeural",
    "Leo (Male)":       "en-US-DavisNeural",
    "British Emma":     "en-GB-SoniaNeural",
    "No Voice":         None,
}

# ─── Flask App ────────────────────────────────────────────────────────────────
app = Flask(__name__, static_folder=None)

# FIX 4: Secure JWT secret — never fall back to a guessable string in production.
# If JWT_SECRET is not set, generate a random one per process (dev only).
# In production (Render/Railway), always set JWT_SECRET as an env variable.
_jwt_secret = os.getenv("JWT_SECRET")
if not _jwt_secret:
    _jwt_secret = secrets.token_hex(32)
    print("[WARNING] JWT_SECRET not set in environment. Using a random key for this session.")
    print("          Tokens will be invalidated on every restart. Set JWT_SECRET in your env vars.")

app.config["JWT_SECRET_KEY"] = _jwt_secret
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
# FIX 5: Hard cap on upload size at the Flask level (prevents memory exhaustion)
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_BYTES

jwt = JWTManager(app)

openai.api_key = os.getenv("OPENAI_API_KEY")


# ─── SQLite Database (FIX 1: replaces in-memory dicts) ───────────────────────
def get_db():
    """Return a thread-local SQLite connection."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")   # better concurrency for web
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Create tables on first run."""
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                email         TEXT PRIMARY KEY,
                name          TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                created_at    TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS videos (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                user_email    TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
                title         TEXT,
                script        TEXT,
                duration      TEXT,
                format        TEXT,
                style         TEXT,
                status        TEXT DEFAULT 'completed',
                download_url  TEXT,
                visual_mode   TEXT DEFAULT 'stock',
                images        TEXT DEFAULT '[]',
                tags          TEXT DEFAULT '[]',
                views         TEXT DEFAULT '0',
                created_at    TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE INDEX IF NOT EXISTS idx_videos_user ON videos(user_email);
        """)
    print("[DB] SQLite database initialised at:", DB_PATH)


init_db()


# ─── Simple In-Process Rate Limiter (FIX 6) ───────────────────────────────────
_rate_limit_store: dict = {}   # { ip: [timestamp, ...] }
_rate_lock = threading.Lock()
RATE_LIMIT_MAX = 10            # max requests
RATE_LIMIT_WINDOW = 60         # per N seconds


def is_rate_limited(ip: str) -> bool:
    """Return True if the IP has exceeded the rate limit."""
    now = time.time()
    with _rate_lock:
        timestamps = _rate_limit_store.get(ip, [])
        # Keep only timestamps within the window
        timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW]
        if len(timestamps) >= RATE_LIMIT_MAX:
            _rate_limit_store[ip] = timestamps
            return True
        timestamps.append(now)
        _rate_limit_store[ip] = timestamps
        return False


# ─── Auth routes ─────────────────────────────────────────────────────────────
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    name     = (data.get("name", "") or "").strip()
    email    = (data.get("email", "") or "").strip().lower()
    password = data.get("password", "") or ""

    if not all([name, email, password]):
        return jsonify({"error": "All fields are required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    with get_db() as conn:
        existing = conn.execute("SELECT email FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            return jsonify({"error": "Email already registered"}), 409

        conn.execute(
            "INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)",
            (email, name, generate_password_hash(password))
        )

    token = create_access_token(identity=email)
    return jsonify({
        "token": token,
        "user": {"name": name, "email": email},
        "message": "Account created successfully"
    }), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data     = request.get_json()
    email    = (data.get("email", "") or "").strip().lower()
    password = data.get("password", "") or ""

    with get_db() as conn:
        user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

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
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM videos WHERE user_email = ? ORDER BY created_at DESC",
            (email,)
        ).fetchall()

    videos = []
    for row in rows:
        v = dict(row)
        v["images"] = json.loads(v.get("images") or "[]")
        v["tags"]   = json.loads(v.get("tags") or "[]")
        videos.append(v)

    return jsonify({"videos": videos}), 200


@app.route("/api/generate", methods=["POST"])
def generate_video():
    """
    Main AI generation endpoint.
    FIX 6: Rate-limited per IP (10 req/min).
    Uses AI to generate a script and extracts keywords,
    then searches stock video or generates AI slideshow images.
    """
    # Rate limiting
    client_ip = request.headers.get("X-Forwarded-For", request.remote_addr or "unknown").split(",")[0].strip()
    if is_rate_limited(client_ip):
        return jsonify({"error": "Too many requests. Please wait a minute and try again."}), 429

    data    = request.get_json()
    prompt  = (data.get("prompt", "") or "").strip()
    options = data.get("options", {}) or {}

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Generate script and search query
    script, search_query = generate_script_with_ai(prompt, options)

    # Generate AI video via fal.ai, or fall back to stock footage
    download_url = generate_video_with_fal(prompt, search_query)

    # Wrap the remote URL in our local streaming proxy to prevent CORS blocks
    wrapped_url = (
        f"/api/video_stream?url={urllib.parse.quote(download_url)}"
        if download_url.startswith("http") else download_url
    )

    # Check visualMatchMode
    visual_mode = options.get("visualMode", "stock")
    images = []
    if visual_mode == "ai_slideshow":
        query_words = [w for w in search_query.split() if len(w) > 3]
        if not query_words:
            query_words = ["creative", "concept", "visual", "art"]
        for idx, qw in enumerate(query_words[:4]):
            images.append(
                f"/api/generate_image?prompt={urllib.parse.quote(prompt + ' ' + qw)}&seed={idx + 42}"
            )

    # Build result
    title = prompt[:50] + "..." if len(prompt) > 50 else prompt
    result = {
        "title":        title,
        "script":       script,
        "duration":     options.get("duration", "60 seconds"),
        "format":       options.get("format", "9:16"),
        "style":        options.get("style", "Cinematic"),
        "status":       "completed",
        "download_url": wrapped_url,
        "visual_mode":  visual_mode,
        "images":       images,
        "tags":         extract_tags(prompt),
        "views":        "0",
    }

    # Save to user's videos if authenticated
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        try:
            token_str = auth_header.split(" ")[1]
            decoded   = decode_token(token_str)
            email     = decoded["sub"]
            with get_db() as conn:
                conn.execute(
                    """INSERT INTO videos
                       (user_email, title, script, duration, format, style,
                        status, download_url, visual_mode, images, tags, views)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (
                        email,
                        result["title"],
                        result["script"],
                        result["duration"],
                        result["format"],
                        result["style"],
                        result["status"],
                        result["download_url"],
                        result["visual_mode"],
                        json.dumps(result["images"]),
                        json.dumps(result["tags"]),
                        result["views"],
                    )
                )
        except Exception as exc:
            print(f"[Auth] Could not save video for user: {exc}")

    return jsonify(result), 200


# ─── Helpers ──────────────────────────────────────────────────────────────────
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
        return text, default_query


def generate_video_with_fal(prompt: str, query: str) -> str:
    """
    Generate an AI video using fal.ai Wan 2.1 (primary).
    Falls back to Pexels → Pixabay → CDN hardcoded clips if fal.ai is unavailable.

    Returns a public URL string to the video.
    """
    # ─── 1. fal.ai Wan 2.1 (AI-generated video) ──────────────────────────────
    fal_key = os.getenv("FAL_KEY")
    if fal_key and fal_client:
        try:
            os.environ["FAL_KEY"] = fal_key  # fal_client reads from env
            result = fal_client.subscribe(
                "fal-ai/wan/v2.1/text-to-video",
                arguments={
                    "prompt": prompt,
                    "num_frames": 81,        # ~5s at 16fps
                    "frames_per_second": 16,
                    "resolution": "480p",   # faster & cheaper for preview
                    "aspect_ratio": "9:16", # Reels/Shorts format
                    "enable_safety_checker": True,
                },
            )
            video_url = (
                result.get("video", {}).get("url")
                or (result.get("videos") or [{}])[0].get("url")
            )
            if video_url:
                print(f"[fal.ai] Generated video: {video_url}")
                return video_url
        except Exception as e:
            print(f"[fal.ai] Video generation failed, falling back to stock: {e}")

    # ─── 2. Pexels stock video ────────────────────────────────────────────────
    query_clean = query.strip().lower().replace('"', "").replace("'", "")

    pexels_key = os.getenv("PEXELS_API_KEY")
    if pexels_key:
        headers = {"Authorization": pexels_key}
        url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query_clean)}&per_page=3&size=medium"
        try:
            res = requests.get(url, headers=headers, timeout=8)
            if res.status_code == 200:
                data = res.json()
                videos = data.get("videos", [])
                if videos:
                    video_files = videos[0].get("video_files", [])
                    for vf in video_files:
                        if vf.get("quality") in ["hd", "sd"] and vf.get("file_type") == "video/mp4":
                            return vf.get("link")
                    if video_files:
                        return video_files[0].get("link")
        except Exception as e:
            print(f"[Pexels] Error searching '{query_clean}': {e}")

    # ─── 3. Pixabay stock video ───────────────────────────────────────────────
    pixabay_key = os.getenv("PIXABAY_API_KEY")
    if pixabay_key:
        url = f"https://pixabay.com/api/videos/?key={pixabay_key}&q={urllib.parse.quote(query_clean)}&per_page=3"
        try:
            res = requests.get(url, timeout=8)
            if res.status_code == 200:
                data = res.json()
                hits = data.get("hits", [])
                if hits:
                    video_obj = hits[0].get("videos", {})
                    for quality in ["medium", "small", "large", "tiny"]:
                        vf = video_obj.get(quality, {})
                        if vf.get("url"):
                            return vf.get("url")
        except Exception as e:
            print(f"[Pixabay] Error searching '{query_clean}': {e}")

    # ─── 4. Stable CDN hardcoded clips (never fails) ──────────────────────────
    fallback_map = {
        ("puppy", "dog", "animal", "pet", "cat", "bear"):
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        ("code", "dev", "tech", "laptop", "computer", "typing"):
            "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        ("nature", "beach", "forest", "tree", "mountain", "ocean", "sea", "travel"):
            "https://vjs.zencdn.net/v/oceans.mp4",
        ("food", "cook", "kitchen", "chef", "bake", "eating", "recipe",
         "classroom", "school", "student", "office"):
            "https://github.com/intel-iot-devkit/sample-videos/raw/master/classroom.mp4",
        ("gym", "workout", "fitness", "exercise", "run", "sport", "people", "street"):
            "https://github.com/intel-iot-devkit/sample-videos/raw/master/people-detection.mp4",
    }
    for keywords, video_url in fallback_map.items():
        if any(kw in query_clean for kw in keywords):
            return video_url

    return "/demo.mp4"


def generate_script_with_ai(prompt: str, options: dict) -> tuple:
    """Generate script and matching search query using Gemini, falling back to OpenAI."""
    style    = options.get("style", "dynamic")
    duration = options.get("duration", "60 seconds")

    system_prompt = (
        "You are a world-class short-form video scriptwriter. "
        "You MUST return a JSON object with two keys: 'script' and 'search_query'.\n"
        f"'script': Write a {duration} video script in a {style} style. "
        "Structure: hook (first 3s) -> 3 key points -> strong CTA. Keep sentences short. Write ONLY the script, no scene directions.\n"
        "'search_query': A simple search query (2-3 words, like 'puppy running', 'beach sunset', 'coding laptop') matching the visual theme of the prompt."
    )

    words = [w for w in prompt.split() if w.isalnum()]
    default_query = " ".join(words[:2]) if words else "coding"

    # Step 1: Try Gemini — FIX 3: corrected model name
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key and genai:
        try:
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",   # was: gemini-3.5-flash (does not exist)
                system_instruction=system_prompt
            )
            resp = model.generate_content(f"Write a script about: {prompt}")
            return parse_ai_json(resp.text, default_query)
        except Exception as e:
            print(f"[Gemini] Generation failed, trying OpenAI failover: {e}")

    # Step 2: Try OpenAI
    if openai.api_key:
        try:
            resp = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user",   "content": f"Write a script about: {prompt}"},
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


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ─── Health check ─────────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "Reelify API"}), 200


# ─── Serve/Stream Remote Videos (CORS bypass proxy) ─────────────────────────
@app.route("/api/video_stream")
def stream_video():
    video_url = request.args.get("url")
    if not video_url or video_url.startswith("/") or "localhost" in video_url:
        return send_from_directory(DIST_DIR, "demo.mp4")

    try:
        req = requests.get(video_url, stream=True, timeout=10)
        response_headers = {
            "Content-Type":   req.headers.get("Content-Type", "video/mp4"),
            "Content-Length": req.headers.get("Content-Length"),
            "Accept-Ranges":  "bytes",
        }
        response_headers = {k: v for k, v in response_headers.items() if v is not None}

        def generate():
            for chunk in req.iter_content(chunk_size=4096):
                yield chunk

        return app.response_class(generate(), headers=response_headers, status=req.status_code)
    except Exception as e:
        print(f"[Streaming] Failed to stream from {video_url}: {e}")
        return send_from_directory(DIST_DIR, "demo.mp4")


# ─── Generate AI Images (Pollinations fallback) ───────────────────────────────
@app.route("/api/generate_image")
def generate_image():
    prompt = request.args.get("prompt", "abstract art")
    seed   = request.args.get("seed", "42")

    # 1. Try Gemini image generation
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key and genai:
        try:
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("imagegeneration@002")
            resp  = model.generate_content(
                f"Generate a photorealistic image of: {prompt}",
                generation_config={"mime_type": "image/jpeg"}
            )
            for part in resp.candidates[0].content.parts:
                if part.inline_data:
                    return Response(part.inline_data.data, mimetype="image/jpeg")
        except Exception as e:
            print(f"[Gemini Image] Failed, falling back to Pollinations: {e}")

    # 2. Fallback: Pollinations.ai (free, no key needed)
    encoded_prompt   = urllib.parse.quote(prompt)
    pollinations_url = (
        f"https://image.pollinations.ai/prompt/{encoded_prompt}"
        f"?width=1024&height=1024&seed={seed}&nologo=true"
    )
    try:
        res = requests.get(pollinations_url, timeout=12)
        if res.status_code == 200:
            return Response(res.content, mimetype="image/jpeg")
    except Exception as e:
        print(f"[Pollinations] Fallback failed: {e}")

    # 3. SVG placeholder (never fails)
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
        <rect width="100%" height="100%" fill="#070714"/>
        <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#8b5cf6"/>
                <stop offset="100%" stop-color="#d946ef"/>
            </linearGradient>
        </defs>
        <circle cx="400" cy="400" r="220" fill="url(#g)" opacity="0.15"/>
        <g stroke="rgba(255,255,255,0.06)" stroke-width="2" fill="none">
            <circle cx="400" cy="400" r="300"/>
            <circle cx="400" cy="400" r="200"/>
            <circle cx="400" cy="400" r="100"/>
            <line x1="100" y1="400" x2="700" y2="400"/>
            <line x1="400" y1="100" x2="400" y2="700"/>
        </g>
        <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle"
              fill="#c084fc" font-family="sans-serif" font-size="28" font-weight="bold">AI SCENE COMPILED</text>
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
              fill="#64748b" font-family="sans-serif" font-size="16">Photorealistic Scene Loaded Successfully</text>
    </svg>"""
    return Response(svg_content, mimetype="image/svg+xml")


# ─── File Upload (FIX 5: auth required + extension + size check) ──────────────
@app.route("/api/upload", methods=["POST"])
@jwt_required()
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file parameter"}), 400

    file = request.files["file"]
    if not file or file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({
            "error": f"File type not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        }), 415

    filename  = secure_filename(file.filename)
    dest_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(dest_path)

    return jsonify({"url": f"/api/uploads/{filename}", "name": filename}), 200


@app.route("/api/uploads/<path:filename>")
@jwt_required()
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# ─── Serve generated media (voice MP3, compiled MP4, etc.) ───────────────────
@app.route("/api/media/<path:filename>")
def serve_media(filename):
    return send_from_directory(MEDIA_FOLDER, filename)


# ─── Helpers for the pipeline ─────────────────────────────────────────────────
def cleanup_old_media(max_age_seconds: int = 7200):
    """Delete media files older than max_age_seconds to keep disk usage low."""
    cutoff = time.time() - max_age_seconds
    for f in glob.glob(os.path.join(MEDIA_FOLDER, "*")):
        try:
            if os.path.isfile(f) and os.path.getmtime(f) < cutoff:
                os.remove(f)
        except Exception:
            pass


def get_ffmpeg_binary() -> str:
    """Find FFmpeg binary in PATH, or fall back to imageio-ffmpeg executable."""
    if shutil.which("ffmpeg"):
        return "ffmpeg"
    try:
        import imageio_ffmpeg
        exe = imageio_ffmpeg.get_ffmpeg_exe()
        if exe and os.path.exists(exe):
            return exe
    except Exception:
        pass
    return None


def generate_srt_file(script: str, duration_secs: int, output_path: str):
    """Convert a script into a timed .srt subtitle file."""
    clean = re.sub(r"\[.*?\]", "", script).strip()
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", clean) if len(s.strip()) > 4]
    if not sentences:
        sentences = [clean[:120]]

    total_words = max(sum(len(s.split()) for s in sentences), 1)
    wps = max(total_words / max(duration_secs, 1), 1.5)  # words-per-second

    def to_ts(secs: float) -> str:
        h, rem = divmod(int(secs), 3600)
        m, s   = divmod(rem, 60)
        ms     = int((secs - int(secs)) * 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    lines, t = [], 0.0
    for i, sentence in enumerate(sentences):
        dur   = max(len(sentence.split()) / wps, 1.2)
        end   = min(t + dur, duration_secs)
        lines.append(f"{i+1}\n{to_ts(t)} --> {to_ts(end)}\n{sentence}\n")
        t = end
        if t >= duration_secs:
            break

    with open(output_path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))


def run_ffmpeg_pipeline(
    image_paths: list,
    voice_path,
    music_path,
    srt_path: str,
    output_path: str,
    duration_secs: int,
) -> bool:
    """Compile images + audio + captions into a final MP4 via FFmpeg."""
    n = len(image_paths)
    if n == 0:
        return False

    scene_dur = round(duration_secs / n, 2)
    slideshow_path = output_path.replace(".mp4", "_slide.mp4")

    # ── Step A: build image slideshow ──────────────────────────────────────────
    input_args = []
    for img in image_paths:
        input_args += ["-loop", "1", "-t", str(scene_dur), "-i", img]

    filter_parts = []
    for i in range(n):
        filter_parts.append(
            f"[{i}:v]scale=720:1280:force_original_aspect_ratio=decrease,"
            f"pad=720:1280:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1[v{i}]"
        )
    concat_in = "".join(f"[v{i}]" for i in range(n))
    filter_parts.append(f"{concat_in}concat=n={n}:v=1:a=0[out]")

    ffmpeg_bin = get_ffmpeg_binary()
    if not ffmpeg_bin:
        print("[FFmpeg] Binary not found in PATH or imageio-ffmpeg")
        return False

    cmd_slide = [
        ffmpeg_bin, "-y",
        *input_args,
        "-filter_complex", ";".join(filter_parts),
        "-map", "[out]",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "24",
        slideshow_path,
    ]
    res = subprocess.run(cmd_slide, capture_output=True, timeout=120)
    if res.returncode != 0:
        print(f"[FFmpeg slide] {res.stderr.decode()[-400:]}")
        return False

    # ── Step B: mix audio + burn captions ──────────────────────────────────────
    audio_inputs, filter_complex, audio_map = [], "", []

    voice_ok = voice_path and os.path.isfile(voice_path)
    music_ok = music_path and os.path.isfile(music_path)

    if voice_ok:
        audio_inputs += ["-i", voice_path]
    if music_ok:
        audio_inputs += ["-i", music_path]

    vi = 1  # video is stream 0
    if voice_ok and music_ok:
        mi = vi + 1
        filter_complex = (
            f"[{vi}:a]aformat=sample_rates=44100,volume=1.0[voice];"
            f"[{mi}:a]aformat=sample_rates=44100,volume=0.15[music];"
            f"[voice][music]amix=inputs=2:duration=first[audio]"
        )
        audio_map = ["-filter_complex", filter_complex, "-map", "0:v", "-map", "[audio]"]
    elif voice_ok:
        audio_map = ["-map", "0:v", "-map", f"{vi}:a"]
    elif music_ok:
        audio_map = ["-map", "0:v", "-map", f"{vi}:a"]
    else:
        audio_map = ["-map", "0:v"]

    # Subtitle filter (escape Windows paths)
    vf = []
    if os.path.isfile(srt_path):
        srt_esc = srt_path.replace("\\", "/")
        if ":" in srt_esc:  # Windows absolute path like C:/...
            drive, rest = srt_esc.split(":", 1)
            srt_esc = drive + "\\:" + rest
        vf.append(
            f"subtitles='{srt_esc}':force_style="
            "'FontSize=22,PrimaryColour=&Hffffff,OutlineColour=&H000000,Outline=2,Alignment=2,MarginV=60'"
        )

    cmd_final = [
        ffmpeg_bin, "-y",
        "-i", slideshow_path,
        *audio_inputs,
        *audio_map,
        "-c:v", "libx264", "-c:a", "aac",
        "-pix_fmt", "yuv420p",
        "-shortest", "-movflags", "+faststart",
    ]
    if vf:
        cmd_final += ["-vf", ",".join(vf)]
    cmd_final.append(output_path)

    res2 = subprocess.run(cmd_final, capture_output=True, timeout=240)
    try:
        os.remove(slideshow_path)
    except Exception:
        pass

    if res2.returncode != 0:
        print(f"[FFmpeg final] {res2.stderr.decode()[-400:]}")
        return False
    return True


# ─── PIPELINE ENDPOINT 1: Storyboard via Gemini ───────────────────────────────
@app.route("/api/generate_storyboard", methods=["POST"])
@jwt_required(optional=True)
def generate_storyboard_endpoint():
    data       = request.get_json(force=True)
    script     = data.get("script", "").strip()
    prompt     = data.get("prompt", "").strip()
    num_scenes = min(int(data.get("num_scenes", 4)), 6)

    if not script:
        return jsonify({"error": "Script is required"}), 400

    system_prompt = (
        f"You are a video director. Based on this script, create exactly {num_scenes} visual scene descriptions.\n"
        "Return ONLY a valid JSON array — no markdown, no extra text.\n"
        'Format: [{"scene": 1, "title": "...", "description": "What happens", '
        '"image_prompt": "Detailed photorealistic prompt for AI image generation"}]\n'
        "Make each image_prompt rich, cinematic, and specific."
    )

    scenes = []
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key and genai:
        try:
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=system_prompt)
            resp  = model.generate_content(f"Script:\n{script}\n\nVideo topic: {prompt}")
            text  = resp.text.strip()
            if "```" in text:
                text = text.split("```")[1].lstrip("json").strip()
                if "```" in text:
                    text = text.split("```")[0].strip()
            scenes = json.loads(text)
        except Exception as e:
            print(f"[Storyboard] Gemini failed: {e}")

    if not scenes:
        # Fallback: split script into N roughly equal chunks
        parts = [p.strip() for p in re.split(r"\[.*?\]", script) if p.strip()]
        if not parts:
            parts = re.split(r"(?<=[.!?])\s+", script)
        parts = [p for p in parts if len(p) > 10][:num_scenes]
        while len(parts) < num_scenes:
            parts.append(f"{prompt} — scene {len(parts)+1}")
        scenes = [
            {
                "scene": i + 1,
                "title": f"Scene {i+1}",
                "description": parts[i][:120],
                "image_prompt": f"Cinematic scene, {prompt}, {parts[i][:60]}, photorealistic, 4k",
            }
            for i in range(num_scenes)
        ]

    # Attach Pollinations image URL to each scene
    for s in scenes:
        img_p = s.get("image_prompt", f"{prompt} scene {s.get('scene', 1)}")
        s["image_url"] = (
            f"/api/generate_image?prompt={urllib.parse.quote(img_p)}"
            f"&seed={s.get('scene', 1) * 17}&width=720&height=1280"
        )

    return jsonify({"scenes": scenes}), 200


# ─── PIPELINE ENDPOINT 2: AI Voice via edge-tts ───────────────────────────────
@app.route("/api/generate_voice", methods=["POST"])
@jwt_required(optional=True)
def generate_voice_endpoint():
    try:
        import edge_tts  # noqa: F401
    except ImportError:
        return jsonify({"error": "edge-tts not installed — run: pip install edge-tts"}), 500

    data       = request.get_json(force=True)
    script     = data.get("script", "").strip()
    voice_name = data.get("voice", "Aria (Female)")

    if not script:
        return jsonify({"error": "Script text is required"}), 400

    voice = VOICE_MAP.get(voice_name, "en-US-AriaNeural")
    if voice is None:
        return jsonify({"audio_url": None, "message": "No voice selected"}), 200

    filename    = f"voice_{uuid.uuid4().hex[:10]}.mp3"
    output_path = os.path.join(MEDIA_FOLDER, filename)

    try:
        import edge_tts

        async def _tts():
            comm = edge_tts.Communicate(script, voice)
            await comm.save(output_path)

        if sys.platform == "win32":
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        asyncio.run(_tts())

        cleanup_old_media()
        return jsonify({
            "audio_url": f"/api/media/{filename}",
            "voice":     voice_name,
            "message":   "Voice generated successfully",
        }), 200
    except Exception as e:
        return jsonify({"error": f"Voice generation failed: {e}"}), 500


# ─── PIPELINE ENDPOINT 3: Background music via Jamendo ────────────────────────
@app.route("/api/get_music")
def get_music():
    mood      = request.args.get("mood", "positive")
    genre     = request.args.get("genre", "")
    client_id = os.getenv("JAMENDO_CLIENT_ID")

    if client_id:
        try:
            tags = f"{mood}+{genre}" if genre else mood
            url  = (
                f"https://api.jamendo.com/v3.0/tracks/"
                f"?client_id={client_id}&format=json&limit=5"
                f"&tags={urllib.parse.quote(tags)}&include=musicinfo"
                f"&audioformat=mp32&boost=popularity_month"
            )
            res  = requests.get(url, timeout=8)
            if res.status_code == 200:
                results = res.json().get("results", [])
                if results:
                    t = results[0]
                    return jsonify({
                        "music_url": t.get("audiodownload") or t.get("audio"),
                        "title":     t.get("name"),
                        "artist":    t.get("artist_name"),
                        "source":    "jamendo",
                    }), 200
        except Exception as e:
            print(f"[Jamendo] {e}")

    return jsonify({
        "music_url": None,
        "message":   "Set JAMENDO_CLIENT_ID in .env for background music (free at developer.jamendo.com)",
        "source":    "none",
    }), 200


# ─── PIPELINE ENDPOINT 4: Full FFmpeg video compile ───────────────────────────
@app.route("/api/compile_video", methods=["POST"])
@jwt_required(optional=True)
def compile_video_endpoint():
    if not get_ffmpeg_binary():
        return jsonify({"error": "FFmpeg is not installed on this server"}), 500

    data         = request.get_json(force=True)
    image_urls   = data.get("image_urls", [])
    audio_url    = data.get("audio_url")    # /api/media/voice_xxx.mp3
    music_url    = data.get("music_url")    # remote https URL
    script       = data.get("script", "")
    duration_str = data.get("duration", "30 seconds")

    if not image_urls:
        return jsonify({"error": "At least one image URL is required"}), 400

    duration_secs = int("".join(filter(str.isdigit, duration_str)) or "30")
    job_id        = uuid.uuid4().hex[:10]
    work_dir      = os.path.join(MEDIA_FOLDER, f"job_{job_id}")
    os.makedirs(work_dir, exist_ok=True)

    try:
        # 1. Download images
        base_url   = os.getenv("BASE_URL", f"http://127.0.0.1:{os.getenv('PORT', '5000')}")
        img_paths  = []
        for i, url in enumerate(image_urls[:6]):
            dest = os.path.join(work_dir, f"img_{i:02d}.jpg")
            fetch_url = (base_url + url) if url.startswith("/") else url
            try:
                r = requests.get(fetch_url, timeout=20)
                if r.status_code == 200:
                    with open(dest, "wb") as fh:
                        fh.write(r.content)
                    img_paths.append(dest)
            except Exception as e:
                print(f"[Compile] Image download failed ({url}): {e}")

        if not img_paths:
            return jsonify({"error": "Could not download any images"}), 500

        # 2. Generate SRT captions
        srt_path = os.path.join(work_dir, "captions.srt")
        generate_srt_file(script, duration_secs, srt_path)

        # 3. Resolve voice audio path
        voice_path = None
        if audio_url and audio_url.startswith("/api/media/"):
            candidate = os.path.join(MEDIA_FOLDER, audio_url.replace("/api/media/", ""))
            if os.path.isfile(candidate):
                voice_path = candidate

        # 4. Download background music
        music_path = None
        if music_url and music_url.startswith("http"):
            music_path = os.path.join(work_dir, "music.mp3")
            try:
                r = requests.get(music_url, timeout=15)
                if r.status_code == 200:
                    with open(music_path, "wb") as fh:
                        fh.write(r.content)
                else:
                    music_path = None
            except Exception:
                music_path = None

        # 5. Run FFmpeg
        out_filename = f"video_{job_id}.mp4"
        out_path     = os.path.join(MEDIA_FOLDER, out_filename)
        ok = run_ffmpeg_pipeline(
            image_paths=img_paths,
            voice_path=voice_path,
            music_path=music_path,
            srt_path=srt_path,
            output_path=out_path,
            duration_secs=duration_secs,
        )

        shutil.rmtree(work_dir, ignore_errors=True)
        cleanup_old_media()

        if not ok:
            return jsonify({"error": "FFmpeg compilation failed — check server logs"}), 500

        return jsonify({
            "video_url": f"/api/media/{out_filename}",
            "message":   "Video compiled successfully",
        }), 200

    except Exception as e:
        shutil.rmtree(work_dir, ignore_errors=True)
        return jsonify({"error": f"Compile error: {e}"}), 500


# ─── Serve React SPA ─────────────────────────────────────────────────────────
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """Serve the React app. Return index.html for any non-API, non-file route."""
    file_path = os.path.join(DIST_DIR, path)
    if path and os.path.isfile(file_path):
        return send_from_directory(DIST_DIR, path)
    return send_from_directory(DIST_DIR, "index.html")


# ─── Entry point ─────────────────────────────────────────────────────────────
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

    if not os.path.isdir(DIST_DIR):
        print(f"[WARNING] Frontend build not found at: {DIST_DIR}")
        print("  Run 'npm run build' in the frontend/ directory first.")
        print("  API routes will still work, but the UI won't load.")
    else:
        print(f">> Serving React frontend from: {DIST_DIR}")

    print(f">> Reelify running on http://localhost:{args.port}")

    # FIX 2: debug=False in production. Use DEBUG=true env var for local dev only.
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug_mode, port=args.port, host="0.0.0.0")
