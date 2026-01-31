# BandScope - Navigation Flow & Sitemap

## Table of Contents
1. [Complete Sitemap](#complete-sitemap)
2. [User Flow: New User Signup](#user-flow-new-user-signup)
3. [User Flow: Musician/Band Finding & Following](#user-flow-musicianband-finding--following)
4. [User Flow: Event Creation (Band/Venue)](#user-flow-event-creation-bandvenue)
5. [User Flow: Event Discovery](#user-flow-event-discovery)
6. [Navigation Structure by User Type](#navigation-structure-by-user-type)

---

## Complete Sitemap

```mermaid
graph TD
    A[Login/Signup Page] --> B{User Type?}
    
    B -->|Musician| C[Musician Hero Page]
    B -->|Band| D[Band Hero Page]
    B -->|Venue| E[Venue Hero Page - TBD]
    
    C --> F[Search & Filter]
    D --> F
    E --> F
    
    C --> G[My Profile Page]
    D --> G
    E --> G
    
    C --> H[Events Page]
    D --> H
    E --> H
    
    C --> I[Other User Profile View]
    D --> I
    E --> I
    
    G --> J[Edit Profile]
    G --> K[Settings]
    G --> L[My Events - Band/Venue Only]
    
    K --> M[Notification Settings]
    K --> N[Password Reset]
    K --> O[Account Settings]
    
    L --> P[Create New Event]
    L --> Q[Edit Event]
    L --> R[Delete Event]
    
    H --> S[Event Detail View]
    S --> T[Attendance Counter]
    
    I --> U[Follow Button]
    I --> V[Message Button - Future]
    
    F --> W[Filter Panel]
    W --> X[Age Filter]
    W --> Y[Genre Filter]
    W --> Z[Location Radius]
    W --> AA[Instrument Filter]
    W --> AB[Seeking Filter]
    
    F --> AC[Sort Options]
    AC --> AD[Newest]
    AC --> AE[Closest]
    AC --> AF[Last Active]
```

---

## User Flow: New User Signup

```mermaid
graph TD
    Start([User Opens App]) --> Login[Login Page]
    Login --> SignupClick{Click Sign Up}
    
    SignupClick --> EmailPass[Enter Email & Password]
    EmailPass --> Submit[Submit Registration]
    
    Submit --> RoleSelect[Select User Role]
    RoleSelect --> Musician{Musician?}
    RoleSelect --> Band{Band?}
    RoleSelect --> Venue{Venue?}
    
    Musician --> MusicianSetup[Musician Profile Setup]
    Band --> BandSetup[Band Profile Setup]
    Venue --> VenueSetup[Venue Profile Setup]
    
    MusicianSetup --> FillProfile1[Fill Required Fields:<br/>Name, Location, Age,<br/>Genres, Instruments,<br/>Seeking]
    BandSetup --> FillProfile2[Fill Required Fields:<br/>Name, Location,<br/>Members & Ages,<br/>Genres, Seeking]
    VenueSetup --> FillProfile3[Fill Required Fields:<br/>Name, Location,<br/>Bio, Links]
    
    FillProfile1 --> OptionalInfo[Add Optional Info:<br/>Bio, Links, Photo,<br/>Influences]
    FillProfile2 --> OptionalInfo
    FillProfile3 --> OptionalInfo
    
    OptionalInfo --> Complete[Complete Setup]
    
    Complete --> MusicianHero[Musician/Band Hero Page]
    Complete --> VenueHero[Venue Hero Page - TBD]
    
    MusicianHero --> End([Start Using App])
    VenueHero --> End
```

---

## User Flow: Musician/Band Finding & Following

```mermaid
graph TD
    Start([User on Hero Page]) --> Browse{How to Find?}
    
    Browse -->|Scroll Feed| ViewCards[View Profile Cards]
    Browse -->|Search| SearchBar[Use Search Bar]
    Browse -->|Filter| FilterBtn[Click Filter Button]
    
    SearchBar --> TypeSearch[Type Name/Location]
    TypeSearch --> Results[View Search Results]
    
    FilterBtn --> FilterPanel[Open Filter Panel]
    FilterPanel --> SelectFilters[Select Filters:<br/>Age, Genre, Location,<br/>Instrument, Seeking]
    SelectFilters --> ApplyFilters[Apply Filters]
    ApplyFilters --> FilteredResults[View Filtered Results]
    
    ViewCards --> ClickCard{Click Profile Card}
    Results --> ClickCard
    FilteredResults --> ClickCard
    
    ClickCard --> ProfileView[View Full Profile Page]
    
    ProfileView --> Actions{User Action?}
    
    Actions -->|Follow| FollowUser[Click Follow Button]
    Actions -->|Message| MessageUser[Click Message - Future]
    Actions -->|Go Back| BackToFeed[Return to Hero Page]
    
    FollowUser --> UpdateFollow[Following Count Updates]
    UpdateFollow --> ProfileView
    
    MessageUser --> DMThread[Open DM Thread - Future]
    
    BackToFeed --> Start
```

---

## User Flow: Event Creation (Band/Venue)

```mermaid
graph TD
    Start([Band/Venue User<br/>on Profile Page]) --> EventsTab[Click Events Tab]
    
    EventsTab --> EventsList[View My Events:<br/>Past & Upcoming]
    
    EventsList --> CreateBtn[Click Create New Event]
    
    CreateBtn --> EventForm[Event Creation Form]
    
    EventForm --> FillDetails[Fill Event Details:<br/>- Event Picture<br/>- Event Name<br/>- Location<br/>- Date & Time<br/>- Price<br/>- Description]
    
    FillDetails --> Review[Review Event Info]
    
    Review --> Valid{All Required<br/>Fields Complete?}
    
    Valid -->|No| Error[Show Error Message]
    Error --> FillDetails
    
    Valid -->|Yes| Submit[Submit Event]
    
    Submit --> Published[Event Published]
    
    Published --> ShowOnProfile[Event Appears on<br/>Profile Events List]
    Published --> ShowOnEvents[Event Appears on<br/>Public Events Page]
    
    ShowOnProfile --> End([Event Live])
    ShowOnEvents --> End
    
    EventsList --> ManageEvent{Manage Existing Event}
    ManageEvent --> EditEvent[Edit Event]
    ManageEvent --> DeleteEvent[Delete Event]
    
    EditEvent --> EventForm
    DeleteEvent --> Confirm{Confirm Delete?}
    Confirm -->|Yes| Remove[Event Removed]
    Confirm -->|No| EventsList
```

---

## User Flow: Event Discovery

```mermaid
graph TD
    Start([User Opens App]) --> NavToEvents[Navigate to Events Page]
    
    NavToEvents --> EventsFeed[View All Upcoming Events]
    
    EventsFeed --> Browse{Browse Events}
    
    Browse --> ScrollList[Scroll Through Event List]
    Browse --> ClickEvent[Click Event Card]
    
    ScrollList --> ClickEvent
    
    ClickEvent --> EventDetail[View Event Detail]
    
    EventDetail --> ViewInfo[See Event Info:<br/>- Picture<br/>- Name<br/>- Location<br/>- Date/Time<br/>- Price<br/>- Description<br/>- Attendee Count]
    
    ViewInfo --> Actions{User Actions}
    
    Actions --> MoreInfo[Click More Info]
    Actions --> ViewVenue[View Venue Profile]
    Actions --> GoBack[Return to Events Page]
    
    MoreInfo --> FullDetails[See Full Event Details]
    ViewVenue --> VenueProfile[Navigate to Venue Profile]
    
    VenueProfile --> FollowVenue{Follow Venue?}
    FollowVenue -->|Yes| Follow[Click Follow]
    Follow --> Notifications[Receive Future Event Notifications]
    
    GoBack --> EventsFeed
```

---

## Navigation Structure by User Type

### Musician Navigation

```mermaid
graph LR
    A[Hero Page<br/>Profile Feed] --> B[My Profile]
    A --> C[Events Page]
    A --> D[Search & Filter]
    
    B --> E[Edit Profile]
    B --> F[Settings]
    
    F --> G[Notifications]
    F --> H[Password]
    F --> I[Account]
    
    D --> J[Filter Panel]
    D --> K[Sort Options]
```

### Band Navigation

```mermaid
graph LR
    A[Hero Page<br/>Profile Feed] --> B[My Profile]
    A --> C[Events Page]
    A --> D[Search & Filter]
    
    B --> E[Edit Profile]
    B --> F[Settings]
    B --> G[My Events]
    
    G --> H[Create Event]
    G --> I[Edit Event]
    G --> J[Delete Event]
    
    F --> K[Notifications]
    F --> L[Password]
    F --> M[Account]
    
    D --> N[Filter Panel]
    D --> O[Sort Options]
```

### Venue Navigation

```mermaid
graph LR
    A[Venue Hero Page<br/>TBD Layout] --> B[My Profile]
    A --> C[Events Page]
    A --> D[Search - Optional]
    
    B --> E[Edit Profile]
    B --> F[Settings]
    B --> G[My Events]
    
    G --> H[Create Event]
    G --> I[Edit Event]
    G --> J[Delete Event]
    G --> K[Past Shows]
    G --> L[Upcoming Shows]
    
    F --> M[Notifications]
    F --> N[Password]
    F --> O[Account]
```

---

## Page Transition Matrix

| From Page | To Page | Trigger |
|-----------|---------|---------|
| Login | Hero Page | Successful login |
| Signup | Profile Setup | Account creation |
| Profile Setup | Hero Page | Setup completion |
| Hero Page | Profile View | Click profile card |
| Hero Page | My Profile | Nav button |
| Hero Page | Events Page | Nav button |
| Hero Page | Filter Panel | Filter button |
| Profile View | Hero Page | Back button |
| My Profile | Edit Profile | Edit button |
| My Profile | Settings | Settings button |
| My Profile | My Events | Events tab (Band/Venue only) |
| My Events | Create Event | Create button |
| Events Page | Event Detail | Click event card |
| Event Detail | Venue Profile | Click venue name |

---

## Bottom Navigation Bar (Mobile)

```
┌─────────────────────────────────────┐
│  [Home]  [Events]  [Profile]  [•••] │
└─────────────────────────────────────┘

Home: Hero Page (feed of profiles)
Events: Events Page (all upcoming events)
Profile: My Profile Page
•••: More options (Settings, Logout, etc.)
```

---

## Key Navigation Principles

### 1. **Consistent Navigation**
- Bottom nav bar always visible on mobile
- Top nav/header on desktop
- Maximum 3 taps to reach any page

### 2. **Clear Back Navigation**
- Back buttons on all sub-pages
- Breadcrumb trail on desktop
- Swipe gestures for mobile

### 3. **Contextual Actions**
- Actions appear where relevant
- Follow button on profiles
- Create event from profile events tab
- Edit from within profile view

### 4. **Role-Based Access**
- Musicians: Cannot create events
- Bands: Can create events
- Venues: Can create events + different hero page

### 5. **Search & Discovery**
- Always accessible from hero page
- Persistent search bar
- Quick filters vs. advanced filters

---

## Screen State Management

### Hero Page States
- **Loading**: Skeleton cards while fetching profiles
- **Empty**: No profiles found message
- **Populated**: Grid/list of profile cards
- **Filtered**: Showing filtered results with clear filters button

### Profile Page States
- **Own Profile**: Edit and Settings buttons visible
- **Other's Profile**: Follow and Message buttons visible
- **Loading**: Skeleton layout
- **Not Found**: Profile doesn't exist message

### Events Page States
- **Loading**: Skeleton event cards
- **No Events**: "No upcoming events" message
- **Populated**: List of event cards
- **Past Events**: Separate view/toggle for past events

---

## Future Navigation Additions (Post-MVP)

### Direct Messaging Flow
```mermaid
graph LR
    A[Profile Page] --> B[Message Button]
    B --> C[DM Thread]
    C --> D[Messages List]
    D --> E[Individual Conversation]
```

### Notifications Flow
```mermaid
graph LR
    A[Notification Icon] --> B[Notifications List]
    B --> C{Notification Type}
    C --> D[New Follower - Profile]
    C --> E[New Message - DM Thread]
    C --> F[New Event - Event Detail]
```

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Ready for Development