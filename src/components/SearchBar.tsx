import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
  totalCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama makanan, minuman, atau menu..."
          aria-label="Cari produk menu"
          className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs transition-all"
        />

        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            aria-label="Hapus pencarian"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <div className="p-1 rounded-full hover:bg-slate-100">
              <X className="w-4 h-4" />
            </div>
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="mt-2 text-xs text-slate-500 flex items-center justify-between px-1">
          <span>
            Ditemukan <strong>{resultCount}</strong> dari {totalCount} menu
          </span>
          <button
            onClick={() => onSearchChange('')}
            className="text-rose-600 hover:underline font-medium cursor-pointer"
          >
            Reset pencarian
          </button>
        </div>
      )}
    </div>
  );
};
