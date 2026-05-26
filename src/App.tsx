import { useState, useMemo } from 'react';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { CollegeCard } from './components/CollegeCard';
import { CompareDrawer } from './components/CompareDrawer';
import { CollegeTable } from './components/CollegeTable';
import { CollegeDetailView } from './components/CollegeDetailView';
import { PredictorTool } from './components/PredictorTool';
import { useSearch } from './hooks/useSearch';
import { useCompare } from './hooks/useCompare';
import { COLLEGES } from './lib/data';
import { College, Review } from './lib/types';
import { Landmark, ArrowRightLeft, Sparkles, Star, MapPin, Award, DollarSign, Calculator, Search } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'catalog' | 'detail' | 'compare' | 'predictor'>('catalog');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);

  // Search, filtration and sorting hook
  const {
    typedSearch,
    setTypedSearch,
    filters,
    setFilters,
    resetFilters,
    countriesList,
    filteredColleges,
  } = useSearch();

  // Compare queue hook
  const {
    comparedColleges,
    removeCompare,
    clearCompare,
    isComparing,
    toggleCompare,
  } = useCompare();

  // Selected college details reference
  const selectedCollege = useMemo(() => {
    if (!selectedCollegeId) return null;
    return COLLEGES.find((c) => c.id === selectedCollegeId) || null;
  }, [selectedCollegeId]);

  // Saved colleges state
  const [savedColleges, setSavedColleges] = useState<College[]>([]);

  const toggleSaveCollege = (college: College) => {
    setSavedColleges((prev) => {
      const isSaved = prev.some((c) => c.id === college.id);
      if (isSaved) {
        return prev.filter((c) => c.id !== college.id);
      } else {
        return [...prev, college];
      }
    });
  };

  // Handler to allow users to write a review inside the detail view and persist it in their browser session
  const handleUpdateReviews = (id: string, nextReviews: Review[]) => {
    const collegeRef = COLLEGES.find((c) => c.id === id);
    if (collegeRef) {
      collegeRef.reviews = nextReviews;
      collegeRef.rating = parseFloat(
        (nextReviews.reduce((sum, r) => sum + r.rating, 0) / nextReviews.length).toFixed(1)
      );
    }
  };

  const handleCollegeDetailClick = (id: string) => {
    setSelectedCollegeId(id);
    setActiveView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToCatalog = () => {
    setActiveView('catalog');
    setSelectedCollegeId(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div id="app-viewport-wrapper" className="min-h-screen bg-slate-50/50 pb-28 text-slate-800 antialiased">
       {/* Prime Header Block */}
      <header id="app-banner-header" className="sticky top-0 z-35 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div
            id="branding-logo-trigger"
            onClick={handleReturnToCatalog}
            className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Landmark className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="font-sans text-lg font-black tracking-tight text-slate-900">
                COLLEGE EXPLORER
              </h1>
              <span className="block font-sans text-[10px] uppercase tracking-widest text-blue-600 font-bold">
                Smart side-by-side search
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden items-center gap-1.5 md:flex">
            <button
              id="nav-catalog-btn"
              type="button"
              onClick={() => {
                setActiveView('catalog');
                setSelectedCollegeId(null);
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeView === 'catalog' || activeView === 'detail'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>Browse Directory</span>
            </button>

            <button
              id="nav-predictor-btn"
              type="button"
              onClick={() => {
                setActiveView('predictor');
                setSelectedCollegeId(null);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeView === 'predictor'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Predictor Tool</span>
            </button>

            <button
              id="nav-compare-btn"
              type="button"
              onClick={() => {
                setActiveView('compare');
                setSelectedCollegeId(null);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeView === 'compare'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>Compare Matrices ({comparedColleges.length})</span>
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {comparedColleges.length > 0 && activeView !== 'compare' && (
              <button
                id="header-shortcut-compare-btn"
                type="button"
                onClick={() => {
                  setActiveView('compare');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hidden items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-3.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 sm:flex"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>Queue ({comparedColleges.length})</span>
              </button>
            )}
            <span className="rounded-full bg-slate-100 px-3 py-1 text-center font-mono text-[10px] font-semibold text-slate-500">
              Active Database: 50 Institutes
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Sub-Navbar Navigation */}
      <div id="mobile-sub-navbar" className="sticky top-[73px] z-30 border-b border-slate-200 bg-white px-2 py-2 shadow-2xs md:hidden">
        <div className="flex justify-around gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveView('catalog');
              setSelectedCollegeId(null);
            }}
            className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer ${
              activeView === 'catalog' || activeView === 'detail'
                ? 'text-blue-600 font-black'
                : 'text-slate-500'
            }`}
          >
            <Search className="h-4 w-4" />
            <span>Browse</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveView('predictor');
              setSelectedCollegeId(null);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer ${
              activeView === 'predictor'
                ? 'text-blue-600 font-black'
                : 'text-slate-500'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>Predictor</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveView('compare');
              setSelectedCollegeId(null);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer ${
              activeView === 'compare'
                ? 'text-blue-600 font-black'
                : 'text-slate-500'
            }`}
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span>Compare ({comparedColleges.length})</span>
          </button>
        </div>
      </div>

      {/* Main Structural Body */}
      <main id="app-primary-layout" className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        
        {/* VIEW: COLLEGE SEARCH / CATALOG CATALOG */}
        {activeView === 'catalog' && (
          <div id="catalog-view" className="space-y-8 animate-fade-in">
            {/* Search Top Header section */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-sans text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
                  Find Your Perfect Institution Match
                </h2>
                <p className="mt-1 text-xs text-slate-500 max-w-xl leading-relaxed">
                  Browse through 50 accredited colleges and institutes across different parameters. Compare annual expenses, career outcomes, and ratings side-by-side.
                </p>
              </div>

              {/* Dynamic search input component */}
              <SearchBar
                value={typedSearch}
                onChange={setTypedSearch}
                resultCount={filteredColleges.length}
              />
            </div>

            {/* Split layout: Filter options left, core listings to the right */}
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Filter panel Left col */}
              <div className="lg:col-span-1">
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  onReset={resetFilters}
                  countriesList={countriesList}
                />
              </div>

              {/* Catalog result list Right col */}
              <div className="lg:col-span-3 space-y-6">
                {filteredColleges.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredColleges.map((college) => (
                      <CollegeCard
                        key={college.id}
                        college={college}
                        onViewDetails={handleCollegeDetailClick}
                        isComparing={isComparing(college.id)}
                        onToggleCompare={toggleCompare}
                      />
                    ))}
                  </div>
                ) : (
                  <div id="no-matches-view" className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center">
                    <div className="rounded-full bg-slate-50 p-4 text-slate-300">
                      <Landmark className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="mt-5 font-sans text-base font-extrabold text-slate-700">No Matching Colleges</h3>
                    <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">
                      Your combination of selection parameters didn't return any institutions. Try loosening tuition caps, country tags, or rating constraints.
                    </p>
                    <button
                      id="reset-no-match-btn"
                      type="button"
                      onClick={resetFilters}
                      className="mt-6 rounded-xl bg-blue-600 px-4.5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 focus:outline-none"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SIDE-BY-SIDE MATRIX */}
        {activeView === 'compare' && (
          <div id="compare-view" className="space-y-6 animate-fade-in">
            <CollegeTable
              colleges={comparedColleges}
              onRemove={removeCompare}
              onClose={handleReturnToCatalog}
            />
          </div>
        )}

        {/* VIEW: COLLEGE DETAIL PAGE */}
        {activeView === 'detail' && selectedCollege && (
          <div id="detail-view" className="animate-fade-in">
            <CollegeDetailView
              college={selectedCollege}
              onBack={handleReturnToCatalog}
              isComparing={isComparing(selectedCollege.id)}
              onToggleCompare={toggleCompare}
              onUpdateCollegeReviews={handleUpdateReviews}
            />
          </div>
        )}

        {/* VIEW: ADMISSION PREDICTOR */}
        {activeView === 'predictor' && (
          <div id="predictor-view" className="animate-fade-in">
            <PredictorTool
              onViewDetails={handleCollegeDetailClick}
              savedColleges={savedColleges}
              onToggleSave={toggleSaveCollege}
            />
          </div>
        )}
      </main>

      {/* FIXED QUEUE DRAWER FOR SIDE COMPONENT */}
      {activeView !== 'compare' && (
        <CompareDrawer
          comparedColleges={comparedColleges}
          onRemove={removeCompare}
          onClear={clearCompare}
          onCompareNow={() => {
            setActiveView('compare');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
