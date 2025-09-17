# Tour Reviews Dataset Summary

This document summarizes the newly created separate JSON file containing reviews for each tour, organized as subcollections in the proper format for Firestore.

## Files Created

1. **TOUR_REVIEWS.json** - A separate JSON file containing reviews organized by tour ID as subcollections
2. **scripts/importTourReviews.js** - A script to import these reviews into Firestore with the proper subcollection structure
3. **Documentation updates** - Updated FIRESTORE_DATA_STRUCTURE.md and FIRESTORE_SETUP.md to reference the new files

## Tour Reviews Structure

The TOUR_REVIEWS.json file contains reviews organized in the following format:

```
{
  "tour_001": {
    "review_001": {
      "id": "review_001",
      "userId": "user_101",
      "userName": "Sarah Johnson",
      "userPhotoURL": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&ixlib=rb-4.0.3",
      "rating": 5,
      "review": "Absolutely incredible experience! The guides were knowledgeable and the views were breathtaking...",
      "createdAt": {
        "_seconds": 1704886200,
        "_nanoseconds": 0
      },
      "helpful": 24
    },
    // Additional reviews for tour_001...
  },
  "tour_002": {
    // Reviews for tour_002...
  }
  // Additional tours...
}
```

## Firestore Structure

The reviews are organized to match the Firestore subcollection structure:
- Query subcollection `/tours/{tourId}/reviews` with pagination
- Each review document follows the specified format:
  ```
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

## Import Script

The import script (scripts/importTourReviews.js) can be used to import the reviews into Firestore:

```bash
node scripts/importTourReviews.js
```

This script will:
1. Read the TOUR_REVIEWS.json file
2. Create subcollections for reviews under each tour document
3. Import all reviews with the proper Firestore structure

## Usage

To use the separate reviews dataset:

1. Ensure you have tours already imported into Firestore
2. Run the import script:
   ```bash
   node scripts/importTourReviews.js
   ```

This approach allows for:
- Separation of tour data from review data
- Flexibility in managing reviews independently
- Proper Firestore subcollection structure for efficient querying