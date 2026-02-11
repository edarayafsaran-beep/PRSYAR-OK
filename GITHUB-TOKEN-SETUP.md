# GitHub Push - PowerShell Guide

## Step 1: Personal Access Token سازیت

بچۆ: https://github.com/settings/tokens/new

ئیتل بکێ:
- Token name: `Prsyar-Deploy`
- Expiration: `90 days` یان `No expiration`
- Scopes: ✅ `repo` (کۆ permissions)
- **Generate token** کلیک بکە
- 🔐 **Token کۆپی کرە** (دوای ئینتێم ئیتل نیکرێ!)

---

## Step 2: PowerShell دا فایلەکان نێرە

```powershell
# Directory بۆ پڕۆجە
cd "c:\Users\Canon Co\Desktop\Prsyar"

# Token خۆت پێنەدە
$TOKEN = "ghp_YOUR_TOKEN_HERE_REPLACE_THIS"
$GITHUB_USER = "afsaranedara"
$REPO = "https://${GITHUB_USER}:${TOKEN}@github.com/afsaranedara/peshmerga-system.git"

# Push بکە
git push -u $REPO main
```

---

## یان سادە تر - بۆ Terminal دا:

```bash
# Token بیجێگە (بیرت وا نیکەیت لە command history!)
$env:GIT_AUTHOR_NAME="Afsaran Edara"
$env:GIT_AUTHOR_EMAIL="afsaranedara@gmail.com"

# URL بە token:
git push https://afsaranedara:ghp_YOUR_TOKEN_HERE@github.com/afsaranedara/peshmerga-system.git main
```

---

## مونمونە Token:

```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

(Token خۆت بنووسە!)

---

## بعدی لە Push سفل:

✅ GitHub دا repository نیکرەمان:
https://github.com/afsaranedara/peshmerga-system

✅ Railway دا deploy دەتوانیت:
https://railway.app

---

## Token سازیت:

```
1️⃣ https://github.com/settings/tokens/new بچۆ
2️⃣ repo scope هەڵبژێرە
3️⃣ Generate
4️⃣ Token کۆپی بکە
5️⃣ PowerShell دا پاسخ بدە
6️⃣ git push رێزمان!
```

