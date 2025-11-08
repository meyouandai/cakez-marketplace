# Pages & Role Access Checklist

This document outlines all pages in the application, their intended purpose, role-based access requirements, and current implementation status.

---

## 🔐 Authentication Pages (Public)

### ✅ `/auth/signin` - Sign In Page
- **Access**: Public (unauthenticated only)
- **Purpose**: User login
- **Actions**:
  - [ ] Login with email/password
  - [ ] Redirect to dashboard after login
  - [ ] Remember me option
  - [ ] Forgot password link
- **Status**: ⚠️ Needs verification

### ✅ `/auth/signup` - Sign Up Page
- **Access**: Public (unauthenticated only)
- **Purpose**: User registration
- **Actions**:
  - [ ] Register as Customer
  - [ ] Register as Baker
  - [ ] Email verification
  - [ ] Terms & conditions acceptance
- **Status**: ⚠️ Needs verification

---

## 🏠 Public Pages

### ✅ `/` - Homepage
- **Access**: Public
- **Purpose**: Landing page with marketplace overview
- **Actions**:
  - [ ] View featured bakers
  - [ ] Browse categories
  - [ ] Search functionality
  - [ ] CTA to sign up
- **Status**: ⚠️ Needs verification

### ✅ `/bakers` - Bakers Directory
- **Access**: Public
- **Purpose**: Browse all bakers
- **Actions**:
  - [ ] View all bakers
  - [ ] Filter by location/category
  - [ ] Search bakers
  - [ ] View baker profiles (link to detail)
- **Status**: ⚠️ Needs verification

### ✅ `/bakers/[id]` - Baker Profile Detail
- **Access**: Public
- **Purpose**: View individual baker profile
- **Actions**:
  - [ ] View baker information
  - [ ] View baker's cake listings
  - [ ] View reviews/ratings
  - [ ] Contact baker (authenticated users)
  - [ ] Order from baker
- **Status**: ⚠️ Needs verification

### ✅ `/browse` - Browse Cakes
- **Access**: Public
- **Purpose**: Browse all cake listings
- **Actions**:
  - [ ] View all cake listings
  - [ ] Filter by category/price/location
  - [ ] Search cakes
  - [ ] View cake details
- **Status**: ⚠️ Needs verification

### ✅ `/cakes/[id]` - Cake Detail Page
- **Access**: Public
- **Purpose**: View individual cake listing
- **Actions**:
  - [ ] View cake details
  - [ ] View baker profile
  - [ ] Add to cart / Order
  - [ ] View reviews
- **Status**: ⚠️ Needs verification

### ✅ `/blog` - Blog Listing
- **Access**: Public
- **Purpose**: View all blog posts
- **Actions**:
  - [ ] View all published blog posts
  - [ ] Filter by category
  - [ ] Search posts
- **Status**: ⚠️ Needs verification

### ✅ `/blog/[id]` - Blog Post Detail
- **Access**: Public
- **Purpose**: Read individual blog post
- **Actions**:
  - [ ] Read full blog post
  - [ ] View related posts
  - [ ] Share post
- **Status**: ⚠️ Needs verification

### ✅ `/buyer-requests` - Buyer Requests Listing
- **Access**: Public (view), Authenticated (create)
- **Purpose**: View all active buyer requests
- **Actions**:
  - [ ] View all buyer requests (BAKER only)
  - [ ] Filter by location/urgency
  - [ ] View request details
- **Status**: ⚠️ Needs verification

### ✅ `/buyer-requests/[id]` - Buyer Request Detail
- **Access**: Public
- **Purpose**: View individual buyer request
- **Actions**:
  - [ ] View request details
  - [ ] Submit proposal (BAKER only)
  - [ ] View existing proposals (REQUEST OWNER only)
- **Status**: ⚠️ Needs verification

### ✅ `/buyer-requests/create` - Create Buyer Request
- **Access**: Authenticated (CUSTOMER only)
- **Purpose**: Create new buyer request
- **Actions**:
  - [ ] Fill out request form
  - [ ] Set budget/location/urgency
  - [ ] Submit request
- **Status**: ⚠️ Needs verification

### ✅ `/courses` - Courses Listing
- **Access**: Public
- **Purpose**: View all available courses
- **Actions**:
  - [ ] View all courses
  - [ ] Filter by type (SafeBake, Academy, Masterclass)
  - [ ] View course details
  - [ ] Enroll in courses
