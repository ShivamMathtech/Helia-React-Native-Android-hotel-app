@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
  echo Run setup-android.bat first.
  pause
  exit /b 1
)
echo Use an Expo Go client compatible with SDK 55. See README.md.
call npm start -- --lan
pause
