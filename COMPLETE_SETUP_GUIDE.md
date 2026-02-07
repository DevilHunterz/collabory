# 🚀 Complete Setup Guide - Collabory

## ⏱️ Total Time: 15 minutes

---

## Step 1: Install Dependencies (2 minutes)

Open your terminal in the project folder and run:

```bash
npm install
```

Wait for all packages to install.

---

## Step 2: Set Up Supabase Database (5 minutes)

### 2.1 Create Supabase Project
1. Go to https://supabase.com
2. Click "New Project"
3. Name: **Collabory**
4. Database Password: **Create a strong password** (save it!)
5. Region: **Choose closest to you**
6. Click "Create new project"
7. Wait ~2 minutes for setup

### 2.2 Run Database Schema
1. In Supabase, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Open `supabase/schema.sql` in your code editor
4. **Copy ALL the SQL code**
5. **Paste** into Supabase SQL Editor
6. Click **"Run"** (or Ctrl+Enter)
7. You should see "Success. No rows returned"

### 2.3 Create Storage Buckets
1. Click **"Storage"** (left sidebar)
2. Click **"Create a new bucket"**
3. Name: `avatars`
4. **Check** "Public bucket"
5. Click "Create bucket"
6. Repeat for `message-files` bucket

### 2.4 Get API Keys
1. Click **"Settings"** (gear icon, left sidebar)
2. Click **"API"**
3. Copy these two values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public** key (long string starting with eyJ...)

---

## Step 3: Configure Environment Variables (1 minute)

1. In your project, open the `.env` file
2. Replace with your actual values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLIC_KEY=
```

3. Save the file

---

## Step 4: Set Up Google OAuth (5 minutes)

### 4.1 In Supabase
1. Go to **Authentication** > **Providers**
2. Find **Google** and toggle it **ON**
3. **Keep this tab open** - you'll need the Callback URL

### 4.2 In Google Cloud Console
1. Go to https://console.cloud.google.com
2. Create a new project:
   - Click "Select a project" at top
   - Click "New Project"
   - Name: **Collabory**
   - Click "Create"

3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click it and click "Enable"

4. Configure OAuth Consent Screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - User Type: **External**
   - Click "Create"
   - App name: **Collabory**
   - User support email: **your email**
   - Developer contact: **your email**
   - Click "Save and Continue" (3 times)
   - Click "Back to Dashboard"

5. Create OAuth Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Application type: **Web application**
   - Name: **Collabory**
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     ```
   - Authorized redirect URIs (copy from Supabase):
     ```
     https://[your-project].supabase.co/auth/v1/callback
     ```
   - Click **"Create"**
   - **Copy** the Client ID and Client Secret

### 4.3 Back to Supabase
1. Go back to Supabase **Authentication** > **Providers** > **Google**
2. Paste **Client ID**
3. Paste **Client Secret**
4. Click **"Save"**
5. Make sure toggle is **ON** (green)

---

## Step 5: Start the App (1 minute)

In your terminal, run:

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

---

## Step 6: Test Everything (1 minute)

### Test Sign Up
1. Click "Sign In" in navbar
2. Switch to "Sign Up"
3. Fill in your details
4. Click "Create account"
5. Check your email for verification link
6. Click the link to verify

### Test Google Sign In
1. Click "Sign In"
2. Click "Continue with Google"
3. Select your Google account
4. Authorize the app
5. You should be logged in!

### Test Profile
1. Click "Profile" in navbar
2. Click "Edit Profile"
3. Upload an avatar
4. Add some skills
5. Click "Save Changes"

---

## ✅ You're Done!

Your Collabory platform is now running with:
- ✅ Database configured
- ✅ Storage buckets created
- ✅ Google OAuth working
- ✅ Premium UI loaded
- ✅ All features functional

---

## 🐛 Troubleshooting

### "Invalid API key"
- Check `.env` file has correct values
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

### "Table does not exist"
- Go back to Step 2.2 and run the SQL schema again

### "Storage bucket not found"
- Go back to Step 2.3 and create the buckets

### Google OAuth not working
- Check Client ID and Secret are correct
- Verify redirect URI matches exactly
- Make sure Google+ API is enabled

### Profile page not loading
- Make sure you're signed in
- Check browser console (F12) for errors
- Verify database tables exist

---

## 🎨 What Makes It Premium Now

### Typography
- System fonts (Apple/Windows native)
- Perfect line heights
- Proper font weights
- Optical sizing

### Colors
- Pure black/white accents
- Subtle gray borders
- High contrast
- Professional palette

### Spacing
- Generous padding
- Consistent gaps
- Breathing room
- Visual hierarchy

### Interactions
- Smooth transitions (200ms)
- Subtle hover states
- Focus rings
- Professional feel

### Components
- Clean borders
- No heavy shadows
- Minimal design
- Sophisticated look

---

## 📱 Mobile Testing

1. Open browser DevTools (F12)
2. Click device toolbar icon
3. Select iPhone or Android
4. Test all features
5. Everything should work perfectly!

---

## 🚀 Next Steps

1. **Customize branding** - Add your logo, colors
2. **Add content** - Create some test profiles
3. **Test features** - Try messaging, reviews
4. **Deploy** - Follow DEPLOYMENT.md when ready
5. **Launch** - Share with users!

---

## 💡 Pro Tips

- Use dark mode toggle in navbar
- Test on real mobile devices
- Check all pages work
- Try different browsers
- Get feedback from users

---

## 📞 Need Help?

- Check `TROUBLESHOOTING.md` for common issues
- Review `API.md` for database queries
- See `DEPLOYMENT.md` for production setup
- Read `ELEGANT_REDESIGN.md` for design philosophy

---

**Congratulations! Your premium creator collaboration platform is ready! 🎉**

The website now has:
- ✨ Truly premium design
- 🚀 Fast performance
- 📱 Mobile responsive
- 🔐 Secure authentication
- 🔄 Realtime updates
- 💎 Professional feel

**Time to start connecting creators! 🎊**