- **Status**: ⚠️ Needs verification

### ✅ `/courses/[id]` - Course Detail Page
- **Access**: Public
- **Purpose**: View individual course
- **Actions**:
  - [ ] View course details
  - [ ] View syllabus/duration
  - [ ] Enroll in course (authenticated)
  - [ ] View instructor info
- **Status**: ⚠️ Needs verification

### ✅ `/insurance` - Insurance Information
- **Access**: Public
- **Purpose**: View insurance options for bakers
- **Actions**:
  - [ ] View insurance plans
  - [ ] Calculate premiums
  - [ ] Apply for insurance (BAKER only)
- **Status**: ⚠️ Needs verification

### ✅ `/shipping-kits` - Shipping Kits
- **Access**: Public
- **Purpose**: View shipping kit options
- **Actions**:
  - [ ] View available shipping kits
  - [ ] View pricing
  - [ ] Order kits (BAKER only)
- **Status**: ⚠️ Needs verification

### ✅ `/support` - Support Page
- **Access**: Public
- **Purpose**: Customer support
- **Actions**:
  - [ ] View FAQs
  - [ ] Submit support ticket
  - [ ] Contact support
- **Status**: ⚠️ Needs verification

---

## 💬 Messaging System (Authenticated)

### ✅ `/messages` - Messages Inbox
- **Access**: Authenticated (ALL roles)
- **Purpose**: View all active conversations
- **Actions**:
  - [x] View conversation list
  - [x] See unread count badges
  - [x] Real-time updates (3s polling)
  - [x] Archive conversations
  - [x] Delete conversations (30-day recovery)
  - [x] Click to view conversation
  - [x] Right-click context menu
- **Status**: ✅ COMPLETE

### ✅ `/messages/[id]` - Conversation View
- **Access**: Authenticated (conversation participants only)
- **Purpose**: View and send messages in conversation
- **Actions**:
  - [x] View message history
  - [x] Send new messages
  - [x] See typing indicators
  - [x] Real-time message updates
  - [x] Mark messages as read
  - [x] Split-pane layout (desktop)
  - [x] Mobile-responsive
- **Status**: ✅ COMPLETE

### ✅ `/messages/archived` - Archived Conversations
- **Access**: Authenticated (ALL roles)
- **Purpose**: View archived conversations
- **Actions**:
  - [x] View all archived conversations
  - [x] Click to view conversation
  - [x] Unarchive conversations
  - [x] See archive date
- **Status**: ✅ COMPLETE

---

## 👨‍🍳 Baker Dashboard

### ✅ `/dashboard/baker` - Baker Dashboard Home
- **Access**: BAKER only
- **Purpose**: Baker overview dashboard
- **Actions**:
  - [ ] View order statistics
  - [ ] View recent orders
  - [ ] View pending buyer requests
  - [ ] Quick actions menu
  - [ ] Notifications
- **Status**: ⚠️ Needs verification

### ✅ `/dashboard/baker/profile` - Baker Profile Management
- **Access**: BAKER only
- **Purpose**: Manage baker profile
- **Actions**:
  - [ ] Edit business name
  - [ ] Edit description
  - [ ] Set delivery radius
  - [ ] Update location
  - [ ] Upload profile images
  - [ ] Toggle fresh availability
- **Status**: ⚠️ Needs verification

### ✅ `/dashboard/baker/cakes` - Manage Cake Listings
- **Access**: BAKER only
- **Purpose**: View/manage all cake listings
- **Actions**:
  - [ ] View all cake listings
  - [ ] Create new listing (link to /new)
  - [ ] Edit existing listings
  - [ ] Delete listings
  - [ ] Toggle active/inactive
  - [ ] View listing stats
- **Status**: ⚠️ Needs verification

### ✅ `/dashboard/baker/cakes/new` - Create Cake Listing
- **Access**: BAKER only
- **Purpose**: Create new cake listing
- **Actions**:
  - [ ] Upload cake images
  - [ ] Set title/description
  - [ ] Set price
  - [ ] Select category
  - [ ] Set bulk pricing tiers
  - [ ] Toggle urgency flag
  - [ ] Publish listing
- **Status**: ⚠️ Needs verification

