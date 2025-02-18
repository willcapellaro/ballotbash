import React, { useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Star, Eye, FilterX } from 'lucide-react';
import { type Nominee, type SortMode, type CellRendererProps } from '../types';
import { cn, groupBy } from '../utils';
import { useGame } from '../contexts/GameContext';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

type Props = {
  nominees: Nominee[];
  sortMode: SortMode;
  setFilters: (filters: Filters) => void;
  setSortMode: (mode: SortMode) => void;
  scoreMode: boolean;
  players: string[];
};

export function DataTable({
  nominees,
  sortMode,
  setSortMode,
  setFilters,
  scoreMode,
  players
}: Props) {
  const { state, actions } = useGame();
  const playerData = state.playerData[state.currentGameId || 'default']?.[state.currentPlayerId || 'default'] || 
    { votes: {}, seen: [] };

  const ActionsRenderer = useCallback(({ data: nominee }: CellRendererProps) => {
    const isVoted = playerData.votes[nominee.catCode] === nominee.id;
    const isSeen = playerData.seen.includes(nominee.filmCode);

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            actions.vote(nominee.id);
          }}
          className={cn(
            'p-1 rounded transition-all duration-300',
            isVoted ? 'text-[#A69764]' : 'text-[var(--color-icon-inactive)]',
            !state.votingLocked && !isVoted && 'hover:text-[#A69764] cursor-pointer',
            state.votingLocked && 'cursor-not-allowed'
          )}
          disabled={state.votingLocked}
        >
          <Star className={cn(
            'w-6 h-6 transition-transform duration-300',
            isVoted && 'fill-current scale-110'
          )} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            actions.toggleSeen(nominee.id);
          }}
          className={cn(
            'p-1 rounded transition-colors duration-300',
            isSeen ? 'text-[#A69764]' : 'text-[var(--color-icon-inactive)]',
            !isSeen && 'hover:text-[#A69764]'
          )}
        >
          <Eye 
            className="w-6 h-6"
            strokeWidth={isSeen ? 2.5 : 2}
          />
        </button>
      </div>
    );
  }, [actions, playerData.votes, playerData.seen, state.votingLocked]);

  /**
   * Renders a film cell with optional emoji, film title, and additional metadata.
   * Handles special cases for Music and International Feature categories by displaying
   * additional information like song titles or country names.
   */
  const FilmRenderer = useCallback(({ value, data }: CellRendererProps) => {
    const renderEmoji = () => {
      if (!data.emoji) return null;
      return <span className="nominee-emoji">{data.emoji}</span>;
    };

    const renderMetadata = () => {
      if (data.category === "Music, Original Song" && data.music) {
        return <span className="text-gray-500 ml-2">• {data.music}</span>;
      }
      if (data.category === "International Feature Film" && data.country) {
        return <span className="text-gray-500 ml-2">• {data.country}</span>;
      }
      return null;
    };

    return (
      <div className="film-cell">
        {renderEmoji()}
        <span>{value}</span>
        {renderMetadata()}
      </div>
    );
  }, []);

  const getRowClass = useCallback((params: any) => (
    playerData.seen.includes(params.data.filmCode) ? 'opacity-100' : 'opacity-75'
  ), [playerData.seen]);

  const columnDefs = useMemo(() => [
    {
      field: 'category',
      headerName: 'Category',
      sortable: true,
      filter: true,
      flex: 1
    },
    {
      field: 'film',
      headerName: 'Film',
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: FilmRenderer,
      getQuickFilterText: (params: any) => params.value,
      valueGetter: (params: any) => params.data.film
    },
    {
      field: 'names',
      headerName: 'Nominee(s)',
      sortable: true,
      filter: true,
      flex: 1.5,
      valueGetter: (params: any) => params.data.names.join(', ')
    },
    {
      headerName: 'Actions',
      cellRenderer: ActionsRenderer,
      sortable: false,
      width: 120,
      cellClass: 'ag-cell-actions'
    }
  ], [players, scoreMode, sortMode, playerData, FilmRenderer, ActionsRenderer]);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    suppressMovable: true
  }), []);

  const onSortChanged = useCallback((params: any) => {
    const [sortColumn] = params.columnApi.getColumnState()
      .filter((col: any) => col.sort)
      .map((col: any) => col.colId);
    
    if (sortColumn) {
      setSortMode(sortColumn as SortMode);
    }
  }, [setSortMode]);

  return (
    <div className="w-full">
      {nominees.length === 0 ? (
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
        <div className="ag-theme-alpine w-full h-[calc(100vh-200px)]">
      <AgGridReact
        immutableData={true}
        getRowId={(params) => params.data.id}
        suppressCellFocus={true}
        rowData={nominees}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowHeight={48}
        headerHeight={48}
        animateRows={true}
        onSortChanged={onSortChanged}
        getRowClass={getRowClass}
      />
        </div>
      )}
    </div>
  );
}