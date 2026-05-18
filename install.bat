@echo off
echo Installing backend dependencies...
cd backend
npm install
cd ..

echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo ✅ All dependencies installed!
echo.
echo Next steps:
echo 1. Copy backend\.env.example to backend\.env and fill in your values
echo 2. Open two terminals:
echo    Terminal 1: cd backend && npm run dev
echo    Terminal 2: cd frontend && npm start
echo.
pause
