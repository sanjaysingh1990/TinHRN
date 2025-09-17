#!/usr/bin/env node

/**
 * Script to import tour reviews into Firestore as subcollections
 * 
 * Usage:
 * 1. Make sure you have the Firebase CLI installed: npm install -g firebase-tools
 * 2. Log in to Firebase: firebase login
 * 3. Run this script: node scripts/importTourReviews.js
 */

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Load the reviews data
const reviewsDataPath = path.join(__dirname, '..', 'TOUR_REVIEWS.json');
const reviewsData = JSON.parse(fs.readFileSync(reviewsDataPath, 'utf8'));

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

async function importTourReviews() {
    console.log('Starting Firestore tour reviews import...');

    try {
        // Import tour reviews
        console.log('Importing tour reviews...');
        for (const [tourId, reviews] of Object.entries(reviewsData)) {
            for (const [reviewId, reviewData] of Object.entries(reviews)) {
                // Create a subcollection for reviews under each tour
                await setDoc(doc(collection(db, 'tours', tourId, 'reviews'), reviewId), reviewData);
                console.log(`Added review ${reviewId} to tour ${tourId}`);
            }
        }
        console.log('Tour reviews imported successfully.');

        console.log('All tour reviews imported successfully!');
    } catch (error) {
        console.error('Error importing tour reviews:', error);
    }
}

// Run the import
importTourReviews();