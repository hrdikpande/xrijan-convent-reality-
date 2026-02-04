# Convent Reality - Database Schema

**Production-Ready Supabase Database Schema**

A comprehensive, well-organized PostgreSQL database schema for a modern real estate platform with property listings, CRM, messaging, subscriptions, and admin tools.

---

## 📁 Migration Files

All migrations are located in the `migrations/` directory and must be executed in order:

| File | Description | Dependencies |
|------|-------------|--------------|
| `01_core_schema.sql` | Core user profiles, KYC, auth triggers | None |
| `02_properties.sql` | Property listings, views, analytics | 01 |
| `03_search_engine.sql` | Search functions, auto-complete, trending | 02 |
| `04_user_interactions.sql` | Saved properties, bookings, notifications | 02 |
| `05_messaging_system.sql` | Conversations and real-time messaging | 01 |
| `06_leads_crm.sql` | Leads, activities, tasks, CRM automation | 01, 02 |
| `07_builder_projects.sql` | Builder projects, team management | 02, 06 |
| `08_subscriptions_payments.sql` | Subscription plans, payments, limits | 01 |
| `09_admin_moderation.sql` | Admin tools, reporting, platform stats | 01, 02 |

---

## 🚀 Quick Start

### Step 1: Execute Migrations in Order

Go to your **Supabase Dashboard → SQL Editor** and execute each file sequentially:

```sql
-- Copy and paste each file content, starting from 01
1. 01_core_schema.sql
2. 02_properties.sql
3. 03_search_engine.sql
4. 04_user_interactions.sql
5. 05_messaging_system.sql
6. 06_leads_crm.sql
7. 07_builder_projects.sql
8. 08_subscriptions_payments.sql
9. 09_admin_moderation.sql
```

### Step 2: Enable Required Extensions

If `uuid-ossp` or `pg_trgm` fail to install:

1. Go to **Database → Extensions** in Supabase
2. Search for the extension
3. Click **Enable**

### Step 3: Create Storage Buckets

Go to **Storage** and create:

- `kyc-documents` (Private)
- `property-media` (Public)
- `project-media` (Public)
- `chat-attachments` (Private)

---

## 🏗️ Database Architecture

### Core Tables

#### **profiles**
- User profiles for all roles (buyer, tenant, owner, agent, builder, admin)
- Auto-created on user signup via trigger
- Includes KYC status, verification, contact info

#### **kyc_records**
- Document verification for users
- Support for multiple document types
- Admin review workflow

### Property Management

#### **properties**
- Core property listings
- JSONB for flexible address, specs, media
- Full-text search indexes
- Status workflow (draft → published → sold/rented)

#### **property_views**
- Analytics tracking for property visits
- IP and user agent logging

### Search & Discovery

#### **Functions**
- `get_location_suggestions()` - Auto-complete for localities
- `search_properties()` - Advanced filtering and sorting
- `get_trending_localities()` - Popular areas by views

#### **saved_searches**
- User saved search criteria
- Notification preferences

### User Interactions

#### **saved_properties**
- Wishlist/favorites for users

#### **bookings**
- Site visit scheduling
- Status workflow (pending → confirmed → completed)
- Automated notifications

#### **notifications**
- System-wide notification center
- Categorized by type
- Read/unread tracking

### Messaging

#### **conversations**
- One-on-one conversations
- Property context linking

#### **messages**
- Real-time chat messages
- Support for text, images, files
- Read receipts

### CRM & Leads

#### **leads**
- Lead capture and management
- Source tracking
- Status pipeline
- Budget and preference tracking

#### **lead_activities**
- Call logs, meetings, notes
- Scheduled and completed activities

#### **crm_tasks**
- Follow-up reminders
- Auto-created on lead status changes

### Builder Features

#### **projects**
- Builder mega-projects
- RERA compliance tracking
- Timeline and unit management

#### **project_updates**
- Construction progress updates
- Milestone announcements

#### **team_members**
- Builder sales team management
- Role-based permissions

### Subscriptions

#### **subscription_plans**
- Configurable pricing plans
- Feature limits

#### **subscriptions**
- User subscription tracking
- Auto-renewal, credits, limits

#### **transactions**
- Payment history
- Gateway integration support

### Admin Tools

