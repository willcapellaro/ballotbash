import React, { useMemo, useState } from 'react';
import { Star, Eye, Menu, ChevronDown, Check, FilterX } from 'lucide-react';
import { type Nominee } from '../types';
import { cn } from '../utils';
import { useGame } from '../contexts/GameContext';

const MERLOT_COLOR = '#722F37';
const GOLD_COLOR = '#A69764';

// Preload images for faster switching between views
function preloadImages(nominees: Nominee[]) {
  nominees.forEach(nominee => {
    if (nominee.posterUrl) {
      const backdropImg = new Image();
      backdropImg.src = nominee.posterUrl;
      const posterImg = new Image();
      posterImg.src = nominee.posterUrl.replace('.jpg', '-t.jpg');
    }
  });
}

type Props = {
  nominees: Nominee[];
  groupBy: 'category' | 'film';
  setFilters: (filters: Filters) => void;
};

export function CardView({ nominees, groupBy, setFilters }: Props) {
  const { state, actions, nominees: allNominees } = useGame();
  const playerData = state.playerData[state.currentGameId || 'default']?.[state.currentPlayerId || 'default'] || { votes: {}, seen: [] };
  const scorekeepingData = state.playerData.default?.scorekeeping || { votes: {}, seen: [] };

  const [categoryMenus, setCategoryMenus] = useState<Record<string, boolean>>({});

  // Preload images on component mount
  React.useEffect(() => {
    preloadImages(allNominees);
  }, [allNominees]);

  const groupedNominees = useMemo(() => {
    return nominees.reduce((acc, nominee) => {
      const key = groupBy === 'category' ? nominee.category : nominee.film;
      if (!acc[key]) acc[key] = [];
      acc[key].push(nominee);
      return acc;
    }, {} as Record<string, Nominee[]>);
  }, [nominees, groupBy]);

  return (
    nominees.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-12 text-secondary">
        <FilterX className="w-12 h-12 mb-4 text-[#A69764]" />
        <p className="text-lg mb-4">All nominees filtered</p>
        <button
          onClick={() => setFilters({ seen: false, unseen: false, voted: false, notVoted: false })}
          className="px-4 py-2 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A] cursor-pointer transition-all duration-200 active:scale-95"
        >
          Reset Filters
        </button>
      </div>
    ) : (
    <div className="space-y-8">
      {Object.entries(groupedNominees).map(([group, groupNominees]) => (
        <div key={group} className="relative bg-[var(--card-bg)] rounded-lg shadow-lg">
          {/* sticky category headings */}
          <div 
            id={`category-${group.replace(/[^a-z0-9]/gi, '')}`} 
            className="sticky bg-white dark:bg-black top-[120px] md:top-[72px] px-6 py-4 bg-[var(--card-bg)] z-20 border-b border-[var(--color-border)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-light text-[#007664]">
                {group}
              </h2>
              <div className="relative">
                <button
                  onClick={() => setCategoryMenus(prev => ({ ...prev, [group]: !prev[group] }))}
                  onBlur={() => setTimeout(() => setCategoryMenus(prev => ({ ...prev, [group]: false })), 100)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-hover)]"
                >
                  <Menu className="w-5 h-5" />
                  <span className="text-secondary">Jump to Category</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {categoryMenus[group] && (
                  <div className="absolute right-0 mt-1 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-[var(--color-border)] p-2 z-50">
                    {Object.keys(groupedNominees).map(category => {
                      const categoryNominees = groupedNominees[category];
                      const hasVote = categoryNominees.some(nominee => 
                        playerData.votes[nominee.catCode] === nominee.id
                      );
                      
                      return (
                        <button
                          key={category}
                          onClick={() => {
                            const el = document.getElementById(`category-${category.replace(/[^a-z0-9]/gi, '')}`);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth' });
                              setCategoryMenus(prev => ({ ...prev, [group]: false }));
                            }
                          }}
                          className="flex items-center justify-between w-full p-2 rounded hover:bg-[var(--color-hover)] text-left"
                        >
                          <span className="text-primary">{category}</span>
                          {hasVote && <Check className="w-4 h-4 text-[#A69764]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6 p-6 pt-4">
            {groupNominees.map(nominee => {
              const isVoted = playerData.votes[nominee.catCode] === nominee.id;
              const isSeen = playerData.seen.includes(nominee.filmCode);
              const isWinner = scorekeepingData.votes[nominee.catCode] === nominee.id;

              return (
                <div 
                  key={nominee.id}
                  className={cn(
                    'bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 relative border-b-8 z-10',
                    isVoted ? 'border-[#A69764]' : 'border-transparent',
                    'hover:shadow-xl'
                  )} 
                >
                  <div className="relative aspect-[16/9]">
                    {nominee.posterUrl && (
                      <>
                        <img 
                          src={nominee.posterUrl} 
                          alt={`${nominee.film} backdrop`}
                          className="absolute inset-0 w-full h-full object-contain bg-black"
                        />
                        <img 
                          src={nominee.posterUrl.replace('.jpg', '-t.jpg')} 
                          alt={`${nominee.film} poster`}
                          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-full w-auto max-w-[45%] object-contain  transition-transform duration-300"
                        />
                      </>
                    )}
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="font-medium mb-3">
                      <div className="flex items-center gap-2">
                        {nominee.emoji && (
                          <span className="nominee-emoji">{nominee.emoji}</span>
                        )}
                        <span className="text-lg">{nominee.film}</span>
                      </div>
                      <div>
                        {nominee.category === "Music, Original Song" && nominee.music && (
                          <span className="text-gray-500 ml-2 text-base">• {nominee.music}</span>
                        )}
                        {nominee.category === "International Feature Film" && nominee.country && (
                          <span className="text-gray-500 ml-2 text-base">• {nominee.country}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-base text-gray-600 mb-4">
                      <span className="text-secondary">{nominee.names.join(', ')}</span>
                    </p>
                    <div className={cn(
                      'flex items-center justify-between p-2 -mx-4 -mb-4 mt-2',
                      isWinner && (isVoted ? `bg-[${GOLD_COLOR}]` : `bg-[${MERLOT_COLOR}]`),
                      isWinner && 'text-white'
                    )}>
                      <span className="text-sm">
                        {isWinner 
                          ? `${nominee.category} - Winner (1pt)`
                          : nominee.category
                        }
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => actions.vote(nominee.id)}
                          className={cn(
                            "group flex items-center gap-2 p-1 rounded transition-all duration-300",
                            isWinner && 'text-white hover:text-white'
                          )}
                        >
                          <div className="relative">
                            <Star 
                              className={cn(
                                'w-6 h-6 transition-all duration-300',
                                isVoted && !isWinner && 'fill-[#A69764] text-[#A69764] scale-110',
                                isVoted && isWinner && 'fill-white scale-110',
                                !isVoted && !isWinner && 'hover:text-[#A69764]'
                              )}
                            />
                            {isVoted && (
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-[#A69764] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Your Pick
                              </span>
                            )}
                          </div>
                        </button>
                        <button
                          onClick={() => actions.toggleSeen(nominee.id)}
                          className={cn(
                            'p-1 rounded transition-colors duration-300',
                            isSeen && !isWinner && 'text-[#A69764]',
                            isSeen && isWinner && 'text-white',
                            !isSeen && !isWinner && 'hover:text-[#A69764]',
                            !isSeen && isWinner && 'text-white/70 hover:text-white'
                          )}
                        >
                          <Eye 
                            className="w-6 h-6"
                            strokeWidth={isSeen ? 3 : 2}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
    )
  );
}