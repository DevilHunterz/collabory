# 🔧 Fix Google Sign In - Error 400: redirect_uri_mismatch

## The Problem

Google OAuth is blocking your app because your Netlify URL is not authorized in Google Cloud Console.

---

## ✅ Step-by-Step Fix

### **Step 1: Get Your Netlify URL**

Your Netlify URL should look like:
- `https://your-site-name.netlify.app`

Copy this URL!

---

### **Step 2: Update Google Cloud Console**

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com

2. **Select Your Project:**
   - Click the project dropdown at the top
   - Select your project (or create one if you haven't)

3. **Go to Credentials:**
   - Click the menu (☰) → **APIs & Services** → **Credentials**

4. **Edit OAuth 2.0 Client:**
   - Find your OAuth 2.0 Client ID
   - Click the pencil icon (✏️) to edit

5. **Add Authorized JavaScript Origins:**
   - Scroll to "Authorized JavaScript origins"
   - Click **+ ADD URI**
   - Add these URLs:
     ```
     http://localhost:3000
     https://your-site-name.netlify.app
     ```

6. **Add Authorized Redirect URIs:**
   - Scroll to "Authorized redirect URIs"
   - Click **+ ADD URI**
   - Add these URLs:
     ```
     http://localhost:3000/**
     https://your-site-name.netlify.app/**
     https://qkmanutkayimqhdlbuyt.supabase.co/auth/v1/callback
     ```

7. **Click SAVE**

---

### **Step 3: Update Supabase Settings**

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard

2. **Select Your Project**

3. **Go to Authentication Settings:**
   - Click **Authentication** → **URL Configuration**

4. **Update Site URL:**
   - Set **Site URL** to: `https://your-site-name.netlify.app`

5. **Update Redirect URLs:**
   - Add to **Redirect URLs**:
     ```
     http://localhost:3000/**
     https://your-site-name.netlify.app/**
     ```

6. **Click SAVE**

---

### **Step 4: Test Google Sign In**

1. Go to your deployed site
2. Click "Sign in with Google"
3. It should work now!

---

## 🎯 Quick Checklist

- [ ] Added Netlify URL to Google Cloud Console (JavaScript origins)
- [ ] Added Netlify URL to Google Cloud Console (Redirect URIs)
- [ ] Added Supabase callback URL to Google Cloud Console
- [ ] Updated Supabase Site URL
- [ ] Updated Supabase Redirect URLs
- [ ] Clicked SAVE in both places
- [ ] Tested Google Sign In

---

## 📝 URLs You Need

Replace `your-site-name` with your actual Netlify site name:

### **Google Cloud Console - JavaScript Origins:**
```
http://localhost:3000
https://your-site-name.netlify.app
```

### **Google Cloud Console - Redirect URIs:**
```
http://localhost:3000/**
https://your-site-name.netlify.app/**
https://qkmanutkayimqhdlbuyt.supabase.co/auth/v1/callback
```

### **Supabase - Site URL:**
```
https://your-site-name.netlify.app
```

### **Supabase - Redirect URLs:**
```
http://localhost:3000/**
https://your-site-name.netlify.app/**
```

---

## ⚠️ Common Mistakes

1. **Forgot the `/**` at the end** → Add it!
2. **Used `http` instead of `https`** → Use `https` for Netlify
3. **Didn't click SAVE** → Always save changes
4. **Wrong Supabase callback URL** → Use your actual Supabase project URL

---

## 🔍 Still Not Working?

### **Check Google Cloud Console:**
1. Make sure you're editing the CORRECT OAuth client
2. Make sure you clicked SAVE
3. Wait 1-2 minutes for changes to propagate

### **Check Supabase:**
1. Make sure Google provider is ENABLED
2. Go to: Authentication → Providers → Google
3. Toggle should be ON (green)

### **Clear Browser Cache:**
1. Press Ctrl + Shift + Delete
2. Clear cookies and cache
3. Try again

---

## 🎉 Success!

Once configured correctly, Google Sign In will work on:
- ✅ Localhost (development)
- ✅ Netlify (production)
- ✅ Any custom domain you add

---

## 📞 Need Help?

If you're still getting errors:
1. Screenshot the Google Cloud Console credentials page
2. Screenshot the Supabase URL configuration page
3. Tell me your Netlify URL
4. I'll help you debug!
