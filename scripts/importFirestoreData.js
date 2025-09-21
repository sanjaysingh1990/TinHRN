#!/usr/bin/env node

/**
 * Script to import sample data into Firestore
 * 
 * Usage:
 * 1. Make sure you have the Firebase CLI installed: npm install -g firebase-tools
 * 2. Log in to Firebase: firebase login
 * 3. Run this script: node scripts/importFirestoreData.js
 */

const fs = require('fs');
const path = require('path');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Load the sample data
const sampleDataPath = path.join(__dirname, '..', 'FIRESTORE_SAMPLE_DATA.json');
const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));

// Use the centralized Firebase configuration
const { default: app, firestore } = require('../src/infrastructure/firebase/firebase.config');

// Use the existing Firestore instance
const db = firestore;

async function importData() {
    console.log('Starting Firestore data import...');

    try {
        // Import users
        console.log('Importing users...');
        for (const [userId, userData] of Object.entries(sampleData.users)) {
            await setDoc(doc(collection(db, 'users'), userId), userData);
        }
        console.log('Users imported successfully.');

        // Import tours
        console.log('Importing tours...');
        for (const [tourId, tourData] of Object.entries(sampleData.tours)) {
            await setDoc(doc(collection(db, 'tours'), tourId), tourData);
        }
        console.log('Tours imported successfully.');

        // Import categories
        console.log('Importing categories...');
        for (const [categoryId, categoryData] of Object.entries(sampleData.categories)) {
            await setDoc(doc(collection(db, 'categories'), categoryId), categoryData);
        }
        console.log('Categories imported successfully.');

        // Import achievements
        console.log('Importing achievements...');
        for (const [achievementId, achievementData] of Object.entries(sampleData.achievements)) {
            await setDoc(doc(collection(db, 'achievements'), achievementId), achievementData);
        }
        console.log('Achievements imported successfully.');

        // Import FAQ
        console.log('Importing FAQ...');
        for (const [faqId, faqData] of Object.entries(sampleData.faq)) {
            await setDoc(doc(collection(db, 'faq'), faqId), faqData);
        }
        console.log('FAQ imported successfully.');

        // Import destinations
        console.log('Importing destinations...');
        for (const [destinationId, destinationData] of Object.entries(sampleData.destinations)) {
            await setDoc(doc(collection(db, 'destinations'), destinationId), destinationData);
        }
        console.log('Destinations imported successfully.');

        // Import gallery posts
        console.log('Importing gallery posts...');
        for (const [postId, postData] of Object.entries(sampleData.gallery)) {
            await setDoc(doc(collection(db, 'gallery'), postId), postData);
        }
        console.log('Gallery posts imported successfully.');

        console.log('All data imported successfully!');
    } catch (error) {
        console.error('Error importing data:', error);
    }
}

// Run the import
importData();