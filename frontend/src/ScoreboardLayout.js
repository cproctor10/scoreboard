import React from 'react';
import './styles.css'; // Make sure this points to the correct CSS file
import FantasyBetLogo1 from '/Users/charlpro/scoreboard/frontend/src/Images/FantasyBetLogo1.png'; // Update the path as needed

const ScoreboardLayout = () => {
  // Function to render player cards
  const renderPlayerCards = (players, bench = false) => players.map((player, index) => (
    <div className={`player-card ${bench ? 'bench' : ''}`} key={index}>
      <span className="player-name">{player.name}</span>
      <span className="player-position">{player.position}</span>
      <span className="player-team">{player.team}</span>
      <span className="player-score">{player.points}</span>
    </div>
  ));

  // Mock data for players
  const starters = new Array(5).fill({ name: 'Starter', position: 'POS', team: 'NFL', points: 'Points' });
  const benchPlayers = new Array(3).fill({ name: 'Bench', position: 'BN', team: 'NFL', points: 'Points' });

  return (
    <div className="scoreboard-layout">
      <header className="scoreboard-header">
        <img src={FantasyBetLogo1} className="app-logo" alt="Fantasy Bet Logo" />
      </header>
      <div className="matchup-info">
        <div className="team-card user-team">
          <div className="team-name">User Team</div>
          <div className="week-info">Week #</div>
          <div className="player-section">
            <div className="starters-title">Starters</div>
            {renderPlayerCards(starters)}
          </div>
          <div className="bench">
            <div className="bench-title">Bench</div>
            {renderPlayerCards(benchPlayers, true)}
          </div>
        </div>
        <div className="team-points user-team-points">
          {/* Points for the user team */}
          <span className="scoreboard-font">###.##</span>
        </div>
        <div className="team-card opposing-team">
          <div className="team-points opposing-team-points">
            {/* Points for the opposing team */}
            <span className="scoreboard-font">###.##</span>
          </div>
          <div className="team-name">Opposing Team</div>
          <div className="week-info">Week #</div>
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
