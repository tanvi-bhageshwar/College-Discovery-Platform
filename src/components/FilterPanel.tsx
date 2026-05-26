import React from 'react';
import { SlidersHorizontal, RotateCcw, Earth, DollarSign, Award, Grid3X3 } from 'lucide-react';
import { CollegeFilters } from '../lib/types';

interface FilterPanelProps {
  filters: CollegeFilters;
  onChange: (filters: CollegeFilters) => void;
  onReset: () => void;
  countriesList: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  countriesList,
}) => {
  const handleCountryToggle = (country: string) => {
    const nextCountries = filters.country.includes(country)
      ? filters.country.filter((c) => c !== country)
      : [...filters.country, country];
    onChange({ ...filters, country: nextCountries });
  };

  const setFeesMax = (max: number) => {
    onChange({ ...filters, feesRange: [filters.feesRange[0], max] });
  };

  return (
    <div
      id="filter-panel-wrapper"
      className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div id="filter-header" className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-slate-800">
          <SlidersHorizontal id="sliders-icon" className="h-4.5 w-4.5 text-blue-600" />
          <h2 id="filter-title" className="font-sans text-sm font-semibold uppercase tracking-wider text-slate-700">
            Search Filters
          </h2>
        </div>
        <button
          id="reset-filters-btn"
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 font-sans text-xs font-semibold text-slate-500 hover:text-blue-600"
        >
          <RotateCcw id="reset-icon" className="h-3.5 w-3.5" />
          Reset All
        </button>
      </div>

      <div id="filter-sections" className="space-y-6">
        {/* Sort By Section */}
        <div id="sort-section">
          <label id="sort-label" className="mb-2 block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sort Order
          </label>
          <select
            id="sort-select"
            value={filters.sortBy}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-700 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:outline-none"
          >
            <option value="ranking">National Rank (Low to High)</option>
            <option value="rating">User Rating (High to Low)</option>
            <option value="fees-low-to-high">Average Fee (Low to High)</option>
            <option value="fees-high-to-low">Average Fee (High to Low)</option>
            <option value="placement-rate">Placement Rate (High to Low)</option>
          </select>
        </div>

        {/* College Type Section */}
        <div id="type-section">
          <label id="type-label" className="mb-2.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Institution Type
          </label>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
            {(['All', 'Public', 'Private'] as const).map((type) => (
              <button
                id={`type-btn-${type.toLowerCase()}`}
                key={type}
                type="button"
                onClick={() => onChange({ ...filters, type })}
                className={`rounded-lg py-1.5 text-center text-xs font-medium transition-all ${
                  filters.type === type
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Fees Range Slider Section */}
        <div id="fees-section">
          <div className="mb-2.5 flex items-center justify-between">
            <span id="fees-label" className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <DollarSign className="h-3.5 w-3.5" /> Max Tuition Fee (USD/Yr)
            </span>
            <span id="fees-val" className="font-mono text-sm font-semibold text-blue-600">
              ${filters.feesRange[1].toLocaleString()}
            </span>
          </div>
          <input
            id="fees-range-slider"
            type="range"
            min={100}
            max={70000}
            step={500}
            value={filters.feesRange[1]}
            onChange={(e) => setFeesMax(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 focus:outline-none"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-400">
            <span>$100</span>
            <span>$70,000</span>
          </div>
        </div>

        {/* Country Filter */}
        <div id="country-section">
          <span id="country-label" className="mb-2.5 flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Earth className="h-3.5 w-3.5" /> Countries
          </span>
          <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
            {countriesList.map((country) => {
              const isChecked = filters.country.includes(country);
              return (
                <label
                  key={country}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 transition-all hover:bg-slate-50 ${
                    isChecked ? 'border-blue-100 bg-blue-50/20' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCountryToggle(country)}
                      className="h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-medium text-slate-700">{country}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Placements Section */}
        <div id="placements-section">
          <span id="placements-label" className="mb-2.5 flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Award className="h-3.5 w-3.5" /> Placement Rate (Min)
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 85, 90, 95].map((rate) => (
              <button
                id={`placement-rate-btn-${rate}`}
                key={rate}
                type="button"
                onClick={() => onChange({ ...filters, placementRateMin: rate })}
                className={`rounded-lg py-1.5 text-center text-xs font-medium border transition-all ${
                  filters.placementRateMin === rate
                    ? 'border-blue-600 bg-blue-50/40 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {rate === 0 ? 'Any' : `${rate}%+`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
