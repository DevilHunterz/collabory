# Collabory Troubleshooting Guide

Common issues and solutions for Collabory development and deployment.

## Installation Issues

### npm install fails

**Problem:** Dependencies fail to install

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Or use yarn
yarn install
```

### Node version mismatch

**Problem:** "Unsupported engine" error

**Solution:**
```bash
# Check Node version
node --version

# Should be 18.x or higher
# Install nvm and switch version
nvm install 18
nvm use 18
```

---

## Development Server Issues

### Port already in use

**Problem:** "Port 3000 is already in use"

**Solutions:**
```bash
# Find and kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

### Hot reload not working

**Problem:** Changes don't reflect in browser

**Solutions:**
1. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache
3. Restart dev server
4. Check file watcher limits (Linux):
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## Supabase Issues

### "Invalid API key"

**Problem:** Cannot connect to Supabase

**Solutions:**
1. Check `.env` file exists in project root
2. Verify keys from Supabase Dashboard > Settings > API
3. Ensure variables start with `VITE_`
4. Restart dev server after changing .env
5. Check for typos in variable names

**Correct format:**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### "relation does not exist"

**Problem:** Database tables not found

**Solutions:**
1. Run SQL schema in Supabase SQL Editor
2. Copy entire `supabase/schema.sql` content
3. Paste and execute in SQL Editor
4. Verify tables in Table Editor
5. Check for SQL errors in execution log

### "Storage bucket not found"

**Problem:** File uploads fail

**Solutions:**
1. Go to Supabase Storage
2. Create bucket: `avatars` (public)
3. Create bucket: `message-files` (public)
4. Set policies to allow public access
5. Verify bucket names match code exactly

### RLS policy errors

**Problem:** "Row level security policy violation"

**Solutions:**
1. Check RLS policies in Table Editor
2. Verify user is authenticated
3. Check policy conditions match your use case
4. Temporarily disable RLS for testing (not in production!)
5. Review policy SQL in schema.sql

---

## Authentication Issues

### Email verification not working

**Problem:** Verification emails not received

**Solutions:**
1. Check spam folder
2. Verify email in Supabase Auth > Users
3. Manually verify user in dashboard
4. Check SMTP settings (if custom)
5. Use magic link instead

### Google OAuth fails

**Problem:** "OAuth error" or redirect fails

**Solutions:**
1. Enable Google provider in Supabase Auth > Providers
2. Create OAuth credentials in Google Cloud Console
3. Add authorized redirect URI:
   ```
   https://[project-ref].supabase.co/auth/v1/callback
   ```
4. Enable Google+ API in Google Cloud
5. Check client ID and secret are correct
6. Verify redirect URL in code matches

### Session expires immediately

**Problem:** User logged out after refresh

**Solutions:**
1. Check browser cookies enabled
2. Clear browser cache and cookies
3. Verify Supabase session settings
4. Check for conflicting auth code
5. Review AuthContext implementation

---

## Messaging Issues

### Real-time not working

**Problem:** Messages don't appear instantly

**Solutions:**
1. Check Supabase Realtime is enabled (default)
2. Verify WebSocket connection in Network tab
3. Check RLS policies allow reading messages
4. Review subscription code for errors
5. Test with multiple browser windows
6. Check firewall/proxy settings

### File uploads fail

**Problem:** Cannot attach files to messages

**Solutions:**
1. Verify storage bucket exists and is public
2. Check file size limits (10MB for message-files)
3. Verify file type is allowed (images, PDFs)
4. Check browser console for errors
5. Test with smaller file
6. Verify upload function in supabase.js

### Message limit not enforced

**Problem:** Free users can send unlimited messages

**Solutions:**
1. Check message count query in Messages.jsx
2. Verify is_premium field in profile
3. Test with non-premium account
4. Review sendMessage function logic
5. Check database for correct user status

---

## Payment Issues

### Stripe checkout fails

**Problem:** "Invalid price ID" or checkout error

**Solutions:**
1. Verify Stripe keys in .env
2. Check price IDs in Profile.jsx match Stripe
3. Ensure using test keys in development
4. Verify Edge Function is deployed
5. Check Stripe logs for errors
6. Test with Stripe test cards

### Webhooks not received

**Problem:** Subscription status not updating

**Solutions:**
1. Deploy stripe-webhook Edge Function
2. Add webhook endpoint in Stripe Dashboard
3. Copy webhook signing secret
4. Set as Supabase secret:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```
5. Test webhook with Stripe CLI:
   ```bash
   stripe listen --forward-to https://[project].supabase.co/functions/v1/stripe-webhook
   ```
6. Check webhook logs in Stripe Dashboard

### Test cards not working

**Problem:** Payment fails with test card

**Solutions:**
1. Ensure Stripe is in Test Mode
2. Use correct test card: `4242 4242 4242 4242`
3. Use any future expiry date
4. Use any 3-digit CVC
5. Use any valid ZIP code
6. Check Stripe Dashboard for decline reason

---

## UI/UX Issues

### Dark mode not working

**Problem:** Theme doesn't change

**Solutions:**
1. Check ThemeContext is wrapping App
2. Verify localStorage is enabled
3. Clear browser localStorage
4. Check Tailwind dark: classes
5. Verify tailwind.config.js has darkMode: 'class'

### Responsive design broken

**Problem:** Mobile layout issues

**Solutions:**
1. Check viewport meta tag in index.html
2. Verify Tailwind breakpoints (md:, lg:)
3. Test in browser dev tools mobile view
4. Check for fixed widths in CSS
5. Review component responsive classes

### Images not loading

**Problem:** Avatars or uploads don't display

**Solutions:**
1. Check image URLs in browser Network tab
2. Verify storage bucket is public
3. Check CORS settings in Supabase
4. Test with direct URL in browser
5. Verify file was uploaded successfully
6. Check for broken image paths

---

## Deployment Issues

### Build fails

**Problem:** `npm run build` errors

**Solutions:**
```bash
# Check for TypeScript errors
npm run build 2>&1 | grep error

