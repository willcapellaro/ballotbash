import React, { useState, useEffect } from 'react';
import { Info, Users, Trash2, Lock, Unlock, Edit2 } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { generateId } from '../utils';
import { GameSelect } from './GameSelect';
import { AddPlayerModal } from './AddPlayerModal';
import { ConfirmModal } from './ConfirmModal';

export function GameControl() {
  const { state, actions, nominees } = useGame();
  const { currentGameId, currentPlayerId, games, votingLocked } = state;
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [hostName, setHostName] = useState(state.hostName);
  const [isEditingHostName, setIsEditingHostName] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete-game' | 'delete-player' | null;
    message: string;
  }>({ type: null, message: '' });

  // Update local state when global state changes
  useEffect(() => {
    setHostName(state.hostName);
  }, [state.hostName]);

  const currentGame = currentGameId ? games[currentGameId] : null;
  const isHost = currentGame?.hostId === currentPlayerId;
  const currentPlayer = currentGame?.players.find(p => p.id === currentPlayerId);

  // Calculate voting progress for each player
  const playerProgress = currentGame?.players.reduce((acc, player) => {
    const playerData = state.playerData[currentGameId]?.[player.id];
    if (!playerData) return acc;

    const votedCount = Object.keys(playerData.votes).length;
    const totalCategories = new Set(nominees.map(n => n.catCode)).size;
    
    acc[player.id] = {
      votedCount,
      totalCategories,
      isComplete: votedCount === totalCategories,
      hasStarted: votedCount > 0
    };
    
    return acc;
  }, {} as Record<string, { votedCount: number; totalCategories: number; isComplete: boolean; hasStarted: boolean; }>);

  const handleAddPlayers = (playerNames: string[]) => {
    if (!currentGameId) return;
    
    playerNames.forEach(name => {
      const playerId = generateId();
      actions.addPlayer(currentGameId, playerId, name);
    });
  };

  const handleNameEdit = () => {
    if (!currentGame || !currentPlayerId) return;
    actions.renamePlayer(currentGameId, currentPlayerId, newName);
    setIsEditingName(false);
    setNewName('');
  };

  const handleHostNameSave = () => {
    if (hostName.trim()) {
      actions.setHostName(hostName.trim());
    }
    setIsEditingHostName(false);
  };

  const handleDeleteGame = () => {
    if (!currentGameId) return;
    actions.deleteGame(currentGameId);
    setConfirmAction({ type: null, message: '' });
  };

  const handleDeletePlayer = () => {
    if (!currentGameId || !currentPlayerId) return;
    actions.deletePlayer(currentGameId, currentPlayerId);
    setConfirmAction({ type: null, message: '' });
  };

  return (
    <div className="bg-[color:--modal-bg)] border-b border-[var(--color-border)] px-4 py-3">
      <div className="container mx-auto space-y-4">
        {/* Game Selection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GameSelect
              value={currentGameId}
              onChange={actions.selectGame}
              games={games}
              currentPlayerId={currentPlayerId}
              hostName={state.hostName}
            />

            {!currentGameId && (
              <div className="flex items-center gap-4">
                {/* Host Name */}
                {isEditingHostName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                      placeholder="Your name"
                      className="px-3 py-2 rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={handleHostNameSave}
                      className="px-4 py-2 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingHostName(false);
                        setHostName(state.hostName);
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingHostName(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <Edit2 className="w-4 h-4" />
                    {state.hostName ? 'Change Name' : 'Set Name'}
                  </button>
                )}

                {/* Cross-game sync info */}
                <div className="flex items-center gap-2 relative group">
                  <span className="text-sm text-gray-600">
                    Cross-game sync {state.syncVotes ? 'enabled' : 'disabled'}
                  </span>
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 left-start mb-2 hidden group-hover:block w-48 p-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg shadow-lg">
                    Your own votes sync across games play
                  </div>
                </div>

                {/* Lock Voting */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lockVoting"
                    checked={votingLocked}
                    onChange={(e) => actions.setVotingLocked(e.target.checked)}
                    className="rounded border-gray-300 text-[#A69764] focus:ring-[#A69764]"
                  />
                  <label 
                    htmlFor="lockVoting" 
                    className="flex items-center gap-2 text-sm text-gray-600"
                    title="Locks voting for all your hosted games"
                  >
                    {votingLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Unlock className="w-4 h-4" />
                    )}
                    Lock Voting
                  </label>
                </div>
              </div>
            )}

            {currentGameId && isHost && (
              <button
                onClick={() => setConfirmAction({
                  type: 'delete-game',
                  message: 'Are you sure you want to delete this game? This action cannot be undone.'
                })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete Game
              </button>
            )}
          </div>
        </div>

        {/* Player Selection */}
        {currentGame && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={currentPlayerId || ''}
                onChange={(e) => actions.selectPlayer(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-primary"
              >
                {currentGame.players
                  .filter(p => !p.isHost && p.id !== 'scorekeeping')
                  .map((player) => {
                    const progress = playerProgress?.[player.id];
                    const prefix = progress?.isComplete ? '✅' : 
                                 progress?.hasStarted ? '🚧' : '';
                    return (
                      <option key={player.id} value={player.id}>
                        {prefix} {player.name} ({player.id.slice(0, 4)})
                      </option>
                    );
                  })}
              </select>

              {currentPlayer && !isEditingName && (
                <button
                  onClick={() => {
                    setNewName(currentPlayer.name);
                    setIsEditingName(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <Edit2 className="w-4 h-4" />
                  Rename
                </button>
              )}

              {isEditingName && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200"
                    placeholder="Enter new name"
                  />
                  <button
                    onClick={handleNameEdit}
                    className="px-4 py-2 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setNewName('');
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsAddPlayerModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Users className="w-4 h-4" />
                Add Players
              </button>

              {currentPlayerId && !isHost && (
                <button
                  onClick={() => setConfirmAction({
                    type: 'delete-player',
                    message: 'Are you sure you want to delete this player? This action cannot be undone.'
                  })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Player
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <AddPlayerModal
        isOpen={isAddPlayerModalOpen}
        onClose={() => setIsAddPlayerModalOpen(false)}
        onAddPlayers={handleAddPlayers}
      />

      <ConfirmModal
        isOpen={confirmAction.type !== null}
        title={confirmAction.type === 'delete-game' ? 'Delete Game' : 'Delete Player'}
        message={confirmAction.message}
        onConfirm={confirmAction.type === 'delete-game' ? handleDeleteGame : handleDeletePlayer}
        onCancel={() => setConfirmAction({ type: null, message: '' })}
      />
    </div>
  );
}