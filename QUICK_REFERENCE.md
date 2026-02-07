# ⚡ Quick Reference Card

## 🚀 Getting Started (5 Commands)

```bash
# 1. Install
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview

# 5. Deploy (after setup)
vercel
```

---

## 🔑 Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## 📋 Setup Checklist

- [ ] Run `npm install`
- [ ] Create Supabase project
- [ ] Run SQL schema
- [ ] Create storage buckets (avatars, message-files)
- [ ] Copy API keys to `.env`
- [ ] Enable Google OAuth (optional)
- [ ] Run `npm run dev`
- [ ] Test sign up/sign in
- [ ] Test profile page
- [ ] Deploy!

---

## 🎨 Premium Design Rules

### DO ✅
- Black/white accents
- Gray borders
- Clean typography
- Generous spacing
- Subtle hover states
- Fast transitions (200ms)
- High contrast
- Minimal design

### DON'T ❌
- Bright gradients
- Heavy shadows
- Glow effects
- Slow animations
- Cramped layouts
- Tiny text
- Too many colors
- Gaming aesthetics

---

## 🐛 Quick Fixes

### Profile not loading?
```bash
# Check if logged in
# Verify .env has correct keys
# Restart dev server
```

### Google OAuth not working?
```bash
# Enable in Supabase Auth > Providers
# Add Client ID and Secret
# Check redirect URI matches
```

### Database error?
```bash
# Run SQL schema in Supabase
# Check table names
# Verify RLS policies
```

---

## 📱 Test on Mobile

```bash
# Open DevTools (F12)
# Click device toolbar
# Select iPhone/Android
# Test all features
```

---

## 🚀 Deploy

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Add environment variables in dashboard
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

---

## 📚 Documentation

- `COMPLETE_SETUP_GUIDE.md` - Full setup (15 min)
- `GOOGLE_OAUTH_SETUP.md` - Google OAuth (5 min)
- `PREMIUM_DESIGN_GUIDE.md` - Design philosophy
- `TROUBLESHOOTING.md` - Common issues
- `API.md` - Database reference

---

## 🎯 Key Features

- ✅ Email/password auth
- ✅ Google OAuth
- ✅ Profile management
- ✅ Avatar uploads
- ✅ Real-time messaging
- ✅ Reviews & ratings
- ✅ Discovery & search
- ✅ Dark mode
- ✅ Mobile responsive
- ✅ Premium UI

---

## 💡 Pro Tips

1. **Use dark mode** - Toggle in navbar
2. **Test on mobile** - Use real devices
3. **Check console** - F12 for errors
4. **Read docs** - Everything is documented
5. **Ask for help** - Check TROUBLESHOOTING.md

---

## 🎉 You're Ready!

Your premium creator collaboration platform is:
- ✨ Designed
- 🚀 Built
- 📱 Responsive
- 🔐 Secure
- 💎 Premium

**Time to launch! 🎊**
