@echo off
REM GitHub Push Script for Prsyar
REM فایلەکان بۆ GitHub نێرە

echo.
echo ============================================
echo   Prsyar - GitHub Push
echo ============================================
echo.

REM Step 1: مایتە Token
echo Step 1️⃣: Personal Access Token سازیت
echo.
echo بچۆ: https://github.com/settings/tokens/new
echo.
echo - سائن ئین بکە GitHub accountت بە
echo - "repo" scope هەڵبژێرە  
echo - "Generate token" کلیک بکە
echo - Token کۆپی کرە (نوسینی جێی ایتی!)
echo.
pause

REM Step 2: Token بنووسە
setlocal enabledelayedexpansion
set /p TOKEN="Enter your GitHub Personal Access Token: "

if "!TOKEN!"=="" (
    echo ❌ Token پێویوت!
    exit /b 1
)

REM Step 3: Git credential store
echo Setting GitHub credentials...
echo https://afsaranedara:!TOKEN!@github.com | git credential approve

REM Step 4: Push
echo.
echo Pushing to GitHub...
cd /d "c:\Users\Canon Co\Desktop\Prsyar"
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ Push سفل!
    echo Repository: https://github.com/afsaranedara/peshmerga-system
    echo.
) else (
    echo.
    echo ❌ Push شکست خۆرد
    echo Token درووست نیە یان ڕاستی نیە
    echo.
)

pause
