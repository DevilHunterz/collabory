# ⚡ Quick Start Guide

## 🔴 Fix Avatar Upload (CRITICAL)

**The avatar upload error is due to missing storage policies in Supabase.**

### Fix in 2 Minutes:

1. Open Supabase Dashboard → SQL Editor
2. Copy the entire content from `supabase/storage-policies.sql`
3. Paste and click "Run"
4. Done! Avatar upload now works

---

## 🚀 Deploy to Netlify

### 1. Push to GitHub
```bash
git add .
git commit -m "Red theme + fixes"
git push origin main
```

### 2. Deploy on Netlify
1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → "Import from Git"
3. Select your repository
4. Add environment variables:
   ```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```
5. Click "Deploy"

### 3. Update Supabase
1. Supabase → Authentication → URL Configuration
2. Add your Netlify URL: `https://your-site.netlify.app`
3. Add to redirect URLs: `https://your-site.netlify.app/**`

**Done! Your site is live.**

---

## 🎨 What Changed

### Theme
- ❌ Blue/Purple gaming colors
- ✅ Red/Black professional theme

### Navbar
- ❌ Full-width bar
- ✅ Floating pill design (centered)

### Backgrounds
- ❌ White/light backgrounds
- ✅ Pure black (#000000)

### Hover Effects
- ✅ Cards lift on hover
- ✅ Red glow effects
- ✅ Smooth animations
- ✅ Professional feel

---

## 📁 Key Files

- `supabase/storage-policies.sql` - **Run this to fix avatar upload**
- `netlify.toml` - Netlify configuration
- `NETLIFY_DEPLOYMENT.md` - Full deployment guide
- `src/index.css` - Red/black theme
- `src/components/Navbar.jsx` - Pill navbar

---

## ✅ Checklist

Before deploying:
- [ ] Run storage policies in Supabase
- [ ] Test avatar upload locally
- [ ] Push to GitHub
- [ ] Add environment variables in Netlify
- [ ] Update Supabase redirect URLs

After deploying:
- [ ] Test avatar upload on live site
- [ ] Test Google OAuth
- [ ] Check all pages work
- [ ] Verify mobile responsive

---

## 🆘 Quick Fixes

### Avatar Upload Fails
→ Run `supabase/storage-policies.sql` in Supabase

### OAuth Not Working
→ Add Netlify URL to Google Cloud Console & Supabase

### Build Fails
→ Check environment variables are set

### 404 on Refresh
→ `netlify.toml` should have redirects (already included)

---

## 🎯 Test Locally

```bash
npm run dev
```

Visit: http://localhost:3000

Test:
- Avatar upload
- Profile editing
- Navigation
- Hover effects

---

## 📞 Support

Check these files for detailed help:
- `NETLIFY_DEPLOYMENT.md` - Full deployment guide
- `RED_BLACK_THEME_COMPLETE.md` - All changes explained
- `POLISH_IMPROVEMENTS.md` - UI improvements

---

## 🎉 You're Ready!

Your Collabory platform is now:
- ✅ Red & black themed
- ✅ Professional SaaS design
- ✅ Floating pill navbar
- ✅ Premium hover effects
- ✅ Avatar upload fixed
- ✅ Ready for deployment

**Deploy and share your platform!** 🚀
