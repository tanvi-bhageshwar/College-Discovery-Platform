import React, { useState } from 'react';
import { Sparkles, Trophy, Wallet, Landmark, TrendingUp, X, Check, Award } from 'lucide-react';
import { College } from '../lib/types';

interface CollegeTableProps {
  colleges: College[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

export const CollegeTable: React.FC<CollegeTableProps> = ({ colleges, onRemove, onClose }) => {
  const [highlightBest, setHighlightBest] = useState(true);

  if (colleges.length === 0) {
    return (
      <div id="compare-empty-state" className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <Landmark className="h-12 w-12 text-slate-300" />
        <h3 className="mt-4 font-sans text-base font-bold text-slate-700">No Colleges to Compare</h3>
        <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
          Go back to the browser catalog and select 2 or 3 colleges using the "Compare" tag.
        </p>
        <button
          id="compare-empty-back-btn"
          type="button"
          onClick={onClose}
          className="mt-6 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 focus:outline-none"
        >
          Browse Colleges
        </button>
      </div>
    );
  }

  // Calculate best values across current selection
  const bestTuition = Math.min(...colleges.map((c) => c.feesPerYear));
  const bestAvgSalary = Math.max(...colleges.map((c) => c.placements.averageSalary));
  const bestPlacementRate = Math.max(...colleges.map((c) => c.placements.placementRate));
  const bestRating = Math.max(...colleges.map((c) => c.rating));

  return (
    <div id="compare-table-container" className="rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Table Action Controls */}
      <div id="table-controls" className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-150 bg-slate-50/50 p-5">
        <div>
          <h3 className="font-sans text-base font-bold text-slate-800">
            Compare ({colleges.length} selected)
          </h3>
          <p className="font-sans text-xs text-slate-500">
            Side-by-side look at tuition, salaries, and overall index.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={highlightBest}
              onChange={(e) => setHighlightBest(e.target.checked)}
              className="h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-300" />
              Highlight Winning Stats
            </span>
          </label>
          <button
            id="close-comparison-btn"
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none"
          >
            Back to Catalog
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] table-fixed border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/20">
              <th className="w-1/4 p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Parameters
              </th>
              {colleges.map((college, idx) => (
                <th key={college.id} className="relative p-4 text-left font-sans align-top">
                  <div id={`table-col-${idx}-header`} className="flex flex-col pr-10">
                    <button
                      id={`remove-table-col-${college.id}`}
                      type="button"
                      onClick={() => onRemove(college.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 focus:outline-none"
                      title="Remove from comparison"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <img
                      src={college.image}
                      alt={college.shortName}
                      className="h-16 w-full rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <h4 className="mt-3.5 text-sm font-extrabold text-slate-800 line-clamp-1">
                      {college.name}
                    </h4>
                    <span className="mt-0.5 font-mono text-[10px] text-slate-400">
                      Rank #{college.ranking}
                    </span>
                  </div>
                </th>
              ))}
              {/* Fill remaining columns to maintain minimum spacing */}
              {colleges.length < 3 &&
                Array.from({ length: 3 - colleges.length }).map((_, idx) => (
                  <th key={`empty-col-${idx}`} className="w-1/4 max-w-[200px] border-b border-slate-100 bg-slate-50/10 p-4 align-top text-center text-slate-300">
                    <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-slate-250 p-4">
                      <p className="font-mono text-[11px] font-medium">Add another college to compare</p>
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 text-sm text-slate-700">
            {/* National Ranking */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider bg-slate-50/10">
                National Rank
              </td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 font-mono text-xs font-bold text-slate-800">
                  #{c.ranking}
                </td>
              ))}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, idx) => <td key={idx} className="p-4 bg-slate-50/5" />)}
            </tr>

            {/* User Rating */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider bg-slate-50/10">
                Overall User Rating
              </td>
              {colleges.map((c) => {
                const isBest = c.rating === bestRating;
                const showHighlight = highlightBest && isBest;
                return (
                  <td
                    key={c.id}
                    className={`p-4 transition-colors ${
                      showHighlight ? 'bg-amber-50/40 text-amber-800 font-semibold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">{c.rating} / 5.0</span>
                      {showHighlight && <Trophy className="h-4 w-4 text-amber-500 fill-amber-300" />}
                    </div>
                  </td>
                );
              })}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, idx) => <td key={idx} className="p-4 bg-slate-50/5" />)}
            </tr>

            {/* Institution Type */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider bg-slate-50/10">
                Institution Type
              </td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                    c.type === 'Private' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {c.type}
                  </span>
                </td>
              ))}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, idx) => <td key={idx} className="p-4 bg-slate-50/5" />)}
            </tr>

            {/* Annual Tuition Fees */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider bg-slate-50/10">
                Annual Tuition Fee
              </td>
              {colleges.map((c) => {
                const isBest = c.feesPerYear === bestTuition;
                const showHighlight = highlightBest && isBest;
                return (
                  <td
                    key={c.id}
                    className={`p-4 font-mono font-bold transition-colors ${
                      showHighlight ? 'bg-teal-50/40 text-teal-800' : 'text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>${c.feesPerYear.toLocaleString()}</span>
                      {showHighlight && (
                        <span className="flex items-center gap-0.5 roundedbg-teal-100 px-1 py-0.5 text-[9px] font-bold text-teal-700">
                          <Wallet className="h-2.5 w-2.5" /> Best Value
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, idx) => <td key={idx} className="p-4 bg-slate-50/5" />)}
            </tr>

            {/* Average Placement Package */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider bg-slate-50/10">
                Avg Placement Package
              </td>
              {colleges.map((c) => {
                const isBest = c.placements.averageSalary === bestAvgSalary;
                const showHighlight = highlightBest && isBest;
                return (
                  <td
                    key={c.id}
                    className={`p-4 font-mono font-bold transition-colors ${
                      showHighlight ? 'bg-emerald-50/40 text-emerald-800' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>${c.placements.averageSalary.toLocaleString()}</span>
                      {showHighlight && (
                        <span className="flex items-center gap-0.5 rounded bg-emerald-100 px-1 py-0.5 text-[9px] text-emerald-700 font-black">
                          <TrendingUp className="h-2.5 w-2.5" /> Top Pay
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, idx) => <td key={idx} className="p-4 bg-slate-50/5" />)}
            </tr>

            {/* Placement Rate */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider bg-slate-50/10">
                Employment / Placement Rate
              </td>
              {colleges.map((c) => {
                const isBest = c.placements.placementRate === bestPlacementRate;
                const showHighlight = highlightBest && isBest;
                return (
                  <td
                    key={c.id}
                    className={`p-4 transition-colors ${
                      showHighlight ? 'bg-blue-50/40 text-blue-800 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{c.placements.placementRate}%</span>
                      {showHighlight && <Award className="h-4 w-4 text-blue-500" />}
                    </div>
                  </td>
                );
              })}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, idx) => <td key={idx} className="p-4 bg-slate-50/5" />)}
            </tr>

            {/* Location */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider bg-slate-50/10">
                Location
              </td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 text-xs">
                  {c.location}, {c.state}, {c.country}
                </td>
              ))}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, idx) => <td key={idx} className="p-4 bg-slate-50/5" />)}
            </tr>

            {/* Accreditation */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider bg-slate-50/10">
                Accreditation
              </td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 text-xs font-semibold text-slate-700">
                  {c.accreditation}
                </td>
              ))}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, idx) => <td key={idx} className="p-4 bg-slate-50/5" />)}
            </tr>

            {/* Campus Size */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider bg-slate-50/10">
                Campus Layout
              </td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 text-xs">
                  {c.campusSize}
                </td>
              ))}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, idx) => <td key={idx} className="p-4 bg-slate-50/5" />)}
            </tr>

            {/* Admission Criteria */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider bg-slate-50/10">
                Admission Standard
              </td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 text-xs font-medium text-slate-600">
                  {c.admissionCriteria}
                </td>
              ))}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, idx) => <td key={idx} className="p-4 bg-slate-50/5" />)}
            </tr>

            {/* Available Programs List */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 text-xs uppercase tracking-wider bg-slate-50/10">
                Featured Programs
              </td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 align-top">
                  <ul className="space-y-2">
                    {c.courses.map((course) => (
                      <li key={course.id} className="rounded-lg bg-slate-50 p-2 text-[11px] leading-tight">
                        <strong className="block text-slate-700 mb-0.5">{course.name}</strong>
                        <span className="text-slate-500">{course.duration} | {course.seats} Seats</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, idx) => <td key={idx} className="p-4 bg-slate-50/5" />)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
