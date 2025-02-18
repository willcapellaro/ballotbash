import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { type ViewMode } from '../types';

type Props = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 bg-[var(--card-bg)] rounded-lg border border-[var(--color-border)] p-1" data-coachmark="view-toggle">
      <button
        onClick={() => onChange('card')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-primary ${
          value === 'card' ? 'bg-[var(--color-hover)]' : ''
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span>Cards</span>
      </button>
      <button
        onClick={() => onChange('table')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-primary ${
          value === 'table' ? 'bg-[var(--color-hover)]' : ''
        }`}
      >
        <List className="w-4 h-4" />
        <span>Table</span>
      </button>
    </div>
  );
}