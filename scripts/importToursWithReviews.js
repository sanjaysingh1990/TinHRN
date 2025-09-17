#!/usr/bin/env node

/**
 * Script to import 20 tours with reviews into Firestore
 * 
 * Usage:
 * 1. Make sure you have the Firebase CLI installed: npm install -g firebase-tools
 * 2. Log in to Firebase: firebase login
 * 3. Run this script: node scripts/importToursWithReviews.js
 */

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Load the tours and reviews data
const toursDataPath = path.join(__dirname, '..', 'TOURS_WITH_REVIEWS.json');
const toursData = JSON.parse(fs.readFileSync(toursDataPath, 'utf8'));

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyBjcV4BykdV3boinmn_-LQZ4IHgTqUwKvw",
  authDomain: "bubble-2d982.firebaseapp.com",
  projectId: "bubble-2d982",
  storageBucket: "bubble-2d982.appspot.com",
  messagingSenderId: "680561170660",
  appId: "1:680561170660:web:64598540804f465c7274f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importToursWithReviews() {
  console.log('Starting Firestore tours and reviews import...');
  
  try {
    // Import tours
    console.log('Importing tours...');
    for (const [tourId, tourData] of Object.entries(toursData.tours)) {
      await setDoc(doc(collection(db, 'tours'), tourId), tourData);
    }
    console.log('Tours imported successfully.');
    
    // Import tour reviews
    console.log('Importing tour reviews...');
    for (const [tourId, reviews] of Object.entries(toursData.tour_reviews)) {
      for (const [reviewId, reviewData] of Object.entries(reviews)) {
        // Create a subcollection for reviews under each tour
        await setDoc(doc(collection(db, 'tours', tourId, 'reviews'), reviewId), reviewData);
      }
    }
    console.log('Tour reviews imported successfully.');
    
    console.log('All tours and reviews imported successfully!');
  } catch (error) {
    console.error('Error importing tours and reviews:', error);
  }
}

// Run the import
importToursWithReviews();