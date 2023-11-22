import React from 'react';
import './styles.css'; // Make sure this points to the correct CSS file
import sleeperLogo from '/Users/charlpro/scoreboard/fantasy-scoreboard/src/sleeper.jpg'; // Update the path to where you've saved the image

const ScoreboardLayout = () => {
  // Function to render player cards
  const renderPlayerCards = (players) => players.map((player, index) => (
    <div className="player-card" key={index}>
      <div className="player-name">{player.name}</div>
      <div className="player-details">{player.position} - {player.team}</div>
      <div className="player-score">{player.points}</div>
    </div>
  ));

  // Mock data for players
  const starters = new Array(5).fill({ name: 'Starter', position: 'POS', team: 'NFL', points: 'Points' });
  const bench = new Array(3).fill({ name: 'Bench', position: 'POS', team: 'NFL', points: 'Points' });

  return (
    <div className="scoreboard-layout">
      <img src={sleeperLogo} alt="Sleeper Logo" className="platform-logo" />
      <div className="matchup-info">
        <div className="team-card">
          <div className="team-name">User Team</div>
          <div className="week-info">Week #</div>
          <div className="player-section">
            <div className="starters-title">Starters</div>
            {renderPlayerCards(starters)}
            <div className="bench-title">Bench</div>
            {renderPlayerCards(bench)}
          </div>
        </div>
        <div className="team-card">
          <div className="team-name">Opposing Team</div>
          <div className="week-info">Week #</div>
          <div className="player-section">
            <div className="starters-title">Starters</div>
            {renderPlayerCards(starters)}
            <div className="bench-title">Bench</div>
            {renderPlayerCards(bench)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreboardLayout;
