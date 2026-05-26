export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number; // Annual tuition
  seats: number;
}

export interface PlacementInfo {
  averageSalary: number; // annual
  highestSalary: number; // annual
  placementRate: number; // e.g. 95 (for 95%)
  topRecruiters: string[];
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  categoryRatings: {
    academics: number;
    infrastructure: number;
    accommodation: number;
    campusLife: number;
  };
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  location: string;
  state: string;
  country: string;
  rating: number;
  type: 'Public' | 'Private';
  feesPerYear: number; // average annual fees
  overview: string;
  courses: Course[];
  placements: PlacementInfo;
  reviews: Review[];
  image: string;
  bannerImage: string;
  established: number; // year
  ranking: number; // national rank
  accreditation: string;
  campusSize: string;
  admissionCriteria: string;
}

export interface CollegeFilters {
  searchQuery: string;
  country: string[];
  type: 'All' | 'Public' | 'Private';
  sortBy: 'ranking' | 'rating' | 'fees-low-to-high' | 'fees-high-to-low' | 'placement-rate';
  feesRange: [number, number];
  placementRateMin: number;
}