#### **admin_logs**
- Complete audit trail
- Action categorization

#### **reported_content**
- User-reported content moderation
- Resolution workflow

#### **platform_settings**
- Dynamic configuration
- Public/private settings

---

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies for:

✅ **Users** can only access their own data  
✅ **Admins** have full access to all data  
✅ **Property owners** can view bookings for their properties  
✅ **Public** can view published properties  
✅ **Team members** can access assigned leads

### Automated Triggers

- `handle_updated_at()` - Auto-update timestamps
- `handle_new_user()` - Create profile on signup
- `handle_property_publish()` - Track publish date
- `notify_owner_on_booking()` - Send booking notifications
- `update_conversation_timestamp()` - Update last message time
- `notify_on_new_message()` - Send message notifications
- `auto_create_followup_task()` - Create tasks on lead status change

---

## 📊 Key Functions

### Search Functions

```sql
-- Auto-complete locations
select * from public.get_location_suggestions('mumbai');

-- Advanced property search
select * from public.search_properties(
  search_location => 'Andheri',
  min_price => 5000000,
  max_price => 10000000,
  bhk_types => ARRAY['2 BHK', '3 BHK'],
  listing_types => ARRAY['Sell']
);

-- Get trending localities
select * from public.get_trending_localities('Mumbai', 30, 10);
```

### Helper Functions

```sql
-- Create notification
select public.create_notification(
  user_id,
  'Title',
  'Message',
  'booking',
  related_id,
  '/action/url'
);

-- Get or create conversation
select public.get_or_create_conversation(user1_id, user2_id, property_id);

-- Check subscription limits
select public.check_subscription_limit(user_id, 'properties');

-- Get platform stats (admin only)
select public.get_platform_stats();

-- Moderate property (admin only)
select public.moderate_property(property_id, 'published', 'Approved');
```

---

## 🎯 Indexes

All tables have optimized indexes for:

- Primary foreign key relationships
- Frequently filtered columns (status, type, date)
- JSONB fields (GIN indexes for address_details)
- Array fields (GIN indexes for amenities)
- Full-text search (pg_trgm)

---

## 🧪 Testing

After migration, verify:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verify RLS policies
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';

-- Verify extensions
SELECT extname FROM pg_extension;

-- Test functions
SELECT public.get_location_suggestions('test');
```

---

## 📝 Best Practices

### Data Insertion

Always insert data through your application using Supabase client to ensure RLS policies are enforced.

### JSONB Structure

Follow the documented structure comments in each migration file for JSONB fields like `address_details`, `specs`, `media`, etc.

### Subscription Limits

Use `check_subscription_limit()` before allowing users to create properties or access premium features.

### Notifications

Use `create_notification()` function to ensure consistent notification creation.

---

## 🔧 Maintenance

### Backups

Supabase automatically backs up your database. For additional safety:

```bash
# Export via Supabase Dashboard → Database → Backups
```

### Monitoring

Monitor:
- Slow queries via **Database → Query Performance**
- Index usage via admin queries
- Table sizes for optimization

### Updates

To modify schema:
1. Create a new migration file (e.g., `10_feature_name.sql`)
2. Use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
3. Document in this README

---

## 🚨 Troubleshooting

### "relation does not exist"
- Execute migrations in correct order
- Check dependencies

### "pg_trgm extension not found"
- Enable manually in Database → Extensions

### RLS blocking queries
- Ensure user is authenticated
- Test with proper user context
- Check policy definitions

### Trigger not firing
- Verify function exists
- Check trigger is created
- Review function logic

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [pg_trgm Extension](https://www.postgresql.org/docs/current/pgtrgm.html)

---

## ✨ What's New in This Version

### Improvements Over Previous Schema

✅ **Better Organization** - Numbered migration files  
✅ **Proper Dependencies** - Clear execution order  
✅ **Comprehensive RLS** - All tables secured  
✅ **Automated ** - Smart triggers for common tasks  
✅ **Better Indexing** - Optimized for performance  
✅ **No Duplicates** - Single source of truth  
✅ **Production Ready** - Idempotent and safe  
✅ **Well Documented** - Inline comments and guides  

---

**Last Updated:** 2026-02-04  
**Schema Version:** 1.0.0  
**Status:** Production Ready ✅
