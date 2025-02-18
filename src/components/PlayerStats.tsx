import React from 'react';
import { Eye, Star, RotateCcw, Film, Trash2, ChevronDown } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { ViewedFilmsModal } from './ViewedFilmsModal';
import { ConfirmModal } from './ConfirmModal';
import { cn } from '../utils';
import { type Filters } from '../types';

type Props = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
};

function VoteMenu({ isOpen, onClose, filters, setFilters, onClearVotes }: {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onClearVotes: () => void;
}) {
  if (!isOpen) return null;
  
  return (
    <div className="absolute bg-white top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-[200px] z-50">
      <button
        onClick={() => {
          setFilters({ ...filters, voted: false, notVoted: false });
          onClose();
        }}
        className={cn(
          "flex items-center gap-2 w-full p-2 rounded",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          !filters.voted && !filters.notVoted && "bg-[#A69764] text-white"
        )}
      >
        <Star className="w-4 h-4 dark:text-gray-400" />
        <span className="dark:text-gray-100">Show all</span>
      </button>
      <button
        onClick={() => {
          setFilters({ ...filters, voted: false, notVoted: true });
          onClose();
        }}
        className={cn(
          "flex items-center gap-2 w-full p-2 rounded",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          filters.notVoted && "bg-[#A69764] text-white"
        )}
      >
        <Star className="w-4 h-4 dark:text-gray-400" />
        <span className="dark:text-gray-100" data-coachmark="filter-recommendation">Show categories I haven't voted for</span>
      </button>
      <button
        onClick={() => {
          setFilters({ ...filters, voted: true, notVoted: false });
          onClose();
        }}
        className={cn(
          "flex items-center gap-2 w-full p-2 rounded",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          filters.voted && "bg-[#A69764] text-white"
        )}
      >
        <Star className="w-4 h-4 fill-current dark:text-gray-400" />
        <span className="dark:text-gray-100">Show categories I have voted for</span>
      </button>
      <div className="border-t my-2" />
      <button
        onClick={() => { onClearVotes(); onClose(); }}
        className="flex items-center gap-2 w-full p-2 rounded text-red-600 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 dark:text-red-500" />
        <span className="dark:text-red-300">Clear my votes</span>
      </button>
    </div>
  );
}

function WatchedMenu({ isOpen, onClose, filters, setFilters, onEditWatched }: {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onEditWatched: () => void;
}) {
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-[200px] z-50">
      <button
        onClick={() => {
          setFilters({ ...filters, seen: false, unseen: false, voted: filters.voted, notVoted: filters.notVoted });
          onClose();
        }}
        className={cn(
          "flex items-center gap-2 w-full p-2 rounded",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          !filters.seen && !filters.unseen && "bg-[#A69764] text-white"
        )}
      >
        <Star className="w-4 h-4 dark:text-gray-400" />
        <span className="dark:text-gray-100">Show all</span>
      </button>
      <button
        onClick={() => {
          setFilters({ ...filters, seen: true, unseen: false, voted: filters.voted, notVoted: filters.notVoted });
          onClose();
        }}
        className={cn(
          "flex items-center gap-2 w-full p-2 rounded",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          filters.seen && "bg-[#A69764] text-white"
        )}
      >
        <Eye className="w-4 h-4 dark:text-gray-400" />
        <span className="dark:text-gray-100">Show films I have watched</span>
      </button>
      <button
        onClick={() => {
          setFilters({ ...filters, seen: false, unseen: true, voted: filters.voted, notVoted: filters.notVoted });
          onClose();
        }}
        className={cn(
          "flex items-center gap-2 w-full p-2 rounded",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          filters.unseen && "bg-[#A69764] text-white"
        )}
      >
        <Eye className="w-4 h-4 dark:text-gray-400" />
        <span className="dark:text-gray-100">Show films I haven't watched</span>
      </button>
      <div className="border-t my-2" />
      <button
        onClick={() => { onEditWatched(); onClose(); }}
        className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Film className="w-4 h-4 dark:text-gray-400" />
        <span className="dark:text-gray-100">Edit my watched films</span>
      </button>
    </div>
  );
}

export function PlayerStats({ filters, setFilters }: Props) {
  const [isViewedModalOpen, setIsViewedModalOpen] = React.useState(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = React.useState(false);
  const [voteMenuOpen, setVoteMenuOpen] = React.useState(false);
  const [watchedMenuOpen, setWatchedMenuOpen] = React.useState(false);
  const { stats, actions, nominees } = useGame();

  return (
    <>
            {/* Vote Stats */}
            <div className="relative">
              <button
                onClick={() => setVoteMenuOpen(!voteMenuOpen)}
                onBlur={() => setTimeout(() => setVoteMenuOpen(false), 100)}
                className="flex items-center  gap-2 px-0 py-2 dark:text-gray-300 rounded-lg hover:bg-[var(--color-hover)]" data-coachmark="vote-filter"
              >
                <Star className="w-5 h-5 text-[#A69764]" />
                <span className="hidden md:inline text-primary">
                  
                  You&rsquo;ve voted for{' '}
                  <strong>
                    {stats.votedCategories} of {stats.totalCategories}
                  </strong>{' '}
                  categories
                </span>
                <span className="md:hidden text-primary">
                  {stats.votedCategories}/{stats.totalCategories}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <VoteMenu
                isOpen={voteMenuOpen}
                onClose={() => setVoteMenuOpen(false)}
                filters={filters}
                setFilters={setFilters}
                onClearVotes={() => setIsConfirmClearOpen(true)}
              />
            </div>

            {/* Watch Stats */}
            <div className="relative">
              <button
                onClick={() => setWatchedMenuOpen(!watchedMenuOpen)}
                onBlur={() => setTimeout(() => setWatchedMenuOpen(false), 100)}
                className="flex items-center gap-2 px-1 py-2 dark:text-gray-300 rounded-lg hover:bg-[var(--color-hover)]" data-coachmark="view-filter"
              >
                <Eye className="w-5 h-5 text-[#A69764]" />
                <span className="hidden md:inline text-primary" >
                  You&rsquo;ve Watched{' '}
                  <strong>
                    {stats.seenFilms} of {stats.totalFilms}
                  </strong>{' '}
                  films
                </span>
                <span className="md:hidden text-primary">
                  {stats.seenFilms}/{stats.totalFilms}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <WatchedMenu
                isOpen={watchedMenuOpen}
                onClose={() => setWatchedMenuOpen(false)}
                filters={filters}
                setFilters={setFilters}
                onEditWatched={() => setIsViewedModalOpen(true)}
              />
            </div>

            {/* Reset Filters */}
      {/* actually works */}
            <button
              onClick={() => setFilters({ seen: false, unseen: false, voted: false, notVoted: false })}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg",
                "text-secondary hover:text-primary hover:bg-[var(--color-hover)]"
              )}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">Reset Filters</span>
            </button>

      <ViewedFilmsModal
        isOpen={isViewedModalOpen}
        onClose={() => setIsViewedModalOpen(false)}
        nominees={nominees}
      />

      <ConfirmModal
        isOpen={isConfirmClearOpen}
        title="Clear My Votes"
        message="Are you sure you want to clear all your votes? This action cannot be undone."
        onConfirm={() => {
          actions.clearVotes();
          setIsConfirmClearOpen(false);
        }}
        onCancel={() => setIsConfirmClearOpen(false)}
      />
    </>
  );
}