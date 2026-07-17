@echo off
REM ═══════════════════════════════════════════════════════════
REM   Reelify - Single Server Launcher
REM   Builds the React frontend and starts the Flask server
REM ═══════════════════════════════════════════════════════════

setlocal
set PROJECT_ROOT=%~dp0

echo.
echo ========================================================
echo    Reelify - Single Server Launcher
echo ========================================================
echo.

REM Step 1: Build the frontend
echo [1/2] Building React frontend...
cd /d "%PROJECT_ROOT%frontend"
call npm run build
if errorlevel 1 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b 1
)
echo [OK] Frontend built successfully.
echo.

REM Step 2: Start Flask server
echo [2/2] Starting Reelify server...
cd /d "%PROJECT_ROOT%backend"
call ".\venv\Scripts\activate.bat"
python app.py

pause
