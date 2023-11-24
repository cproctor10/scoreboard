const os = require('os');
const path = require('path');
const admin = require('firebase-admin'); // Add this line to import the firebase-admin module

let serviceAccountPath = './frontend/src/thescoreboardapp-e8534-firebase-adminsdk-3xxuw-21a3cc81ee.json';

const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://thescoreboardapp-e8534-default-rtdb.firebaseio.com', // Replace with your Firebase project URL
});

// Import the functions you need from the SDKs
const { get, getDatabase, ref, push, set } = require("firebase/database");
const { initializeApp } = require("firebase/app");
const fetch = require('isomorphic-fetch');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6f94-MMgd79UPR5TGYn3K_V8mUEZPpbw",
    authDomain: "thescoreboardapp-e8534.firebaseapp.com",
    projectId: "thescoreboardapp-e8534",
    storageBucket: "thescoreboardapp-e8534.appspot.com",
    messagingSenderId: "393453093241",
    appId: "1:393453093241:web:28430c542ec9a783e4afa8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database
const db = getDatabase(app);

// PlayerServices class to handle player data operations
export default class PlayerServices {

    // Method to fetch all NFL players from the API
    async getAllPlayers() {
        try {
            const response = await fetch(`https://api.sleeper.app/v1/players/nfl`);
            if (!response.ok) {
                throw new Error(`Error fetching all NFL players: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            throw new Error(`Error fetching all NFL players: ${error.message}`);
        }
    }

    // Method to fetch player data by Sleeper ID (placeholder)
    async getPlayerBySleeperId() {
        // Implementation for fetching player by Sleeper ID
    }

    // Method to fetch and save all NFL players to Firebase, called once a day
    async createAllSleeperPlayers() {
        try {
            // Fetch current NFL players data
            const playersData = await this.getAllPlayers();

            // Format today's date
            var today = new Date();
            const datePath = `${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`; // Month is 0-indexed

            // Reference to save players in Firebase Realtime Database
            const playersRef = ref(db, `AllNFLPlayers/${datePath}`);

            // Save players data to Firebase, overwriting existing data
            await set(playersRef, playersData);
            console.log('NFL players data updated successfully.');

        } catch (error) {
            console.error(`Error in createAllSleeperPlayers: ${error.message}`);
        }
    }
}
