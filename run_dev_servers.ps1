# Reelify Development Servers Startup Script
# This script starts both frontend and backend development servers

param(
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [int]$BackendPort = 5000,
    [int]$FrontendPort = 5173
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $projectRoot "backend"
$frontendDir = Join-Path $projectRoot "frontend"

Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🎬 Reelify Development Servers Launcher 🎬      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if directories exist
if (-not (Test-Path $backendDir)) {
    Write-Host "❌ Backend directory not found: $backendDir" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendDir)) {
    Write-Host "❌ Frontend directory not found: $frontendDir" -ForegroundColor Red
    exit 1
}

# Function to start backend server
function Start-BackendServer {
    Write-Host "📡 Starting Backend Server..." -ForegroundColor Green
    
    Push-Location $backendDir
    
    # Check if Python is installed
    if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
        Pop-Location
        return $false
    }
    
    # Check if requirements are installed
    Write-Host "📦 Checking Python dependencies..." -ForegroundColor Yellow
    python -m pip install -r requirements.txt -q
    
    Write-Host "✅ Backend Server starting on http://127.0.0.1:$BackendPort" -ForegroundColor Green
    python app.py --port $BackendPort
    
    Pop-Location
}

# Function to start frontend server
function Start-FrontendServer {
    Write-Host "⚛️  Starting Frontend Server..." -ForegroundColor Green
    
    Push-Location $frontendDir
    
    # Check if Node.js is installed
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Node.js/npm is not installed or not in PATH" -ForegroundColor Red
        Pop-Location
        return $false
    }
    
    # Check if node_modules exists
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
        npm install
    }
    
    Write-Host "✅ Frontend Server starting on http://localhost:$FrontendPort" -ForegroundColor Green
    npm run dev
    
    Pop-Location
}

# Main execution
try {
    if ($BackendOnly) {
        Start-BackendServer
    }
    elseif ($FrontendOnly) {
        Start-FrontendServer
    }
    else {
        # Start both servers in parallel
        Write-Host "🚀 Starting both servers..." -ForegroundColor Cyan
        Write-Host ""
        
        # Create jobs for parallel execution
        $backendJob = Start-Job -ScriptBlock {
            param($backendDir, $BackendPort)
            Push-Location $backendDir
            python -m pip install -r requirements.txt -q
            Write-Host "✅ Backend Server starting on http://127.0.0.1:$BackendPort" -ForegroundColor Green
            python app.py --port $BackendPort
        } -ArgumentList $backendDir, $BackendPort
        
        $frontendJob = Start-Job -ScriptBlock {
            param($frontendDir, $FrontendPort)
            Push-Location $frontendDir
            if (-not (Test-Path "node_modules")) {
                npm install
            }
            Write-Host "✅ Frontend Server starting on http://localhost:$FrontendPort" -ForegroundColor Green
            npm run dev
        } -ArgumentList $frontendDir, $FrontendPort
        
        Write-Host ""
        Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "║   Servers are running:                             ║" -ForegroundColor Cyan
        Write-Host "║   Backend  → http://127.0.0.1:$BackendPort                   ║" -ForegroundColor Cyan
        Write-Host "║   Frontend → http://localhost:$FrontendPort                   ║" -ForegroundColor Cyan
        Write-Host "║                                                    ║" -ForegroundColor Cyan
        Write-Host "║   Press Ctrl+C to stop servers                     ║" -ForegroundColor Cyan
        Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
        Write-Host ""
        
        # Wait for both jobs
        $backendJob, $frontendJob | Wait-Job
    }
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}
finally {
    # Cleanup jobs
    Get-Job | Remove-Job -Force -ErrorAction SilentlyContinue
}
