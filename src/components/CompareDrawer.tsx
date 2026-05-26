import React from 'react';
import { X, ArrowRight, ArrowRightLeft, Sparkles } from 'lucide-react';
import { College } from '../lib/types';

interface CompareDrawerProps {
  comparedColleges: College[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompareNow: () => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  comparedColleges,
  onRemove,
  onClear,
  onCompareNow,
}) => {
  if (comparedColleges.length === 0) return null;

  return (
    <div
      id="compare-drawer-wrapper"
      className="fixed right-0 bottom-0 left-0 z-40 bg-white/95 border-t border-slate-200 shadow-2xl backdrop-blur-md px-4 py-4 md:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Info Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-sans text-sm font-bold text-slate-800">
              College Comparison Queue
            </h4>
            <p className="font-sans text-xs text-slate-500">
              {comparedColleges.length} of 3 selected. Add more to compare side-by-side.
            </p>
          </div>
        </div>

        {/* Selected Items List */}
        <div className="flex flex-1 flex-wrap items-center gap-2.5 md:justify-center">
          {comparedColleges.map((college) => (
            <div
              id={`drawer-item-${college.id}`}
              key={college.id}
              className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-1.5 pr-2.5 shadow-xs transition-colors hover:bg-slate-50"
            >
              <img
                src={college.image}
                alt={college.shortName}
                className="h-8 w-8 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="max-w-[120px] truncate text-xs font-semibold text-slate-700">
                {college.shortName}
              </span>
              <button
                id={`remove-drawer-item-${college.id}`}
                type="button"
                onClick={() => onRemove(college.id)}
                className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 focus:outline-none"
                aria-label={`Remove ${college.shortName}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {comparedColleges.length < 3 && (
            <div className="hidden items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-slate-400 md:flex">
              <Sparkles className="h-3.5 w-3.5 text-slate-300" />
              <span className="font-sans text-[11px]">Slot {comparedColleges.length + 1} Open</span>
            </div>
          )}
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-3 border-t border-slate-100 pt-3 md:border-t-0 md:pt-0">
          <button
            id="clear-all-compare-btn"
            type="button"
            onClick={onClear}
            className="px-3.5 py-2 font-sans text-xs font-semibold text-slate-500 hover:text-blue-600"
          >
            Clear All
          </button>
          
          <button
            id="compare-queue-now-btn"
            type="button"
            onClick={onCompareNow}
            disabled={comparedColleges.length < 2}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold shadow-xs transition-colors focus:outline-none ${
              comparedColleges.length >= 2
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Compare Side-by-Side
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
