import { useEffect, useCallback } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function useCoachmarks() {
  const driverObj = driver({
    animate: true,
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    steps: [
      {
        element: '[data-coachmark="vote-tab"]',
        popover: {
          title: 'Vote Tab',
          description: 'Do all your voting from this tab!',
          side: 'bottom',
          align: 'start'
        }
      },
        {
        element: '[data-coachmark="vote-filter"]',
        popover: {
          title: 'Voting',
          description: 'Click ⭐️ anywhere in the app to cast a vote! Use the vote filters to organize your view.',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '[data-coachmark="view-filter"]',
        popover: {
          title: 'Track your watched',
          description: 'Click 👁️ anywhere to mark any films you have watched. Use the watch filters to customize your view — watch bias is okay!',
          side: 'bottom',
          align: 'start'
        }
      },
        {
        element: '[data-coachmark="search"]',
        popover: {
          title: 'Search',
          description: 'Search for films, nominees, or by award category.',
          side: 'bottom',
          align: 'start'
        }
      },
        {
        element: '[data-coachmark="view-toggle"]',
        popover: {
          title: 'View controls',
          description: 'Switch between card view or table view!',
          side: 'bottom',
          align: 'start'
        }
      },
        {
        element: '[data-coachmark="score-tab"]',
        popover: {
          title: 'Scorekeeping',
          description: 'When you are ready to watch, use this tab to view your scores!',
          side: 'bottom',
          align: 'start'
        }
      },
      {
        element: '[data-coachmark="join-game"]',
        popover: {
          title: 'Game controls',
          description: 'Join or start a game party with friends.',
          side: 'bottom',
          align: 'start'
        }
      }
    ]
  });

  const startTour = useCallback(() => {
    driverObj.drive();
  }, [driverObj]);

  return { startTour };
}