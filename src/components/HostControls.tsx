import React from 'react';
import { Info, Lock, Unlock } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

export function HostControls() {
  const { state, actions } = useGame();

  return (
    <div className="w-full flex border border-[var(--color-border)] rounded-lg p-4 bg-[var(--card-bg)]">
      <h3 className="text-sm font-large text-primary ">Host Controls</h3>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Cross-game sync info */}
        <div className="flex items-center gap-2 relative group">
          <span className="flex text-sm text-gray-600 px-20">
            
            Cross-game sync {state.syncVotes ? 'enabled' : 'disabled'}
            <Info className="h-4 text-gray-400 cursor-help" />
          </span>
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 text-sm text-gray-600 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            Your own votes sync across games play
          </div>
        </div>

        {/* Lock Voting */}
        <div className="flex items-center gap-2 relative group">
          <input
            type="checkbox"
            id="lockVotingNatural"
            checked={state.votingLocked}
            onChange={(e) => actions.setVotingLocked(e.target.checked)}
            className="rounded border-gray-300 text-[#A69764] focus:ring-[#A69764]"
          />
          <label 
            htmlFor="lockVotingNatural" 
            className="flex items-center gap-2 text-sm text-gray-600"
            title="Locks voting for all your hosted games"
          >
            {state.votingLocked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
            Lock Voting
            <Info className="h-4 text-gray-400 cursor-help" />
          </label>
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 text-sm text-gray-600 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            Prevents all players from changing their votes
          </div>
        </div>
      </div>
    </div>
  );
}