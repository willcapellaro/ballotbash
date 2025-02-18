import React, { useState } from 'react';
import { Edit2, Plus, Users, Laptop, Info, Lock, Unlock } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useTheme } from '../contexts/ThemeContext';
import { AddPlayerModal } from './AddPlayerModal';
import { GameModal } from './GameModal';
import { HostControls } from './HostControls';
import { cn } from '../utils';

export function NaturalSentenceControl() {
  const { state, actions } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [gameModalMode, setGameModalMode] = useState<false | 'full' | 'players-only'>(false);
  const [isEditingGame, setIsEditingGame] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const gameInputRef = React.useRef<HTMLInputElement>(null);

  const { theme } = useTheme();

  const currentGame = state.currentGameId ? state.games[state.currentGameId] : null;
  const currentPlayer = currentGame?.players.find(p => p.id === state.currentPlayerId);
  const isHost = currentGame ? currentGame.hostId === state.currentPlayerId : true;

  const totalGames = Object.keys(state.games).length;

  const handleNameEdit = () => {
    if (isHost) {
      if (newName.trim()) {
        actions.setHostName(newName.trim());
      }
    } else if (state.currentPlayerId && newName.trim()) {
      actions.renamePlayer(currentGame.id, state.currentPlayerId, newName.trim());
    }
    setIsEditing(false);
    setNewName('');
  };

  const handleGameNameEdit = () => {
    if (currentGame && newGameName.trim()) {
      actions.renameGame(currentGame.id, newGameName.trim());
    }
    setIsEditingGame(false);
    setNewGameName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setNewName('');
    }
  };

  // Focus input when editing starts
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Group games for select menu
  const groupedGames = Object.entries(state.games).reduce((acc, [id, game]) => {
    if (game.hostedLocally) {
      acc[0].games.push([id, game]);
    } else {
      acc[1].games.push([id, game]);
    }
    return acc;
  }, [
    { title: "Games you're hosting", games: [] },
    { title: "Games you joined", games: [] }
  ] as { title: string; games: [string, Game][]; }[]);

  return (
    <div className="flex flex-col items-center gap-4 text-sm text-secondary">
      <div className="flex items-center gap-2 flex-wrap justify-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg w-full">
        <span className="whitespace-nowrap">{currentGame ? (isHost ? 'Voting as' : 'Voting as') : 'Voting as'}</span>
        {currentGame ? (
        <>
          {isEditing ? (
            <div className="inline-flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-primary"
                placeholder="Enter name"
              />
              <button
                onClick={handleNameEdit}
                className="px-3 py-1 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A]"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewName('');
                }}
                className="px-3 py-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-hover)]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-2">
                <select
                  value={state.currentPlayerId || ''}
                  onChange={(e) => actions.selectPlayer(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-primary min-w-[150px]"
                  title={theme.showUuids ? `ID: ${state.currentPlayerId}` : undefined}
                >
                  <option value={currentGame.hostId}>
                    💻 {' '}
                    {currentGame.hostName || 'Anonymous Host'}
                    {theme.showUuids ? ` (${currentGame.hostId})` : ''}
                  </option>
                  {currentGame.players
                    .filter(p => !p.isHost && p.id !== 'scorekeeping')
                    .map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                        {theme.showUuids ? ` (${player.id})` : ''}
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => {
                    setNewName(isHost ? state.hostName : (currentPlayer?.name || ''));
                    setIsEditing(true);
                  }}
                  className="p-1 rounded hover:bg-[var(--color-hover)]"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              {totalGames > 0 && (
                <span className="text-secondary">
                  in
                </span>
              )} 
              {isEditingGame ? (
                <div className="inline-flex items-center gap-2">
                  <input
                    ref={gameInputRef}
                    type="text"
                    value={newGameName}
                    onChange={(e) => setNewGameName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGameNameEdit();
                      if (e.key === 'Escape') {
                        setIsEditingGame(false);
                        setNewGameName('');
                      }
                    }}
                    className="px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-primary"
                    placeholder="Enter game name"
                  />
                  <button
                    onClick={handleGameNameEdit}
                    className="px-3 py-1 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingGame(false);
                      setNewGameName('');
                    }}
                    className="px-3 py-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-hover)]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2">
                  <select
                    value={state.currentGameId || ''}
                    onChange={(e) => {
                      if (e.target.value === 'new') {
                        setGameModalMode('full');
                        actions.selectGame(null); // Reset game selection
                      } else {
                        actions.selectGame(e.target.value || null);
                      }
                    }}
                    className="px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-primary min-w-[150px]"
                  >
                    {[
                      { title: "Games you joined", games: Object.entries(state.games).filter(([, game]) => !game.hostedLocally) },
                      { title: "Games you're hosting", games: Object.entries(state.games).filter(([, game]) => game.hostedLocally) }
                    ].map((group, index) => (
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
                            </option>
                          );
                        })}
                      </React.Fragment>
                    ))}
                    <option disabled>──────────</option>
                    <option value="new">+ New Game</option>
                  </select>
                  {currentGame && isHost && (
                    <button
                      onClick={() => {
                        setNewGameName(currentGame.name || '');
                        setIsEditingGame(true);
                      }}
                      className="p-1 rounded hover:bg-[var(--color-hover)]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
              {currentGame && (
                <button
                  onClick={() => setGameModalMode('players-only')}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A]"
                  )}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Players</span>
                </button>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {isEditing ? (
            <div className="inline-flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-primary"
                placeholder="Enter your name"
              />
              <button
                onClick={handleNameEdit}
                className="px-3 py-1 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A]"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewName('');
                }}
                className="px-3 py-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-hover)]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-2">
                <span className="font-medium text-primary flex items-center gap-2">
                  <span>💻</span>
                  {state.hostName || 'Anonymous Host'}
                </span>
                <button
                  onClick={() => {
                    setNewName(state.hostName);
                    setIsEditing(true);
                  }}
                  className="p-1 rounded hover:bg-[var(--color-hover)]"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => setGameModalMode('full')}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A]"
              >
                <Users className="w-4 h-4" />
                <span>Add Friends</span>
              </button>
            </>
          )}
        </>
      )}
      </div>

      <GameModal
        isOpen={!!gameModalMode}
        mode={gameModalMode || 'full'}
        initialGameId={gameModalMode === 'players-only' ? currentGame?.id : undefined}
        onClose={() => setGameModalMode(false)}
      />

      <div className="w-full">
        {isHost && (
          <div className="w-full ">
            <HostControls />
          </div>
        )}
      </div>
    </div>
  );
}