import React, { useState } from 'react';
import './styles.css'; // Make sure this points to the correct CSS file
import FantasyBetLogo1 from './Images/FantasyBetLogo1.png'; // Update the path as needed
import sleeperfantasy from './Images/sleeperfantasy.png';
import SleeperService from './services/sleeper-services/sleeper.services';
import PlayerServices from './services/firebase-services/player.services';

const ScoreboardLayout = () => {
  const [username, setUser] = useState(''); // State variable for user
  const [playerId, setPlayer] = useState(''); // State variable for user

  const sleeperService = new SleeperService();
  const playerService = new PlayerServices();
  
  let userId;

  let leagues;
  let currentLeague;

  let rosters;
  let ownerRoster;

  let [playerData,setPlayerData] = useState(null);

  const getUser = async () => {
    try {
      //get user from sleeper api
      userId = await sleeperService.fetchUserId(username);
      console.log("Fetched User ID:", userId); // Log the user ID or set it in the state

      //get leagues after getting user from sleeper api
      await getLeagues();

      //get current league that we want to see 
      //need to change this later to a dropdown or a slider to show all league info
      if (leagues !== null && leagues !== undefined) {
        if (leagues.length >= 1) {
          leagues.forEach(league => {
            if (league.name.toString().toLowerCase() === 'usfl') {
              currentLeague = league;
            }
          });
        }
      }
      console.log(`Current League: ${JSON.stringify(currentLeague)}`);

      //get the roster from our current league that we want to display
      await getRosters();

      //get users roster in league
      //need to change this later to a dropdown or a slider to show all rosters info
      if (rosters !== null && rosters !== undefined) {
        if (rosters.length >= 1) {
          rosters.forEach(roster => {
            if (roster.owner_id === userId) {
              ownerRoster = roster;
            }
          });
        }
      }

      console.log(`Current Owner's Roster: ${JSON.stringify(ownerRoster)}`);

    } catch (error) {
      console.error("Error in getRoster:", error.message); // Log any errors
    }
  };


  const getLeagues = async () => {
    try {
      leagues = await sleeperService.getAllLeaguesForUser(userId, "nfl", 2023);
      console.log(`All Player Leagues: ${leagues}`);
    } catch (error) {
      console.error("Error in getleagues:", error.message); // Log any errors
    }
  }

  const getRosters = async () => {
    try {
      rosters = await playerService.createAllPlayersIndex();
      console.log(`Roster: ${JSON.stringify(rosters)}`);
    } catch (error) {
      console.error("Error in getRoster:", error.message); // Log any errors
    }
  }

  const updatePlayers = async () => {
    try {
      await playerService.createNflPlayers();
    } catch (error) {
      console.error("Error in getRoster:", error.message); // Log any errors
    }
  }

  const getPlayerById = async () => {
    try{
      setPlayerData(await playerService.getPlayerBySleeperId(playerId));
    } catch (error){
      console.log("Error in getPlayerById: ", error.message);
    }
  }

  // Function to render player cards
  const renderPlayerCards = (players, bench = false) => players.map((player, index) => (
    <div className={`player-card ${bench ? 'bench' : ''}`} key={index}>
      <span className="player-name">{playerData?.full_name}</span>
      <span className="player-position">{player.position}</span>
      <span className="player-team">{player.team}</span>
      <span className="player-score">{player.points}</span>
    </div>
  ));

  // Mock data for players
  const starters = new Array(5).fill({ name: 'Player', position: 'NFL TEAM', team: 'POS', points: 'Points' });
  const benchPlayers = new Array(3).fill({ name: 'Player', position: 'NFL TEAM', team: 'POS', points: 'Points' });

  return (
    <div className="scoreboard-layout">
      <header className="scoreboard-header">
        <img src={FantasyBetLogo1} className="app-logo" alt="Fantasy Bet Logo" />
      </header>
      <div className="subapp-header">
        <img src={sleeperfantasy} className="subapp-logo" alt="Sleeper Logo" />
      </div>
      <div>
        <input
          value={username}
          onChange={(e) => setUser(e.target.value)}
          placeholder='Enter Username'
        />
        <button onClick={getUser}>Get User</button>
        <button onClick={updatePlayers}>Update Players</button>
        <br />
        <input
          value={playerId}
          onChange={(e) => setPlayer(e.target.value)}
          placeholder='Enter Player Id'
        />
        <button onClick={getPlayerById}>Get Player</button>

      </div>
      <div className="week-info">Week #</div>
      <div className="matchup-info">
        <div className="team-card user-team">
          <div className="team-name">User Team</div>
          <div className="player-section">
            <div className="starters-title">Starters</div>
            {renderPlayerCards(starters)}
          </div>
          <div className="bench">
            <div className="bench-title">Bench</div>
            {renderPlayerCards(benchPlayers, true)}
          </div>
        </div>
        <div className="team-card opposing-team">
          <div className="team-points opposing-team-points">
            {/* Points for the opposing team */}
            <span className="scoreboard-font">Total: ###.##</span>
          </div>
          <div className="team-points user-team-points">
            {/* Points for the user team */}
            <span className="scoreboard-font">Total: ###.##</span>
          </div>
          <div className="team-name">Opposing Team</div>
          <div className="player-section">
            <div className="starters-title">Starters</div>
            {renderPlayerCards(starters)}
          </div>
          <div className="bench">
            <div className="bench-title">Bench</div>
            {renderPlayerCards(benchPlayers, true)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreboardLayout;
