import React, { useState, useEffect, useMemo } from 'react';
import { Search, Menu, ChevronDown, Check, Clapperboard } from 'lucide-react';
import anime from 'animejs/lib/anime.es.js';
import { Toaster } from 'react-hot-toast';
import { DataTable } from './components/DataTable';
import { Header } from './components/Header';
import { ViewToggle } from './components/ViewToggle';
import { CardView } from './components/CardView';
import { ScoreBoard } from './components/ScoreBoard';
import { PlayerStats } from './components/PlayerStats';
import { GameControl } from './components/GameControl';
import { ScoringView } from './components/ScoringView';
import { ScoreDrawer } from './components/ScoreDrawer';
import { BackToTop } from './components/BackToTop';
import { GameProvider } from './contexts/GameContext';
import { ThemeProvider, ThemeContext, useTheme } from './contexts/ThemeContext';
import { useGame } from './contexts/GameContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { WelcomeModal } from './components/WelcomeModal';
import { NaturalSentenceControl } from './components/NaturalSentenceControl';
import { type ViewMode, type SortMode, type Nominee } from './types';

function AppContent({ showScoreBar }: { showScoreBar: boolean }) {
  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem('ballotbash_hide_welcome') !== 'true';
  });
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('ballotbash_view_mode');
    return (saved as ViewMode) || 'card';
  });
  const [sortMode, setSortMode] = useState<SortMode>('category');
  const { theme } = useTheme();
  const [filters, setFilters] = useState<Filters>({
    seen: false,
    unseen: false,
    voted: false,
    notVoted: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreMode, setScoreMode] = useState(false);
  const [isScoreDrawerOpen, setIsScoreDrawerOpen] = useState(false);
  const [prefersReducedMotion] = useState(() => 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [hasInitialAnimationPlayed, setHasInitialAnimationPlayed] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const animateMotion = () => {
    if (prefersReducedMotion) return;
    
    // Wrap each letter in a span
    const textWrapper = document.querySelector('.letters');
    if (!textWrapper) return;
    
    textWrapper.innerHTML = textWrapper.textContent!.replace(/\S/g, "<span class='letter inline-block leading-none'>$&</span>");

    // First reverse the current state
    anime.timeline({ loop: false })
      .add({
        targets: '.letter',
        translateY: [0, "1.2em"],
        translateZ: 0,
        duration: 600,
        delay: (el, i) => 30 * i,
        easing: 'easeInExpo',
        complete: () => {
          // Then animate forward again
          anime.timeline({ loop: false })
            .add({
              targets: '.letter',
              translateY: ["1.2em", 0],
              translateZ: 0,
              duration: 1000,
              delay: (el, i) => 30 * i,
              easing: 'easeOutExpo'
            });
        }
      });
  };

  // Handle initial animation after welcome modal closes
  useEffect(() => {
    if (!showWelcome && !hasInitialAnimationPlayed && !prefersReducedMotion) {
      animateMotion();
      setHasInitialAnimationPlayed(true);
    }
  }, [showWelcome, hasInitialAnimationPlayed, prefersReducedMotion]);
  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ballotbash_view_mode', viewMode);
  }, [viewMode]);

  // Handle Cmd/Ctrl + F
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  const [activeView, setActiveView] = useState<'vote' | 'score'>('vote');
  
  const { state, nominees } = useGame();
  const playerData = state.playerData[state.currentGameId || 'default']?.[state.currentPlayerId || 'default'] || { votes: {}, seen: [] };

  const filteredNominees = nominees.filter(nominee => {
    if (filters.seen && !playerData.seen.includes(nominee.filmCode)) return false;
    if (filters.unseen && playerData.seen.includes(nominee.filmCode)) return false;
    if (filters.voted && !playerData.votes[nominee.catCode]) return false;
    if (filters.notVoted && playerData.votes[nominee.catCode]) return false;
    
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        nominee.category.toLowerCase().includes(searchLower) ||
        nominee.film.toLowerCase().includes(searchLower) ||
        nominee.names.some(name => name.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  const groupedNominees = useMemo(() => {
    return nominees.reduce((acc, nominee) => {
      const key = nominee.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(nominee);
      return acc;
    }, {} as Record<string, Nominee[]>);
  }, [nominees]);

  return (
    <div className="min-h-screen bg-primary">
      {/* 1. Site header */}
      <Header 
        isHost={state.currentGameId ? state.games[state.currentGameId]?.hostId === state.currentPlayerId : false}
        players={state.currentGameId ? state.games[state.currentGameId]?.players.map(p => p.name) : []}
        scoreMode={scoreMode}
        setScoreMode={setScoreMode}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenScoring={() => setIsScoreDrawerOpen(true)}
      />
      
      {/* Game Controls */}
      {theme.showGameControls && <GameControl />}
      
      {activeView === 'vote' ? (
        <div>
          {/* Intro Section */}
          <div className="container mx-auto px-4 py-8 text-center">
            <div className="mx-auto">
              <div className="flex justify-center mb-4">
                <button
                  onClick={animateMotion}
                  className="p-2 rounded-full hover:bg-[var(--color-hover)] transition-colors"
                >
                  <Clapperboard className="w-16 h-16 text-[#A69764]" />
                </button>
              </div>
              <h1 
                className="text-4xl font-light mb-2 text-[#A69764] dark:text-[#D4C9A6] relative cursor-pointer"
                onClick={animateMotion}
              >
                <span className="text-wrapper relative inline-block overflow-hidden">
                  <span className="letters inline-block">Cast your 2025 Oscar ballot</span>
                </span>
              </h1>
              <div className="text-xl text-secondary mb-6">
                The 97th Academy Awards 🏆  Celebrating the greatest films of 2024
              </div>
              <div className="flex items-center justify-center">
                <NaturalSentenceControl />
              </div>
            </div>
          </div>

          {/* Filter Section - Sticky */}
          <div className="sticky bg-white top-0 z-40 bg-[var(--player-stats-bg)] border-b border-[var(--color-border)] shadow-sm">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Filter Controls */}
                <div className="flex items-center gap-4 flex-wrap">
                  <PlayerStats filters={filters} setFilters={setFilters} />
                </div>
                
                {/* Search and View Controls */}
                <div className="flex items-center gap-4 flex-1 md:justify-end">
                  <div className="relative flex-1 md:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      ref={searchInputRef}
                      data-coachmark="search"
                      type="search"
                      placeholder="Search nominees..."
                      className="w-full pl-9 pr-4 py-2 text-base rounded-lg border border-gray-200 bg-[var(--color-input-bg)] text-primary"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <ViewToggle value={viewMode} onChange={setViewMode} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-[#007664] dark:text-[#4DB5A6]">
                The Nominees are:
              </h2>
            </div>
            
            {viewMode === 'table' ? (
              <DataTable
                nominees={filteredNominees}
                sortMode={sortMode}
                setSortMode={setSortMode}
                setFilters={setFilters}
                scoreMode={scoreMode}
                players={state.currentGameId ? state.games[state.currentGameId]?.players.map(p => p.name) : []}
              />
            ) : (
              <CardView
                nominees={filteredNominees}
                setFilters={setFilters}
                groupBy={sortMode === 'category' ? 'category' : 'film'}
              />
            )}

            {scoreMode && (
              <ScoreBoard
                nominees={nominees}
                votes={playerData.votes}
                players={state.currentGameId ? state.games[state.currentGameId]?.players.map(p => p.name) : []}
                winners={{}}
              />
            )}
          </main>
          <BackToTop />
        </div>
      ) : (
        <>
        <div className="transform transition-transform duration-300 ease-in-out">
          <ScoringView />
        </div>
        </>
      )}

      <ScoreDrawer
        isOpen={isScoreDrawerOpen}
        onClose={() => setIsScoreDrawerOpen(false)}
      />

      <Toaster position="bottom-right" />
      
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <GameProvider>
          <AppThemeWrapper />
        </GameProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function AppThemeWrapper() {
  const { theme } = useTheme();
  return <AppContent showScoreBar={theme.showScoreBar} />;
}

export default App;