import { useState, useMemo, useEffect } from 'react';
import { College, CollegeFilters } from '../lib/types';
import { COLLEGES } from '../lib/data';

const DEFAULT_FILTERS: CollegeFilters = {
  searchQuery: '',
  country: [],
  type: 'All',
  sortBy: 'ranking',
  feesRange: [0, 70000],
  placementRateMin: 0,
};

export function useSearch() {
  const [filters, setFilters] = useState<CollegeFilters>(DEFAULT_FILTERS);
  const [typedSearch, setTypedSearch] = useState('');

  // Debounce the typed search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchQuery: typedSearch }));
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [typedSearch]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setTypedSearch('');
  };

  const countriesList = useMemo(() => {
    const set = new Set(COLLEGES.map((c) => c.country));
    return Array.from(set).sort();
  }, []);

  const filteredColleges = useMemo(() => {
    let result = [...COLLEGES];

    // Search query filter (matches name, shortName, location, or course names)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.courses.some((course) => course.name.toLowerCase().includes(q))
      );
    }

    // Country multi-select filter
    if (filters.country.length > 0) {
      result = result.filter((c) => filters.country.includes(c.country));
    }

    // College type filter
    if (filters.type !== 'All') {
      result = result.filter((c) => c.type === filters.type);
    }

    // Placement Minimum Rate filter
    if (filters.placementRateMin > 0) {
      result = result.filter((c) => c.placements.placementRate >= filters.placementRateMin);
    }

    // Fees range filter
    result = result.filter(
      (c) => c.feesPerYear >= filters.feesRange[0] && c.feesPerYear <= filters.feesRange[1]
    );

    // Sorting logic
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'ranking':
          // Lower rank value is better (e.g. #1 Rank > #10 Rank)
          return a.ranking - b.ranking;
        case 'rating':
          return b.rating - a.rating;
        case 'fees-low-to-high':
          return a.feesPerYear - b.feesPerYear;
        case 'fees-high-to-low':
          return b.feesPerYear - a.feesPerYear;
        case 'placement-rate':
          return b.placements.placementRate - a.placements.placementRate;
        default:
          return 0;
      }
    });

    return result;
  }, [filters]);

  return {
    typedSearch,
    setTypedSearch,
    filters,
    setFilters,
    resetFilters,
    countriesList,
    filteredColleges,
  };
}
