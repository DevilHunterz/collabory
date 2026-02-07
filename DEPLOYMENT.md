# Collabory Deployment Guide

Complete step-by-step guide to deploy Collabory to production.

## Prerequisites

- Node.js 18+ installed
- Git installed
- Accounts created on:
  - Supabase (database & auth)
  - Stripe (payments)
  - Vercel or Netlify (hosting)

## Step 1: Supabase Setup (15 minutes)

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and set project name: "collabory"
4. Set a strong database password (save it!)
5. Choose region closest to your users
6. Wait for project to be ready (~2 minutes)

### 1.2 Run Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy entire contents of `supabase/schema.sql`
4. Paste and click "Run"
5. Verify tables created in Table Editor

### 1.3 Create Storage Buckets
1. Go to Storage in sidebar
2. Create bucket: `avatars`
   - Make it public
   - Set file size limit: 5MB
   - Allowed MIME types: image/*
3. Create bucket: `message-files`
   - Make it public
   - Set file size limit: 10MB
   - Allowed MIME types: image/*, application/pdf

### 1.4 Enable Google OAuth
1. Go to Authentication > Providers
2. Enable Google provider
3. Follow instructions to create Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase
5. Save configuration

### 1.5 Get API Keys
1. Go to Settings > API
2. Copy:
   - Project URL (VITE_SUPABASE_URL)
   - anon/public key (VITE_SUPABASE_ANON_KEY)
   - service_role key (for Edge Functions)

## Step 2: Stripe Setup (10 minutes)

### 2.1 Create Account
1. Sign up at [stripe.com](https://stripe.com)
2. Complete business verification (can test without this)
3. Switch to Test mode for development

### 2.2 Create Products
1. Go to Products > Add Product
2. Create "Premium Membership":
   - Name: Premium Membership
   - Description: Unlimited messaging and higher visibility
   - Pricing: $9.99/month recurring
   - Copy the Price ID (starts with price_)
3. Create "Featured Profile":
   - Name: Featured Profile
   - Description: Homepage highlighting and priority placement
   - Pricing: $29.99/month recurring
   - Copy the Price ID

### 2.3 Update Code with Price IDs
Open `src/pages/Profile.jsx` and update:
```javascript
const upgradeToPremium = async () => {
  await createCheckoutSession('price_YOUR_PREMIUM_PRICE_ID', user.id)
}

const upgradeFeatured = async () => {
  await createCheckoutSession('price_YOUR_FEATURED_PRICE_ID', user.id)
}
```

### 2.4 Get API Keys
1. Go to Developers > API Keys
2. Copy:
   - Publishable key (VITE_STRIPE_PUBLIC_KEY)
   - Secret key (STRIPE_SECRET_KEY)

## Step 3: Deploy Edge Functions (5 minutes)

### 3.1 Install Supabase CLI
```bash
npm install -g supabase
```

### 3.2 Login to Supabase
```bash
supabase login
```

### 3.3 Link Project
```bash
supabase link --project-ref your-project-ref
```

### 3.4 Set Secrets
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3.5 Deploy Functions
```bash
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
```

### 3.6 Configure Stripe Webhook
1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://[your-project-ref].supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - checkout.session.completed
   - customer.subscription.deleted
   - customer.subscription.updated
4. Copy webhook signing secret
5. Update in Supabase secrets:
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

## Step 4: Deploy Frontend (10 minutes)

### Option A: Vercel (Recommended)

#### 4.1 Install Vercel CLI
```bash
npm install -g vercel
```

#### 4.2 Deploy
```bash
vercel
```

Follow prompts:
- Set up and deploy? Yes
- Which scope? Your account
- Link to existing project? No
- Project name? collabory
- Directory? ./
- Override settings? No

#### 4.3 Add Environment Variables
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_STRIPE_PUBLIC_KEY
```

Or add via dashboard:
1. Go to project settings
2. Environment Variables
3. Add all three variables for Production, Preview, and Development

#### 4.4 Deploy to Production
```bash
vercel --prod
```

### Option B: Netlify

#### 4.1 Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 4.2 Login
```bash
netlify login
```

#### 4.3 Initialize
```bash
netlify init
```

#### 4.4 Add Environment Variables
```bash
netlify env:set VITE_SUPABASE_URL "your_value"
netlify env:set VITE_SUPABASE_ANON_KEY "your_value"
netlify env:set VITE_STRIPE_PUBLIC_KEY "your_value"
```

#### 4.5 Deploy
```bash
netlify deploy --prod
```

## Step 5: Post-Deployment Setup (5 minutes)

### 5.1 Update OAuth Redirect URLs
1. Go to Supabase Authentication > URL Configuration
2. Add your production URL to:
   - Site URL: `https://your-domain.com`
   - Redirect URLs: `https://your-domain.com/**`

### 5.2 Update Stripe Checkout URLs
Update `src/lib/stripe.js` if needed to use production URLs.

### 5.3 Create Admin Account
1. Sign up on your deployed site with email: `admin@collabory.com`
2. Verify email
3. Access admin dashboard at `/admin`

### 5.4 Test Payment Flow
1. Use Stripe test cards:
   - Success: 4242 4242 4242 4242
   - Decline: 4000 0000 0000 0002
2. Test premium upgrade
3. Test featured profile upgrade
4. Verify webhooks in Stripe dashboard

## Step 6: Custom Domain (Optional)

### Vercel
1. Go to project settings > Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Update DNS records
4. Enable HTTPS (automatic)

## Step 7: Monitoring & Analytics

### 7.1 Supabase Monitoring
- Check Database > Logs for errors
- Monitor API usage in Settings
- Set up email alerts for issues

### 7.2 Stripe Monitoring
- Check Dashboard for payment activity
- Monitor failed payments
- Set up email notifications

### 7.3 Application Monitoring (Optional)
Consider adding:
- Sentry for error tracking
- Google Analytics for user analytics
- LogRocket for session replay

## Production Checklist

- [ ] Database schema deployed
- [ ] Storage buckets created and configured
- [ ] Google OAuth enabled and tested
- [ ] Stripe products created
- [ ] Edge Functions deployed
- [ ] Stripe webhooks configured
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] OAuth redirect URLs updated
- [ ] Admin account created
- [ ] Payment flow tested
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Monitoring set up

## Troubleshooting

### Issue: "Invalid API key"
- Verify environment variables are set correctly
- Check for typos in .env file
- Ensure variables start with VITE_ for Vite

### Issue: Google OAuth not working
- Verify redirect URI matches exactly
- Check Google Cloud Console credentials
- Ensure Google+ API is enabled

### Issue: Payments failing
- Verify Stripe keys are correct (test vs live)
- Check webhook endpoint is accessible
- Review Stripe logs for errors

### Issue: Images not uploading
- Check storage bucket permissions (should be public)
- Verify file size limits
- Check CORS settings in Supabase

### Issue: Real-time messages not working
- Verify Supabase Realtime is enabled
- Check RLS policies on messages table
- Review browser console for WebSocket errors

## Support

For issues:
1. Check Supabase logs
2. Check browser console
3. Review Stripe webhook logs
4. Check deployment logs (Vercel/Netlify)

## Security Notes

- Never commit .env files
- Use environment variables for all secrets
- Enable RLS on all Supabase tables
- Keep dependencies updated
- Monitor for security vulnerabilities
- Use HTTPS only in production
- Implement rate limiting (Supabase has built-in)

## Performance Optimization

- Enable Vercel/Netlify CDN
- Optimize images before upload
- Use lazy loading for images
- Enable Supabase connection pooling
- Monitor database query performance
- Consider adding Redis cache for hot data

## Scaling Considerations

- Supabase scales automatically
- Monitor database connections
- Consider upgrading Supabase plan for more resources
- Use database indexes (already in schema)
- Implement pagination for large lists
- Consider CDN for static assets

Your Collabory platform is now live! 🚀
