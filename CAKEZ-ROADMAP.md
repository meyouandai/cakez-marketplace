# Cakez Marketplace - Complete Product Roadmap

## Project Overview
**Cakez** is a Next.js marketplace connecting customers with local bakers for custom birthday cakes.

---

## Current Status (MVP - November 2025)

### ✅ Implemented Features

#### Authentication & Users
- Email/password authentication (NextAuth)
- User roles: Customer, Baker, Admin
- Sign up/sign in pages
- Session management

#### Baker Features
- Baker profile creation/editing
- Business name, location, bio, delivery radius
- Create/manage cake listings
- View customer inquiries/orders
- Dashboard with stats

#### Customer Features
- Browse cakes with filtering
- Browse bakers directory
- View individual cake/baker pages
- Place orders with Stripe payment
- Customer dashboard to view orders
- Payment success page

#### Listings & Marketplace
- Cake listings (title, description, price, images, flavors, sizes)
- Image upload (Base64 storage)
- Category system
- Search and filters
- Responsive design with Tailwind CSS

#### Payment Integration
- Stripe Checkout integration
- Test mode payments
- Order creation after successful payment
- Payment success flow

#### Technical Stack
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- Neon Postgres Database
- NextAuth for authentication
- Stripe for payments
- Tailwind CSS for styling
- Vercel deployment

---

## Original Vision (From Initial Schema)

### 🔴 Features That Were Stripped for MVP

#### Advanced User Features
- **Email verification system**
- **Verification status** (Unverified, Pending, Verified, Rejected)
- **Response time tracking** for bakers
- **Trust badges** system
- **User referrals**

#### Enhanced Baker Profile
- **Featured baker** listings
- **Featured until date** for promotions
- **Premium subscription** with expiry
- **Quick responder badge**
- **Fresh availability** indicator
- **Response time tracking**
- **Average response hours**

#### Advanced Listing Features
- **Urgency flags** for cakes
- **Bulk pricing** tiers (JSON)
- **Fresh indicator** for just-baked items
- **Active/inactive** status management

#### Orders & Reviews
- **Full order system** with statuses:
  - Pending → Accepted → In Progress → Completed → Cancelled
- **Delivery date** and **delivery address**
- **Special requests** field
- **Insurance coverage** option
- **Customer reviews** with:
  - 1-5 star ratings
  - Written comments
  - Photo uploads
  - Linked to orders

#### Discovery & Matching
- **Saved searches** with criteria
- **Search alerts** (Daily/Weekly/Monthly frequency)
- **Buyer requests** system where customers post requirements
- **Baker responses** to buyer requests with quotes
- **Expiring requests** with urgency levels

#### Content & Community
- **Newsletter system** with:
  - Subject, content, sent date
  - Open rate and click rate tracking
- **Newsletter subscriptions**
- **Content management system**:
  - Content pages (title, content, category)
  - Author attribution
  - Published status
  - Blog/resources functionality

#### Training & Education
- **Courses system** with three types:
  - SafeBake Hygiene
  - Cakez Academy
  - Expert Masterclass
- **Course enrollments**
- **Certificates** upon completion
- **Certification badges**:
  - Certificate type
  - Issue and expiry dates
  - Visible badges on profiles

#### Business Services
- **Referral system** for services
  - Insurance, accountants, lawyers, etc.
  - Commission tracking
- **Insurance policies** for bakers:
  - Provider, policy number
  - Coverage amount
  - Monthly cost tracking
- **Shipping kits** for nationwide delivery:
  - Kit types
  - Pricing
  - Branded options

#### Trust & Safety
- **Document verification** system
  - Upload documents
  - Admin review process
  - Approval/rejection workflow
- **Trust badges** earned over time
- **Response tracking** to build reputation

---

## Current MVP Schema (Simplified)

```prisma
✅ User (email, password, role)
✅ BakerProfile (businessName, location, description, deliveryRadius)
✅ CakeListing (title, description, price, images, flavors, sizes)
✅ Inquiry (customer contact requests to bakers - used as "orders" post-payment)
✅ Category (basic categorization)
```

**Removed from MVP:**
- ❌ Order (full order lifecycle)
- ❌ Review (ratings and photos)
- ❌ SavedSearch
- ❌ BuyerRequest & BakerResponse
- ❌ Newsletter & NewsletterSubscription
- ❌ ContentPage (CMS)
- ❌ Course & CourseEnrollment
- ❌ Certification
- ❌ Referral
- ❌ InsurancePolicy
- ❌ ShippingKit
- ❌ Verification
- ❌ ResponseTracking
- ❌ TrustBadge

---

## Recommended Roadmap

