@echo off
REM Reelify Development Servers Startup Script (Windows Batch)
REM This script starts both frontend and backend development servers

setlocal enabledelayedexpansion

set PROJECT_ROOT=%~dp0
set BACKEND_DIR=%PROJECT_ROOT%backend
set FRONTEND_DIR=%PROJECT_ROOT%frontend
set BACKEND_PORT=5000
set FRONTEND_PORT=5173

cls
echo.
echo ════════════════════════════════════════════════════════════
echo    ^(^( Reelify Development Servers Launcher ^)^)
echo ════════════════════════════════════════════════════════════
echo.

REM Check if directories exist
if not exist "%BACKEND_DIR%" (
    echo [ERROR] Backend directory not found: %BACKEND_DIR%
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%" (
    echo [ERROR] Frontend directory not found: %FRONTEND_DIR%
    pause
    exit /b 1
)

echo Starting both servers...
echo.

REM Start Backend Server in new window
echo [1/2] Starting Backend Server...
start "Reelify Backend" cmd /k "cd /d "%BACKEND_DIR%" && python -m pip install -r requirements.txt -q && python app.py --port %BACKEND_PORT%"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start Frontend Server in new window
echo [2/2] Starting Frontend Server...
start "Reelify Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && if not exist node_modules ( npm install ) && npm run dev"

echo.
echo ════════════════════════════════════════════════════════════
echo    Servers are running:
echo    Backend  ^> http://127.0.0.1:%BACKEND_PORT%
echo    Frontend ^> http://localhost:%FRONTEND_PORT%
echo.
echo    Close the terminal windows to stop servers
echo ════════════════════════════════════════════════════════════
echo.
pause
