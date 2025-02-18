import React, { useState } from 'react';
import { X, Users, Link as LinkIcon } from 'lucide-react';
import { AnimatedHeadline } from './AnimatedHeadline';
import { cn } from '../utils';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAddPlayers: (players: string[]) => void;
};

type Step = 'type' | 'names';

export function AddPlayerModal({ isOpen, onClose, onAddPlayers }: Props) {
  const [step, setStep] = useState<Step>('type');
  const [playerType, setPlayerType] = useState<'local' | 'network'>('local');
  const [playerNames, setPlayerNames] = useState('');

  const handleSubmit = () => {
    const names = playerNames
      .split('\n')
      .map(name => name.trim())
      .filter(Boolean);
    
    if (names.length > 0) {
      onAddPlayers(names);
      onClose();
      // Reset state
      setStep('type');
      setPlayerType('local');
      setPlayerNames('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--color-modal-overlay)] flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-black rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
          <AnimatedHeadline className="text-xl font-semibold text-primary dark:text-gray-100">
            Add Players
          </AnimatedHeadline>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--color-hover)] text-primary dark:text-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'type' ? (
            <div className="space-y-4">
              {/* Local Players Option */}
              <label className="flex items-start gap-3 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--card-bg)] cursor-pointer hover:bg-[var(--color-hover)]">
                <input
                  type="radio"
                  name="playerType"
                  checked={playerType === 'local'}
                  onChange={() => setPlayerType('local')}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#A69764]" />
                    <span className="font-medium text-primary dark:text-gray-100">Add Local Players</span>
                  </div>
                  <p className="text-sm text-secondary dark:text-gray-300 mt-1">
                    Pass this device around for voting. Each player will take turns making their selections.
                  </p>
                </div>
              </label>

              {/* Network Players Option */}
              <label className="flex items-start gap-3 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--card-bg)] cursor-not-allowed opacity-50">
                <input
                  type="radio"
                  name="playerType"
                  checked={playerType === 'network'}
                  onChange={() => setPlayerType('network')}
                  disabled
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-[#A69764]" />
                    <span className="font-medium text-primary dark:text-gray-100">Invite via Link</span>
                  </div>
                  <p className="text-sm text-secondary dark:text-gray-300 mt-1">
                    Coming soon! Players will be able to vote on their own devices by joining with a game code.
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block">
                <span className="block text-sm font-medium text-primary dark:text-gray-100 mb-1">
                  Enter player names
                </span>
                <p className="text-sm text-secondary dark:text-gray-300 mb-2">
                  Add as many players as you want, one name per line. You can always add more later.
                </p>
                <textarea
                  value={playerNames}
                  onChange={(e) => setPlayerNames(e.target.value)}
                  className="w-full h-32 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-primary dark:text-gray-100 focus:border-[#A69764] focus:ring focus:ring-[#A69764] focus:ring-opacity-50"
                  placeholder="John Doe&#10;Jane Smith&#10;..."
                />
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-hover)] text-primary dark:text-gray-100"
          >
            Cancel
          </button>
          {step === 'type' ? (
            <button
              onClick={() => setStep('names')}
              className={cn(
                'px-4 py-2 rounded-lg',
                playerType === 'local'
                  ? 'bg-[#A69764] text-white hover:bg-[#95875A]'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              )}
              disabled={playerType !== 'local'}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A]"
              disabled={!playerNames.trim()}
            >
              Add Players
            </button>
          )}
        </div>
      </div>
    </div>
  );
}