import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Trophy, Film, HelpCircle, ChevronRight, X, Sparkles, Circle, CircleDot, Eye, ChevronDown } from 'lucide-react';
import { AnimatedHeadline } from './AnimatedHeadline';
import { useGame } from '../contexts/GameContext';
import { useCoachmarks } from '../hooks/useCoachmarks';
import { cn } from '../utils';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type Page = 'welcome' | 'watched' | 'prepare' | 'final';

const pages: Page[] = ['welcome', 'watched', 'prepare', 'final'];

export function WelcomeModal({ isOpen, onClose }: Props) {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [hideOnStartup, setHideOnStartup] = useState(false);
  const [preparationChoices, setPreparationChoices] = useState<Set<string>>(new Set());
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Blockbusters': false,
    'Rare Gems': false,
    'Shorts': false
  });
  const { startTour } = useCoachmarks();
  const { nominees, state, actions } = useGame();
  const playerData = state.playerData[state.currentGameId || 'default']?.[state.currentPlayerId || 'default'] || 
    { votes: {}, seen: [] };
  const [tempSeen, setTempSeen] = useState<Set<string>>(new Set());

  // Reset temp state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTempSeen(new Set(playerData.seen));
    }
  }, [isOpen]);

  const sections = [
    { title: 'Blockbusters', range: [0, 3] },
    { title: 'Rare Gems', range: [4, 6] },
    { title: 'Shorts', range: [7, 12] }
  ];

  const sectionFilms = React.useMemo(() => {
    const uniqueFilms = new Map();
    
    return sections.reduce((acc, section) => {
      const films = nominees
        .filter(n => n.order >= section.range[0] && n.order <= section.range[1])
        .reduce((filmAcc, nominee) => {
          if (!uniqueFilms.has(nominee.filmCode)) {
            uniqueFilms.set(nominee.filmCode, true);
            filmAcc.push({
              filmCode: nominee.filmCode,
              film: nominee.film,
              emoji: nominee.emoji
            });
          }
          return filmAcc;
        }, [] as { filmCode: string; film: string; emoji?: string }[]);

      acc[section.title] = films.sort((a, b) => a.film.localeCompare(b.film));
      return acc;
    }, {} as Record<string, { filmCode: string; film: string; emoji?: string }[]>);
  }, [nominees]);
  
  // Reset to first page when opened from menu
  React.useEffect(() => {
    if (isOpen) {
      setCurrentPage('welcome');
      setPreparationChoices(new Set());
      setHideOnStartup(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (hideOnStartup) {
      localStorage.setItem('ballotbash_hide_welcome', 'true');
    }
    onClose();
  };

  const handleSaveAndNext = () => {
    actions.updateSeenFilms(Array.from(tempSeen));
    handleNext();
  };

  const handleNext = () => {
    switch (currentPage) {
      case 'welcome':
        setCurrentPage('watched');
        break;
      case 'watched':
        setCurrentPage('prepare');
        break;
      case 'prepare':
        setCurrentPage('final');
        break;
      case 'final':
        handleClose();
        break;
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            {/* overlay */}
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-[var(--modal-bg)] bg-white rounded-lg max-w-md w-full shadow-xl transform transition-all">
                  {/* Header */}
                  <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
                    <AnimatedHeadline className="text-xl font-semibold text-primary">
                      {currentPage === 'welcome' && 'Welcome to Ballot Bash!'}
                      {currentPage === 'watched' && 'What Have You Watched?'}
                      {currentPage === 'prepare' && 'Watch More Films!'}
                      {currentPage === 'final' && (preparationChoices.size > 0 ? "You're Almost Ready!" : "Help Available")}
                    </AnimatedHeadline>
                    <button
                      onClick={handleClose}
                      className="p-1 rounded-full hover:bg-[var(--color-hover)]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {currentPage === 'welcome' && (
                      <div className="space-y-4">
                        <div className="flex justify-center mb-6">
                          <Trophy className="w-16 h-16 text-[#A69764]" />
                        </div>
                        <p className="text-secondary">
                          Pick your Oscar winners, earn points when they win, and check your score while watching the show!
                        </p>
                        <p className="text-secondary">
                          On March 2, play solo or with friends and see how you did.
                        </p>
                      </div>
                    )}

                    {currentPage === 'watched' && (
                      <div className="space-y-4">
                        <div className="flex justify-center mb-6">
                          <Film className="w-16 h-16 text-[#A69764]" />
                        </div>
                        <p className="text-secondary mb-4">
                          There are many categories to vote in, but we can make voting easier if we know what you've seen.
                        </p>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
                          {sections.map(section => (
                            <div key={section.title} className="border border-[var(--color-border)] rounded-lg">
                              <button
                                onClick={() => setOpenSections(prev => ({
                                  ...prev,
                                  [section.title]: !prev[section.title]
                                }))}
                                className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-hover)]"
                              >
                                <span className="font-medium">{section.title}</span>
                                <ChevronDown className={cn(
                                  "w-4 h-4 transition-transform",
                                  openSections[section.title] && "rotate-180"
                                )} />
                              </button>
                              
                              {openSections[section.title] && (
                                <div className="p-4 pt-0 flex flex-wrap gap-2">
                                  {sectionFilms[section.title]?.map(film => (
                                    <button
                                      key={film.filmCode}
                                      onClick={() => {
                                        setTempSeen(prev => {
                                          const next = new Set(prev);
                                          if (next.has(film.filmCode)) {
                                            next.delete(film.filmCode);
                                          } else {
                                            next.add(film.filmCode);
                                          }
                                          return next;
                                        });
                                      }}
                                      className={cn(
                                        'flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors',
                                        tempSeen.has(film.filmCode)
                                          ? 'bg-[#A69764] text-white border-[#A69764]'
                                          : 'border-gray-200 hover:border-[#A69764]'
                                      )}
                                    >
                                      {film.emoji && (
                                        <span className="text-lg">{film.emoji}</span>
                                      )}
                                      <span>{film.film}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentPage === 'prepare' && (
                      <div className="space-y-4">
                        <div className="flex justify-center mb-6">
                          <Sparkles className="w-16 h-16 text-[#A69764]" />
                        </div>
                        <p className="text-secondary mb-6">
                          Want help finding movies to watch before or after?
                        </p>
                        <div className="space-y-3">
                          <label className={cn(
                            "flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)] cursor-pointer transition-colors",
                            preparationChoices.has('prepare') && "bg-[#A69764] text-white border-[#A69764]",
                            !preparationChoices.has('prepare') && "hover:bg-[var(--color-hover)]"
                          )}>
                            <input
                              type="checkbox"
                              className="mt-1"
                              checked={preparationChoices.has('prepare')}
                              onChange={(e) => {
                                const newChoices = new Set(preparationChoices);
                                if (e.target.checked) {
                                  newChoices.add('prepare');
                                } else {
                                  newChoices.delete('prepare');
                                }
                                setPreparationChoices(newChoices);
                              }}
                            />
                            <div className="flex-1">
                              Help me prepare for the Oscars
                            </div>
                          </label>
                          <label className={cn(
                            "flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)] cursor-pointer transition-colors",
                            preparationChoices.has('winners') && "bg-[#A69764] text-white border-[#A69764]",
                            !preparationChoices.has('winners') && "hover:bg-[var(--color-hover)]"
                          )}>
                            <input
                              type="checkbox"
                              className="mt-1"
                              checked={preparationChoices.has('winners')}
                              onChange={(e) => {
                                const newChoices = new Set(preparationChoices);
                                if (e.target.checked) {
                                  newChoices.add('winners');
                                } else {
                                  newChoices.delete('winners');
                                }
                                setPreparationChoices(newChoices);
                              }}
                            />
                            <div className="flex-1">
                              Help me watch Oscar winners later
                            </div>
                          </label>
                        </div>
                      </div>
                    )}

                    {currentPage === 'final' && (
                      <div className="space-y-4">
                        <div className="flex justify-center mb-6">
                          <HelpCircle className="w-16 h-16 text-[#A69764]" />
                        </div>
                        <p className="text-secondary">
                          Thanks! You can always access this guide in the menu. Next, we'll give you a brief tour of the app.
                        </p>
                        <label className="flex items-center gap-2 mt-6">
                          <input
                            type="checkbox"
                            checked={hideOnStartup}
                            onChange={(e) => setHideOnStartup(e.target.checked)}
                            className="rounded border-gray-300 text-[#A69764] focus:ring-[#A69764]"
                          />
                          <span className="text-secondary">Hide this on startup</span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Page Dots */}
                  <div className="flex justify-center gap-2 pb-4">
                    {pages.map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className="p-1 text-[#A69764] hover:text-[#95875A] transition-colors"
                      >
                        {currentPage === page ? (
                          <CircleDot className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between p-4 border-t border-[var(--color-border)]">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 rounded-lg text-secondary hover:text-primary hover:bg-[var(--color-hover)]"
                    >
                      {currentPage === 'final' ? 'Skip Tour' : 'Skip Intro'}
                    </button>
                    <button
                      onClick={currentPage === 'watched' ? handleSaveAndNext : handleNext}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A]"
                    >
                      {currentPage === 'final' ? (
                        <span onClick={() => {
                          handleClose();
                          startTour();
                        }}>
                          Start Tour
                        </span>
                      ) : 'Next'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}