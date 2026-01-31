# BandScope - Music Networking App
## Project Specification Document

---

## 1. Project Overview

**BandScope** is a music networking platform that connects musicians, bands, and venues. It serves as both an event discovery board and a professional networking tool for the local music community.

### Target Platform
- **Primary**: Responsive web application
- **Future**: Mobile app (iOS/Android) - design must follow mobile-first principles and Apple App Store guidelines

### Design System
- **Color Scheme**: Dark grey primary with #4caf50 (green) accent
- **UI Philosophy**: Clean and simple
- **Responsiveness**: Mobile-first, fully responsive design

---

## 2. User Roles

### Three Primary User Types:
1. **Musician** - Individual artists/players
2. **Band** - Musical groups
3. **Venue** - Performance spaces/establishments

---

## 3. Authentication System

### Sign Up Flow
- Email and password registration
- User role selection during profile setup process
- Email verification (optional for MVP)

### Login
- Email/password authentication
- "Remember me" option
- Password reset available in Profile Settings > Password Reset

---

## 4. Profile System

### All Profiles Include:
- Name
- Profile picture
- User role (musician/band/venue)
- Location
- Bio
- Links (social media, website, etc.)
- Followers/Following count
- Direct messaging capability

### Musician Profile (Additional Fields):
- Age
- Last active timestamp
- Music genres (multiple selection)
- Roles (e.g., lead vocalist, rhythm guitarist)
- Instruments (multiple selection)
- **Seeking**: What instrument players they're looking for
- Influences (artists/bands)

### Band Profile (Additional Fields):
- Members & their ages
- Last active timestamp
- Music genres (multiple selection)
- **Seeking**: What instrument players the band is looking for
- Influences (artists/bands)

### Venue Profile (Additional Fields):
- Past shows list
- Upcoming shows list

---

## 5. Page Structure

### 5.1 Login Page
- Email input
- Password input
- "Forgot Password?" link
- "Sign Up" button
- Login button

### 5.2 Hero Page (Main Feed)

**For Musicians & Bands:**
- Search bar at top
- Filters button (opens filter panel)
- List of profile cards showing:
  - Profile picture
  - Name
  - Age
  - Profile type (musician/band)
  - Instrument(s)
  - Seeking
- **Note**: Venue profiles are NOT shown in this feed

**For Venues:**
- Different hero page layout (to be designed later)

### 5.3 Profile Page
- Displays current user's profile
- "Edit Profile" button
- "Settings" button
- All profile information display
- **For Bands/Venues**: Access to Events section
  - View all events (past and upcoming)
  - "Create New Event" button
  - Delete event option on each event

### 5.4 Events Page
- List of upcoming events (all venue profile posts)
- Each event card shows:
  - Event picture
  - Event name
  - Location
  - Date & time
  - Price
  - "More Info" link/button
  - Attendee counter

---

## 6. Search & Discovery

### Search Functionality
- Search bar for name/location search
- Real-time search results

### Filters
Users can filter by:
- **Age**: Age range slider or input
- **Genre**: Music genre multi-select
- **Location Radius**: Distance from user's location
- **Instrument**: Instrument type multi-select
- **Seeking Type**: What they're looking for

### Sorting Options
- Newest profiles first
- Closest by distance
- Last active (most recently active first)

---

## 7. Social Features

### Following System
- Users can follow other musicians and bands
- Instagram-style following model
- Followers and Following counts displayed on profiles

### Direct Messaging
- Similar to Instagram DM system
- Accessible from any profile
- Message thread view
- Real-time messaging (or close to it)

### Notifications
User receives notifications for:
- New follower
- New direct message
- Event posted by followed venue
- Customizable in User Settings

---

## 8. Events System

### Event Creation
**Who Can Create:**
- Venues
- Bands

**How to Create:**
1. Navigate to Profile Page
2. Go to Events tab
3. Click "Create New Event"
4. Fill out event form:
   - Event picture
   - Event name
   - Location
   - Date & time
   - Price
   - Description/More info

### Event Management
- Edit event (from event detail page)
- Delete event (from event detail page)
- View attendee count

### Event Display
- **Events Page**: Shows all upcoming events from all venues
- **Profile Events Tab**: Shows past and upcoming events for that specific band/venue
- **Attendance Tracking**: Counter showing number of attendees per event

---

## 9. Settings & User Management

### Profile Settings
Accessible from Profile Page:
- Edit profile information
- Change profile picture
- Update bio and links
- **Password Reset**: Change password functionality

