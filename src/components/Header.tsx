import React from 'react';
import { Award, Vote, Users, Info } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { cn } from '../utils';
import { ThemeMenu } from './ThemeMenu';
import { GameModal } from './GameModal';
import { useCoachmarks } from '../hooks/useCoachmarks';

type Props = {
  isHost: boolean;
  players: string[];
  scoreMode: boolean;
  setScoreMode: (value: boolean) => void;
  activeView: 'vote' | 'score';
  setActiveView: (view: 'vote' | 'score') => void;
  onOpenScoring: () => void;
};

export function Header({
  isHost,
  players,
  scoreMode,
  setScoreMode,
  activeView,
  setActiveView,
  onOpenScoring
}: Props) {
  const { state, actions, nominees } = useGame();
  const [showGameModal, setShowGameModal] = React.useState(false);
  const { startTour } = useCoachmarks();

  // Calculate score completion for the button
  const scorekeepingData = state.playerData.default?.scorekeeping || { votes: {}, seen: [] };
  const completedCount = Object.keys(scorekeepingData.votes).length;
  const totalCategories = new Set(nominees.map(n => n.catCode)).size;

  return (
    <div className="bg-[var(--header-bg)] border-b border-[var(--color-border)]">
      {/* Main Header */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="BallotBash" className="h-12" />
            <h1 className="text-2xl font-light text-primary">
              Your 2025 Oscars Party!
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="flex gap-4">
              <button
                data-coachmark="vote-tab"
                onClick={() => setActiveView('vote')}
                className={cn(
                  'px-4 py-2 border-b-2 transition-colors',
                  activeView === 'vote'
                    ? 'border-[#007664] text-[#007664] dark:text-[#4DB5A6]'
                    : 'border-transparent text-secondary hover:text-[#007664] dark:hover:text-[#4DB5A6]'
                )}
              >
                <div className="flex items-center gap-2">
                  <Vote className="w-4 h-4" />
                  <span>Vote</span>
                </div>
              </button>
              <button
                data-coachmark="score-tab"
                onClick={() => setActiveView('score')}
                className={cn(
                  'px-4 py-2 border-b-2 transition-colors',
                  activeView === 'score'
                    ? 'border-[#007664] text-[#007664] dark:text-[#4DB5A6]'
                    : 'border-transparent text-secondary hover:text-[#007664] dark:hover:text-[#4DB5A6]'
                )}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Keep Score</span>
                </div>
              </button>
            </nav>
            <button
              data-coachmark="join-game"
              onClick={() => setShowGameModal(true)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                'border border-[#007664] text-[#007664] dark:text-[#4DB5A6] hover:bg-[#F3DBD2] dark:hover:bg-[#1A3D38]'
              )}
            >
              <Users className="w-5 h-5" />
              <span>Join or Start a Game</span>
            </button>
            <ThemeMenu />
          </div>
        </div>
      </div>

      <GameModal
        isOpen={showGameModal}
        mode="full"
        onClose={() => setShowGameModal(false)}
      />
    </div>
  );
}