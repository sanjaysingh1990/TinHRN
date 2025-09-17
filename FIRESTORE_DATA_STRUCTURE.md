# Scalable Firestore Data Structure for TiNHRn Application

This document outlines a scalable Firestore data structure for the TiNHRn application that optimizes read/write operations to minimize costs while maintaining data integrity and performance.

## 1. Overview

The structure is designed with the following principles:
- Minimize document reads by structuring data to reduce the need for multiple queries
- Use subcollections for related data that is frequently accessed together
- Denormalize data where appropriate to avoid expensive joins
- Structure data to support common app queries efficiently
- Separate frequently updated data from static data

## 2. Collections Structure

### 2.1 Users Collection
```
/users/{userId}
```

**Document Structure:**
```javascript
{
  id: string,                      // User ID (same as document ID)
  name: string,                    // User's full name
  email: string,                   // User's email
  phoneNumber: string,             // User's phone number
  photoURL: string,                // URL to user's profile picture
  emailVerified: boolean,          // Whether email is verified
  createdAt: timestamp,            // Account creation timestamp
  updatedAt: timestamp,            // Last update timestamp
  lastLoginAt: timestamp,          // Last login timestamp
  preferences: {
    notifications: boolean,        // Notification preference
    darkMode: boolean,             // Dark mode preference
    language: string               // Preferred language
  },
  profile: {
    bio: string,                   // User bio
    location: string,              // User location
    dateOfBirth: timestamp         // User's date of birth
  },
  stats: {
    totalBookings: number,         // Total number of bookings
    totalAchievements: number,     // Total achievements earned
    totalFavorites: number         // Total favorite items
  }
}
```

### 2.2 Tours Collection
```
/tours/{tourId}
```

**Document Structure:**
```javascript
{
  id: string,                      // Tour ID (same as document ID)
  name: string,                    // Tour name
  description: string,             // Detailed tour description
  duration: string,                // Duration (e.g., "14 Days")
  difficulty: string,              // Difficulty level (Easy, Moderate, Challenging)
  altitude: string,                // Maximum altitude (e.g., "4,130m")
  image: string,                   // Main tour image URL
  images: string[],                // Array of additional tour images
  price: {
    standard: number,              // Standard package price
    premium: number                // Premium package price
  },
  location: {
    country: string,               // Country
    region: string,                // Region/state
    coordinates: {
      latitude: number,
      longitude: number
    }
  },
  highlights: string[],            // Key highlights of the tour
  includes: string[],              // What's included in the package
  excludes: string[],              // What's not included
  bestTime: string[],              // Best time to visit
  createdAt: timestamp,            // Creation timestamp
  updatedAt: timestamp,            // Last update timestamp
  rating: number,                  // Average rating (0-5)
  totalReviews: number,            // Total number of reviews
  popularity: number               // Popularity score for sorting
}
```

### 2.3 Bookings Collection
```
/bookings/{bookingId}
```

**Document Structure:**
```javascript
{
  id: string,                      // Booking ID (same as document ID)
  userId: string,                  // Reference to user
  tourId: string,                  // Reference to tour
  tourName: string,                // Tour name (denormalized for quick access)
  bookingReference: string,        // Booking reference number
  startDate: timestamp,            // Start date of tour
  endDate: timestamp,              // End date of tour
  duration: string,                // Duration (e.g., "14 Days")
  status: string,                  // Booking status (confirmed, pending, cancelled)
  totalAmount: number,             // Total amount paid
  currency: string,                // Currency code (e.g., USD)
  packageType: string,             // Package type (standard, premium)
  travelers: number,               // Number of travelers
  createdAt: timestamp,            // Booking creation timestamp
  updatedAt: timestamp,            // Last update timestamp
  payment: {
    method: string,                // Payment method
    status: string,                // Payment status
    transactionId: string          // Transaction ID
  }
}
```

### 2.4 Reviews Subcollection
```
/tours/{tourId}/reviews/{reviewId}
```

**Document Structure:**
```javascript
{
  id: string,                      // Review ID (same as document ID)
  userId: string,                  // Reference to user
  userName: string,                // User name (denormalized)
  userPhotoURL: string,            // User photo URL (denormalized)
  rating: number,                  // Rating (1-5)
  review: string,                  // Review text
  createdAt: timestamp,            // Review creation timestamp
  helpful: number                  // Number of helpful votes
}
```

### 2.5 Categories Collection
```
/categories/{categoryId}
```

**Document Structure:**
```javascript
{
  id: string,                      // Category ID (same as document ID)
  name: string,                    // Category name
  icon: string,                    // Icon name
  color: string,                   // Color code
  type: string,                    // Type (trek, adventure, spiritual, wildlife)
  createdAt: timestamp,            // Creation timestamp
  updatedAt: timestamp             // Last update timestamp
}
```

### 2.6 Destinations Collection
```
/destinations/{destinationId}
```

