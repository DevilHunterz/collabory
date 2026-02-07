# Collabory API Documentation

Complete reference for Supabase database, storage, and edge functions.

## Database Tables

### profiles

User profile information and settings.

**Columns:**
- `id` (UUID, PK) - References auth.users
- `email` (TEXT, UNIQUE) - User email
- `name` (TEXT) - Display name
- `role` (TEXT) - YouTuber | Editor | Designer | Other
- `skills` (TEXT[]) - Array of skill tags
- `bio` (TEXT) - Profile description
- `avatar_url` (TEXT) - Profile picture URL
- `portfolio_links` (JSONB) - Portfolio URLs (flexible structure)
- `availability_status` (TEXT) - available | busy | unavailable
- `is_premium` (BOOLEAN) - Premium membership status
- `is_featured` (BOOLEAN) - Featured profile status
- `is_verified` (BOOLEAN) - Admin verification badge
- `rating` (DECIMAL) - Average rating (0-5)
- `review_count` (INTEGER) - Total reviews received
- `created_at` (TIMESTAMP) - Account creation
- `updated_at` (TIMESTAMP) - Last profile update

**Indexes:**
- `idx_profiles_role` on role
- `idx_profiles_premium` on is_premium
- `idx_profiles_featured` on is_featured

**RLS Policies:**
- SELECT: Public (anyone can view profiles)
- INSERT: Users can create own profile
- UPDATE: Users can update own profile

**Example Query:**
```javascript
// Get all featured creators
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('is_featured', true)
  .order('rating', { ascending: false })
```

---

### messages

Direct messages between users.

**Columns:**
- `id` (UUID, PK) - Message ID
- `sender_id` (UUID, FK) - References profiles(id)
- `receiver_id` (UUID, FK) - References profiles(id)
- `content` (TEXT) - Message text
- `file_url` (TEXT) - Attachment URL (optional)
- `is_read` (BOOLEAN) - Read status
- `created_at` (TIMESTAMP) - Message timestamp

**Indexes:**
- `idx_messages_sender` on sender_id
- `idx_messages_receiver` on receiver_id

**RLS Policies:**
- SELECT: Users can view their own messages (sent or received)
- INSERT: Users can send messages
- UPDATE: Users can update received messages (mark as read)

**Example Query:**
```javascript
// Get conversation between two users
const { data } = await supabase
  .from('messages')
  .select('*, sender:profiles!messages_sender_id_fkey(*)')
  .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
  .order('created_at', { ascending: true })
```

**Realtime Subscription:**
```javascript
const channel = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `receiver_id=eq.${userId}`
  }, (payload) => {
    console.log('New message:', payload.new)
  })
  .subscribe()
```

---

### reviews

User reviews and ratings.

**Columns:**
- `id` (UUID, PK) - Review ID
- `reviewer_id` (UUID, FK) - References profiles(id)
- `reviewee_id` (UUID, FK) - References profiles(id)
- `rating` (INTEGER) - 1-5 stars
- `comment` (TEXT) - Review text
- `is_approved` (BOOLEAN) - Admin approval status
- `created_at` (TIMESTAMP) - Review timestamp

**Constraints:**
- UNIQUE(reviewer_id, reviewee_id) - One review per user pair
- CHECK(rating >= 1 AND rating <= 5)

**Indexes:**
- `idx_reviews_reviewee` on reviewee_id

**RLS Policies:**
- SELECT: Public (only approved reviews)
- INSERT: Users can create reviews

**Triggers:**
- `update_rating_trigger` - Automatically updates profile rating when review is added/updated

**Example Query:**
```javascript
// Get reviews for a user
const { data } = await supabase
  .from('reviews')
  .select('*, reviewer:profiles!reviews_reviewer_id_fkey(*)')
  .eq('reviewee_id', userId)
  .eq('is_approved', true)
  .order('created_at', { ascending: false })
```

---

### subscriptions

Stripe subscription tracking.

**Columns:**
- `id` (UUID, PK) - Subscription ID
- `user_id` (UUID, FK) - References profiles(id)
- `stripe_customer_id` (TEXT) - Stripe customer ID
- `stripe_subscription_id` (TEXT) - Stripe subscription ID
- `status` (TEXT) - active | canceled | past_due
- `plan_type` (TEXT) - premium | featured
- `current_period_end` (TIMESTAMP) - Subscription end date
- `created_at` (TIMESTAMP) - Subscription start

**RLS Policies:**
- SELECT: Users can view own subscriptions

**Example Query:**
```javascript
// Get user's active subscriptions
const { data } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', userId)
  .eq('status', 'active')
```

---

## Storage Buckets

### avatars

Profile pictures storage.

