@echo off
echo ==============================================
echo    HealthTracker 2025 - Windows Build Script
echo ==============================================
echo.

echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b %errorlevel%
)

echo.
echo [2/5] Rebuilding native modules for Electron...
call npm run postinstall  
if %errorlevel% neq 0 (
    echo ❌ Failed to rebuild native modules
    pause
    exit /b %errorlevel%
)

echo.
echo [3/5] Cleaning previous builds...
if exist "dist" rmdir /s /q "dist"

echo.
echo [4/5] Building Windows application...
call npm run build-win
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b %errorlevel%
)

echo.
echo [5/5] Build completed successfully!
echo.
echo ✅ Windows installer: dist\HealthTracker-2025-Setup-1.0.0.exe
echo ✅ Portable version: dist\win-unpacked\
echo.
echo Build artifacts saved in 'dist' directory
pause
