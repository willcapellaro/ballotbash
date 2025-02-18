import React, { useState, useEffect } from 'react';
import { X, Users, Link as LinkIcon } from 'lucide-react';
import { AnimatedHeadline } from './AnimatedHeadline';
import { useGame } from '../contexts/GameContext';
import { generateId } from '../utils';
import { cn } from '../utils';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'full' | 'players-only';
  initialGameId?: string;
};

export function GameModal({ isOpen, onClose, mode = 'full', initialGameId }: Props) {
  const [step, setStep] = useState<'game' | 'players'>('game');
  const [gameName, setGameName] = useState('');
  const [playerNames, setPlayerNames] = useState('');
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const { actions, state } = useGame();

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setGameName('');
      setPlayerNames('');
      setCurrentGameId(initialGameId || null);
      // If in players-only mode or if initialGameId is provided, go straight to players step
      setStep(mode === 'players-only' || initialGameId ? 'players' : 'game');
    }
  }, [isOpen, mode, initialGameId]);

  if (!isOpen) return null;

  const handleCreateGame = () => {
    if (gameName.trim()) {
      const gameId = generateId();
      const playerId = generateId();
      actions.createGame(gameId, playerId, gameName.trim());
      setCurrentGameId(gameId);
      setStep('players');
    }
  };

  const handleAddPlayers = () => {
    const gameId = currentGameId || initialGameId;
    if (!gameId) return;

    const names = playerNames
      .split('\n')
      .map(name => name.trim())
      .filter(Boolean);
    
    names.forEach(name => {
      const playerId = generateId();
      actions.addPlayer(gameId, playerId, name);
    });
    
    onClose();
  };

  const handleCancel = () => {
    if (step === 'players' && currentGameId && !initialGameId) {
      // Only delete the game if we created it in this session
      actions.deleteGame(currentGameId);
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleCancel} />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white dark:bg-black rounded-lg max-w-2xl w-full shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
              <AnimatedHeadline className="text-xl font-semibold text-primary">
                {step === 'game' ? 'Start a New Game' : 'Add Players'}
              </AnimatedHeadline>
              <button
                onClick={handleCancel}
                className="p-1 rounded-full hover:bg-[var(--color-hover)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 'game' && (
                <div className="space-y-6">
                  {/* Create Game */}
                  <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--card-bg)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-[#A69764]" />
                      <h3 className="text-lg font-medium text-primary">Create Game</h3>
                    </div>
                    <p className="text-secondary mb-4">
                      Create a new game for local players to join. All players will use this device.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        placeholder="Game name"
                        className="flex-1 px-3 py-2 rounded-lg w-full border border-[var(--color-border)] bg-[var(--color-input-bg)]"
                        maxLength={30}
                      />
                      <button
                        onClick={handleCreateGame}
                        className="px-4 py-2 rounded-lg bg-[#007664] text-white hover:bg-[#006654]"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  {/* Join Game (disabled) */}
                  <div className="p-4 opacity-50 rounded-lg border border-[var(--color-border)] bg-[var(--card-bg)]">
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon className="w-4 h-4 text-[#A69764]" />
                      <h3 className="text-lg font-medium text-primary">Join Existing Game</h3>
                    </div>
                    <p className="text-secondary mb-4">
                      Coming soon! Join games hosted on other devices.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter game code"
                        className="flex-1 px-3 py-2 rounded-lg w-full border border-[var(--color-border)] bg-[var(--color-input-bg)]"
                        disabled
                      />
                      <button
                        className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-secondary"
                        disabled
                      >
                        Join Game
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 'players' && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="block text-sm font-medium text-primary mb-1">
                      Enter player names
                    </span>
                    <p className="text-sm text-secondary mb-2">
                      Add as many players as you want, one name per line.
                    </p>
                    <textarea
                      value={playerNames}
                      onChange={(e) => setPlayerNames(e.target.value)}
                      className="w-full h-32 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-primary"
                      placeholder="John Doe&#10;Jane Smith&#10;..."
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-4 border-t border-[var(--color-border)]">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-hover)] text-primary"
              >
                Cancel
              </button>
              {step === 'players' && (
                <button
                  onClick={handleAddPlayers}
                  className="px-4 py-2 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A]"
                  disabled={!playerNames.trim()}
                >
                  Add Players
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}