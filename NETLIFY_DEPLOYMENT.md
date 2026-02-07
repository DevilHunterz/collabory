# 🚀 Deploy to Netlify - Complete Guide

## Prerequisites
- GitHub account
- Netlify account (free tier works)
- Supabase project already set up

---

## Step 1: Prepare Your Repository

### 1.1 Create `.gitignore` (if not exists)
Make sure these are in your `.gitignore`:
```
node_modules
dist
.env
.env.local
```

### 1.2 Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Step 2: Configure Build Settings

### 2.1 Create `netlify.toml` in your project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

This file tells Netlify:
- How to build your project
- Where the built files are
- How to handle React Router (SPA redirects)

---

## Step 3: Deploy on Netlify

### 3.1 Connect to Netlify
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Authorize Netlify to access your repositories
5. Select your Collabory repository

### 3.2 Configure Build Settings
Netlify should auto-detect these from `netlify.toml`, but verify:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18

### 3.3 Add Environment Variables
Click "Show advanced" → "New variable" and add:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key (if using Stripe)
```

**Where to find these:**
- Supabase URL & Key: Supabase Dashboard → Settings → API
- Stripe Key: Stripe Dashboard → Developers → API keys

### 3.4 Deploy
Click "Deploy site"

Wait 2-3 minutes for the build to complete.

---

## Step 4: Configure Supabase for Production

### 4.1 Update Supabase URL Settings
1. Go to Supabase Dashboard
2. Authentication → URL Configuration
3. Add your Netlify URL to:
   - **Site URL:** `https://your-site-name.netlify.app`
   - **Redirect URLs:** `https://your-site-name.netlify.app/**`

### 4.2 Run Storage Policies (IMPORTANT - Fixes Avatar Upload)
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the content from `supabase/storage-policies.sql`
3. Click "Run"

This creates the storage buckets and sets up proper permissions for avatar uploads.

---

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Custom Domain
1. In Netlify: Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `collabory.com`)

### 5.2 Update DNS
Add these records to your domain provider:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

### 5.3 Enable HTTPS
Netlify automatically provisions SSL certificates (takes ~1 minute)

### 5.4 Update Supabase URLs
Update the redirect URLs in Supabase to use your custom domain:
- `https://yourdomain.com/**`

---

## Step 6: Verify Deployment

### 6.1 Test Core Features
Visit your deployed site and test:
- ✅ Homepage loads
- ✅ Sign in with Google works
- ✅ Profile creation works
- ✅ Avatar upload works (after running storage policies)
- ✅ Messages work
- ✅ Navigation works

### 6.2 Check Console for Errors
Open browser DevTools (F12) → Console
- No red errors should appear
- If you see CORS errors, check Supabase URL configuration

---

## Step 7: Continuous Deployment

### Automatic Deploys
Every time you push to GitHub, Netlify automatically:
1. Pulls the latest code
2. Runs `npm run build`
3. Deploys the new version

### Manual Deploy
In Netlify Dashboard:
- Click "Deploys" → "Trigger deploy" → "Deploy site"

---

## Troubleshooting

### Avatar Upload Still Failing?
1. Verify storage policies are applied in Supabase
2. Check bucket names match (`avatars`, `message-files`)
3. Verify buckets are set to "public"
4. Check browser console for specific error

### Google OAuth Not Working?
1. Add Netlify URL to Google Cloud Console:
   - APIs & Services → Credentials
   - Add `https://your-site.netlify.app` to Authorized JavaScript origins
   - Add `https://your-site.netlify.app/**` to Authorized redirect URIs
2. Update Supabase redirect URLs

### Build Failing?
1. Check build logs in Netlify
2. Verify all environment variables are set
3. Make sure `package.json` has all dependencies
4. Try building locally: `npm run build`

### 404 on Page Refresh?
- Make sure `netlify.toml` has the redirects rule
- Redeploy the site

---

## Environment Variables Checklist

Required for production:
```
✅ VITE_SUPABASE_URL
✅ VITE_SUPABASE_ANON_KEY
✅ VITE_STRIPE_PUBLISHABLE_KEY (if using payments)
```

---

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Google OAuth works
- [ ] Avatar upload works
- [ ] Profile editing works
- [ ] Messages work
- [ ] All pages accessible
- [ ] No console errors
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)

---

## Quick Deploy Commands

```bash
# Build locally to test
npm run build

# Preview build locally
npm run preview

# Push to trigger deploy
git add .
git commit -m "Update"
git push origin main
```

---

## Support

If you encounter issues:
1. Check Netlify build logs
2. Check browser console
3. Check Supabase logs
4. Verify all environment variables
5. Test locally first with `npm run build && npm run preview`

---

## Your Deployment URLs

After deployment, save these:
- **Netlify URL:** `https://your-site-name.netlify.app`
- **Custom Domain:** `https://yourdomain.com` (if configured)
- **Supabase URL:** Your Supabase project URL
- **Admin Email:** tyrytr0981@gmail.com (has admin access)

---

## Success! 🎉

Your Collabory platform is now live and accessible worldwide!

Next steps:
- Share the URL
- Monitor usage in Netlify Analytics
- Check Supabase usage
- Set up monitoring/alerts
