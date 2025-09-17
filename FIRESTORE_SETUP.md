# Firestore Setup and Data Structure

This document explains how to set up Firestore for the TiNHRn application with the optimized data structure and sample data.

## 1. Firestore Data Structure

The application uses a carefully designed Firestore structure to optimize read/write operations and minimize costs. The structure includes:

1. **Users Collection** - Stores user profile information
2. **Tours Collection** - Contains tour details and metadata
3. **Categories Collection** - Tour categories for filtering
4. **Achievements Collection** - Available achievements in the system
5. **FAQ Collection** - Frequently asked questions
6. **Destinations Collection** - Popular destinations
7. **Gallery Collection** - User-generated content
8. **Subcollections** - Related data stored under parent documents for efficiency

For detailed information about the data structure, see [FIRESTORE_DATA_STRUCTURE.md](FIRESTORE_DATA_STRUCTURE.md).

## 2. Sample Data

Sample data is provided in [FIRESTORE_SAMPLE_DATA.json](FIRESTORE_SAMPLE_DATA.json) to help you quickly populate your Firestore database for development and testing.

## 3. Importing Sample Data

To import the sample data into your Firestore database:

### 3.1 Prerequisites

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Log in to Firebase:
   ```bash
   firebase login
   ```

### 3.2 Update Firebase Configuration

Before running the import script, make sure to update the Firebase configuration in [scripts/importFirestoreData.js](scripts/importFirestoreData.js) with your actual Firebase project credentials.

### 3.3 Run the Import Script

```bash
node scripts/importFirestoreData.js
```

The script will import all sample data into your Firestore database.

### 3.4 Importing Tours with Reviews

For a more comprehensive dataset, you can also import 20 trekking tours with their reviews:

1. Run the tours and reviews import script:
   ```bash
   node scripts/importToursWithReviews.js
   ```

This script imports both tours and their embedded reviews from [TOURS_WITH_REVIEWS.json](TOURS_WITH_REVIEWS.json).

### 3.5 Importing Reviews Separately

If you prefer to manage reviews as a separate dataset:

1. Run the separate reviews import script:
   ```bash
   node scripts/importTourReviews.js
   ```

This script imports reviews from [TOUR_REVIEWS.json](TOUR_REVIEWS.json) as subcollections under existing tours.

## 4. Data Access Patterns

The Firestore structure is optimized for the following common access patterns in the application:

### 4.1 User Profile
- Single document read from `/users/{userId}`
- Includes denormalized data to minimize additional queries

### 4.2 Tour Listings
- Collection query with filters and sorting
- Uses indexes for efficient performance

### 4.3 User Bookings
- Subcollection query `/users/{userId}/bookings`
- Status-based filtering for upcoming/past bookings

### 4.4 Tour Reviews
- Subcollection query `/tours/{tourId}/reviews`
- Pagination support for large review sets

### 4.5 User Favorites
- Subcollection query `/users/{userId}/favorites`
- Quick access to user's favorite items

## 5. Optimization Strategies

### 5.1 Denormalization
- Store frequently accessed related data directly in documents
- Example: User name and photo in reviews to avoid additional queries

### 5.2 Subcollections
- Use subcollections for related data accessed together
- Improves query performance and reduces document reads

### 5.3 Aggregation
- Store aggregated data in user documents (booking counts, achievement counts)
- Reduces need for expensive count queries

### 5.4 Indexing
- Create composite indexes for common query patterns
- Improves query performance for sorted and filtered data

## 6. Cost Optimization Tips

1. **Batch Operations** - Use batched writes for related updates
2. **Pagination** - Implement pagination for large result sets
3. **Caching** - Cache frequently accessed data on the client
4. **Selective Fields** - Only fetch required fields using field masks
5. **Composite Indexes** - Create indexes for common query patterns
6. **Data Archiving** - Archive old data to reduce active document count

## 7. Security Rules

For development, you can use these basic Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read tours, categories, achievements, FAQ, destinations, and gallery
    match /tours/{tourId} {
      allow read: if request.auth != null;
    }
    
    match /categories/{categoryId} {
      allow read: if request.auth != null;
    }
    
    match /achievements/{achievementId} {
      allow read: if request.auth != null;
    }
    
    match /faq/{faqId} {
      allow read: if request.auth != null;
    }
    
    match /destinations/{destinationId} {
      allow read: if request.auth != null;
    }
    
    match /gallery/{postId} {
      allow read: if request.auth != null;
    }
    
    // Users can read and write their own bookings
    match /users/{userId}/bookings/{bookingId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read and write their own reviews for tours
    match /tours/{tourId}/reviews/{reviewId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Users can read and write their own achievements
    match /users/{userId}/achievements/{achievementId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read and write their own favorites
    match /users/{userId}/favorites/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read and write their own notifications
    match /users/{userId}/notifications/{notificationId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

For production, you should implement more restrictive rules based on your specific requirements.

## 8. Monitoring and Maintenance

1. **Monitor Usage** - Use Firebase Console to monitor read/write operations
2. **Optimize Queries** - Regularly review and optimize expensive queries
3. **Update Indexes** - Add indexes as new query patterns emerge
4. **Archive Data** - Implement data archiving for old bookings and notifications