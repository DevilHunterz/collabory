# 🔧 Fix Blank Screen After Deployment

## ✅ Step-by-Step Fix

### **Step 1: Add Environment Variables in Netlify**

1. Go to your Netlify dashboard
2. Click on your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add these TWO variables:

```
Variable 1:
Key: VITE_SUPABASE_URL
Value: https://qkmanutkayimqhdlbuyt.supabase.co

Variable 2:
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrbWFudXRrYXlpbXFoZGxidXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODU3NTgsImV4cCI6MjA4NTk2MTc1OH0.reW5QqykUQaZMm5ebHiKWXw3TR7lFmNjXtuSKI62wk4
```

### **Step 2: Trigger Redeploy**

After adding variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait 2-3 minutes

### **Step 3: Check Build Logs**

While deploying:
1. Click on the deploy in progress
2. Scroll down to see build logs
3. Look for any errors (red text)

**Common errors:**
- "Module not found" → Missing dependency
- "Environment variable not defined" → Variables not set
- "Build failed" → Check the specific error

---

## 🔍 If Still Blank

### **Check Browser Console:**

1. Open your deployed site
2. Press **F12** (or right-click → Inspect)
3. Go to **Console** tab
4. Look for errors

**Common console errors:**

**Error: "Failed to fetch"**
- Solution: Check Supabase URL is correct

**Error: "Unexpected token"**
- Solution: Build issue, check build logs

**Error: "Cannot read property of undefined"**
- Solution: Missing environment variables

---

## 🚀 Quick Test Locally

Test if it works locally:

```bash
npm run build
npm run preview
```

If it works locally but not on Netlify:
- ✅ Environment variables are missing in Netlify
- ✅ Need to redeploy after adding variables

---

## ✅ Checklist

- [ ] Environment variables added in Netlify
- [ ] Redeployed after adding variables
- [ ] Build completed successfully (green checkmark)
- [ ] No errors in browser console
- [ ] Supabase URL is correct
- [ ] Supabase anon key is correct

---

## 📞 Still Having Issues?

**Send me:**
1. Screenshot of Netlify build log
2. Screenshot of browser console (F12)
3. Your Netlify site URL

I'll help you fix it!

---

## 🎯 Most Common Fix

**90% of blank screens are fixed by:**

1. Adding environment variables in Netlify
2. Redeploying the site

**Make sure you REDEPLOY after adding variables!**
