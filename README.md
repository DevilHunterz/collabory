# Collabory - Creator Collaboration Hub

A production-ready platform connecting YouTubers, editors, designers, and content creators for networking and collaboration.

## Features

- **User Authentication**: Email/password and Google OAuth via Supabase Auth
- **Creator Profiles**: Customizable profiles with skills, portfolio links, and ratings
- **Real-time Messaging**: Direct messaging with file uploads using Supabase Realtime
- **Discovery & Search**: Advanced filtering by role, skills, and ratings
- **Reviews & Ratings**: Verified review system with admin moderation
- **Monetization**: 
  - Premium membership ($9.99/month) - Unlimited messaging, higher visibility
  - Featured profiles ($29.99/month) - Homepage highlighting, priority search placement
- **Admin Dashboard**: User management, content moderation, analytics
- **Responsive Design**: Mobile-first, dark/light mode support

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Payments**: Stripe (subscriptions + one-time payments)
- **Deployment**: Vercel/Netlify (frontend) + Supabase (backend)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql` in the SQL Editor
3. Create storage buckets:
   - `avatars` (public)
   - `message-files` (public)
4. Enable Google OAuth in Authentication > Providers
5. Deploy Edge Functions:
   ```bash
   supabase functions deploy create-checkout
   supabase functions deploy stripe-webhook
   ```

### 3. Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Create products:
   - Premium Membership: $9.99/month recurring
   - Featured Profile: $29.99/month recurring
3. Copy price IDs and update in `src/pages/Profile.jsx`
4. Set up webhook endpoint pointing to your Supabase Edge Function
5. Copy webhook secret

### 4. Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

For Supabase Edge Functions, set secrets:
```bash
supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key
supabase secrets set STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

Add environment variables in Netlify dashboard.

## Admin Access

To access admin dashboard, create a user with email `admin@collabory.com` in Supabase Auth.

## Database Schema

- **profiles**: User profiles with role, skills, ratings
- **messages**: Direct messages between users
- **reviews**: User reviews and ratings
- **subscriptions**: Stripe subscription tracking

## Security Features

- Row Level Security (RLS) enabled on all tables
- Secure authentication with Supabase Auth
- HTTPS enforced in production
- XSS and CSRF protection
- Secure file uploads with validation

## Monetization Strategy

1. **Free Tier**: Basic profile, limited messaging (10 messages)
2. **Premium ($9.99/mo)**: Unlimited messaging, higher search visibility, analytics
3. **Featured ($29.99/mo)**: Homepage placement, priority search, all premium features

## Future Enhancements

- AI-powered collaborator matching
- Project management tools
- Video portfolio integration
- Advanced analytics dashboard
- Mobile apps (React Native)
- Email notifications
- Calendar integration for scheduling

## License

MIT License - feel free to use for your projects!

## Support

For issues or questions, create an issue on GitHub or contact support@collabory.com
