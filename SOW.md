Here’s a clean, professional **Statement of Work (SOW)** you can use.

---

# Statement of Work (SOW)

**Project:** Makeup Artist Web Application
**Tech Stack:** Next.js (SSR), Supabase (Free Tier), Vercel (Free Tier)

---

## 1. Project Overview

This project involves designing and developing a responsive, SEO-optimized web application for a professional makeup artist. The platform will allow the artist to showcase her portfolio, manage services and pricing, receive inquiries and custom quote requests, and enable customers to book appointments (including multiple services and multiple clients per booking).

The application will be deployed on Vercel using the free tier and will use Supabase (free tier) as the backend database and authentication provider.

---

## 2. Objectives

- Establish a professional online presence
- Showcase portfolio work effectively
- Enable online booking and inquiry handling
- Streamline service management
- Allow customers to request custom quotes
- Support multiple services and multi-client bookings

---

## 3. Scope of Work

### 3.1 Frontend Development (Next.js with SSR)

All pages will be server-side rendered (SSR) where appropriate for SEO optimization.

#### Pages to be Developed

1. **Home Page**
   - Hero section
   - Featured work showcase
   - Highlights of services
   - Call-to-action buttons (Book Now / Get Quote / Contact)

2. **About Page**
   - Artist bio
   - Experience and certifications
   - Testimonials (optional enhancement)

3. **Services Page**
   - List of services
   - Pricing display
   - Service details
   - Add-to-cart style functionality for booking

4. **Booking Page**
   - Select one or multiple services
   - Specify number of clients
   - Assign service per client (if multiple clients)
   - Date and time selection
   - Contact details collection
   - Booking summary (cart-like review)
   - Submit booking request

5. **Contact Page**
   - General contact form
   - Custom quote request
   - Special requirement message field

6. **Admin Dashboard** (Protected, Login Required)
   - Admin login page (Supabase Auth email/password)
   - Dashboard overview with key metrics (total bookings, pending inquiries, active services)
   - Services management (add, edit, deactivate services and categories)
   - Bookings management (view all bookings, filter by status, confirm/cancel bookings, view booking details with client-service mapping)
   - Portfolio management (upload images, set featured items, edit/delete portfolio entries)
   - Contact requests & quotes viewer (view all inquiries, filter by quote requests, mark as read/responded)
   - Site content management (update About page content, testimonials)

---

### 3.2 Core Functional Features

#### A. Portfolio Showcase

- Image gallery (categorized if required)
- Optimized image loading
- SEO-friendly metadata
- Admin ability to add/update portfolio via the admin dashboard

---

#### B. Service Management

- Add/edit/delete services
- Set pricing per service
- Optional service duration
- Category grouping (e.g., Bridal, Party, Editorial)

Managed via:

- Supabase database
- Admin dashboard (full CRUD interface)

---

#### C. Contact & Custom Quote System

- Contact form fields:
  - Name
  - Email
  - Phone
  - Message
  - Special requirements

- Quote request flag
- Data stored in Supabase
- Email notification integration (optional enhancement)

---

#### D. Booking System

Supports:

- Single service booking
- Multiple services per booking
- Multiple clients per booking
- Different services per client

Booking Data Captured:

- Customer details
- Event date
- Time slot
- Location (if applicable)
- Selected services
- Number of clients
- Special instructions

System Behavior:

- Booking stored in Supabase
- Slot availability validation
- Booking confirmation screen
- Admin approval workflow via admin dashboard

---

#### E. Cart-like Functionality

- Add/remove services
- Quantity control
- Price calculation
- Booking summary page

---

## 4. Database Design (Supabase)

Proposed Tables:

- Users (optional if authentication is enabled)
- Services
- Categories
- PortfolioItems
- Bookings
- BookingClients
- BookingServices
- ContactRequests
- Quotes

Relational structure will support:

- Multiple services per booking
- Multiple clients per booking
- Service-client mapping

---

## 5. SEO Implementation

- Server-side rendering (SSR)
- Dynamic meta tags per page
- Open Graph tags
- Sitemap generation
- Structured data (JSON-LD for services)

---

## 6. Deployment

- Frontend hosted on Vercel (Free Tier)
- Database hosted on Supabase (Free Tier)
- Environment variables securely managed
- Domain configuration (if custom domain provided)

---

## 7. Non-Functional Requirements

- Fully responsive design (mobile-first)
- Fast loading performance
- Clean UI/UX
- Form validation
- Basic security best practices
- Input sanitization

---

## 8. Nice-to-Have Features (Optional Enhancements)

- Email notifications (booking + contact)
- WhatsApp integration
- Payment gateway integration (advance booking fee)
- Calendar sync (Google Calendar)
- Testimonials section
- Instagram feed integration
- Booking status tracking
- Discount codes
- Analytics integration
- Blog section (SEO growth)
- Multi-language support

---

## 9. Assumptions

- Free-tier limitations of Supabase and Vercel will be respected
- No complex real-time availability engine initially
- Payments integration (if required) will use supported third-party APIs
- No native mobile app included

---

## 10. Deliverables

- Complete Next.js application (public site + admin dashboard)
- Supabase database setup
- Deployment on Vercel
- Production-ready build
- Admin dashboard with full content management
- Basic documentation
- Database schema documentation

---

## 11. Timeline (Suggested)

- Week 1: UI Design + Database Schema
- Week 2: Core Pages + Portfolio + Services
- Week 3: Booking System + Contact + Integration
- Week 4: Admin Dashboard (Services, Bookings, Portfolio, Contacts management)
- Week 5: Testing + Deployment + SEO + Optimizations

---

## 12. Acceptance Criteria

The project will be considered complete when:

- All listed features function correctly
- Booking system supports multi-client and multi-service logic
- Admin dashboard allows full management of services, bookings, portfolio, and inquiries
- Admin authentication restricts dashboard access to authorized users only
- SEO implementation is verified
- Deployment is successful
- Responsive layout works across devices

---

## 13. Feature Addendum: Foundation Shade Finder + Lead Funnel

### 13.1 Objective

Build a web feature that allows users to upload a photo, detects skin tone & undertone using rule-based color analysis (pure client-side HTML5 Canvas, NO AI/ML), recommends suitable foundation shades, educates users, and captures makeup service leads securely in Supabase.

### 13.2 Scope

- **Upload & Processing**: Drag & drop upload, auto-compression, Supabase Storage integration.
- **Rules Engine**: Central cheek region sampling, RGB to HSL conversion, static shade mapping based on lightness and color channel deltas.
- **Lead Capture**: Form collecting Name, Email, Phone, selected service, and mapped shades, securely stored in the `foundation_leads` Supabase table.
