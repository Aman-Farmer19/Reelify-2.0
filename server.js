/**
 * Reelify Server Runner - Node.js version
 * Alternative way to manage and run both servers
 * 
 * Usage:
 *   node server.js              - Start both servers
 *   node server.js --backend    - Start only backend
 *   node server.js --frontend   - Start only frontend
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const backendDir = path.join(projectRoot, 'backend');
const frontendDir = path.join(projectRoot, 'frontend');

const BACKEND_PORT = process.env.BACKEND_PORT || 5000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 5173;

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function startBackendServer() {
    return new Promise((resolve, reject) => {
        log('📡 Starting Backend Server...', 'green');

        // Install requirements if needed
        const installCmd = `cd "${backendDir}" && python -m pip install -r requirements.txt -q`;

        exec(installCmd, (error) => {
            if (error) {
                log(`❌ Failed to install dependencies: ${error}`, 'red');
                reject(error);
                return;
            }

            log(`✅ Backend Server starting on http://127.0.0.1:${BACKEND_PORT}`, 'green');

            const backend = spawn('python', ['app.py', '--port', String(BACKEND_PORT)], {
                cwd: backendDir,
                stdio: ['inherit', 'inherit', 'inherit'],
            });

            backend.on('error', (error) => {
                log(`❌ Backend server error: ${error}`, 'red');
                reject(error);
            });

            resolve(backend);
        });
    });
}

function startFrontendServer() {
    return new Promise((resolve, reject) => {
        log('⚛️  Starting Frontend Server...', 'green');

        const nodeModulesPath = path.join(frontendDir, 'node_modules');

        let frontend;

        if (!fs.existsSync(nodeModulesPath)) {
            log('📦 Installing frontend dependencies...', 'yellow');

            const npm = spawn('npm', ['install'], {
                cwd: frontendDir,
                stdio: ['inherit', 'inherit', 'inherit'],
            });

            npm.on('close', (code) => {
                if (code !== 0) {
                    log(`❌ npm install failed with code ${code}`, 'red');
                    reject(new Error(`npm install failed with code ${code}`));
                    return;
                }

                log(`✅ Frontend Server starting on http://localhost:${FRONTEND_PORT}`, 'green');

                frontend = spawn('npm', ['run', 'dev'], {
                    cwd: frontendDir,
                    stdio: ['inherit', 'inherit', 'inherit'],
                });

                frontend.on('error', (error) => {
                    log(`❌ Frontend server error: ${error}`, 'red');
                    reject(error);
                });

                resolve(frontend);
            });
        } else {
            log(`✅ Frontend Server starting on http://localhost:${FRONTEND_PORT}`, 'green');

            frontend = spawn('npm', ['run', 'dev'], {
                cwd: frontendDir,
                stdio: ['inherit', 'inherit', 'inherit'],
            });

            frontend.on('error', (error) => {
                log(`❌ Frontend server error: ${error}`, 'red');
                reject(error);
            });

            resolve(frontend);
        }
    });
}

async function startAllServers() {
    log('', 'reset');
    log('╔════════════════════════════════════════════════════╗', 'cyan');
    log('║   🎬 Reelify Development Servers Launcher 🎬      ║', 'cyan');
    log('╚════════════════════════════════════════════════════╝', 'cyan');
    log('', 'reset');

    try {
        const args = process.argv.slice(2);

        if (args.includes('--backend-only') || args.includes('--backend')) {
            await startBackendServer();
        } else if (args.includes('--frontend-only') || args.includes('--frontend')) {
            await startFrontendServer();
        } else {
            // Start both servers
            log('🚀 Starting both servers...', 'cyan');
            log('', 'reset');

            const [backend, frontend] = await Promise.all([
                startBackendServer(),
                startFrontendServer(),
            ]);

            log('', 'reset');
            log('╔════════════════════════════════════════════════════╗', 'cyan');
            log('║   Servers are running:                             ║', 'cyan');
            log(`║   Backend  → http://127.0.0.1:${BACKEND_PORT}                   ║`, 'cyan');
            log(`║   Frontend → http://localhost:${FRONTEND_PORT}                   ║`, 'cyan');
            log('║                                                    ║', 'cyan');
            log('║   Press Ctrl+C to stop servers                     ║', 'cyan');
            log('╚════════════════════════════════════════════════════╝', 'cyan');
            log('', 'reset');

            // Handle graceful shutdown
            process.on('SIGINT', () => {
                log('\n\n⛔ Stopping servers...', 'yellow');
                backend.kill();
                frontend.kill();
                process.exit(0);
            });
        }
    } catch (error) {
        log(`❌ Error: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Check if required directories exist
if (!fs.existsSync(backendDir)) {
    log(`❌ Backend directory not found: ${backendDir}`, 'red');
    process.exit(1);
}

if (!fs.existsSync(frontendDir)) {
    log(`❌ Frontend directory not found: ${frontendDir}`, 'red');
    process.exit(1);
}

startAllServers();
