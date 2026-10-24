@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
  echo Run setup-android.bat first.
  pause
  exit /b 1
)
echo This builds an installable APK with your own Expo account.
echo Follow the account and project setup prompts. No Android Studio is needed.
call npx eas-cli@latest login
if errorlevel 1 (
  pause
  exit /b 1
)
call npm run build:apk
pause
