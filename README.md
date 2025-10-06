# PromptHub - Corporate AI Prompts Marketplace

**Professional AI prompts for Legal, Compliance, HR, Finance & more.**

Live Site: [https://prompt-marketplace.vercel.app](https://prompt-marketplace.vercel.app)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Changelog](#changelog)
- [Roadmap](#roadmap)

---

## 🎯 Overview

PromptHub is a B2B marketplace where professionals can buy and sell high-quality AI prompts designed for corporate use. Unlike consumer-focused prompt marketplaces, PromptHub targets business professionals who need sophisticated, industry-specific prompts for compliance, legal work, HR, finance, and other business functions.

**Mission:** Work less. Be happy more.

**Vision:** Enable professionals to leverage AI effectively without extensive prompt engineering knowledge.

---

## ✨ Features

### Current Features (v1.2)

**For Buyers:**
- ✅ Browse approved prompts without account
- ✅ View detailed prompt information with previews
- ✅ Purchase prompts via Stripe (no account required)
- ✅ Receive prompts via email instantly
- ✅ Lifetime access via unique purchase links
- ✅ Optional account for purchase history

**For Sellers:**
- ✅ Create account to list prompts
- ✅ Submit prompts for approval
- ✅ Track prompt status (pending/approved/rejected)
- ✅ View all submitted prompts in seller dashboard
- ✅ Categories: Legal, Compliance, HR, Finance, Marketing, Sales, Operations

**For Admins:**
- ✅ Comprehensive admin panel
- ✅ Approve/reject prompts
- ✅ View all prompts with status indicators
- ✅ Statistics dashboard (pending/approved/rejected counts)
- ✅ Preview prompts before approval

**Platform:**
- ✅ Secure authentication via Supabase
- ✅ Payment processing via Stripe
- ✅ Email delivery via Resend
- ✅ Responsive Bootstrap UI
- ✅ Real-time database updates

---

## 🛠 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- Bootstrap 5
- JavaScript (no TypeScript)

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL)
- Supabase Auth

**Services:**
- Stripe (Payments)
- Resend (Email)
- Vercel (Hosting)

**Database:**
- PostgreSQL (via Supabase)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- GitHub account
- Supabase account (free tier)
- Stripe account (test mode)
- Resend account (free tier)
- Vercel account (free tier)

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/arminas-a/prompt-marketplace.git
cd prompt-marketplace
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create `.env.local` in root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your-stripe-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
RESEND_API_KEY=re_your-resend-key
```

4. **Set up database:**

Run the SQL script in Supabase SQL Editor (see [Database Schema](#database-schema))

5. **Run development server:**
```bash
npm run dev
```

6. **Open browser:**
```
http://localhost:3000
```

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | `eyJhbGc...` |
| `NEXT_PUBLIC_APP_URL` | Your app URL | Production: your Vercel URL<br>Local: `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode) | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |
| `RESEND_API_KEY` | Resend API key for emails | `re_...` |

### Where to Get Keys

- **Supabase:** Dashboard → Settings → API
- **Stripe:** Dashboard → Developers → API Keys
- **Resend:** Dashboard → API Keys

---

## 🗄 Database Schema

### Tables

**`profiles`** - User profiles
```sql
- id (UUID, PK, FK to auth.users)
- email (TEXT)
- is_admin (BOOLEAN, default: false)
- stripe_account_id (TEXT, nullable)
- created_at (TIMESTAMP)
```

**`prompts`** - Prompt listings
```sql
- id (UUID, PK)
- seller_id (UUID, FK to profiles)
- title (TEXT)
- description (TEXT)
- category (TEXT)
- price (DECIMAL)
- prompt_text (TEXT) - Full prompt (hidden until purchase)
- preview_text (TEXT) - Preview (visible to all)
- status (TEXT) - 'pending', 'approved', 'rejected'
- created_at (TIMESTAMP)
```

**`purchases`** - Transaction records
```sql
- id (UUID, PK)
- buyer_email (TEXT)
- buyer_id (UUID, FK to profiles, nullable)
- prompt_id (UUID, FK to prompts)
- stripe_payment_id (TEXT)
- price_paid (DECIMAL)
- access_token (UUID) - Unique link for lifetime access
- created_at (TIMESTAMP)
```

### Database Setup

See `docs/database-setup.sql` for complete SQL script including:
- Table creation
- Row Level Security policies
- Auto-profile creation trigger
- Admin setup

---

## 📦 Deployment

### Deploy to Vercel

1. **Push code to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

3. **Add environment variables in Vercel:**
   - Settings → Environment Variables
   - Add all 6 required variables
   - Redeploy

4. **Configure Supabase:**
   - Authentication → URL Configuration
   - Set Site URL to your Vercel URL
   - Add Redirect URLs:
     - `https://your-app.vercel.app/**`
     - `https://your-app.vercel.app/api/auth/callback`