# Fix import errors
# Ensure all imports have correct paths

# Check for unused variables
# Remove or comment out

# Verify all dependencies installed
npm install

# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment variables not working in production

**Problem:** App can't connect to Supabase in production

**Solutions:**

**Vercel:**
```bash
# Set via CLI
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_STRIPE_PUBLIC_KEY

# Or via dashboard
# Project Settings > Environment Variables
```

**Netlify:**
```bash
# Set via CLI
netlify env:set VITE_SUPABASE_URL "value"
netlify env:set VITE_SUPABASE_ANON_KEY "value"
netlify env:set VITE_STRIPE_PUBLIC_KEY "value"

# Or via dashboard
# Site Settings > Environment Variables
```

### 404 on page refresh

**Problem:** Direct URLs return 404

**Solutions:**
1. Verify vercel.json or netlify.toml exists
2. Check rewrite rules are correct
3. Ensure SPA routing is configured
4. Test with `npm run preview` locally

### CORS errors in production

**Problem:** "CORS policy blocked"

**Solutions:**
1. Add production URL to Supabase allowed origins
2. Go to Authentication > URL Configuration
3. Add site URL and redirect URLs
4. Include wildcards: `https://yourdomain.com/**`
5. Redeploy after changes

---

## Performance Issues

### Slow page loads

**Problem:** App takes long to load

**Solutions:**
1. Check bundle size: `npm run build`
2. Implement code splitting
3. Lazy load components
4. Optimize images before upload
5. Enable CDN (Vercel/Netlify automatic)
6. Check database query performance
7. Add indexes to frequently queried columns

### Database queries slow

**Problem:** Data takes long to load

**Solutions:**
1. Check query performance in Supabase Dashboard
2. Add indexes to filtered columns
3. Limit query results with `.limit()`
4. Use `.select()` to fetch only needed columns
5. Implement pagination
6. Consider caching frequently accessed data

---

## Admin Dashboard Issues

### Cannot access admin panel

**Problem:** 403 or redirected from /admin

**Solutions:**
1. Ensure logged in with `admin@collabory.com`
2. Create admin user in Supabase Auth
3. Verify email exactly matches
4. Check Admin.jsx access control logic
5. Clear browser cache and re-login

### Stats not updating

**Problem:** Dashboard shows old data

**Solutions:**
1. Hard refresh page (Ctrl+Shift+R)
2. Check fetchStats function for errors
3. Verify database queries are correct
4. Check browser console for errors
5. Test queries directly in Supabase

---

## Common Error Messages

### "Failed to fetch"

**Cause:** Network error or CORS issue

**Fix:**
- Check internet connection
- Verify Supabase URL is correct
- Check CORS settings
- Verify API is accessible

### "Invalid token"

**Cause:** Expired or invalid auth token

**Fix:**
- Sign out and sign in again
- Clear browser cookies
- Check token expiry settings
- Verify auth implementation

### "Unique constraint violation"

**Cause:** Duplicate data in unique column

**Fix:**
- Check for existing records
- Handle duplicate errors in code
- Use upsert instead of insert
- Verify unique constraints in schema

### "Foreign key violation"

**Cause:** Referenced record doesn't exist

**Fix:**
- Ensure parent record exists first
- Check foreign key relationships
- Verify IDs are correct
- Review cascade delete settings

---

## Debug Tools

### Browser Console

```javascript
// Check Supabase connection
console.log(supabase)

// Check auth state
supabase.auth.getSession().then(console.log)

// Check environment variables
console.log(import.meta.env)

// Test query
supabase.from('profiles').select('*').then(console.log)
```

### Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by Fetch/XHR
4. Check request/response
5. Look for failed requests (red)
6. Inspect headers and payload

### Supabase Logs

1. Go to Supabase Dashboard
2. Database > Logs
3. Filter by error level
4. Check query performance
5. Review API logs

### Stripe Logs

1. Go to Stripe Dashboard
2. Developers > Logs
3. Filter by event type
4. Check webhook deliveries
5. Review API requests

---

## Getting Help

### Before asking for help:

1. Check this troubleshooting guide
2. Review error messages carefully
3. Check browser console
4. Review Supabase logs
5. Test in incognito mode
6. Try with fresh database

### When asking for help:

Include:
- Error message (full text)
- Browser console output
- Steps to reproduce
- Environment (dev/prod)
- Browser and version
- Node version
- Relevant code snippet

### Resources:

- [Supabase Discord](https://discord.supabase.com)
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Stripe Support](https://support.stripe.com)
- [Stack Overflow](https://stackoverflow.com)

---

## Prevention Tips

1. **Always check for errors** after async operations
2. **Use TypeScript** for better type safety
3. **Write tests** for critical functionality
4. **Monitor logs** regularly
5. **Keep dependencies updated**
6. **Use version control** (Git)
7. **Test in multiple browsers**
8. **Validate user input**
9. **Handle edge cases**
10. **Document your code**

---

Most issues can be resolved by carefully reading error messages and checking the relevant logs. When in doubt, start with the basics: verify environment variables, check database schema, and ensure services are running.
