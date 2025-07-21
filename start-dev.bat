@echo off
echo ==============================================
echo   HealthTracker 2025 - Development Mode
echo ==============================================
echo.

echo Installing/updating dependencies...
call npm install

echo.
echo Starting application in development mode...
echo Press Ctrl+C to stop the application
echo.
call npm run dev