**Document Structure:**
```javascript
{
  id: string,                      // Destination ID (same as document ID)
  name: string,                    // Destination name
  country: string,                 // Country
  image: string,                   // Main image URL
  rating: number,                  // Average rating (0-5)
  description: string,             // Detailed description
  coordinates: {
    latitude: number,
    longitude: number
  },
  bestTime: string[],              // Best time to visit
  createdAt: timestamp,            // Creation timestamp
  updatedAt: timestamp             // Last update timestamp
}
```

### 2.7 Gallery Collection
```
/gallery/{postId}
```

**Document Structure:**
```javascript
{
  id: string,                      // Post ID (same as document ID)
  userId: string,                  // Reference to user
  userName: string,                // User name (denormalized)
  userAvatar: string,              // User avatar URL (denormalized)
  title: string,                   // Post title
  description: string,             // Post description
  category: string,                // Category name
  categoryId: string,              // Reference to category
  imageUrl: string,                // Main image URL
  viewsCount: number,              // Number of views
  likesCount: number,              // Number of likes
  commentsCount: number,           // Number of comments
  createdAt: timestamp,            // Post creation timestamp
  updatedAt: timestamp,            // Last update timestamp
  tags: string[]                   // Array of tags
}
```

### 2.8 Achievements Collection
```
/achievements/{achievementId}
```

**Document Structure:**
```javascript
{
  id: string,                      // Achievement ID (same as document ID)
  title: string,                   // Achievement title
  description: string,             // Achievement description
  icon: string,                    // Icon name
  color: string,                   // Color code
  points: number,                  // Points awarded
  criteria: {
    type: string,                  // Type of criteria (booking_count, tour_completion, etc.)
    value: number                  // Value needed to unlock
  },
  createdAt: timestamp             // Creation timestamp
}
```

### 2.9 User Achievements Subcollection
```
/users/{userId}/achievements/{achievementId}
```

**Document Structure:**
```javascript
{
  id: string,                      // Achievement ID (same as document ID)
  unlockedAt: timestamp,           // When the achievement was unlocked
  progress: number                 // Progress towards the achievement (0-100)
}
```

### 2.10 User Favorites Subcollection
```
/users/{userId}/favorites/{itemId}
```

**Document Structure:**
```javascript
{
  id: string,                      // Item ID (same as document ID)
  type: string,                    // Type of item (tour, destination, post)
  referenceId: string,             // Reference to the actual item
  addedAt: timestamp,              // When the item was added to favorites
  title: string,                   // Item title (denormalized)
  image: string                    // Item image URL (denormalized)
}
```

### 2.11 Notifications Collection
```
/users/{userId}/notifications/{notificationId}
```

**Document Structure:**
```javascript
{
  id: string,                      // Notification ID (same as document ID)
  title: string,                   // Notification title
  message: string,                 // Notification message
  type: string,                    // Type of notification (booking, guide, offer, etc.)
  read: boolean,                   // Whether notification is read
  createdAt: timestamp,            // Notification creation timestamp
  relatedBookingId: string,        // Related booking ID (if applicable)
  relatedTourId: string            // Related tour ID (if applicable)
}
```

### 2.12 FAQ Collection
```
/faq/{faqId}
```

**Document Structure:**
```javascript
{
  id: string,                      // FAQ ID (same as document ID)
  question: string,                // FAQ question
  answer: string,                  // FAQ answer
  category: string,                // FAQ category
  createdAt: timestamp,            // Creation timestamp
  updatedAt: timestamp,            // Last update timestamp
  helpfulYes: number,              // Number of helpful "yes" votes
  helpfulNo: number                // Number of helpful "no" votes
}
```

## 3. Optimization Strategies

### 3.1 Denormalization
- Store user name and photo in reviews to avoid additional queries
- Store tour name in bookings for quick access
- Store item title and image in user favorites

### 3.2 Subcollections
- Use subcollections for related data that is frequently accessed together:
  - Reviews under tours
  - Achievements under users
  - Favorites under users
  - Notifications under users

### 3.3 Indexing
- Create composite indexes for common query patterns:
  - Tours by popularity and rating
  - Reviews by tour and creation date
  - Bookings by user and date
  - Gallery posts by category and creation date

### 3.4 Aggregation
- Store aggregated data in user documents:
  - Total bookings count
  - Total achievements count
  - Total favorites count

### 3.5 Caching
- Cache frequently accessed data like categories and FAQ
- Use client-side caching for user-specific data

## 4. Sample Data for Quick Access

