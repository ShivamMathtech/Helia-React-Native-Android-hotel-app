@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
  echo Run setup-android.bat first.
  pause
  exit /b 1
)
echo Start your Android emulator or connect an authorized USB-debugging phone first.
echo Android Studio, Android SDK 36, and JDK 17 are required. See docs\ANDROID_SETUP.md.
call npm run android:native
pause
