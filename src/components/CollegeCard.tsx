import React from 'react';
import { Star, MapPin, Award, DollarSign, ArrowRight, CheckSquare, Square } from 'lucide-react';
import { College } from '../lib/types';

interface CollegeCardProps {
  college: College;
  onViewDetails: (id: string) => void;
  isComparing: boolean;
  onToggleCompare: (id: string) => void;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({
  college,
  onViewDetails,
  isComparing,
  onToggleCompare,
}) => {
  return (
    <div
      id={`college-card-${college.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
    >
      {/* Upper Brand Section */}
      <div id={`college-[${college.id}]-media`} className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={college.image}
          alt={college.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
        
        {/* Absolute Badges on Image */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="inline-flex items-center rounded-lg bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
            Rank #{college.ranking}
          </span>
          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold backdrop-blur-xs ${
            college.type === 'Private' 
              ? 'bg-amber-500/90 text-white' 
              : 'bg-blue-600/95 text-white'
          }`}>
            {college.type}
          </span>
        </div>

        {/* Rating overlay bottom right */}
        <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-lg bg-white/95 px-2 py-0.5 text-xs font-bold text-slate-800 shadow-xs">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
          {college.rating}
        </div>
      </div>

      {/* Middle Content Section */}
      <div id={`college-[${college.id}]-text`} className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 font-sans text-lg font-bold tracking-tight text-slate-800 group-hover:text-blue-600">
          {college.name}
        </h3>
        
        <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span className="truncate">{college.location}, {college.state}</span>
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {college.overview}
        </p>

        {/* Key Stats Grid */}
        <div className="mt-4.5 grid grid-cols-2 gap-2 border-t border-b border-slate-100 py-3 text-xs">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Avg Tuition / Yr
            </span>
            <span className="flex items-center font-mono text-sm font-semibold text-slate-700">
              ${college.feesPerYear ? college.feesPerYear.toLocaleString() : 'N/A'}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Avg Placement
            </span>
            <span className="flex items-center font-mono text-sm font-semibold text-teal-600">
              ${college.placements.averageSalary ? college.placements.averageSalary.toLocaleString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="mt-4 flex items-center justify-between">
          {/* Comparison checkbox toggle */}
          <button
            id={`compare-toggle-btn-${college.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(college.id);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold tracking-tight transition-colors ${
              isComparing
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {isComparing ? (
              <>
                <CheckSquare className="h-4.5 w-4.5 text-blue-600" />
                <span>Comparing</span>
              </>
            ) : (
              <>
                <Square className="h-4.5 w-4.5 text-slate-300" />
                <span>Compare</span>
              </>
            )}
          </button>

          {/* View detail button */}
          <button
            id={`view-details-[${college.id}]`}
            type="button"
            onClick={() => onViewDetails(college.id)}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700"
          >
            <span>Full Profile</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
