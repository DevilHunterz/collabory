# 🔐 Admin Setup Guide

## Make Yourself Admin

### Step 1: Go to Supabase
1. Open your Supabase Dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**

### Step 2: Run Admin SQL
Copy and paste this SQL:

```sql
UPDATE profiles 
SET 
  is_verified = true,
  is_premium = true,
  is_featured = true
WHERE email = 'tyrytr0981@gmail.com';
```

### Step 3: Click "Run"
- You should see "Success. 1 rows affected"
- Your account now has:
  - ✅ Verified badge
  - ✅ Premium membership
  - ✅ Featured status

### Step 4: Access Admin Dashboard
1. Go to your website
2. Click "Profile" in navbar
3. You should see your admin badges
4. Go to `/admin` to access admin dashboard

---

## Admin Features

### As Admin You Can:
- ✅ Verify other users
- ✅ Grant premium status
- ✅ Feature profiles
- ✅ Moderate reviews
- ✅ View analytics
- ✅ Manage all users

### Admin Dashboard Access:
- URL: `http://localhost:3000/admin`
- Only accessible if email is `tyrytr0981@gmail.com`

---

## Profile Fixed! ✅

### What Was Wrong:
- Profile wasn't being created automatically on signup
- Google OAuth users had no profile

### What I Fixed:
1. **Auto-create profile** on signup
2. **Auto-create profile** for Google OAuth users
3. **Better error handling**
4. **Realtime updates** via Supabase
5. **Full customization** options

### New Profile Features:
- ✅ Fully customizable
- ✅ Avatar upload with validation
- ✅ Skills management
- ✅ Bio editing
- ✅ Availability status
- ✅ Portfolio links (ready)
- ✅ Realtime updates
- ✅ Premium animations
- ✅ Tabbed interface
- ✅ Review system

---

## Premium Animations Added

### What's Animated:
1. **Profile Picture**
   - Hover scale effect
   - Smooth transitions
   - Upload indicator

2. **Tabs**
   - Smooth switching
   - Active indicator slide
   - Fade transitions

3. **Buttons**
   - Hover effects
   - Click feedback
   - Smooth colors

4. **Cards**
   - Hover border change
   - Smooth shadows
   - Content transitions

5. **Forms**
   - Focus states
   - Input animations
   - Submit feedback

### Animation Style:
- **Duration**: 200-300ms (fast, smooth)
- **Easing**: cubic-bezier (professional)
- **Type**: Subtle, not cartoonish
- **Feel**: Premium, sophisticated

---

## Test Your Profile

### 1. Sign In
```
Email: tyrytr0981@gmail.com
Password: [your password]
```

### 2. Go to Profile
- Click "Profile" in navbar
- You should see your profile page

### 3. Edit Profile
- Click "Edit Profile"
- Upload avatar
- Add bio
- Add skills
- Set availability
- Click "Save Changes"

### 4. Check Admin Status
- Run the SQL above
- Refresh page
- You should see verified badge
- Go to `/admin` to access dashboard

---

## Troubleshooting

### Profile Still Not Found?
1. Check if you're signed in
2. Run the SQL to create profile manually:
```sql
INSERT INTO profiles (id, email, name, role, skills, bio, avatar_url, portfolio_links, availability_status)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  'Other',
  '{}',
  '',
  raw_user_meta_data->>'avatar_url',
  '{}',
  'available'
FROM auth.users
WHERE email = 'tyrytr0981@gmail.com'
ON CONFLICT (id) DO NOTHING;
```

### Can't Access Admin?
1. Make sure you ran the admin SQL
2. Check email matches exactly
3. Clear browser cache
4. Sign out and sign in again

---

## Next Steps

1. ✅ Run admin SQL
2. ✅ Test profile editing
3. ✅ Upload avatar
4. ✅ Add skills and bio
5. ✅ Access admin dashboard
6. ✅ Start using the platform!

---

**You're now an admin with full access! 🎉**
