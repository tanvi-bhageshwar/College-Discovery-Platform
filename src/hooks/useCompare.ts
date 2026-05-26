import { useState, useEffect, useMemo } from 'react';
import { College } from '../lib/types';
import { COLLEGES } from '../lib/data';

const STORAGE_KEY = 'college_explorer_compare_ids';

export function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
  }, [compareIds]);

  const addCompare = (id: string): { success: boolean; message?: string } => {
    if (compareIds.includes(id)) {
      return { success: false, message: 'College is already in the comparison list.' };
    }
    if (compareIds.length >= 3) {
      return { success: false, message: 'You can compare a maximum of 3 colleges side-by-side.' };
    }
    setCompareIds((prev) => [...prev, id]);
    return { success: true };
  };

  const removeCompare = (id: string) => {
    setCompareIds((prev) => prev.filter((item) => item !== id));
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  const isComparing = (id: string): boolean => {
    return compareIds.includes(id);
  };

  const toggleCompare = (id: string): { success: boolean; message?: string } => {
    if (isComparing(id)) {
      removeCompare(id);
      return { success: true };
    } else {
      return addCompare(id);
    }
  };

  const comparedColleges = useMemo(() => {
    return compareIds
      .map((id) => COLLEGES.find((c) => c.id === id))
      .filter((c): c is College => !!c);
  }, [compareIds]);

  return {
    compareIds,
    comparedColleges,
    addCompare,
    removeCompare,
    clearCompare,
    isComparing,
    toggleCompare,
  };
}
