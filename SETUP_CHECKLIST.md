# Collabory Setup Checklist

Complete this checklist to ensure your Collabory platform is fully configured and ready for production.

## ☐ Prerequisites

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Modern web browser

## ☐ Project Setup

- [ ] Clone or download project
- [ ] Navigate to project directory
- [ ] Run `npm install`
- [ ] Verify all dependencies installed successfully

## ☐ Supabase Configuration

### Account & Project
- [ ] Create Supabase account at supabase.com
- [ ] Create new project
- [ ] Save database password securely
- [ ] Wait for project initialization (~2 minutes)

### Database Setup
- [ ] Open SQL Editor in Supabase dashboard
- [ ] Copy contents of `supabase/schema.sql`
- [ ] Execute SQL in editor
- [ ] Verify tables created in Table Editor:
  - [ ] profiles
  - [ ] messages
  - [ ] reviews
  - [ ] subscriptions
- [ ] Check indexes created
- [ ] Verify RLS policies enabled

### Storage Setup
- [ ] Go to Storage section
- [ ] Create bucket: `avatars`
  - [ ] Set as public
  - [ ] Set max file size: 5MB
  - [ ] Allow image/* types
- [ ] Create bucket: `message-files`
  - [ ] Set as public
  - [ ] Set max file size: 10MB
  - [ ] Allow image/*, application/pdf

### Authentication Setup
- [ ] Go to Authentication > Providers
- [ ] Email provider enabled (default)
- [ ] Configure Google OAuth:
  - [ ] Create Google Cloud project
  - [ ] Enable Google+ API
  - [ ] Create OAuth 2.0 credentials
  - [ ] Add authorized redirect URI
  - [ ] Copy Client ID and Secret to Supabase
  - [ ] Save configuration

### API Keys
- [ ] Go to Settings > API
- [ ] Copy Project URL
- [ ] Copy anon/public key
- [ ] Copy service_role key (for Edge Functions)
- [ ] Save keys securely

## ☐ Stripe Configuration

### Account Setup
- [ ] Create Stripe account at stripe.com
- [ ] Complete business information
- [ ] Switch to Test Mode for development

### Products & Pricing
- [ ] Create Premium Membership product:
  - [ ] Name: Premium Membership
  - [ ] Price: $9.99/month recurring
  - [ ] Copy Price ID
- [ ] Create Featured Profile product:
  - [ ] Name: Featured Profile
  - [ ] Price: $29.99/month recurring
  - [ ] Copy Price ID

### API Keys
- [ ] Go to Developers > API Keys
- [ ] Copy Publishable key (test mode)
- [ ] Copy Secret key (test mode)
- [ ] Save keys securely

### Webhook Setup (After Edge Functions deployed)
- [ ] Go to Developers > Webhooks
- [ ] Add endpoint URL
- [ ] Select events:
  - [ ] checkout.session.completed
  - [ ] customer.subscription.deleted
  - [ ] customer.subscription.updated
- [ ] Copy webhook signing secret

## ☐ Environment Variables

### Local Development
- [ ] Create `.env` file in project root
- [ ] Add Supabase URL
- [ ] Add Supabase anon key
- [ ] Add Stripe public key
- [ ] Verify format:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Update Code
- [ ] Open `src/pages/Profile.jsx`
- [ ] Update Premium price ID in `upgradeToPremium` function
- [ ] Update Featured price ID in `upgradeFeatured` function

## ☐ Edge Functions Deployment

### Supabase CLI Setup
- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Login: `supabase login`
- [ ] Link project: `supabase link --project-ref [your-ref]`

### Set Secrets
- [ ] Set Stripe secret key:
  ```bash
  supabase secrets set STRIPE_SECRET_KEY=sk_test_...
  ```
- [ ] Set webhook secret:
  ```bash
  supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
  ```
- [ ] Set service role key:
  ```bash
  supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
  ```

### Deploy Functions
- [ ] Deploy create-checkout:
  ```bash
  supabase functions deploy create-checkout
  ```
- [ ] Deploy stripe-webhook:
  ```bash
  supabase functions deploy stripe-webhook
  ```
- [ ] Verify functions in Supabase dashboard

### Update Stripe Webhook
- [ ] Copy Edge Function URL
- [ ] Update webhook endpoint in Stripe
- [ ] Test webhook delivery

## ☐ Local Testing

### Start Development Server
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Verify app loads without errors
- [ ] Check browser console for errors

### Test Authentication
- [ ] Click "Sign In"
- [ ] Switch to "Sign Up"
- [ ] Create test account
- [ ] Check email for verification
- [ ] Verify email address
- [ ] Sign in successfully
- [ ] Test Google OAuth (optional)

### Test Profile
- [ ] Navigate to Profile page
- [ ] Click "Edit Profile"
- [ ] Upload avatar image
- [ ] Add bio text
- [ ] Add skills (comma separated)
- [ ] Save changes
- [ ] Verify changes persist

### Test Discovery
- [ ] Navigate to Discover page
- [ ] Verify profiles display
- [ ] Test search functionality
- [ ] Test role filter
- [ ] Test sort options
- [ ] Click profile card
- [ ] View full profile

### Test Messaging
- [ ] Create second test account (different browser/incognito)
- [ ] Navigate to Messages
- [ ] Start conversation
- [ ] Send text message
- [ ] Upload file attachment
- [ ] Verify real-time delivery
- [ ] Check message limit for free users

### Test Reviews
- [ ] View another user's profile
- [ ] Leave a rating (1-5 stars)
- [ ] Write review comment
- [ ] Submit review
- [ ] Verify review appears
- [ ] Check rating updates

### Test Payments (Optional)
- [ ] Go to Profile page
- [ ] Click "Upgrade to Premium"
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Complete checkout
- [ ] Verify redirect back
- [ ] Check premium badge appears
- [ ] Test unlimited messaging

### Test Admin Dashboard
- [ ] Create admin account: admin@collabory.com
- [ ] Verify email
- [ ] Navigate to /admin
- [ ] Check statistics display
- [ ] Test user management
- [ ] Toggle verification badge
- [ ] Toggle premium status
- [ ] Test review moderation

## ☐ Production Deployment

### Choose Platform
- [ ] Vercel (recommended) OR
- [ ] Netlify

### Vercel Deployment
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Run `vercel` command
- [ ] Follow prompts
- [ ] Add environment variables:
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
  - [ ] VITE_STRIPE_PUBLIC_KEY
- [ ] Deploy to production: `vercel --prod`
- [ ] Verify deployment successful

### Netlify Deployment
- [ ] Install Netlify CLI: `npm install -g netlify-cli`
- [ ] Run `netlify init`
- [ ] Follow prompts
- [ ] Add environment variables:
  ```bash
  netlify env:set VITE_SUPABASE_URL "value"
  netlify env:set VITE_SUPABASE_ANON_KEY "value"
  netlify env:set VITE_STRIPE_PUBLIC_KEY "value"
  ```
- [ ] Deploy: `netlify deploy --prod`
- [ ] Verify deployment successful

## ☐ Post-Deployment Configuration

### Update Supabase URLs
- [ ] Go to Supabase Authentication > URL Configuration
- [ ] Add production URL to Site URL
- [ ] Add production URL to Redirect URLs
- [ ] Include wildcard: `https://yourdomain.com/**`
- [ ] Save changes

### Update Stripe
- [ ] Update checkout success/cancel URLs if needed
- [ ] Verify webhook endpoint is accessible
- [ ] Test webhook delivery in production

### SSL & Security
- [ ] Verify HTTPS is active
- [ ] Check SSL certificate valid
- [ ] Test security headers
- [ ] Verify CORS configuration

## ☐ Production Testing

### Functionality Tests
- [ ] Sign up new account
- [ ] Verify email works
- [ ] Complete profile
- [ ] Upload avatar
- [ ] Search for users
- [ ] Send messages
- [ ] Leave reviews
- [ ] Test payments with test cards
- [ ] Verify webhooks work

### Cross-Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge

### Mobile Testing
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test responsive design
- [ ] Test touch interactions
- [ ] Test mobile navigation

### Performance Testing
- [ ] Check page load times
- [ ] Test with slow 3G
- [ ] Verify images load
- [ ] Check bundle size
- [ ] Test real-time features

## ☐ Monitoring Setup

### Supabase Monitoring
- [ ] Check Database logs
- [ ] Monitor API usage
- [ ] Set up email alerts
- [ ] Review query performance

### Stripe Monitoring
- [ ] Check payment activity
- [ ] Monitor webhook deliveries
- [ ] Set up email notifications
- [ ] Review failed payments

### Application Monitoring (Optional)
- [ ] Set up Sentry for error tracking
- [ ] Configure Google Analytics
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation

## ☐ Documentation

### Internal Documentation
- [ ] Document custom configurations
- [ ] Note any deviations from defaults
- [ ] Document admin procedures
- [ ] Create runbook for common tasks

### User Documentation (Optional)
- [ ] Create user guide
- [ ] Write FAQ
- [ ] Create video tutorials
- [ ] Set up help center

## ☐ Launch Preparation

### Content
- [ ] Create initial featured profiles
- [ ] Seed database with test data (optional)
- [ ] Prepare marketing materials
- [ ] Write launch announcement

### Marketing
- [ ] Set up social media accounts
- [ ] Prepare email campaigns
- [ ] Create landing page content
- [ ] Plan launch strategy

### Support
- [ ] Set up support email
- [ ] Create support documentation
- [ ] Train support team
- [ ] Set up ticketing system (optional)

## ☐ Go Live

### Final Checks
- [ ] All tests passing
- [ ] No console errors
- [ ] All features working
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Backups configured

### Launch
- [ ] Switch Stripe to Live Mode
- [ ] Update Stripe keys in production
- [ ] Announce launch
- [ ] Monitor closely for issues
- [ ] Be ready for support requests

### Post-Launch
- [ ] Monitor error logs
- [ ] Track user signups
- [ ] Monitor payment processing
- [ ] Gather user feedback
- [ ] Plan first updates

## ☐ Maintenance

### Regular Tasks
- [ ] Review error logs weekly
- [ ] Check payment processing
- [ ] Monitor database performance
- [ ] Review user feedback
- [ ] Update dependencies monthly
- [ ] Backup database regularly

### Security
- [ ] Review security logs
- [ ] Update dependencies for security patches
- [ ] Monitor for vulnerabilities
- [ ] Review access logs
- [ ] Update API keys periodically

## 📝 Notes

Use this space to track custom configurations or important information:

```
Project URL: ___________________________
Admin Email: ___________________________
Deployment Date: _______________________
Custom Configurations: _________________
_________________________________________
_________________________________________
```

## ✅ Completion

- [ ] All checklist items completed
- [ ] Platform fully functional
- [ ] Documentation reviewed
- [ ] Team trained
- [ ] Ready for users

---

**Congratulations! Your Collabory platform is ready to launch! 🚀**

For ongoing support, refer to:
- README.md - Main documentation
- TROUBLESHOOTING.md - Common issues
- API.md - Technical reference
- DEPLOYMENT.md - Deployment details

*Keep this checklist for future reference and updates.*
