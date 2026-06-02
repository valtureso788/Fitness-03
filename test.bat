@echo off
chcp 65001 >nul
echo ============================================
echo    FitClub — Запуск тестов (Windows)
echo ============================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js не найден. Установите: https://nodejs.org
    pause
    exit /b 1
)

echo [INFO] Запуск тестов...
echo.
node tests\run-tests.js
echo.
pause
