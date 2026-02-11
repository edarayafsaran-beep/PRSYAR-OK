# GitHub Push Guide - Prsyar

## یاری حالی:
- ✅ Code prepped and committed locally
- ❌ Need GitHub authentication

## Solution - Two Options:

### Option 1: Personal Access Token (سادە تر)

1. **Create Token on GitHub:**
   - بچۆ https://github.com/settings/tokens/new
   - سائن ئین بکە Account خۆتا
   - `repo` scope هەڵبژێرە
   - Generate token کلیک بکە
   - **Token کۆپی کرە** (نوسینی جێی ایتی!)

2. **Configure Git:**
   ```bash
   # Terminal دا:
   git config --global credential.helper wincred
   ```

3. **Push Again:**
   ```bash
   git push -u origin main
   ```
   - Username prompt: بنووسە username GitHub خۆت
   - Password prompt: **Token کۆپی کردی پاسخ بدە** (نیس پاسخ نیە!)

---

### Option 2: SSH Keys (بێ Password جار جار)

1. **Generate SSH Key:**
   ```bash
   ssh-keygen -t ed25519 -C "youremail@example.com"
   ```
   - File location: Press Enter (پێشتریی شوێن)
   - Passphrase: Leave empty یان بنووسە passphrase

2. **Add to SSH Agent:**
   ```bash
   eval $(ssh-agent -s)
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Add to GitHub:**
   - بچۆ https://github.com/settings/keys
   - **New SSH key** - کلیک بکە
   - File دا کیای پاسخ بدە:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   - پاسخ GitHub دا پاسخ بدە

4. **Update Git Remote:**
   ```bash
   git remote set-url origin git@github.com:afsaranedara/peshmerga-system.git
   ```

5. **Push:**
   ```bash
   git push -u origin main
   ```

---

## After Push:

پاشان GitHub دا هاوکات سیتەمەکە دەبینیت:
- https://github.com/afsaranedara/peshmerga-system

Railway بتوانیت بگرنت لەم GitHub repository!

---

## Troubleshooting

اگەر هێشتا کێشە هەبێت:

```bash
# Test connection
ssh -T git@github.com

# یان check status
git status
```

---

**نیاز ئینسترۆکشن:** بیاننێرە + token/SSH setup کردەدا ئیستا push خۆت بو!
