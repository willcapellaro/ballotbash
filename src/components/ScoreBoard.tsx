import React from 'react';
import { type Nominee, type Vote } from '../types';

type Props = {
  nominees: Nominee[];
  votes: Record<string, Vote>;
  players: string[];
  winners: Record<string, string>;
};

export function ScoreBoard({ nominees, votes, players, winners }: Props) {
  const calculateScore = (playerId: string) => {
    let score = 0;
    Object.entries(votes).forEach(([nomineeId, vote]) => {
      if (winners[nomineeId] === playerId) {
        score += vote === 'primary' ? 1 : 0.25;
      }
    });
    return score;
  };

  const calculateSeenCount = (playerId: string) => {
    return nominees.filter(nominee => votes[nominee.id]).length;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-3xl font-light mb-8">Scoreboard</h2>
        <div className="grid gap-6">
          {players.map(player => (
            <div key={player} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">{player}</h3>
                <div className="text-2xl font-light">
                  {calculateScore(player)} points
                </div>
              </div>
              <div className="mt-2 text-gray-500">
                Watched {calculateSeenCount(player)} movies
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}