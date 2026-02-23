# Milestone-Based Execution Plan

**Project:** Makeup Artist Web Application
**Stack:** Next.js (SSR), Supabase, Vercel
**Deployment Target:** Production-ready on free tiers

---

# Project Timeline Overview (4–6 Weeks)

| Milestone | Name                         | Duration  | Outcome                            |
| --------- | ---------------------------- | --------- | ---------------------------------- |
| M1        | Project Setup & Foundation   | Week 1    | Working base app + DB schema       |
| M2        | Core Public Pages            | Week 2    | Portfolio + Services live          |
| M3        | Booking System (Core Logic)  | Week 3    | Multi-client booking functional    |
| M4        | Contact + Quote + Admin APIs | Week 4    | Inquiry & admin control working    |
| M4.5      | Admin Dashboard UI           | Week 4–5  | Full content management dashboard  |
| M5        | SEO, Security & Optimization | Week 5–6  | Production hardened                |
| M6        | Deployment & UAT             | Week 6–7  | Live production release            |

---

# 🟢 Milestone 1: Project Setup & Foundation

**Duration:** 5–7 days

## Objectives

- Initialize application
- Configure database
- Set deployment pipeline

## Deliverables

### 1. Environment Setup

- Next.js project initialized
- Tailwind or styling system setup
- ESLint + Prettier configured

### 2. Supabase Setup

- Create project
- Apply DB schema
- Configure:
  - UUID extension
  - Indexes
  - RLS policies

### 3. Base Project Structure

```
/app
/components
/lib
/services
/api
/types
/utils
```

### 4. CI/CD

- GitHub repository
- Vercel connected
- Environment variables configured

## Acceptance Criteria

- App deployed to preview environment
- Database schema successfully migrated
- Supabase connected to Next.js

---

# 🟢 Milestone 2: Core Public Pages

**Duration:** 7 days

## Objectives

- Build SEO-friendly pages
- Implement portfolio and services listing

## Deliverables

### 1. Home Page

- Hero section
- Featured portfolio
- Service highlights
- SEO metadata

### 2. About Page

- Static content
- Structured metadata

### 3. Services Page

- Dynamic fetch from Supabase
- Service categories
- Pricing display
- “Add to booking” state management

### 4. Portfolio Page

- Dynamic image rendering
- Supabase Storage integration
- Optimized images

## Technical Implementation

- SSR for services & portfolio
- Dynamic metadata generation
- Error handling

## Acceptance Criteria

- Services load dynamically
- Portfolio loads from DB
- Lighthouse SEO score > 85

---

# 🟢 Milestone 3: Booking System (Core)

**Duration:** 7–10 days

## Objectives

- Implement multi-client, multi-service booking

## Deliverables

### 1. Booking UI

- Select services
- Add multiple clients
- Assign services per client
- Date/time selector
- Booking summary

### 2. Booking API

`POST /api/booking`

Logic:

- Validate input
- Check slot availability
- Calculate total price
- Insert:
  - bookings
  - booking_clients
  - booking_services

### 3. Slot Validation

- Basic conflict prevention logic

### 4. Confirmation Page

## Acceptance Criteria

- Can book 1 service for 1 client
- Can book 5 services for 10 clients
- Total calculation correct
- DB reflects correct relationships

---

# 🟢 Milestone 4: Contact, Quotes & Admin APIs

**Duration:** 5–7 days

## Objectives

- Implement inquiry system
- Enable admin-level data access

## Deliverables

### 1. Contact Form

- Save to contact_requests table
- Quote request flag

### 2. Admin APIs

- View bookings
- View contact requests
- Add/update services

### 3. Basic Admin Authentication

- Supabase Auth (email login)
- Protected routes

## Acceptance Criteria

- Contact form stores data
- Admin APIs for services, bookings, portfolio, contacts are functional
- Admin auth middleware verifies tokens correctly
- Public cannot access admin API routes

---

# 🟢 Milestone 4.5: Admin Dashboard UI