### ✅ `/dashboard/baker/orders` - Baker Orders Management
- **Access**: BAKER only
- **Purpose**: Manage incoming orders
- **Actions**:
  - [ ] View all orders
  - [ ] Filter by status
  - [ ] Accept/reject orders
  - [ ] Update order status
  - [ ] View customer details
  - [ ] View special requests
- **Status**: ⚠️ Needs verification

### ✅ `/dashboard/baker/verification` - Baker Verification
- **Access**: BAKER only
- **Purpose**: Submit verification documents
- **Actions**:
  - [ ] Upload business license
  - [ ] Upload insurance policy
  - [ ] Upload hygiene certificate
  - [ ] Upload ID document
  - [ ] Submit verification
  - [ ] View verification status
- **Status**: ⚠️ Needs verification

---

## 👤 Customer Dashboard

### ✅ `/dashboard/customer` - Customer Dashboard Home
- **Access**: CUSTOMER only
- **Purpose**: Customer overview dashboard
- **Actions**:
  - [ ] View recent orders
  - [ ] View active buyer requests
  - [ ] View saved searches
  - [ ] Quick actions menu
- **Status**: ⚠️ Needs verification

### ✅ `/dashboard/customer/buyer-requests` - Customer Buyer Requests
- **Access**: CUSTOMER only
- **Purpose**: Manage buyer requests
- **Actions**:
  - [ ] View all buyer requests
  - [ ] View proposals received
  - [ ] Create new request
  - [ ] Edit requests
  - [ ] Delete requests
  - [ ] Accept proposals
- **Status**: ⚠️ Needs verification

---

## 🎓 Courses Dashboard (Shared)

### ✅ `/dashboard/courses` - My Courses
- **Access**: Authenticated (ALL roles)
- **Purpose**: View enrolled courses
- **Actions**:
  - [ ] View all enrolled courses
  - [ ] View course progress
  - [ ] Resume course
  - [ ] View certificates
- **Status**: ⚠️ Needs verification

### ✅ `/dashboard/courses/[id]` - Course Learning Page
- **Access**: Authenticated (enrolled users only)
- **Purpose**: Course learning interface
- **Actions**:
  - [ ] Watch course videos
  - [ ] View course materials
  - [ ] Track progress
  - [ ] Take quizzes/tests
  - [ ] Download certificate (if completed)
- **Status**: ⚠️ Needs verification

---

## 🛡️ Admin Dashboard

### ✅ `/dashboard/admin` - Admin Dashboard Home
- **Access**: ADMIN only
- **Purpose**: Admin overview dashboard
- **Actions**:
  - [ ] View platform statistics
  - [ ] View recent activity
  - [ ] View pending verifications
  - [ ] View support tickets
  - [ ] Quick actions menu
- **Status**: ⚠️ Needs verification

### ✅ `/dashboard/admin/users` - User Management
- **Access**: ADMIN only
- **Purpose**: Manage all users
- **Actions**:
  - [ ] View all users
  - [ ] Filter by role
  - [ ] Search users
  - [ ] Edit user details
  - [ ] Change user roles
  - [ ] Suspend/ban users
  - [ ] View user activity
- **Status**: ⚠️ Needs verification

### ✅ `/dashboard/admin/verifications` - Verification Management
- **Access**: ADMIN only
- **Purpose**: Review baker verifications
- **Actions**:
  - [ ] View pending verifications
  - [ ] Review submitted documents
  - [ ] Approve verifications
  - [ ] Reject verifications (with reason)
  - [ ] View verification history
- **Status**: ⚠️ Needs verification

### ✅ `/dashboard/admin/content` - Content Management
- **Access**: ADMIN only
- **Purpose**: Manage blog posts
- **Actions**:
  - [ ] View all content
  - [ ] Filter by status (published/draft)
  - [ ] Create new content (link to /new)
  - [ ] Edit existing content
  - [ ] Delete content
  - [ ] Publish/unpublish content
- **Status**: ⚠️ Needs verification

### ✅ `/dashboard/admin/content/new` - Create Blog Post
- **Access**: ADMIN only
- **Purpose**: Create new blog post
- **Actions**:
  - [ ] Write blog post content
  - [ ] Set title/category
  - [ ] Upload featured image
  - [ ] Save as draft
  - [ ] Publish post
