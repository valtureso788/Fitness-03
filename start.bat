@echo off
chcp 65001 >nul
echo ============================================
echo    FitClub — Запуск приложения (Windows)
echo ============================================
echo.

:: Проверяем наличие Python для локального сервера
where python >nul 2>nul
if %ERRORLEVEL%==0 (
    echo [INFO] Запуск через Python HTTP-сервер...
    echo [INFO] Приложение будет доступно: http://localhost:8000
    echo [INFO] Для остановки нажмите Ctrl+C
    echo.
    cd app
    python -m http.server 8000
    goto :end
)

:: Проверяем наличие Node.js
where npx >nul 2>nul
if %ERRORLEVEL%==0 (
    echo [INFO] Запуск через npx serve...
    echo [INFO] Приложение будет доступно: http://localhost:3000
    echo.
    npx -y serve app -l 3000
    goto :end
)

:: Если ничего не найдено — открываем напрямую
echo [INFO] Python и Node.js не найдены.
echo [INFO] Открываю index.html напрямую в браузере...
start "" "app\index.html"

:end
echo.
echo Готово!
pause
