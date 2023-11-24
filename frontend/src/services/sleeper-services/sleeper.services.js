export default class SleeperService {

    // Function to fetch user ID from Sleeper API based on the username
    async fetchUserId(username) {
        try {
            console.log(username);
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

    async getAllLeaguesForUser(userId, sport, season){
        try {
            console.log(`Fetching leagues for user ID: ${userId}`);
            const response = await fetch(`https://api.sleeper.app/v1/user/${userId}/leagues/${sport}/${season}`);

            // Check if the response is successful; if not, throw an error
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Bad response from server: ${response.statusText} - ${errorText}`);
            }
        
            // Parse the response as JSON and log the fetched leagues
            const leagues = await response.json();
            console.log(`Leagues fetched successfully: ${JSON.stringify(leagues)}`);
            
            return leagues;
        } catch (error) {
            // If any error occurs during the process, throw an error with a descriptive message
            throw new Error(`Error fetching user ID: ${error.message}`);
        }
    }

    async getRosterInLeagueData(leagueId) {
      try {
        // get rosters for the league and week
        const rosters = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);

        if (!rosters.ok) {
          throw new Error(`Error fetching rosters: ${rosters.statusText}`);
        }

        return await rosters.json();

    } catch (error) {
        throw new Error(`Error fetching rosters: ${error.message}`);
      }
    }
}
