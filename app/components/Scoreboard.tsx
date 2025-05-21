import React from 'react';
import { Score } from '../types';

export function Scoreboard({ scores }: { scores: Score[] }) {
  return (
    <div>
      <h2>Scoreboard</h2>
      {scores.map((score) => (
        <div key={score.fid}>
          <p>{score.username}: {score.points} points</p>
        </div>
      ))}
    </div>
  );
} 