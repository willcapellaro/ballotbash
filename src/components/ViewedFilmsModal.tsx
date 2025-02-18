import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatedHeadline } from './AnimatedHeadline';
import { type Nominee } from '../types';
import { cn } from '../utils';
import { useGame } from '../contexts/GameContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  nominees: Nominee[];
};

type Section = {
  title: string;
  range: [number, number];
  defaultOpen?: boolean;
};

const sections: Section[] = [
  { title: 'Blockbusters', range: [0, 3], defaultOpen: true },
  { title: 'Rare Gems', range: [4, 6] },
  { title: 'Shorts', range: [7, 12] }
];

const initialOpenSections = sections.reduce((acc, section) => ({
  ...acc,
  [section.title]: !!section.defaultOpen
}), {} as Record<string, boolean>);

export function ViewedFilmsModal({ isOpen, onClose, nominees }: Props) {
  const { state, actions } = useGame();
  const playerData = useMemo(() => (
    state.playerData[state.currentGameId || 'default']?.[state.currentPlayerId || 'default'] || 
    { votes: {}, seen: [] }
  ), [state.playerData, state.currentGameId, state.currentPlayerId]);
  
  const [tempSeen, setTempSeen] = useState(() => new Set(playerData.seen));
  const [openSections, setOpenSections] = useState(initialOpenSections);

  // Reset temp state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSeen(new Set(playerData.seen));
    }
  }, [isOpen, playerData.seen]);

  const sectionFilms = useMemo(() => {
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

  const toggleFilm = (filmCode: string) => {
    setTempSeen(prev => {
      const next = new Set(prev);
      if (next.has(filmCode)) {
        next.delete(filmCode);
      } else {
        next.add(filmCode);
      }
      return next;
    });
  };

  const handleSave = () => {
    actions.updateSeenFilms(Array.from(tempSeen));
    onClose();
  };

  return (
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
              <Dialog.Panel className="bg-white dark:bg-black rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
          <AnimatedHeadline className="text-xl font-semibold text-primary dark:text-gray-100">
            Which movies have you seen this year?
          </AnimatedHeadline>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--color-hover)] rounded-full text-primary dark:text-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {sections.map(section => (
            <div key={section.title} className="border border-[var(--color-border)] rounded-lg bg-white dark:bg-black">
              <button
                onClick={() => setOpenSections(prev => ({
                  ...prev,
                  [section.title]: !prev[section.title]
                }))}
                className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-hover)] text-primary dark:text-gray-100"
              >
                <span className="font-medium">{section.title}</span>
                {openSections[section.title] ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              
              {openSections[section.title] && (
                <div className="p-4 pt-0 flex flex-wrap gap-2">
                  {sectionFilms[section.title]?.map(film => (
                    <button
                      key={film.filmCode}
                      onClick={() => toggleFilm(film.filmCode)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors',
                        tempSeen.has(film.filmCode)
                          ? 'bg-[#A69764] text-white border-[#A69764]'
                          : 'border-gray-200 hover:border-[#A69764] text-primary dark:text-gray-100'
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

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-hover)] text-primary dark:text-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#A69764] text-white hover:bg-[#95875A]"
          >
            Save Changes
          </button>
        </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}