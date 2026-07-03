# تعليمات تركيب لوحة الأدمن

## 1. تثبيت الباكدج الإضافي
المشروع يحتاج باكدج واحد جديد للتعامل مع الجلسة (auth session) بين السيرفر والمتصفح:

```bash
npm install @supabase/ssr
```

## 2. انسخ الملفات لمكانها بنفس المسارات
```
middleware.ts                              -> جذر المشروع (بجانب package.json)
lib/admin-actions.ts                       -> lib/
lib/supabase-server.ts                     -> lib/
lib/supabase-browser.ts                    -> lib/
app/admin/login/page.tsx                   -> app/admin/login/
app/admin/page.tsx                         -> app/admin/
components/admin/AdminDashboard.tsx        -> components/admin/
components/admin/ProductsManager.tsx       -> components/admin/
components/admin/CategoriesManager.tsx     -> components/admin/
components/admin/SettingsManager.tsx       -> components/admin/
components/admin/ImageUploader.tsx         -> components/admin/
```

ملفاتك الحالية (`lib/types.ts`, `lib/supabase.ts`, `app/page.tsx`) ما تحتاج أي تعديل.

## 3. أنشئ Storage Bucket في Supabase
1. ادخل Supabase Dashboard → Storage → New bucket
2. اسم الـ bucket: `images`
3. فعّل "Public bucket" حتى تظهر الصور في الموقع

## 4. أنشئ حساب أدمن
1. Supabase Dashboard → Authentication → Users → Add user
2. حط الإيميل والباسورد اللي بتسجل فيهم دخول لاحقًا

## 5. تأكد من متغيرات البيئة (.env.local)
لازم يكون عندك هالثلاثة موجودين أصلًا حسب ملف `lib/supabase.ts`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## 6. شغل المشروع وجرب
```bash
npm run dev
```
افتح `/admin/login` وسجل دخول بالحساب اللي أنشأته.

## ملاحظات مهمة
- جدول `settings` لازم يكون شكله `key` / `value` (نفس اللي شفته بصفحتك الرئيسية `settings.forEach((s) => settings[s.key] = s.value)`).
- صفحة `/admin` محمية تلقائيًا عبر `middleware.ts` — أي شخص مو مسجل دخول بينحول لصفحة تسجيل الدخول.
- كل عمليات الإضافة/التعديل/الحذف تمر عبر `lib/admin-actions.ts` وتستخدم `supabaseAdmin` (السيرفر فقط) — هذا أأمن من استخدام مفتاح الـ service role بالمتصفح.
