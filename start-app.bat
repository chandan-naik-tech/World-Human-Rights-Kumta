@echo off
title World Human Rights App Launcher
echo ===================================================
echo   WORLD HUMAN RIGHTS (WHR RK FOUNDATIONS KUMTA)
echo              Local Dev App Launcher
echo ===================================================
echo.
echo Starting Backend Server (MongoDB connection, Port 5000)...
start "WHR Backend Server" cmd /k "cd backend && npm run dev"

echo.
echo Starting Frontend Client (React Vite, Port 5173)...
start "WHR Frontend Client" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo Both servers are launching!
echo.
echo - Website: http://localhost:5173
echo - Backend API: http://localhost:5000
echo - Admin Login: http://localhost:5173/admin-login
echo ===================================================
echo Keep the launched terminal windows open. 
echo Press any key to exit this launcher window...
pause > nul
