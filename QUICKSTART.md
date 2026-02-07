# Collabory - Quick Start Guide

Get Collabory running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed

## Quick Setup

### 1. Install Dependencies (1 minute)

```bash
npm install
```

### 2. Create Supabase Project (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project (wait ~2 minutes for setup)
3. Go to SQL Editor and run the schema from `supabase/schema.sql`
4. Go to Storage and create two public buckets:
   - `avatars`
   - `message-files`

### 3. Configure Environment (1 minute)

Create `.env` file in root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLIC_KEY=pk_test_your-key
```

Get these from:
- Supabase: Settings > API
- Stripe: Developers > API Keys (test mode)

### 4. Run Development Server (30 seconds)

```bash
npm run dev
```

Visit `http://localhost:3000`

## First Steps

### Create Your First User

1. Click "Sign In" in navbar
2. Switch to "Sign Up"
3. Fill in:
   - Name: Your Name
   - Role: YouTuber (or your role)
   - Email: your@email.com
   - Password: minimum 6 characters
4. Check email for verification link
5. Click link to verify

### Create Admin Account (Optional)

1. Sign up with email: `admin@collabory.com`
2. Verify email
3. Access admin dashboard at `/admin`

### Test Features

1. **Profile**: Click "Profile" to edit your profile
   - Upload avatar
   - Add bio
   - Add skills (comma separated)
   - Save changes

2. **Discovery**: Click "Discover"
   - Browse all creators
   - Use search and filters
   - View other profiles

3. **Messaging**: Click "Messages"
   - Start conversation with any user
   - Send text messages
   - Upload files (images, PDFs)
   - Note: Free users limited to 10 messages

4. **Reviews**: Visit another user's profile
   - Leave a rating (1-5 stars)
   - Write a review
   - See it appear on their profile

## Test Payments (Optional)

### Setup Stripe Test Mode

1. Create Stripe account at [stripe.com](https://stripe.com)
2. Stay in Test Mode
3. Create two products:
   - Premium: $9.99/month
   - Featured: $29.99/month
4. Copy price IDs and update in `src/pages/Profile.jsx`

### Test Cards

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date
- Any 3-digit CVC

### Test Upgrade Flow

1. Go to your profile
2. Click "Upgrade to Premium"
3. Use test card
4. Complete checkout
5. Return to see premium badge

## Project Structure

```
collabory/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Navbar.jsx
│   │   └── ProfileCard.jsx
│   ├── contexts/        # React contexts
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Discover.jsx
│   │   ├── Auth.jsx
│   │   ├── Messages.jsx
│   │   ├── Profile.jsx
│   │   └── Admin.jsx
│   ├── lib/            # Utilities
│   │   ├── supabase.js
│   │   └── stripe.js
│   ├── App.jsx         # Main app
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── supabase/
│   ├── schema.sql      # Database schema
│   └── edge-functions/ # Serverless functions
├── package.json
└── vite.config.js
```

## Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Deployment
vercel              # Deploy to Vercel
netlify deploy      # Deploy to Netlify
```

## Troubleshooting

### "Invalid API key"
- Check `.env` file exists in root
- Verify keys are correct from Supabase dashboard
- Restart dev server after changing .env

### "Table does not exist"
- Run the SQL schema in Supabase SQL Editor
- Check table names match exactly

### "Storage bucket not found"
- Create buckets in Supabase Storage
- Make them public
- Check bucket names: `avatars` and `message-files`

### Google OAuth not working
- Enable Google provider in Supabase Auth
- Set up OAuth credentials in Google Cloud Console
- Add redirect URI from Supabase

### Messages not real-time
- Check Supabase Realtime is enabled (it is by default)
- Verify RLS policies allow reading messages
- Check browser console for errors

## Next Steps

1. **Customize Design**: Edit Tailwind config and components
2. **Add Features**: Check `FEATURES.md` for ideas
3. **Deploy**: Follow `DEPLOYMENT.md` for production
4. **Add AI**: Integrate OpenAI for smart matching
5. **Mobile App**: Build with React Native

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Stripe Docs](https://stripe.com/docs)
- [Vite Docs](https://vitejs.dev)

## Support

- Check `README.md` for detailed setup
- Review `DEPLOYMENT.md` for production guide
- See `FEATURES.md` for complete feature list

## Tips

- Use dark mode toggle in navbar
- Test on mobile (responsive design)
- Try different user roles
- Explore admin dashboard
- Test message limits for free users
- Check profile ratings update automatically

Happy coding! 🚀