### Notification Settings
- Toggle notifications for:
  - New followers
  - Direct messages
  - Events from followed venues
- Global notification on/off

---

## 10. MVP Scope (Phase 1)

### Include in MVP:
✅ User authentication (email/password signup and login)
✅ Three user role types (musician, band, venue)
✅ Profile creation and editing
✅ Hero page with profile cards
✅ Basic search by name/location
✅ Following system
✅ Events page showing all upcoming events
✅ Event creation for bands and venues
✅ Basic profile viewing
✅ Location-based profile display

### Exclude from MVP (Future Development):
❌ Advanced filters (start with basic search only)
❌ Direct messaging system (implement following first)
❌ Notification system
❌ Event RSVP/ticketing beyond basic attendance counter
❌ Reviews/ratings
❌ Media uploads (audio/video samples)
❌ Calendar integrations
❌ Password reset flow (add after MVP)
❌ Email verification
❌ Venue-specific hero page (use generic for MVP)

---

## 11. Technical Considerations

### Mobile-First Requirements
- Touch-friendly UI (44px minimum tap targets)
- Responsive breakpoints for tablet and desktop
- Fast loading times
- Optimized images
- Native-feeling navigation

### Future Mobile App Conversion
- Component structure compatible with React Native
- No web-specific dependencies that would block conversion
- Follow iOS Human Interface Guidelines
- Follow Material Design for Android
- Prepare for App Store review requirements

### Data Storage Needs
- User profiles
- Event data
- Following relationships
- User locations
- Profile images
- Event images

---

## 12. User Flows

### New User Journey
1. Land on login page
2. Click "Sign Up"
3. Enter email and password
4. Select user role (musician/band/venue)
5. Complete profile setup
6. Arrive at Hero page

### Creating an Event (Band/Venue)
1. Navigate to Profile page
2. Go to Events section
3. Click "Create New Event"
4. Fill out event form
5. Submit event
6. Event appears on Events page for all users

### Finding and Following Musicians
1. From Hero page, browse profile cards
2. Use search bar to find specific users
3. Click on profile card to view full profile
4. Click "Follow" button
5. User added to Following list

---

## 13. Design Notes

### Color Usage
- **Primary Background**: Dark grey (#2a2a2a or similar)
- **Accent/CTAs**: #4caf50 (green)
- **Text**: White/light grey on dark backgrounds
- **Cards**: Slightly lighter grey than background for contrast

### Typography
- Clean, modern sans-serif font
- Clear hierarchy (headings, body, captions)
- Readable font sizes for mobile (16px minimum for body)

### Imagery
- Profile pictures: Circular avatars
- Event pictures: 16:9 or 4:3 aspect ratio cards
- Placeholder images for users without uploaded photos

---

## 14. Future Enhancements (Post-MVP)

### Phase 2
- Direct messaging system
- Notification system
- Advanced filters and sorting
- Password reset flow
- Email verification

### Phase 3
- Audio/video media samples on profiles
- Event RSVP and ticketing
- Reviews and ratings
- Venue-specific hero page
- Calendar integration

### Phase 4
- Native mobile apps (iOS/Android)
- Push notifications
- In-app purchases (premium features)
- Analytics dashboard for venues

---

## 15. Success Metrics

### User Engagement
- Number of active profiles
- Daily/monthly active users
- Average session duration
- Profile completion rate

### Social Interaction
- Follower growth rate
- Profile views
- Event attendance numbers

### Event Performance
- Number of events created per month
- Event attendance rates
- Event discovery (views per event)

---

## 16. Development Phases

### Phase 1: MVP (Weeks 1-4)
- Authentication system
- Profile creation and viewing
- Hero page with profile cards
- Basic search
- Following system
- Events page and creation

### Phase 2: Social Features (Weeks 5-6)
- Direct messaging
- Notifications
- Advanced filters

### Phase 3: Polish & Enhancement (Weeks 7-8)
- Refined UI/UX
- Performance optimization
- Bug fixes
- User testing feedback implementation

### Phase 4: Mobile Preparation (Weeks 9-10)
- Mobile app conversion
- App store submission preparation
- Final testing

---

## 17. Notes & Considerations

- All timestamps should show "last active" for user activity tracking
- Location should support address autocomplete for easy input
- Profile pictures should have size limits and compression
- Event images should have recommended dimensions
- Consider rate limiting for event creation to prevent spam
- Implement soft delete for events (archive rather than permanent delete)
- User blocking/reporting system for safety (add in Phase 2)

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Ready for Development