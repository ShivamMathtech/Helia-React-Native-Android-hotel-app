@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 24 LTS from https://nodejs.org and run this file again.
  pause
  exit /b 1
)
node scripts\check-node.cjs
if errorlevel 1 (
  pause
  exit /b 1
)
call npm ci
if errorlevel 1 (
  echo Dependency installation failed. Check your connection and run this file again.
  pause
  exit /b 1
)
call npm run check
if errorlevel 1 (
  pause
  exit /b 1
)
echo Setup complete. Run start-expo.bat to open the app on your phone.
pause
