# Prsyar - سیستەمی پرسیار و وەڵام

## دۆخی سیستەمەکە

✅ **سیستەمەکە ئامادەیە بۆ ئۆنلاین!**

### تێکنۆلۆجی بەکاردېتسراوە:

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: Neon PostgreSQL (Cloud)
- **وێنە و فایل**: Multer (Local Storage / uploads/)
- **RTL**: تێreamework بۆ کوردی

---

## سیتسییری بۆ ئۆنلاین (Railway)

### مرحلە 1: سێتاپ Git

```bash
cd c:\Users\Canon Co\Desktop\Prsyar
git init
git add .
git commit -m "Initial commit for Prsyar "
git remote add origin https://github.com/yourusername/prsyar.git
git push -u origin main
```

### مرحلە 2: Railway دا Deploy کرە

1. بچۆ [railway.app](https://railway.app)
2. **Login** بکە github accountت بە
3. **New Project** > **Deploy from GitHub**
4. Repository خۆت هەڵبژێرە
5. **Deploy** کلیک بکە

### مرحلە 3: Environment Variables سازیت

Railway dashboard دا:

```
DATABASE_URL=postgresql://neondb_owner:npg_a4NevQSYd6Bu@ep-misty-tooth-aisbynf9-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=production
SESSION_SECRET=تخەیلیتەبکە-رستەیەکی-تێفاہی-طويلة-و-بیرایی
PORT=3000
```

### مرحلە 4: بیڕێ!

Railway خۆمانی هەموو شتی دەکات. بعدی لە 2-5 خانە سیستەمەکە **LIVE** دەبێت!

---

## بۆ لوکەل Testing

```bash
# دەپەندومەندز
npm install

# Development server
npm run dev

# Build
npm run build

# Production
npm start
```

---

## ئاکوونتی تێست

**ئەفسەر (Officer):**
- ناوی: `Sarbaz Ahmed`
- ID: `987654321`

**ئەدمین (Admin):**
- ناوی: `Admin Officer`
- ID: `ADMIN123`

---

## فیچەرەکان

✅ Login بە Military ID نیسان دان
✅ Requests سازیت (پرسیار)
✅ Attachments (وێنە، PDF، etc)
✅ Admin وەڵام دان
✅ Status tracking (چاونمایی)
✅ RTL Kurdish Support
✅ Responsive UI

---

## نوێ فیچەر زیاد کردن

ئێتە بتوانیت بۆ سیستەمەکە نوێ فیچەر بزیاد بکەی:

### بیلالام Notifications
```bash
npm install nodemailer
```

### Search و Filtering
- Backend: Add APIs for search
- Frontend: Implement search UI

### Mobile App
- React Native یا Flutter

---

## Database Management (Neon)

```bash
# نیخۆشێتی PostgreSQL CLI
psql 'postgresql://neondb_owner:npg_a4NevQSYd6Bu@ep-misty-tooth-aisbynf9-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'

# یان DBeaver IDE بەکار بهێنە
```

---

## Support

سیستەمەکە هەموو ڕاستی بۆ production!

**بەڕێاندە:** بعدی لە لاپی deploy کۆت، جار ئێتر تەنها:
```bash
git push
```

سوشت، Railway خۆمانی دیڵۆیی ئاپۆ دەکات! 🚀