- **Status**: ⚠️ Needs verification

### ✅ `/dashboard/admin/newsletters` - Newsletter Management
- **Access**: ADMIN only
- **Purpose**: Manage newsletter campaigns
- **Actions**:
  - [ ] View past newsletters
  - [ ] Create new newsletter
  - [ ] View subscriber list
  - [ ] Send newsletter
  - [ ] View analytics (open/click rates)
- **Status**: ⚠️ Needs verification

### ✅ `/dashboard/admin/support` - Support Ticket Management
- **Access**: ADMIN only
- **Purpose**: Manage support tickets
- **Actions**:
  - [ ] View all support tickets
  - [ ] Filter by status
  - [ ] Respond to tickets
  - [ ] Close tickets
  - [ ] Escalate tickets
- **Status**: ⚠️ Needs verification

---

## 💳 Payment & Orders

### ✅ `/orders/[orderId]/review` - Order Review Page
- **Access**: Authenticated (order customer only)
- **Purpose**: Leave review after order completion
- **Actions**:
  - [ ] View order details
  - [ ] Rate baker (1-5 stars)
  - [ ] Write review comment
  - [ ] Upload photos
  - [ ] Submit review
- **Status**: ⚠️ Needs verification

### ✅ `/payment/success` - Payment Success Page
- **Access**: Authenticated
- **Purpose**: Payment confirmation
- **Actions**:
  - [ ] View order confirmation
  - [ ] View order details
  - [ ] Download receipt
  - [ ] Return to dashboard
- **Status**: ⚠️ Needs verification

---

## 🧪 Testing/Development

### ⚠️ `/test-stripe` - Stripe Integration Test
- **Access**: Development only
- **Purpose**: Test Stripe payment integration
- **Actions**: Test payment flows
- **Status**: 🔴 Should be removed in production

### ⚠️ `/screens` - Screens Test Page
- **Access**: Development only
- **Purpose**: UI component showcase
- **Actions**: View component library
- **Status**: 🔴 Should be removed in production

---

## 📊 Summary by Role

### 🔓 Public (Unauthenticated)
- ✅ Homepage
- ✅ Browse bakers/cakes
- ✅ View baker profiles
- ✅ View blog posts
- ✅ View courses
- ✅ View buyer requests (list)
- ✅ Auth pages (signin/signup)

### 👤 Customer
**Public pages +**
- ✅ Messages (full access)
- ⚠️ Customer dashboard
- ⚠️ Create buyer requests
- ⚠️ View proposals
- ⚠️ Place orders
- ⚠️ Leave reviews
- ⚠️ Course enrollment

### 👨‍🍳 Baker
**Public pages +**
- ✅ Messages (full access)
- ⚠️ Baker dashboard
- ⚠️ Manage profile
- ⚠️ Manage cake listings
- ⚠️ Manage orders
- ⚠️ Respond to buyer requests
- ⚠️ Submit verification
- ⚠️ Course enrollment

### 🛡️ Admin
**All pages +**
- ⚠️ Admin dashboard
- ⚠️ User management
- ⚠️ Verification approval
- ⚠️ Content management
- ⚠️ Newsletter management
- ⚠️ Support tickets
- ⚠️ Platform analytics

---

## 🚨 Critical Missing Features

### Authentication & Authorization
- [ ] Role-based middleware protection
- [ ] Redirect logic after login
- [ ] Password reset functionality
- [ ] Email verification flow
- [ ] Session management

### Access Control
- [ ] Verify role restrictions on all pages
- [ ] Prevent unauthorized access to dashboards
- [ ] Proper 403/404 error pages
- [ ] Audit role-based queries in all pages

### Data Validation
- [ ] Input validation on all forms
- [ ] Server-side validation
- [ ] CSRF protection
- [ ] Rate limiting on API endpoints

---

## 📝 Next Steps

1. **Immediate**: Verify authentication/authorization on all protected pages
2. **High Priority**: Implement missing CRUD operations in dashboards
3. **Medium Priority**: Add missing features (reviews, payments, etc.)
4. **Low Priority**: Polish UI/UX and add analytics

---

**Legend:**
- ✅ Complete and tested
- ⚠️ Implemented but needs verification
- 🔴 Issue/needs work
- [ ] Action item unchecked
- [x] Action item complete
