const os = require('os');
const path = require('path');
const admin = require('firebase-admin'); // Add this line to import the firebase-admin module

let serviceAccountPath;

// Check the computer's hostname or any other condition
if (os.hostname() === 'Charless-MBP-2') {
  serviceAccountPath = '/Users/charlesproctor/Desktop/scoreboard/thescoreboardapp-e8534-firebase-adminsdk-3xxuw-21a3cc81ee.json';
} else {
  serviceAccountPath = '/Users/charlpro/Downloads/thescoreboardapp-e8534-firebase-adminsdk-3xxuw-b6377f9ec1.json';
}

const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://thescoreboardapp-e8534-default-rtdb.firebaseio.com', // Replace with your Firebase project URL
});

// Import the functions you need from the SDKs
const { get, getDatabase, ref, push, set } = require("firebase/database");
const { initializeApp } = require("firebase/app");
const fetch = require('isomorphic-fetch');
const readline = require('readline');

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

// Create an interface for reading input from the user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// Function to fetch user ID from Sleeper API based on the username
async function fetchUserId(username) {
  try {
    const response = await fetch(`https://api.sleeper.app/v1/user/${username}`);
    
    // Check if the response is successful; if not, throw an error
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Bad response from server: ${response.statusText} - ${errorText}`);
    }

    // Parse the response as JSON and return the user ID
    const user = await response.json();
    return user.user_id;
  } catch (error) {
    // If any error occurs during the process, throw an error with a descriptive message
    throw new Error(`Error fetching user ID: ${error.message}`);
  }
}


// Function to fetch user leagues from Sleeper API based on the user ID
async function fetchUserLeagues(userId) {
  try {
    console.log(`Fetching leagues for user ID: ${userId}`);
    const response = await fetch(`https://api.sleeper.app/v1/user/${userId}/leagues/nfl/2023`);


    // Check if the response is successful; if not, throw an error
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Bad response from server: ${response.statusText} - ${errorText}`);
    }

    // Parse the response as JSON and log the fetched leagues
    const leagues = await response.json();
    console.log(`Leagues fetched successfully: ${JSON.stringify(leagues)}`);

    // Save leagues to Firebase Realtime Database
    const leaguesRef = ref(db, `users/${userId}/leagues`); // Adjust the path as needed
    await set(leaguesRef, leagues);

    console.log(`Leagues saved to the database.`);

    // Log a message if no leagues are found
    if (!leagues || !Array.isArray(leagues) || leagues.length === 0) {
      console.log(`No leagues found for user ID: ${userId}`);
      return [];
    }

    // Return the fetched leagues
    return leagues;
  } catch (error) {
    // If any error occurs during the process, log an error and re-throw it
    console.error(`Error fetching user leagues: ${error.message}`);
    throw error;
  }
}


// Function to fetch the current week from Sleeper API
async function fetchCurrentWeek() {
  try {
    const response = await fetch("https://api.sleeper.app/v1/state/nfl");
    
    // Check if the response is successful; if not, throw an error
    if (!response.ok) {
      throw new Error(`Bad response from server: ${response.statusText}`);
    }

    // Parse the response as JSON and return the current week
    const state = await response.json();
    return state.week;
  } catch (error) {
    // If any error occurs during the process, throw an error with a descriptive message
    throw new Error(`Error fetching current week: ${error.message}`);
  }
}


// Function to fetch matchups for a specific league and week from Sleeper API
async function fetchMatchups(leagueId, week) {
  try {
    // Fetch matchups for the league and week
    const matchupsResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`);
    if (!matchupsResponse.ok) {
      throw new Error(`Bad response from server: ${matchupsResponse.statusText}`);
    }
    const matchups = await matchupsResponse.json();

    // Save matchups to Firebase Realtime Database
    const matchupsRef = ref(db, `leagues/${leagueId}/matchups/${week}`); // Adjust the path as needed
    await set(matchupsRef, matchups);

    console.log(`Matchups for League ${leagueId} and Week ${week} saved to the database.`);

    return matchups;
  } catch (error) {
    // If any error occurs during the process, throw an error with a descriptive message
    throw new Error(`Error fetching matchups: ${error.message}`);
  }
}


// Function to fetch matchups for a user and week from Sleeper API
async function fetchUserMatchups(userLeagues, week) {
  const userMatchups = [];

  for (const league of userLeagues) {
    const leagueId = league?.league_id;

    if (leagueId) {
      try {
        // Fetch matchups for the user's league and week
        const matchups = await fetchMatchups(leagueId, week);
        userMatchups.push({ leagueId, matchups });
        console.log(`Matchups for League ${leagueId}, Week ${week}: ${JSON.stringify(matchups)}`);
      } catch (error) {
        console.error(`Error fetching matchups for League ${leagueId}, Week ${week}: ${error.message}`);
      }
    }
  }

  return userMatchups; // Return the userMatchups array
}

