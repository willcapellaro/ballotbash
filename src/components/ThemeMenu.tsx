import React from 'react';
import { Menu, Monitor, Moon, Sun, ChevronDown, Eye, Bug, Trash2, Gamepad2, HelpCircle, PlayCircle, Hash } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { WelcomeModal } from './WelcomeModal';
import { cn } from '../utils';
import { useCoachmarks } from '../hooks/useCoachmarks';

export function ThemeMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDebugOpen, setIsDebugOpen] = React.useState(false);
  const [isClearOpen, setIsClearOpen] = React.useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const { state } = useGame();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const { startTour } = useCoachmarks();

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeIcons = {
    light: <Sun className="w-5 h-5" />,
    dark: <Moon className="w-5 h-5" />,
    system: <Monitor className="w-5 h-5" />
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg ",
          "text-primary hover:bg-[var(--color-hover)]"
        )}
        aria-label="Theme settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Menu className="w-5 h-5" />
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4 z-50">
          <div className="space-y-2 z-55">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 ">
              Theme
            </h3>
            <div className="grid grid-cols-3 gap-2 dark:text-gray-400">
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTheme({ ...theme, mode })}
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
                    theme.mode === mode
                      ? 'bg-[#A69764] text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                  aria-label={`${mode} theme`}
                  aria-pressed={theme.mode === mode}
                >
                  {themeIcons[mode]}
                  <span className="text-xs capitalize">{mode}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setTheme({ ...theme, highContrast: !theme.highContrast })}
            className={cn(
              'flex items-center justify-between w-full p-2 rounded-lg transition-colors',
              theme.highContrast
                ? 'bg-[#A69764] text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
            aria-pressed={theme.highContrast}
          >
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 dark:text-gray-100" />
              <span className="dark:text-gray-100">High Contrast</span>
            </div>
            <div
              className={cn(
                'w-10 h-6 rounded-full p-1 transition-colors',
                theme.highContrast ? 'bg-white' : 'bg-gray-200 dark:bg-gray-600'
              )}
            >
              <div
                className={cn(
                  'w-4 h-4 rounded-full transition-transform',
                  theme.highContrast
                    ? 'bg-[#A69764] translate-x-4'
                    : 'bg-white translate-x-0'
                )}
              />
            </div>
          </button>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Help
            </h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setIsWelcomeOpen(true);
              }}
              className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <HelpCircle className="w-5 h-5 dark:text-gray-400" />
              <span className="dark:text-gray-100">Welcome Guide</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                startTour();
              }}
              className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <PlayCircle className="w-5 h-5 dark:text-gray-400" />
              <span className="dark:text-gray-100">Show Tips</span>
            </button>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => setIsDebugOpen(!isDebugOpen)}
              className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 dark:text-gray-400" />
                <span className="dark:text-gray-400">Debug Options</span>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isDebugOpen && "rotate-180"
              )} />
            </button>
            {isDebugOpen && (
              <div className="pl-4 space-y-2">
                <button
                  onClick={() => setTheme({ ...theme, showGameControls: !theme.showGameControls })}
                  className={cn(
                    'flex items-center justify-between w-full p-2 rounded-lg transition-colors',
                    theme.showGameControls
                      ? 'bg-[#A69764] text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5" />
                    <span>Game Controls</span>
                  </div>
                  <div className={cn(
                    'w-10 h-6 rounded-full p-1 transition-colors',
                    theme.showGameControls ? 'bg-white' : 'bg-gray-200'
                  )}>
                    <div className={cn(
                      'w-4 h-4 rounded-full transition-transform',
                      theme.showGameControls ? 'bg-[#A69764] translate-x-4' : 'bg-white'
                    )} />
                  </div>
                </button>
                <button
                  onClick={() => setTheme({ ...theme, showUuids: !theme.showUuids })}
                  className={cn(
                    'flex items-center justify-between w-full p-2 rounded-lg transition-colors',
                    theme.showUuids
                      ? 'bg-[#A69764] text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    <span>Display UUIDs</span>
                  </div>
                  <div className={cn(
                    'w-10 h-6 rounded-full p-1 transition-colors',
                    theme.showUuids ? 'bg-white' : 'bg-gray-200'
                  )}>
                    <div className={cn(
                      'w-4 h-4 rounded-full transition-transform',
                      theme.showUuids ? 'bg-[#A69764] translate-x-4' : 'bg-white'
                    )} />
                  </div>
                </button>
                <button
                  onClick={() => {
                    const debugData = document.createElement('pre');
                    debugData.textContent = JSON.stringify(state, null, 2);
                    debugData.className = 'bg-[var(--color-bg-secondary)] p-4 rounded overflow-auto text-primary';
                    
                    const container = document.createElement('div');
                    container.className = 'mt-2';
                    container.appendChild(debugData);
                    
                    const existingDebugData = document.querySelector('.debug-data-container');
                    if (existingDebugData) {
                      existingDebugData.remove();
                    }
                    
                    container.classList.add('debug-data-container');
                    const button = document.querySelector('.debug-view-button')?.parentElement;
                    if (button) {
                      button.after(container);
                    }
                  }}
                  className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Bug className="w-5 h-5" />
                  <span className="debug-view-button">View Debug Data</span>
                </button>
                <button
                  onClick={() => setIsClearOpen(true)}
                  className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Clear All Data</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Debug Modal */}
      {/* Clear Data Modal */}
      <div className={cn(
        'fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50',
        !isClearOpen && 'hidden'
      )}>
        <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Clear All Data</h2>
            <button onClick={() => setIsClearOpen(false)} className="text-secondary hover:text-primary">
              ✕
            </button>
          </div>
          <p className="text-secondary mb-6">
            This will clear all game data and return the app to its initial state. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsClearOpen(false)}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-hover)] text-primary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
      />
    </div>
  );
}