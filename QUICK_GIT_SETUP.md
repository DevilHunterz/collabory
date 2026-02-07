# ⚡ Quick Git Setup - Copy & Paste

## Step 1: Initialize and Commit

Copy and paste these commands one by one:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Initial commit - Collabory platform"
```

## Step 2: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `collabory`
3. Click "Create repository"
4. **Copy your repository URL** (looks like: `https://github.com/YOUR_USERNAME/collabory.git`)

## Step 3: Connect and Push

**Replace `YOUR_USERNAME` with your actual GitHub username:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/collabory.git
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

## ✅ Done!

Your code is now on GitHub!

Visit: `https://github.com/YOUR_USERNAME/collabory`

---

## 🚀 Next: Deploy to Netlify

1. Go to: https://app.netlify.com
2. Click "Add new site" → "Import from Git"
3. Choose GitHub
4. Select your `collabory` repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

**Your site will be live in 2-3 minutes!**

---

## 📝 Future Updates

Whenever you make changes:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

Netlify will automatically deploy the updates!
