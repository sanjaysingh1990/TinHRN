import { collection, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../infrastructure/firebase/firebase.config';

// Sample tour data
const sampleTours = {
  "tour_001": {
    "id": "tour_001",
    "name": "Annapurna Base Camp Trek",
    "description": "Experience the beauty of the Annapurna range with stunning mountain views. This 14-day trek takes you through rhododendron forests, traditional Gurung villages, and offers breathtaking views of the Annapurna massif.",
    "duration": "14 Days",
    "difficulty": "Moderate",
    "altitude": "4,130m",
    "image": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    "price": {
      "standard": 1200,
      "premium": 1800
    },
    "location": {
      "country": "Nepal",
      "region": "Annapurna Region",
      "coordinates": {
        "latitude": 28.5306,
        "longitude": 83.8795
      }
    },
    "highlights": [
      "Stunning mountain views",
      "Traditional villages",
      "Rhododendron forests",
      "Cultural immersion"
    ],
    "includes": [
      "Accommodation during trek",
      "All meals (breakfast, lunch, dinner)",
      "Experienced English-speaking guide",
      "Porter service (1 porter for 2 guests)",
      "All necessary permits",
      "First aid kit"
    ],
    "excludes": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Alcoholic beverages"
    ],
    "bestTime": ["March", "April", "May", "October", "November"],
    "createdAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "updatedAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "rating": 4.8,
    "totalReviews": 125,
    "popularity": 95
  },
  "tour_002": {
    "id": "tour_002",
    "name": "Everest Base Camp Trek",
    "description": "The ultimate Himalayan adventure to the base of the world's highest mountain. This challenging 16-day trek offers unparalleled views and a true test of endurance.",
    "duration": "16 Days",
    "difficulty": "Challenging",
    "altitude": "5,364m",
    "image": "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    "price": {
      "standard": 1500,
      "premium": 2200
    },
    "location": {
      "country": "Nepal",
      "region": "Khumbu Region",
      "coordinates": {
        "latitude": 27.9881,
        "longitude": 86.925
      }
    },
    "highlights": [
      "Base of the world's highest mountain",
      "Sherpa culture",
      "Tenzing-Hillary Airport",
      "Namche Bazaar"
    ],
    "includes": [
      "Accommodation during trek",
      "All meals (breakfast, lunch, dinner)",
      "Experienced English-speaking guide",
      "Porter service (1 porter for 2 guests)",
      "All necessary permits",
      "First aid kit",
      "Oxygen kit"
    ],
    "excludes": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Alcoholic beverages"
    ],
    "bestTime": ["March", "April", "May", "September", "October", "November"],
    "createdAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "updatedAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "rating": 4.9,
    "totalReviews": 210,
    "popularity": 98
  },
  "tour_003": {
    "id": "tour_003",
    "name": "Langtang Valley Trek",
    "description": "A beautiful and less crowded trek through the Langtang region with stunning mountain views and rich cultural experiences.",
    "duration": "12 Days",
    "difficulty": "Moderate",
    "altitude": "3,700m",
    "image": "https://images.unsplash.com/photo-1604537529428-15bc512c298a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [
      "https://images.unsplash.com/photo-1604537529428-15bc512c298a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    "price": {
      "standard": 950,
      "premium": 1400
    },
    "location": {
      "country": "Nepal",
      "region": "Langtang Region",
      "coordinates": {
        "latitude": 28.212,
        "longitude": 85.597
      }
    },
    "highlights": [
      "Less crowded trek",
      "Beautiful valley scenery",
      "Traditional Tamang culture",
      "Kyanjin Gompa monastery"
    ],
    "includes": [
      "Accommodation during trek",
      "All meals (breakfast, lunch, dinner)",
      "Experienced English-speaking guide",
      "Porter service (1 porter for 2 guests)",
      "All necessary permits",
      "First aid kit"
    ],
    "excludes": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Alcoholic beverages"
    ],
    "bestTime": ["March", "April", "May", "October", "November"],
    "createdAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "updatedAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "rating": 4.6,
    "totalReviews": 87,
    "popularity": 78
  },
  "tour_004": {
    "id": "tour_004",
    "name": "Manaslu Circuit Trek",
    "description": "An adventurous trek around the eighth highest mountain in the world, offering diverse landscapes and authentic Tibetan culture.",
    "duration": "18 Days",
    "difficulty": "Challenging",
    "altitude": "5,106m",
    "image": "https://images.unsplash.com/photo-1542395975-16a58c6b68f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [
      "https://images.unsplash.com/photo-1542395975-16a58c6b68f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    "price": {
      "standard": 1400,
      "premium": 2000
    },
    "location": {
      "country": "Nepal",
      "region": "Manaslu Region",
      "coordinates": {
        "latitude": 28.548,
        "longitude": 84.552
      }
    },
    "highlights": [
      "Remote and pristine landscapes",
      "Tibetan Buddhist culture",
      "Larkya La Pass",
      "Authentic village experiences"
    ],
    "includes": [
      "Accommodation during trek",
      "All meals (breakfast, lunch, dinner)",
      "Experienced English-speaking guide",
      "Porter service (1 porter for 2 guests)",
      "All necessary permits",
      "First aid kit"
    ],
    "excludes": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Alcoholic beverages"
    ],
    "bestTime": ["March", "April", "May", "September", "October", "November"],
    "createdAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "updatedAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "rating": 4.7,
    "totalReviews": 92,
    "popularity": 82
  },
  "tour_005": {
    "id": "tour_005",
    "name": "Gokyo Lakes Trek",
    "description": "A spectacular trek to the turquoise Gokyo Lakes with panoramic views of Everest, Lhotse, and Makalu from Gokyo Ri.",
    "duration": "15 Days",
    "difficulty": "Moderate",
    "altitude": "5,357m",
    "image": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    "price": {
      "standard": 1300,
      "premium": 1900
    },
    "location": {
      "country": "Nepal",
      "region": "Khumbu Region",
      "coordinates": {
        "latitude": 27.983,
        "longitude": 86.822
      }
    },
    "highlights": [
      "Turquoise Gokyo Lakes",
      "Panoramic mountain views from Gokyo Ri",
      "Alternative to Everest Base Camp",
      "Renjo La Pass"
    ],
    "includes": [
      "Accommodation during trek",
      "All meals (breakfast, lunch, dinner)",
      "Experienced English-speaking guide",
      "Porter service (1 porter for 2 guests)",
      "All necessary permits",
      "First aid kit"
    ],
    "excludes": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Alcoholic beverages"
    ],
    "bestTime": ["March", "April", "May", "September", "October", "November"],
    "createdAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "updatedAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "rating": 4.8,
    "totalReviews": 76,
    "popularity": 85
  },
  "tour_006": {
    "id": "tour_006",
    "name": "Upper Mustang Trek",
    "description": "A unique journey through the ancient Kingdom of Mustang with its desert landscapes, ancient monasteries, and Tibetan culture.",
    "duration": "17 Days",
    "difficulty": "Challenging",
    "altitude": "3,800m",
    "image": "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    "price": {
      "standard": 1600,
      "premium": 2300
    },
    "location": {
      "country": "Nepal",
      "region": "Mustang Region",
      "coordinates": {
        "latitude": 29.093,
        "longitude": 83.867
      }
    },
    "highlights": [
      "Ancient Kingdom of Mustang",
      "Desert landscapes",
      "Tibetan Buddhist monasteries",
      "Lo Manthang walled city"
    ],
    "includes": [
      "Accommodation during trek",
      "All meals (breakfast, lunch, dinner)",
      "Experienced English-speaking guide",
      "Porter service (1 porter for 2 guests)",
      "All necessary permits",
      "First aid kit"
    ],
    "excludes": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Alcoholic beverages"
    ],
    "bestTime": ["March", "April", "May", "September", "October", "November"],
    "createdAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "updatedAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "rating": 4.9,
    "totalReviews": 68,
    "popularity": 75
  },
  "tour_007": {
    "id": "tour_007",
    "name": "Kanchenjunga Base Camp Trek",
    "description": "An adventurous trek to the base of the third highest mountain in the world, through remote wilderness and diverse ethnic communities.",
    "duration": "22 Days",
    "difficulty": "Extreme",
    "altitude": "5,143m",
    "image": "https://images.unsplash.com/photo-1604537529428-15bc512c298a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [
      "https://images.unsplash.com/photo-1604537529428-15bc512c298a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    "price": {
      "standard": 1800,
      "premium": 2600
    },
    "location": {
      "country": "Nepal",
      "region": "Kanchenjunga Region",
      "coordinates": {
        "latitude": 27.721,
        "longitude": 88.171
      }
    },
    "highlights": [
      "Base of third highest mountain",
      "Remote wilderness",
      "Diverse ethnic communities",
      "Rich biodiversity"
    ],
    "includes": [
      "Accommodation during trek",
      "All meals (breakfast, lunch, dinner)",
      "Experienced English-speaking guide",
      "Porter service (1 porter for 2 guests)",
      "All necessary permits",
      "First aid kit"
    ],
    "excludes": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Alcoholic beverages"
    ],
    "bestTime": ["March", "April", "May", "September", "October", "November"],
    "createdAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "updatedAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "rating": 4.8,
    "totalReviews": 45,
    "popularity": 70
  },
  "tour_008": {
    "id": "tour_008",
    "name": "Makalu Base Camp Trek",
    "description": "A challenging trek to the base of the fifth highest mountain in the world through the pristine Barun Valley.",
    "duration": "24 Days",
    "difficulty": "Extreme",
    "altitude": "5,000m",
    "image": "https://images.unsplash.com/photo-1542395975-16a58c6b68f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [
      "https://images.unsplash.com/photo-1542395975-16a58c6b68f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    "price": {
      "standard": 1900,
      "premium": 2700
    },
    "location": {
      "country": "Nepal",
      "region": "Makalu Region",
      "coordinates": {
        "latitude": 27.894,
        "longitude": 87.052
      }
    },
    "highlights": [
      "Base of fifth highest mountain",
      "Prinstine Barun Valley",
      "Shipton La pass",
      "Remote wilderness experience"
    ],
    "includes": [
      "Accommodation during trek",
      "All meals (breakfast, lunch, dinner)",
      "Experienced English-speaking guide",
      "Porter service (1 porter for 2 guests)",
      "All necessary permits",
      "First aid kit"
    ],
    "excludes": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Alcoholic beverages"
    ],
    "bestTime": ["March", "April", "May", "September", "October", "November"],
    "createdAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "updatedAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "rating": 4.7,
    "totalReviews": 38,
    "popularity": 65
  },
  "tour_009": {
    "id": "tour_009",
    "name": "Poon Hill Trek",
    "description": "A short and accessible trek with spectacular sunrise views over the Annapurna range from Poon Hill.",
    "duration": "5 Days",
    "difficulty": "Easy",
    "altitude": "3,210m",
    "image": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    "price": {
      "standard": 600,
      "premium": 900
    },
    "location": {
      "country": "Nepal",
      "region": "Annapurna Region",
      "coordinates": {
        "latitude": 28.423,
        "longitude": 83.726
      }
    },
    "highlights": [
      "Spectacular sunrise views",
      "Accessible for beginners",
      "Traditional Gurung villages",
      "Short duration"
    ],
    "includes": [
      "Accommodation during trek",
      "All meals (breakfast, lunch, dinner)",
      "Experienced English-speaking guide",
      "Porter service (1 porter for 2 guests)",
      "All necessary permits",
      "First aid kit"
    ],
    "excludes": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Alcoholic beverages"
    ],
    "bestTime": ["March", "April", "May", "October", "November"],
    "createdAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "updatedAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "rating": 4.5,
    "totalReviews": 142,
    "popularity": 90
  },
  "tour_010": {
    "id": "tour_010",
    "name": "Mardi Himal Trek",
    "description": "A beautiful trek offering close-up views of Machapuchare and Annapurna South with fewer crowds than other Annapurna treks.",
    "duration": "7 Days",
    "difficulty": "Moderate",
    "altitude": "4,500m",
    "image": "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    "price": {
      "standard": 750,
      "premium": 1100
    },
    "location": {
      "country": "Nepal",
      "region": "Annapurna Region",
      "coordinates": {
        "latitude": 28.476,
        "longitude": 83.852
      }
    },
    "highlights": [
      "Close-up mountain views",
      "Fewer crowds",
      "Rhododendron forests",
      "Accessible alternative trek"
    ],
    "includes": [
      "Accommodation during trek",
      "All meals (breakfast, lunch, dinner)",
      "Experienced English-speaking guide",
      "Porter service (1 porter for 2 guests)",
      "All necessary permits",
      "First aid kit"
    ],
    "excludes": [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Alcoholic beverages"
    ],
    "bestTime": ["March", "April", "May", "October", "November"],
    "createdAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "updatedAt": {
      "_seconds": 1704886200,
      "_nanoseconds": 0
    },
    "rating": 4.6,
    "totalReviews": 98,
    "popularity": 80
  }
};

async function populateTours() {
  try {
    const toursCollection = collection(firestore, 'tours');
    
    // Add each tour to Firestore
    for (const [tourId, tourData] of Object.entries(sampleTours)) {
      const tourRef = doc(toursCollection, tourId);
      await setDoc(tourRef, tourData);
      console.log(`Added tour: ${tourData.name}`);
    }
    
    console.log('All tours have been added to Firestore successfully!');
  } catch (error) {
    console.error('Error populating tours:', error);
  }
}

// Run the function
populateTours();