# Google OAuth Setup Guide

## Quick Setup (5 minutes)

### Step 1: Enable Google Provider in Supabase

1. Go to your Supabase Dashboard
2. Click **Authentication** in the sidebar
3. Click **Providers**
4. Find **Google** and toggle it ON

### Step 2: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure consent screen if prompted:
   - User Type: External
   - App name: Collabory
   - User support email: your email
   - Developer contact: your email
   - Save and continue through all steps

### Step 3: Configure OAuth Client

1. Application type: **Web application**
2. Name: **Collabory**
3. Authorized JavaScript origins:
   ```
   http://localhost:3000
   https://your-domain.com
   ```
4. Authorized redirect URIs:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
   (Get this from Supabase Auth > Providers > Google)

5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### Step 4: Add Credentials to Supabase

1. Back in Supabase Dashboard
2. Authentication > Providers > Google
3. Paste **Client ID**
4. Paste **Client Secret**
5. Click **Save**

### Step 5: Test

1. Go to your Collabory app
2. Click "Sign In"
3. Click "Continue with Google"
4. Select your Google account
5. Authorize the app
6. You should be redirected back and logged in!

---

## Troubleshooting

### "Redirect URI mismatch"
- Make sure the redirect URI in Google Cloud Console exactly matches the one from Supabase
- Include the full URL with `/auth/v1/callback`

### "OAuth client not found"
- Verify Client ID and Secret are correct
- Check for extra spaces when copying
- Make sure you saved in Supabase

### "Access blocked"
- Complete the OAuth consent screen configuration
- Add your email as a test user
- Verify app is not in production mode yet

### Profile not created
- Check Supabase logs
- Verify profiles table exists
- Check RLS policies allow INSERT

---

## What Happens When User Signs In with Google

1. User clicks "Continue with Google"
2. Redirected to Google sign-in page
3. User selects account and authorizes
4. Google redirects back to Supabase
5. Supabase creates auth user
6. App creates profile in profiles table
7. Google avatar is fetched (if available)
8. User is logged in and redirected to /discover

---

## Security Notes

- Client Secret should be kept secure
- Only add trusted redirect URIs
- Use HTTPS in production
- Regularly rotate credentials
- Monitor OAuth usage

---

## Production Checklist

- [ ] OAuth consent screen completed
- [ ] Production redirect URI added
- [ ] Client ID and Secret configured
- [ ] Tested sign-in flow
- [ ] Profile creation works
- [ ] Avatar fetching works
- [ ] Error handling tested

---

**Google OAuth is now ready! Users can sign in with one click. 🎉**
