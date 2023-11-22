import React from 'react';

const PlayerCard = ({ player }) => (
  <div className="player-card">
    <img src={player.picture} alt={`${player.name}`} className="player-picture" />
    <div className="player-details">
      <div className="player-name">{player.name}</div>
      <div className="player-info">
        <span className="player-position">{player.position}</span> - 
        <span className="player-team">{player.team}</span>
      </div>
    </div>
    <div className="player-score">{player.score}</div>
  </div>
);

export default PlayerCard;