### Phase 1: MVP Refinement (Current)
- [x] Basic marketplace (browse, list, search)
- [x] Authentication
- [x] Stripe payments
- [x] Simple inquiry/order system
- [ ] Email notifications (order confirmation)
- [ ] Baker can mark inquiries as completed
- [ ] Customer can see order history properly

### Phase 2: Core Marketplace Features (Next)
1. **Full Order System**
   - Replace Inquiry with proper Order model
   - Order statuses (Pending → Accepted → In Progress → Completed)
   - Delivery date and address
   - Special requests field

2. **Reviews & Ratings**
   - 1-5 star reviews
   - Written reviews
   - Photo uploads
   - Display on baker profiles
   - Average rating calculation

3. **Enhanced Search**
   - Save searches
   - Search alerts
   - Advanced filtering

### Phase 3: Trust & Discovery
1. **Verification System**
   - Email verification
   - Document verification for bakers
   - Trust badges (verified, quick responder, etc.)

2. **Buyer Requests**
   - Customers post requirements
   - Bakers respond with quotes
   - Request expiry dates

3. **Featured Listings**
   - Premium baker subscriptions
   - Featured placement
   - Urgency flags

### Phase 4: Business Growth Features
1. **Content & Community**
   - Blog/resources CMS
   - Newsletter system
   - Email campaigns

2. **Training Platform**
   - Hygiene courses (SafeBake)
   - Skill courses (Cakez Academy)
   - Masterclasses
   - Certifications

3. **Business Services**
   - Insurance referrals
   - Accounting/legal services
   - Shipping kit marketplace

### Phase 5: Advanced Features
1. **Analytics**
   - Response time tracking
   - Conversion metrics
   - Newsletter analytics (open/click rates)

2. **Advanced Pricing**
   - Bulk pricing tiers
   - Dynamic pricing
   - Promotional codes

3. **Nationwide Expansion**
   - Shipping integration
   - Multi-location support
   - Regional marketing

---

## Current File Structure

```
app/
├── auth/
│   ├── signin/page.tsx
│   └── signup/page.tsx
├── browse/page.tsx
├── bakers/
│   ├── page.tsx
│   └── [id]/page.tsx
├── cakes/[id]/page.tsx
├── dashboard/
│   ├── customer/page.tsx
│   └── baker/
│       ├── page.tsx
│       ├── profile/page.tsx
│       ├── cakes/
│       │   ├── page.tsx
│       │   └── new/page.tsx
│       └── inquiries/page.tsx
├── payment/success/page.tsx
├── screens/page.tsx (screen directory)
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── checkout/route.ts
│   ├── complete-order/route.ts
│   ├── webhooks/stripe/route.ts
│   └── [other API routes]
├── components/
│   ├── Navigation.tsx
│   ├── CakeCard.tsx
│   ├── ImageUpload.tsx
│   ├── InquiryForm.tsx
│   ├── SearchFilters.tsx
│   └── Providers.tsx
└── lib/
    ├── auth.ts
    └── prisma.ts
```

---

## Technical Debt & Improvements Needed

1. **Replace Inquiry with Order Model**
   - Current "Inquiry" is being used post-payment as orders
   - Need proper Order model with statuses

2. **Email System**
   - Set up email service (Resend, SendGrid, etc.)
   - Order confirmation emails
   - Baker notification emails

3. **Image Storage**
   - Currently using Base64 (not scalable)
   - Move to Cloudinary or S3

4. **Webhook Configuration**
   - Set up proper Stripe webhook endpoint URL
   - Handle webhook signature verification

5. **Testing**
   - Add unit tests
   - E2E testing for critical flows
   - Payment flow testing

6. **Performance**
   - Image optimization
   - Database query optimization
   - Caching strategy

7. **Security**
   - CSRF protection
   - Rate limiting
   - Input validation
   - SQL injection prevention

---

## Key Metrics to Track (Future)

1. **Marketplace Health**
   - Active bakers
   - Active listings
   - Successful orders
   - Conversion rate (browse → order)

2. **User Engagement**
   - Response time (bakers)
   - Repeat customers
   - Baker retention
   - Customer satisfaction

3. **Business Metrics**
   - GMV (Gross Merchandise Value)
   - Take rate
   - Premium subscription rate
   - Course enrollment rate

---

## Next Immediate Steps

1. ✅ Complete Stripe payment integration (DONE)
2. ✅ Create screens directory page (DONE)
3. [ ] Set up email notifications
4. [ ] Migrate Inquiry → Order model
5. [ ] Add review system
6. [ ] Implement baker order management
7. [ ] Add email verification
8. [ ] Set up production Stripe webhooks
9. [ ] Move to Cloudinary for images
10. [ ] Create admin panel

---

**Last Updated:** November 7, 2025
**Current Phase:** MVP (Phase 1)
**Live URL:** https://cakez-marketplace-yvgc.vercel.app
