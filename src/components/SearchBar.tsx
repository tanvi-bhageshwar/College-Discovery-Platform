import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  resultCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, resultCount }) => {
  return (
    <div id="search-bar-container" className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Search id="search-icon" className="h-5 w-5" />
        </div>
        <input
          id="college-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by college name, place, short form, or courses..."
          className="block w-full rounded-2xl border border-slate-200 bg-white py-3.5 pr-11 pl-11 text-base text-slate-800 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        {value && (
          <button
            id="clear-search-btn"
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label="Clear school search"
          >
            <X id="clear-search-icon" className="h-5 w-5" />
          </button>
        )}
      </div>
      <div id="search-result-indicator" className="mt-2.5 px-1 font-mono text-xs text-slate-500">
        Found <span className="font-semibold text-slate-700">{resultCount}</span> colleges match your criteria
      </div>
    </div>
  );
};