// Function to fetch matchups for all leagues
async function fetchAllMatchups(userLeagues, week) {
  for (const league of userLeagues) {
    const leagueId = league?.league_id;

    if (leagueId) {
      try {
        await fetchMatchups(leagueId, week);
      } catch (error) {
        console.error(`Error fetching matchups for League ${leagueId}: ${error.message}`);
      }
    }
  }
}


// Function to fetch roster data
async function fetchRosterData(leagueId) {
  try {
    // Fetch rosters for the league and week
    const rostersResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
    if (!rostersResponse.ok) {
      throw new Error(`Error fetching rosters: ${rostersResponse.statusText}`);
    }
    const rosters = await rostersResponse.json();

    // Save rosters to Firebase Realtime Database
    const rostersRef = ref(db, `leagues/${leagueId}/rosters`); // Adjust the path as needed
    await set(rostersRef, rosters);

    console.log(`Rosters for League ${leagueId} saved to the database.`);

    return rosters;
  } catch (error) {
    throw new Error(`Error fetching rosters: ${error.message}`);
  }
}


// Function to fetch user-specific roster information for the current week
async function fetchUserRosters(userLeagues, week) {
  const userRosters = [];

  for (const league of userLeagues) {
    const leagueId = league?.league_id;

    if (leagueId) {
      try {
        const rosters = await fetchRosterData(leagueId, week);
        userRosters.push({ leagueId, rosters });
        console.log(`Rosters for League ${leagueId}, Week ${week}: ${JSON.stringify(rosters)}`);
      } catch (error) {
        console.error(`Error fetching rosters for League ${leagueId}, Week ${week}: ${error.message}`);
      }
    }
  }

  return userRosters;
}


// Function to fetch and store transactions for a specific league and week
async function fetchAndStoreTransactions(leagueId, week) {
  try {
    // Fetch transactions for the league and week
    const transactionsResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/transactions/${week}`);
    
    if (!transactionsResponse.ok) {
      throw new Error(`Bad response from server: ${transactionsResponse.statusText}`);
    }

    const transactions = await transactionsResponse.json();

    // Check if transactions already exist in the database for the specified league and week
    const transactionsRef = ref(db, `leagues/${leagueId}/transactions/${week}`);
    const existingTransactions = await get(transactionsRef); // Use get on the reference directly

    if (!existingTransactions.exists()) {
      // If no existing transactions, save the fetched transactions to the database
      await set(transactionsRef, transactions);
      console.log(`Transactions for League ${leagueId} and Week ${week} saved to the database.`);
    } else {
      // If transactions already exist, update the existing data in the database
      await set(transactionsRef, { ...existingTransactions.val(), ...transactions });
      console.log(`Transactions for League ${leagueId} and Week ${week} updated in the database.`);
    }

    return transactions;
  } catch (error) {
    // Improve error handling by providing more details
    throw new Error(`Error fetching transactions for League ${leagueId} and Week ${week}: ${error.message}`);
  }
}


// Function to fetch and store transactions for all leagues and the current week
async function fetchAndStoreAllTransactions(userLeagues, week) {
  for (const league of userLeagues) {
    const leagueId = league?.league_id;

    if (leagueId) {
      try {
        await fetchAndStoreTransactions(leagueId, week);
      } catch (error) {
        console.error(error.message);
        // Handle the error or log it as needed
      }
    }
  }
}



async function run() {
  try {
    // Prompt the user for their username
    rl.question('Enter your Sleeper username: ', async (username) => {
      // Close the interface as we have received the input
      rl.close();

      try {
        const userId = await fetchUserId(username);
        console.log(`User ID: ${userId}`);

        const userLeagues = await fetchUserLeagues(userId);
        console.log(`User leagues: ${JSON.stringify(userLeagues)}`);

        // Assuming the first league in the array, you can modify as needed
        const currentWeek = await fetchCurrentWeek();
        console.log(`Current Week: ${currentWeek}`);

        // Fetch matchups for all leagues and get the user matchups
        const userMatchups = await fetchUserMatchups(userLeagues, currentWeek);
        console.log(`User Matchups: ${JSON.stringify(userMatchups)}`);

        // Fetch all matchups
        await fetchAllMatchups(userLeagues, currentWeek);

        // Fetch and store user rosters for the current week
        await fetchUserRosters(userLeagues, currentWeek);

        // Fetch and store transactions for all leagues and the current week
        await fetchAndStoreAllTransactions(userLeagues, currentWeek);
        
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Run the code
run();