### 4.1 Sample Users
```javascript
// User document
{
  id: "user_123456",
  name: "John Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  photoURL: "https://example.com/profile.jpg",
  emailVerified: true,
  createdAt: new Date("2024-01-15T10:30:00Z"),
  updatedAt: new Date("2024-01-20T14:45:00Z"),
  lastLoginAt: new Date("2024-01-20T14:45:00Z"),
  preferences: {
    notifications: true,
    darkMode: false,
    language: "en"
  },
  profile: {
    bio: "Adventure enthusiast and mountain lover",
    location: "Kathmandu, Nepal",
    dateOfBirth: new Date("1990-05-15")
  },
  stats: {
    totalBookings: 3,
    totalAchievements: 5,
    totalFavorites: 12
  }
}
```

### 4.2 Sample Tours
```javascript
// Tour document
{
  id: "tour_789012",
  name: "Annapurna Base Camp Trek",
  description: "Experience the beauty of the Annapurna range with stunning mountain views.",
  duration: "14 Days",
  difficulty: "Moderate",
  altitude: "4,130m",
  image: "https://example.com/annapurna.jpg",
  images: [
    "https://example.com/annapurna1.jpg",
    "https://example.com/annapurna2.jpg"
  ],
  price: {
    standard: 1200,
    premium: 1800
  },
  location: {
    country: "Nepal",
    region: "Annapurna Region",
    coordinates: {
      latitude: 28.5306,
      longitude: 83.8795
    }
  },
  highlights: [
    "Stunning mountain views",
    "Traditional villages",
    "Rhododendron forests"
  ],
  includes: [
    "Accommodation",
    "Meals",
    "Experienced guide"
  ],
  excludes: [
    "International flights",
    "Travel insurance"
  ],
  bestTime: ["March", "April", "May", "October", "November"],
  createdAt: new Date("2024-01-10T09:00:00Z"),
  updatedAt: new Date("2024-01-10T09:00:00Z"),
  rating: 4.8,
  totalReviews: 125,
  popularity: 95
}
```

### 4.3 Sample Bookings
```javascript
// Booking document
{
  id: "booking_345678",
  userId: "user_123456",
  tourId: "tour_789012",
  tourName: "Annapurna Base Camp Trek",
  bookingReference: "THB-2024-ABC123",
  startDate: new Date("2024-05-15T00:00:00Z"),
  endDate: new Date("2024-05-29T00:00:00Z"),
  duration: "14 Days",
  status: "confirmed",
  totalAmount: 1200,
  currency: "USD",
  packageType: "standard",
  travelers: 2,
  createdAt: new Date("2024-01-20T15:30:00Z"),
  updatedAt: new Date("2024-01-20T15:30:00Z"),
  payment: {
    method: "credit_card",
    status: "completed",
    transactionId: "txn_987654321"
  }
}
```

### 4.4 Sample Categories
```javascript
// Category document
{
  id: "cat_111111",
  name: "Treks",
  icon: "terrain",
  color: "#4CAF50",
  type: "trek",
  createdAt: new Date("2024-01-01T00:00:00Z"),
  updatedAt: new Date("2024-01-01T00:00:00Z")
}
```

### 4.5 Sample Reviews Dataset

For development and testing purposes, two sample datasets are available:

1. **Integrated Dataset**: [TOURS_WITH_REVIEWS.json](TOURS_WITH_REVIEWS.json) - Contains 20 trekking tours with embedded reviews (1-5 reviews per tour)

2. **Separate Dataset**: [TOUR_REVIEWS.json](TOUR_REVIEWS.json) - Contains reviews organized by tour ID as subcollections in the proper format for Firestore:
   ```
   Query subcollection `/tours/{tourId}/reviews` with reviews format {
     id: string,                      // Review ID (same as document ID)
     userId: string,                  // Reference to user
     userName: string,                // User name (denormalized)
     userPhotoURL: string,            // User photo URL (denormalized)
     rating: number,                  // Rating (1-5)
     review: string,                  // Review text
     createdAt: timestamp,            // Review creation timestamp
     helpful: number                  // Number of helpful votes
   }
   ```

## 5. Query Patterns and Optimization

### 5.1 User Profile
- Single document read from `/users/{userId}`

### 5.2 Tour Listings
- Query tours collection with filters and sorting
- Use indexes for efficient sorting by popularity, rating, etc.

### 5.3 User Bookings
- Query subcollection `/users/{userId}/bookings` with status filters

### 5.4 Tour Reviews
- Query subcollection `/tours/{tourId}/reviews` with pagination

### 5.5 User Favorites
- Query subcollection `/users/{userId}/favorites` for quick access

### 5.6 Gallery Posts
- Query gallery collection with category filters and pagination

## 6. Cost Optimization Tips

1. **Batch Operations**: Use batched writes for related updates
2. **Pagination**: Implement pagination for large result sets
3. **Caching**: Cache frequently accessed data on the client
4. **Selective Fields**: Only fetch required fields using field masks
5. **Composite Indexes**: Create indexes for common query patterns
6. **Data Archiving**: Archive old data to reduce active document count

This structure provides a scalable foundation for the TiNHRn application while minimizing Firestore read/write costs through thoughtful data organization and optimization strategies.