5. **Set up admin account:**
   - Sign up on your live site
   - Run SQL in Supabase:
   ```sql
   UPDATE profiles SET is_admin = true 
   WHERE email = 'your-email@example.com';
   ```

---

## 📝 Changelog

### Version 1.2 (Current) - 2025-02-06

**Major Improvements:**

**Admin Panel Overhaul:**
- ✅ Fixed: Admin can now see ALL pending prompts from any user
- ✅ Fixed: Status changes immediately on page (no popup)
- ✅ Added: Statistics dashboard showing pending/approved/rejected counts
- ✅ Added: Organized sections for each status with color coding
- ✅ Added: Expandable prompt preview in admin panel
- ✅ Improved: Visual feedback during approval/rejection

**Public Marketplace:**
- ✅ Fixed: Approved prompts now visible to everyone (no login required)
- ✅ Fixed: Homepage feed updates immediately after admin approval
- ✅ Added: Prompt count display on homepage
- ✅ Improved: Prompts display as cards with "View Details & Buy" button

**Account Management:**
- ✅ Added: Complete account management page (`/account`)
- ✅ Added: Purchase history with access links
- ✅ Added: Account information display
- ✅ Added: Account deletion option (with confirmation)
- ✅ Added: Quick actions sidebar
- ✅ Added: "My Account" link in navigation

**User Experience:**
- ✅ Fixed: Email confirmation now redirects to account page (not localhost)
- ✅ Added: Success message after email confirmation
- ✅ Improved: Clear navigation flow for logged-in users
- ✅ Improved: Better status indicators throughout app

**Bug Fixes:**
- ✅ Fixed homepage not showing approved prompts
- ✅ Fixed admin not seeing prompts from other users
- ✅ Fixed email confirmation showing error page
- ✅ Fixed confusing approve/reject button behavior
- ✅ Fixed missing account management functionality

---

### Version 1.1 - 2025-02-05

**Core Marketplace Features:**

**Seller Features:**
- ✅ Seller dashboard with prompt creation form
- ✅ Multi-field form: title, description, category, price, preview, full prompt
- ✅ Submit prompts for admin approval
- ✅ View own prompts with status badges
- ✅ Track prompt status (pending/approved/rejected)

**Buyer Features:**
- ✅ Detailed prompt pages with full description
- ✅ Preview text visible before purchase
- ✅ Buy button with email collection
- ✅ Stripe checkout integration
- ✅ Success page after payment
- ✅ Unique access links for purchased prompts
- ✅ Purchase page showing full prompt text
- ✅ Copy to clipboard functionality

**Payment & Email:**
- ✅ Stripe payment processing
- ✅ Email delivery via Resend
- ✅ Automatic purchase record creation
- ✅ Lifetime access via unique token links

**Technical:**
- ✅ API routes for checkout and webhooks
- ✅ Database integration for purchases
- ✅ Server-side rendering for prompt pages
- ✅ Client-side components for interactive features

---

### Version 1.0 - 2025-02-04

**Initial Release - Foundation:**

**Authentication:**
- ✅ User signup with email confirmation
- ✅ User login/logout
- ✅ Supabase Auth integration
- ✅ Auto-profile creation on signup
- ✅ Protected routes for sellers

**Admin System:**
- ✅ Admin flag in profiles table
- ✅ Basic admin panel for prompt approval
- ✅ Approve/reject functionality
- ✅ Admin-only navigation link

**Database:**
- ✅ PostgreSQL via Supabase
- ✅ Three core tables: profiles, prompts, purchases
- ✅ Row Level Security policies
- ✅ Foreign key relationships
- ✅ Automated trigger for profile creation

**UI/UX:**
- ✅ Bootstrap 5 responsive design
- ✅ Navigation bar with auth state
- ✅ Homepage with placeholder content
- ✅ Seller dashboard (placeholder)
- ✅ Login/signup pages

**Infrastructure:**
- ✅ Next.js 14 with App Router
- ✅ Deployed on Vercel
- ✅ Environment variable configuration
- ✅ Git repository structure
- ✅ README documentation

---

## 🗺 Roadmap

### Version 1.3 (Next Release)

**Stripe Webhooks:**
- [ ] Configure Stripe webhook endpoint
- [ ] Automatic email delivery on purchase
- [ ] Purchase record creation via webhook
- [ ] Test with live transactions

**Seller Payments:**
- [ ] Stripe Connect integration
- [ ] Seller onboarding flow
- [ ] 80/20 revenue split (seller/platform)
- [ ] Automated payouts
- [ ] Seller earnings dashboard

**Enhanced Features:**
- [ ] Prompt search functionality
- [ ] Category filtering
- [ ] Price range filters
- [ ] Sorting options (newest, popular, price)
- [ ] Prompt ratings & reviews

---

### Version 2.0 (Future)

**Request Board:**
- [ ] Buyers post prompt requests
- [ ] Sellers browse and fulfill requests
- [ ] Bid/negotiate system
- [ ] Escrow payment protection
- [ ] Request status tracking