**Configuration:**
- Public: Yes
- Max file size: 5MB
- Allowed types: image/*
- Path structure: `{userId}-{timestamp}.{ext}`

**Upload Example:**
```javascript
const uploadAvatar = async (file, userId) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file)
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)
  
  return publicUrl
}
```

---

### message-files

Message attachments storage.

**Configuration:**
- Public: Yes
- Max file size: 10MB
- Allowed types: image/*, application/pdf
- Path structure: `{userId}-{timestamp}.{ext}`

**Upload Example:**
```javascript
const uploadMessageFile = async (file, userId) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('message-files')
    .upload(fileName, file)
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('message-files')
    .getPublicUrl(fileName)
  
  return publicUrl
}
```

---

## Edge Functions

### create-checkout

Creates Stripe checkout session for subscriptions.

**Endpoint:** `https://[project-ref].supabase.co/functions/v1/create-checkout`

**Method:** POST

**Request Body:**
```json
{
  "priceId": "price_xxx",
  "userId": "uuid"
}
```

**Response:**
```json
{
  "sessionId": "cs_xxx"
}
```

**Usage:**
```javascript
const response = await fetch(
  `${supabaseUrl}/functions/v1/create-checkout`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, userId })
  }
)
const { sessionId } = await response.json()
```

---

### stripe-webhook

Handles Stripe webhook events.

**Endpoint:** `https://[project-ref].supabase.co/functions/v1/stripe-webhook`

**Method:** POST

**Events Handled:**
- `checkout.session.completed` - New subscription
- `customer.subscription.deleted` - Canceled subscription
- `customer.subscription.updated` - Updated subscription

**Webhook Configuration:**
1. Add endpoint in Stripe Dashboard
2. Select events listed above
3. Copy webhook secret
4. Set as Supabase secret: `STRIPE_WEBHOOK_SECRET`

---

## Authentication

### Sign Up

```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})
```

### Sign In

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Google OAuth

```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})
```

### Sign Out

```javascript
const { error } = await supabase.auth.signOut()
```

### Get Session

```javascript
const { data: { session } } = await supabase.auth.getSession()
```

### Listen to Auth Changes

```javascript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log(event, session)
  }
)
```

---

## Common Queries

### Search Creators

```javascript
const { data } = await supabase
  .from('profiles')
  .select('*')
  .or(`name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`)
  .eq('role', role) // optional filter
  .order('rating', { ascending: false })
```

### Get User Stats

```javascript
const { data: profile } = await supabase
  .from('profiles')
  .select('rating, review_count, is_premium, is_featured')
  .eq('id', userId)
  .single()
```

### Count Messages Sent

```javascript
const { count } = await supabase
  .from('messages')
  .select('*', { count: 'exact', head: true })
  .eq('sender_id', userId)
```

### Get Top Rated Creators

```javascript
const { data } = await supabase
  .from('profiles')
  .select('*')
  .order('rating', { ascending: false })
  .order('review_count', { ascending: false })
  .limit(10)
```

### Get Recent Conversations

```javascript
const { data } = await supabase
  .from('messages')
  .select('sender_id, receiver_id, created_at')
  .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
  .order('created_at', { ascending: false })
```

---

## Rate Limits

Supabase has built-in rate limiting:
- Free tier: 500 requests/second
- Pro tier: 1000 requests/second
- Enterprise: Custom

---

## Error Handling

```javascript
const { data, error } = await supabase
  .from('profiles')
  .select('*')

if (error) {
  console.error('Error:', error.message)
  // Handle error
} else {
  // Use data
}
```

---

## Best Practices

1. **Always check for errors** after Supabase calls
2. **Use RLS policies** for security
3. **Index frequently queried columns**
4. **Limit query results** with `.limit()`
5. **Use select()** to specify needed columns
6. **Subscribe to realtime** only when needed
7. **Unsubscribe** when component unmounts
8. **Validate file uploads** before storage
9. **Use transactions** for related updates
10. **Monitor query performance** in dashboard

---

## Security Checklist

- [x] RLS enabled on all tables
- [x] Policies restrict data access
- [x] API keys in environment variables
- [x] File upload validation
- [x] Input sanitization
- [x] HTTPS only in production
- [x] Webhook signature verification
- [x] Rate limiting enabled

---

## Performance Tips

1. Use indexes on filtered/sorted columns
2. Limit query results
3. Use select() to fetch only needed columns
4. Implement pagination for large lists
5. Cache frequently accessed data
6. Use CDN for static assets
7. Optimize images before upload
8. Monitor slow queries in dashboard

---

## Monitoring

### Supabase Dashboard
- Database > Logs - Query logs
- API > Logs - API request logs
- Storage > Usage - Storage metrics
- Auth > Users - User activity

### Stripe Dashboard
- Payments - Transaction history
- Subscriptions - Active subscriptions
- Webhooks - Event logs
- Logs - API logs

---

## Support Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Stripe Docs](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

---

This API documentation covers all database operations, storage, authentication, and edge functions for Collabory. Use it as a reference when building features or debugging issues.
