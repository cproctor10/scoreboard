import { db } from '../../firebase';
import { ref, set, onValue, query } from "firebase/database";
import { onSnapshot, collection, where } from 'firebase/firestore';

// PlayerServices class to handle player data operations
export default class PlayerServices {

    // Method to fetch all NFL players from the API
    async getAllPlayers() {
        try {
            const response = await fetch('https://api.sleeper.app/v1/players/nfl', { method: 'GET' });

            if (!response.ok) {
                throw new Error(`Error fetching all NFL players: ${response.statusText}`);
            }

            const players = await response.json();
            console.log(`All Players: ${JSON.stringify(players)}`);

            const allPlayers = [];
            for (var index in players) {
                allPlayers.push(players[index]);
            }

            return allPlayers.filter(x => x.active === true);
        } catch (error) {
            throw new Error(`Error fetching all NFL players: ${error.message}`);
        }
    }

    //************************  THIS METHOD STILL NEEDS WORK   ************************/
    // Method to fetch player data by Sleeper ID (placeholder)
    async getPlayerBySleeperId(playerId) {
        var today = new Date();
        const datePath = `${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`; // Month is 0-indexed

        // Implementation for fetching player by Sleeper ID
        const playerDataRef = ref(db, `allNflPlayers/${datePath}`);
        let playerData;
        await onValue(playerDataRef, (snapshot) => {
            playerData = snapshot.val();
            console.log(playerData);
        });
        debugger;

        const collectionQuery = query(collection(db, `allNflPlayers/${datePath}`), where(playerId, '==', playerId))
        const unsub = onSnapshot(playerDataRef, (snapshot) => { 
            snapshot.docs.forEach((doc) => {
                 console.log(doc.data()); 
                });
            }); 

        console.log(`Player Data: ${playerData}`);
        return playerData;
    }

    // Method to fetch and save all NFL players to Firebase, called once a day
    async createAllPlayersIndex() {
        try {
            // Fetch current NFL players data
            const playersData = await this.getAllPlayers();

            // Format today's date
            var today = new Date();
            const datePath = `${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`; // Month is 0-indexed

            // Reference to save players in Firebase Realtime Database
            const playersRef = ref(db, `allNflPlayers/${datePath}`);

            // Save players data to Firebase, overwriting existing data
            set(playersRef, playersData);

            debugger;
            console.log('NFL players data updated successfully.');

        } catch (error) {
            console.error(`Error in createAllSleeperPlayers: ${error.message}`);
        }
    }
}