**Advanced Seller Tools:**
- [ ] Analytics dashboard (views, sales, revenue)
- [ ] Prompt editing after approval
- [ ] Bulk upload
- [ ] Prompt versioning
- [ ] Customer messaging

**Enterprise Features:**
- [ ] Team accounts
- [ ] Bulk licensing
- [ ] Private prompts for organizations
- [ ] API access
- [ ] Custom branding

**Platform Enhancements:**
- [ ] Prompt testing interface
- [ ] LLM optimization guides
- [ ] Prompt templates
- [ ] Educational content
- [ ] Community features

---

## 📂 Project Structure

```
prompt-marketplace/
├── app/                          # Next.js app directory
│   ├── layout.js                 # Root layout with navbar
│   ├── page.js                   # Homepage (browse prompts)
│   ├── login/                    # Login page
│   ├── signup/                   # Signup page
│   ├── sell/                     # Seller dashboard
│   ├── admin/                    # Admin panel
│   ├── account/                  # Account management (v1.2)
│   ├── prompt/[id]/              # Individual prompt pages
│   ├── purchase/
│   │   ├── [token]/              # View purchased prompt
│   │   └── success/              # Payment success page
│   └── api/
│       ├── auth/callback/        # Supabase auth callback
│       ├── checkout/             # Stripe checkout session
│       └── webhook/              # Stripe webhook handler
│
├── components/                   # Reusable React components
│   ├── Navbar.js                 # Navigation bar
│   ├── PromptCard.js             # Prompt display card
│   └── BuyButton.js              # Purchase button component
│
├── lib/                          # Utility functions
│   └── supabase.js               # Supabase client setup
│
├── public/                       # Static assets
│
├── .env.local                    # Environment variables (not in git)
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies
├── next.config.js                # Next.js configuration
├── jsconfig.json                 # JavaScript configuration
└── README.md                     # This file
```

---

## 🤝 Contributing

This is a private project. For questions or suggestions, contact the maintainer.

---

## 📄 License

Proprietary - All Rights Reserved

---

## 👤 Maintainer

**Arminas Abramavicius**
- Email: arminas.abramavicius@gmail.com
- GitHub: [@arminas-a](https://github.com/arminas-a)

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database by [Supabase](https://supabase.com/)
- Payments by [Stripe](https://stripe.com/)
- Email by [Resend](https://resend.com/)
- Hosted on [Vercel](https://vercel.com/)
- UI by [Bootstrap](https://getbootstrap.com/)

---

## 📊 Status

**Current Version:** 1.2  
**Status:** Active Development  
**Last Updated:** February 6, 2025  
**Live Site:** [https://prompt-marketplace.vercel.app](https://prompt-marketplace.vercel.app)

---

## 🔧 Development Notes

### Database Migrations

All database changes are tracked in version control. To update your database schema:

1. Go to Supabase Dashboard → SQL Editor
2. Run migration scripts in order
3. Document changes in this README

### Deployment Checklist

Before deploying a new version:

- [ ] Test locally with `npm run build`
- [ ] Update version number in this README
- [ ] Document changes in Changelog
- [ ] Update environment variables if needed
- [ ] Push to GitHub
- [ ] Verify Vercel deployment succeeds
- [ ] Test critical user flows on live site
- [ ] Update database if schema changed

### Testing User Flows

**Seller Flow:**
1. Sign up → Confirm email → Redirects to account page
2. Go to Sell Prompts → Create new prompt
3. Submit for approval
4. Check status in seller dashboard

**Admin Flow:**
1. Login as admin
2. Go to Admin panel
3. Review pending prompt
4. Approve or reject
5. Verify status updates

**Buyer Flow (Incognito):**
1. Browse homepage without login
2. Click prompt → View details
3. Click Buy Now → Enter email
4. Complete Stripe test payment
5. Verify success page
6. Check email for prompt

---

## 🐛 Known Issues

### Version 1.2

**Minor Issues:**
- Stripe webhooks not configured (emails don't send automatically)
- Purchase records not created until webhook setup
- Account deletion requires manual intervention

**Planned Fixes in v1.3:**
- Full Stripe webhook implementation
- Automated email delivery
- Self-service account deletion

---

## 💡 Tips for Developers

**Working with Supabase:**
- Use SQL Editor for all schema changes
- Test RLS policies with different user roles
- Enable realtime subscriptions for live updates

**Stripe Integration:**
- Always use test mode keys in development
- Test with card: 4242 4242 4242 4242
- Monitor webhooks in Stripe Dashboard

**Debugging:**
- Check Vercel deployment logs for build errors
- Use browser console for client-side issues
- Check Supabase logs for database errors
- Monitor Stripe webhooks for payment issues

---

**Last Updated:** February 6, 2025  
**Version:** 1.2  
**Maintained by:** Arminas Abramavicius
