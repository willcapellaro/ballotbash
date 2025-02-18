import React from 'react';
import { type Game } from '../types';
import { useTheme } from '../contexts/ThemeContext';

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
  games: Record<string, Game>;
  currentPlayerId: string | null;
  hostName?: string;
};

type GameGroup = {
  title: string;
  games: [string, Game][];
};

export function GameSelect({ value, onChange, games, currentPlayerId, hostName }: Props) {
  // Group games based on where they are hosted
  const groupedGames = Object.entries(games).reduce((acc, [id, game]) => {
    if (!game.hostedLocally) {
      acc[0].games.push([id, game]); // Games you joined
    } else {
      acc[1].games.push([id, game]); // Games you're hosting
    }
    return acc;
  }, [
    { title: "Games you joined", games: [] },
    { title: "Games you're hosting", games: [] }
  ] as GameGroup[]);

  // Sort games within each group by creation date
  groupedGames.forEach(group => {
    group.games.sort((a, b) => b[1].created - a[1].created);
  });

  const { theme } = useTheme();

  const hostDisplay = hostName || 'Anonymous Host';

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="px-3 py-2 rounded-lg border border-gray-200"
      title={theme.showUuids ? `ID: ${value}` : undefined}
    >
      <option value="">{hostDisplay}</option>
      
      {groupedGames.map((group, index) => (
        <React.Fragment key={group.title}>
          {group.games.length > 0 && <option disabled>──────────</option>}
          <option disabled>{group.title}</option>
          {group.games.map(([id, game]) => {
            const localPlayers = game.players.filter(p => 
              !p.isNetworked && p.id !== 'scorekeeping' && !p.isHost
            ).length;
            
            return (
              <option key={id} value={id}>
                {index === 1 && '💻 '}
                {game.name || `Game ${theme.showUuids ? id : id.slice(0, 4)}`}
                {localPlayers > 0 && ` (${localPlayers}p)`}
                {!game.hostedLocally && ` • ${game.hostName || 'Anonymous'}`}
              </option>
            );
          })}
        </React.Fragment>
      ))}
      <option disabled>──────────</option>
      <option value="new">+ New Game</option>
    </select>
  );
}