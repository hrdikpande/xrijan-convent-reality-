# Convent Reality - Supabase Database

**Production-Ready Database Schema for Real Estate Platform**

---

## 📁 File Structure

```
supabase/
├── README.md                    ← You are here
├── EXECUTION_GUIDE.sql          ← Complete setup walkthrough
├── SCHEMA_SUMMARY.md            ← Table structure reference
├── QUICK_REFERENCE.txt          ← Quick cheat sheet
└── migrations/                  ← Migration files (execute in order)
    ├── README.md                ← Full documentation
    ├── 01_core_schema.sql
    ├── 02_properties.sql
    ├── 03_search_engine.sql
    ├── 04_user_interactions.sql
    ├── 05_messaging_system.sql
    ├── 06_leads_crm.sql
    ├── 07_builder_projects.sql
    ├── 08_subscriptions_payments.sql
    └── 09_admin_moderation.sql
```

---

## 🎯 Quick Links

- **[📋 Execution Guide](EXECUTION_GUIDE.sql)** - Step-by-step setup instructions
- **[📘 Full Documentation](migrations/README.md)** - Complete schema documentation
- **[📊 Schema Summary](SCHEMA_SUMMARY.md)** - Quick reference and table overview
- **[⚡ Quick Reference](QUICK_REFERENCE.txt)** - Common commands cheat sheet

---

## ⚡ Quick Start

### 1. Execute Migrations in Order

Go to **Supabase Dashboard → SQL Editor** and run each file:

```
migrations/01_core_schema.sql
migrations/02_properties.sql
migrations/03_search_engine.sql
migrations/04_user_interactions.sql
migrations/05_messaging_system.sql
migrations/06_leads_crm.sql
migrations/07_builder_projects.sql
migrations/08_subscriptions_payments.sql
migrations/09_admin_moderation.sql
```

### 2. Create Storage Buckets

Go to **Storage** and create:
- `kyc-documents` (Private)
- `property-media` (Public)
- `project-media` (Public)
- `chat-attachments` (Private)

### 3. Verify Installation

Run verification queries from `EXECUTION_GUIDE.sql`

---

## 📦 What's Included

### ✨ Features

✅ User authentication & profiles (6 roles)  
✅ KYC verification system  
✅ Property listings with advanced search  
✅ Real-time messaging  
✅ Lead management & CRM  
✅ Builder project management  
✅ Subscription & payment tracking  
✅ Admin moderation tools  
✅ Automated notifications  
✅ Analytics & reporting  

### 📊 Database Stats

- **21 Tables** - Fully normalized schema
- **15 Functions** - Business logic & helpers
- **10 Triggers** - Automated workflows
- **60+ RLS Policies** - Complete security
- **50+ Indexes** - Optimized performance

---

## 🏗️ Architecture

```
Core
├── Profiles & KYC
└── Authentication

Properties
├── Listings
├── Search Engine
└── Analytics

User Features
├── Saved Properties
├── Bookings
└── Notifications

Communication
├── Messaging
└── Chat

CRM
├── Leads
├── Activities
└── Tasks

Builder
├── Projects
├── Updates
└── Teams

Business
├── Subscriptions
├── Payments
└── Transactions

Admin
├── Moderation
├── Reports
└── Platform Stats
```

---

## 🔐 Security

All tables have **Row Level Security (RLS)** enabled with policies for:

- Users can only access their own data
- Admins have full platform access
- Property owners can manage their listings
- Public can view published content
- Role-based permissions (buyer, tenant, owner, agent, builder, admin)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [EXECUTION_GUIDE.sql](EXECUTION_GUIDE.sql) | Complete setup walkthrough with verification |
| [migrations/README.md](migrations/README.md) | Full schema documentation with examples |
| [SCHEMA_SUMMARY.md](SCHEMA_SUMMARY.md) | Table structure and relationships |
| [QUICK_REFERENCE.txt](QUICK_REFERENCE.txt) | Quick commands cheat sheet |
| Individual migration files | Inline comments explaining each feature |

---

## 🚀 Technology Stack

- **Database**: PostgreSQL 15+ (via Supabase)
- **Extensions**: uuid-ossp, pg_trgm
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth
- **Real-time**: Supabase Realtime (optional)

---

## 🎓 Key Features Explained

### Advanced Search
- Fuzzy location matching with pg_trgm
- 15+ filter options (price, area, BHK, amenities, etc.)
- Auto-complete suggestions
- Trending localities
- Sort by various criteria

### CRM System
- Lead capture from multiple sources
- Activity tracking (calls, meetings, visits)
- Automated task creation
- Follow-up reminders
- Conversion tracking

### Builder Tools
- Project management
- Team member management
- Construction updates
- Unit tracking
- RERA compliance

### Subscription System
- Flexible pricing plans
- Feature-based limits
- Credit system
- Auto-renewal
- Payment gateway integration

---

## 🔧 Maintenance

### Backups
Supabase automatically backs up your database. Additional backups can be configured in the dashboard.

### Monitoring
Monitor via Supabase Dashboard:
- Query performance
- Table sizes
- Index usage
- Connection stats

### Updates
To add new features:
1. Create new migration file (e.g., `10_new_feature.sql`)
2. Use `IF NOT EXISTS` for safety
3. Document changes in README

---

## 🆘 Support

### Common Issues

**"relation does not exist"**  
→ Execute migrations in correct order

**"pg_trgm extension not found"**  
→ Enable manually in Database → Extensions

**RLS blocking queries**  
→ Ensure proper authentication context

### Resources

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 📝 Migration History

### Version 1.0.0 (2026-02-04)

✨ **Initial Release**

- Complete database schema redesign
- 9 organized migration files
- Production-ready with RLS
- Comprehensive documentation
- All features implemented

---

## ✅ Production Checklist

- [x] All tables use UUID primary keys
- [x] All FKs have ON DELETE actions
- [x] All tables have RLS enabled
- [x] All timestamps use timestamptz
- [x] All migrations are idempotent
- [x] All functions have security definer where needed
- [x] All indexes optimized for queries
- [x] All JSONB schemas documented
- [x] Storage buckets configured
- [x] Comprehensive documentation

---

## 🎯 Next Steps

After database setup:

1. ✅ Configure Supabase client in your app
2. ✅ Set environment variables
3. ✅ Test user authentication
4. ✅ Test property CRUD operations
5. ✅ Configure payment gateway
6. ✅ Set up email notifications
7. ✅ Deploy to production

---

## 📄 License

This schema is part of the Convent Reality project.

---

**Schema Version**: 1.0.0  
**Last Updated**: 2026-02-04  
**Status**: ✅ Production Ready

Made with ❤️ for Convent Reality
