// TeamCard.js

import React from 'react';
import PlayerCard from './PlayerCard';

const TeamCard = ({ teamName, teamRecord, teamScore, teamLogo, players }) => (
  <div className="team-card">
    <div className="team-header">
      <div className="avatar-container">
        <img src={teamLogo} alt={`${teamName} Logo`} className="team-logo" />
      </div>
      <div className="team-info">
        <div className="team-name">{teamName}</div>
        <div className="team-record">{teamRecord}</div>
      </div>
      <div className="team-score">{teamScore}</div>
    </div>
    <div className="players">
      {players.starters.map((player, index) => (
        <PlayerCard key={index} {...player} />
      ))}
    </div>
    <div className="bench">
      {players.bench.map((player, index) => (
        <PlayerCard key={index} {...player} />
      ))}
    </div>
  </div>
);

export default TeamCard;