**Duration:** 7–10 days

## Objectives

- Build a complete admin dashboard for the site owner to manage all content
- Secure admin routes with Supabase Auth (email/password login)

## Deliverables

### 1. Admin Login Page (`/admin/login`)

- Email/password authentication via Supabase Auth
- Redirect to dashboard on successful login
- Error handling for invalid credentials
- Logout functionality

### 2. Admin Dashboard Home (`/admin`)

- Overview metrics cards:
  - Total bookings (pending, confirmed, cancelled)
  - Total contact requests (unread count)
  - Active services count
  - Portfolio items count
- Recent bookings list
- Quick action links

### 3. Services Management (`/admin/services`)

- Table listing all services (active and inactive)
- Add new service form (name, description, price, duration, category)
- Edit existing service
- Deactivate/reactivate services (soft delete via is_active flag)
- Category management (add/edit categories)

### 4. Bookings Management (`/admin/bookings`)

- Table of all bookings with:
  - Status filter (pending/confirmed/cancelled)
  - Date range filter
  - Search by customer name/email
- Booking detail view:
  - Customer information
  - All clients with their assigned services
  - Total price breakdown
- Actions: confirm or cancel booking (status update)

### 5. Portfolio Management (`/admin/portfolio`)

- Grid view of all portfolio items
- Upload new images (Supabase Storage)
- Edit title, description, category
- Toggle featured status
- Delete portfolio items

### 6. Contact Requests (`/admin/contacts`)

- Table of all contact requests and quote inquiries
- Filter: all / quote requests only
- View full message details
- Mark as read/responded

## Technical Implementation

- Admin layout with sidebar navigation
- Middleware to protect `/admin/*` routes
- All admin API calls include auth token
- Responsive design for tablet/desktop use
- Client-side data fetching with loading states

## Acceptance Criteria

- Admin can log in and log out securely
- Admin can add, edit, and deactivate services
- Admin can view all bookings and update their status
- Admin can upload, edit, and delete portfolio items
- Admin can view and manage all contact requests
- Public users cannot access any admin routes
- Dashboard shows accurate metrics

---

# 🟢 Milestone 5: SEO, Security & Optimization

**Duration:** 5 days

## Objectives

- Production hardening

## Deliverables

### 1. SEO Enhancements

- Sitemap.xml
- Robots.txt
- JSON-LD structured data
- OpenGraph tags

### 2. Security

- RLS fully configured
- Input validation (Zod)
- Rate limiting (optional)

### 3. Performance

- Image optimization
- Query optimization
- Index validation

### 4. Testing

- Multi-client edge cases
- Double booking attempts
- Validation failures

## Acceptance Criteria

- Lighthouse score > 90
- RLS policies verified
- No public read access to private data

---

# 🟢 Milestone 6: Deployment & UAT

**Duration:** 3–5 days

## Objectives

- Production release

## Deliverables

### 1. Final Deployment

- Production build on Vercel
- Custom domain configured
- SSL active

### 2. User Acceptance Testing

- Full booking flow test
- Contact flow test
- Admin flow test

### 3. Documentation

- Setup guide
- DB schema documentation
- API documentation

### 4. Handover

## Acceptance Criteria

- All major flows functional
- Production environment stable
- Stakeholder approval

---

# 💰 Optional Commercial Milestone Structuring

If tying to payments:

| Milestone | Payment % |
| --------- | --------- |
| M1        | 10%       |
| M2        | 15%       |
| M3        | 20%       |
| M4        | 10%       |
| M4.5      | 20%       |
| M5        | 15%       |
| M6        | 10%       |

---

# 🧠 Risk Buffer Plan

Add 10–15% buffer for:

- UI iteration
- Client feedback loops
- Deployment configuration issues
- Free tier limitations

---

# 📦 Phase 2 (Post-MVP Expansion)

- Payment gateway integration
- Email automation
- Google Calendar sync
- Advanced analytics in admin dashboard
- Advanced slot engine
- WhatsApp integration
