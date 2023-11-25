import { db } from '../../firebase';
import { ref, set, onValue, query, remove, get, child } from "firebase/database";
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
// Method to fetch player data by Sleeper ID (placeholder)
    async getPlayerBySleeperId(playerId) {
      try {
          // Reference to the player data using playerId
          const playerRef = ref(db, `AllNflPlayers/${playerId}`);

          // Fetch the player data
          const snapshot = await get(playerRef);
          if (snapshot.exists()) {
              const playerData = snapshot.val();
              console.log(`Player Data: `, playerData);
              return playerData;
          } else {
              console.log("No player data available for ID:", playerId);
              return null;
          }
      } catch (error) {
          console.error("Error fetching player data:", error);
          return null;
      }
    }


    // Method to add all NFL players to Firebase, called once a day by player_id
    async createNflPlayers() {
      try {
          // Fetch current NFL players data
          const playersData = await this.getAllPlayers();
          // const allTableRef = ref(db, "allNflPlayers");
          // remove(allTableRef).then(() =>{});

          // Reference to save players in Firebase Realtime Database
          const playersRef = ref(db, `AllNflPlayers`);

          playersData.forEach(player => {
              // Corrected line: Concatenate the player ID in the path
              const playerRef = ref(db, `AllNflPlayers/${player.player_id}`);
              set(playerRef, player);
          });

      } catch (error) {
          console.error(`Error in create AllNflPlayers: ${error.message}`);
      }
    }
}
    // // Delete unneeded firebase tables
    // async createNflPlayers() {
    //   try {
    //       // Fetch current NFL players data
    //       const playersData = await this.getAllPlayers();
    //       // const allTableRef = ref(db, "allNflPlayers");
    //       // remove(allTableRef).then(() =>{});
