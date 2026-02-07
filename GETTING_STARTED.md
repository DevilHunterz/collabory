# Getting Started with Collabory

Welcome to Collabory! This guide will help you get up and running quickly.

## 🎯 What is Collabory?

Collabory is a creator collaboration platform that connects:
- **YouTubers** looking for editors and designers
- **Video Editors** seeking clients and projects
- **Graphic Designers** finding collaboration opportunities
- **Content Creators** building their teams

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (takes ~2 minutes)
3. In the SQL Editor, paste and run the contents of `supabase/schema.sql`
4. In Storage, create two public buckets: `avatars` and `message-files`
5. Copy your project URL and anon key from Settings > API

### 3. Configure Environment

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📖 What's Included?

### Core Features
- ✅ User authentication (email + Google OAuth)
- ✅ Creator profiles with avatars and skills
- ✅ Real-time messaging with file uploads
- ✅ Discovery and search functionality
- ✅ Reviews and ratings system
- ✅ Premium memberships ($9.99/mo)
- ✅ Featured profiles ($29.99/mo)
- ✅ Admin dashboard
- ✅ Dark/light mode
- ✅ Mobile responsive design

### Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Payments:** Stripe
- **Deployment:** Vercel or Netlify

## 📁 Project Structure

```
collabory/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (Auth, Theme)
│   ├── pages/          # Main pages (Home, Discover, Messages, etc.)
│   ├── lib/            # Utilities (Supabase, Stripe)
│   └── App.jsx         # Main app component
├── supabase/
│   ├── schema.sql      # Database schema
│   └── edge-functions/ # Serverless functions
└── Documentation files
```

## 🎓 Learning Path

### For Beginners

1. **Start Here:**
   - Read `QUICKSTART.md` for basic setup
   - Follow the 5-minute quick start above
   - Create your first user account

2. **Explore Features:**
   - Create and edit your profile
   - Browse other creators
   - Send messages
   - Leave reviews

3. **Understand the Code:**
   - Start with `src/App.jsx` - main app structure
   - Look at `src/pages/Home.jsx` - landing page
   - Check `src/contexts/AuthContext.jsx` - authentication
   - Review `src/components/Navbar.jsx` - navigation

### For Intermediate Developers

1. **Database:**
   - Study `supabase/schema.sql` - database design
   - Read `API.md` - complete API reference
   - Understand Row Level Security (RLS)

2. **Features:**
   - Real-time messaging in `src/pages/Messages.jsx`
   - Payment integration in `src/pages/Profile.jsx`
   - Admin dashboard in `src/pages/Admin.jsx`

3. **Deployment:**
   - Follow `DEPLOYMENT.md` for production setup
   - Configure Stripe webhooks
   - Deploy Edge Functions

### For Advanced Developers

1. **Customization:**
   - Modify Tailwind theme in `tailwind.config.js`
   - Add new features (see `FEATURES.md` for ideas)
   - Implement AI matching algorithms

2. **Optimization:**
   - Add caching strategies
   - Implement lazy loading
   - Optimize database queries
   - Add analytics

3. **Scaling:**
   - Set up monitoring
   - Implement rate limiting
   - Add CDN for assets
   - Configure load balancing

## 🛠️ Common Tasks

### Add a New Page

1. Create file in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`:
```javascript
<Route path="/new-page" element={<NewPage />} />
```
3. Add navigation link in `src/components/Navbar.jsx`

### Add a New Component

1. Create file in `src/components/NewComponent.jsx`
2. Import and use in your pages:
```javascript
import NewComponent from '../components/NewComponent'
```

### Modify Database Schema

1. Update `supabase/schema.sql`
2. Run new SQL in Supabase SQL Editor
3. Update TypeScript types (if using TypeScript)
4. Update relevant components

### Add New Environment Variable

1. Add to `.env` file (must start with `VITE_`)
2. Access in code: `import.meta.env.VITE_YOUR_VAR`
3. Add to deployment platform (Vercel/Netlify)
4. Restart dev server

## 🐛 Troubleshooting

### "Invalid API key"
- Check `.env` file exists and has correct values
- Restart dev server after changing .env
- Verify keys from Supabase dashboard

### "Table does not exist"
- Run `supabase/schema.sql` in Supabase SQL Editor
- Check table names match exactly

### "Storage bucket not found"
- Create buckets in Supabase Storage
- Make them public
- Check bucket names: `avatars` and `message-files`

For more issues, see `TROUBLESHOOTING.md`

## 📚 Documentation Guide

Choose the right document for your needs:

- **GETTING_STARTED.md** (this file) - Start here
- **QUICKSTART.md** - 5-minute setup
- **README.md** - Complete overview and setup
- **DEPLOYMENT.md** - Production deployment guide
- **FEATURES.md** - Complete feature list
- **API.md** - Database and API reference
- **TROUBLESHOOTING.md** - Common issues and solutions
- **SETUP_CHECKLIST.md** - Complete setup checklist
- **PROJECT_SUMMARY.md** - Project overview

## 🎯 Next Steps

### Immediate (Today)
1. ✅ Complete quick start setup
2. ✅ Create your first user account
3. ✅ Explore all features
4. ✅ Read through the code

### Short Term (This Week)
1. Set up Stripe for payments
2. Deploy to Vercel or Netlify
3. Configure custom domain
4. Add your branding

### Medium Term (This Month)
1. Customize design and features
2. Add AI-powered matching
3. Implement analytics
4. Launch to users

### Long Term (This Quarter)
1. Build mobile apps
2. Add advanced features
3. Scale infrastructure
4. Grow user base

## 💡 Tips for Success

### Development
- Use browser DevTools for debugging
- Check Supabase logs for database issues
- Test in multiple browsers
- Use mobile view in DevTools

### Deployment
- Start with test mode in Stripe
- Test thoroughly before going live
- Monitor logs after deployment
- Have rollback plan ready

### Growth
- Start with small user group
- Gather feedback early
- Iterate based on usage
- Monitor key metrics

## 🤝 Getting Help

### Resources
- **Documentation:** All .md files in project
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **React Docs:** [react.dev](https://react.dev)
- **Tailwind Docs:** [tailwindcss.com](https://tailwindcss.com)
- **Stripe Docs:** [stripe.com/docs](https://stripe.com/docs)

### Community
- Supabase Discord
- React Community
- Stack Overflow
- GitHub Issues

## 🎉 You're Ready!

You now have everything you need to:
- ✅ Run Collabory locally
- ✅ Understand the codebase
- ✅ Deploy to production
- ✅ Customize and extend
- ✅ Launch to users

**Time to build something amazing! 🚀**

---

**Questions?** Check the other documentation files or create an issue.

**Ready to deploy?** Follow `DEPLOYMENT.md` for step-by-step instructions.

**Need help?** See `TROUBLESHOOTING.md` for common issues.

Happy coding! 💻✨
