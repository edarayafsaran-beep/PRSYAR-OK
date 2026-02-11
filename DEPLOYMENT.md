# بەڕێوەبەری سیستەمەکە - Prsyar

## سیتسییری بۆ Railway

### گام 1: سێتاپ Repository

```bash
# Git repository سازیت، ئێگەر پێدانێت
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/prsyar.git
git push -u origin main
```

### گام 2: Railway سازیت

1. بچۆ [railway.app](https://railway.app)
2. سائن ئین بکە یان نیو ئەکاونت سازیت
3. **New Project** کلیک بکە
4. **Deploy from GitHub** هەڵبژێرە
5. Repository خۆت هەڵبژێرە (prsyar)

### گام 3: Environment Variables سازیت

Railway dashboard دا، دڵ ران بە **Variables**:

```
DATABASE_URL=postgresql://neondb_owner:npg_a4NevQSYd6Bu@ep-misty-tooth-aisbynf9-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=production
SESSION_SECRET=your-secure-random-string-here
```

### گام 4: بیڕێ

Railway خۆمانی ڕێ دەچێت:
- کۆد دیڕێگێ دەکات
- `npm run build` چالاک دەکات
- `npm start` رێنمایی دەکات
- Domain دەدەتە (مثلاً: `prsyar.railway.app`)

## بەڕێاندە

هەمو **git push** پاش ئەم، Railway خۆمانی دیڵۆیی نوێ دەکات!

```bash
git add .
git commit -m "خصوصی نوێ"
git push origin main
```

## کۆنوولی Railway

```bash
# Railway CLI ئینستاللڑ
npm install @railway/cli -g

# Login بۆ Railway
railway login

# لۆگس بیبینە
railway logs

# لوکەل تێست
railway run npm start
```

---

**لینک سیتەمەکە:** https://yourdomain.railway.app (بعدی لە deploy)
