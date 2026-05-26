import { College, Course, Review } from './types';

// Helper to generate realistic placeholder reviews
const generateReviews = (collegeName: string, baseRating: number): Review[] => {
  const reviewsData = [
    {
      username: 'Alex Cooper',
      comment: `Incredible academics and a very active student life. The peer group at ${collegeName} is extremely driven and pushes you to do your best every day. Industry alignment is top notch.`,
    },
    {
      username: 'Priya Sharma',
      comment: `The campus infrastructure of ${collegeName} is world-class, especially the labs and research libraries. The transition from lectures to real-world applications is seamless here. Highly recommend!`,
    },
    {
      username: 'Daniel K.',
      comment: `Academic rigor can be a bit overwhelming sometimes, but the placement cells and career fairs make it totally worth the grind. Met some of my closest friends and inspiring mentors.`,
    },
    {
      username: 'Sofia Martinez',
      comment: `Amazing culture and student support systems. The dorms are comfortable and the campus is super beautiful throughout the year. Faculty is very approachable.`,
    },
  ];

  return reviewsData.map((rev, index) => {
    // Generate slight variations in rating around the baseRating
    const offset = (index % 2 === 0 ? 0.2 : -0.2) + (index === 0 ? 0.3 : -0.1);
    const rating = Math.min(5, Math.max(3, parseFloat((baseRating + offset).toFixed(1))));
    
    return {
      id: `rev-${collegeName.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      username: rev.username,
      rating,
      comment: rev.comment,
      date: new Date(2025, 4 - index, 12 - index * 2).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      categoryRatings: {
        academics: Math.min(5, Math.round(rating + 0.2)),
        infrastructure: Math.min(5, Math.round(rating - 0.1)),
        accommodation: Math.min(5, Math.round(rating - 0.3)),
        campusLife: Math.min(5, Math.round(rating + 0.1)),
      },
    };
  });
};

// Raw template list of colleges with their distinctive traits
const FAMOUS_COLLEGES_DATA = [
  { name: 'Massachusetts Institute of Technology', shortName: 'MIT', location: 'Cambridge, MA', country: 'United States', state: 'Massachusetts', rating: 4.9, type: 'Private' as const, fees: 59750, ranking: 1, established: 1861, size: '168 Acres', criteria: 'SAT / ACT + Advanced Math/Science Portfolio', accr: 'NECHE' },
  { name: 'Stanford University', shortName: 'Stanford', location: 'Stanford, CA', country: 'United States', state: 'California', rating: 4.9, type: 'Private' as const, fees: 61730, ranking: 2, established: 1885, size: '8180 Acres', criteria: 'SAT / ACT / Stanford Admissions Essay', accr: 'WASC' },
  { name: 'Harvard University', shortName: 'Harvard', location: 'Cambridge, MA', country: 'United States', state: 'Massachusetts', rating: 4.8, type: 'Private' as const, fees: 58220, ranking: 3, established: 1636, size: '5093 Acres', criteria: 'SAT / ACT + Multi-disciplinary Interviews', accr: 'NECHE' },
  { name: 'Indian Institute of Technology, Bombay', shortName: 'IIT Bombay', location: 'Mumbai, Maharashtra', country: 'India', state: 'Maharashtra', rating: 4.8, type: 'Public' as const, fees: 2800, ranking: 4, established: 1958, size: '550 Acres', criteria: 'JEE Advanced Exam Rank (Top 2000)', accr: 'NBA, NAAC A++' },
  { name: 'Indian Institute of Technology, Delhi', shortName: 'IIT Delhi', location: 'New Delhi, Delhi', country: 'India', state: 'Delhi', rating: 4.7, type: 'Public' as const, fees: 2900, ranking: 5, established: 1961, size: '325 Acres', criteria: 'JEE Advanced Exam Rank (Top 2500)', accr: 'NBA, NAAC A++' },
  { name: 'California Institute of Technology', shortName: 'Caltech', location: 'Pasadena, CA', country: 'United States', state: 'California', rating: 4.8, type: 'Private' as const, fees: 60810, ranking: 6, established: 1891, size: '124 Acres', criteria: 'Academic Olympiad Status + High-School STEM portfolio', accr: 'WASC' },
  { name: 'University of Oxford', shortName: 'Oxford', location: 'Oxford, Oxfordshire', country: 'United Kingdom', state: 'Oxfordshire', rating: 4.9, type: 'Public' as const, fees: 48500, ranking: 7, established: 1096, size: '400 Acres', criteria: 'UCAS + Oxford TSA / MAT / HAT Interviews', accr: 'Royal Charter' },
  { name: 'University of Cambridge', shortName: 'Cambridge', location: 'Cambridge, Cambridgeshire', country: 'United Kingdom', state: 'Cambridgeshire', rating: 4.9, type: 'Public' as const, fees: 49200, ranking: 8, established: 1209, size: '350 Acres', criteria: 'UCAS + Cambridge Assessment Writing Tests', accr: 'Royal Charter' },
  { name: 'BITS Pilani', shortName: 'BITS Pilani', location: 'Pilani, Rajasthan', country: 'India', state: 'Rajasthan', rating: 4.6, type: 'Private' as const, fees: 6200, ranking: 9, established: 1964, size: '328 Acres', criteria: 'BITSAT Exam score (Cutoff > 320/400)', accr: 'NAAC A++' },
  { name: 'University of California, Berkeley', shortName: 'UC Berkeley', location: 'Berkeley, CA', country: 'United States', state: 'California', rating: 4.7, type: 'Public' as const, fees: 44100, ranking: 10, established: 1868, size: '1232 Acres', criteria: 'UC Portal + Creative Writing & Extra-Curriculars', accr: 'WASC' },
  { name: 'Indian Institute of Science', shortName: 'IISc', location: 'Bengaluru, Karnataka', country: 'India', state: 'Karnataka', rating: 4.8, type: 'Public' as const, fees: 1100, ranking: 11, established: 1909, size: '400 Acres', criteria: 'JEE Advanced / KVPY / GATE ranks', accr: 'Centrally Funded Govt' },
  { name: 'Princeton University', shortName: 'Princeton', location: 'Princeton, NJ', country: 'United States', state: 'New Jersey', rating: 4.8, type: 'Private' as const, fees: 59100, ranking: 12, established: 1746, size: '500 Acres', criteria: 'Princeton Graded Essay & Counselor Review', accr: 'MSCHE' },
  { name: 'Imperial College London', shortName: 'Imperial', location: 'London', country: 'United Kingdom', state: 'London', rating: 4.7, type: 'Public' as const, fees: 46800, ranking: 13, established: 1907, size: '150 Acres', criteria: 'UCAS + Chemistry/Math Entrance Exam', accr: 'Royal Charter' },
  { name: 'Delhi University', shortName: 'DU', location: 'New Delhi, Delhi', country: 'India', state: 'Delhi', rating: 4.3, type: 'Public' as const, fees: 300, ranking: 14, established: 1922, size: '200 Acres', criteria: 'CUET Entrance Exam percentile (Cutoff > 98%)', accr: 'NAAC A++' },
  { name: 'National University of Singapore', shortName: 'NUS', location: 'Singapore', country: 'Singapore', state: 'Queenstown', rating: 4.8, type: 'Public' as const, fees: 32000, ranking: 15, established: 1905, size: '370 Acres', criteria: 'A-Levels / SAT score / Local Poly Diploma', accr: 'Ministry of Education' },
  { name: 'ETH Zurich', shortName: 'ETH Zurich', location: 'Zurich', country: 'Switzerland', state: 'Zurich', rating: 4.8, type: 'Public' as const, fees: 1600, ranking: 16, established: 1855, size: '140 Acres', criteria: 'Swiss Maturity Certificate or ETH Admission Exam', accr: 'Swiss Govt Accreditation' },
  { name: 'Tsinghua University', shortName: 'Tsinghua', location: 'Beijing', country: 'China', state: 'Beijing', rating: 4.8, type: 'Public' as const, fees: 4500, ranking: 17, established: 1911, size: '850 Acres', criteria: 'Chinese National College Entrance Exam Gaokao (Top 0.1%)', accr: 'MoE China' },
  { name: 'Nanyang Technological University', shortName: 'NTU', location: 'Singapore', country: 'Singapore', state: 'Jurong West', rating: 4.7, type: 'Public' as const, fees: 31000, ranking: 18, established: 1981, size: '490 Acres', criteria: 'JEE Advanced / SAT or GCE A-Level Scores', accr: 'Ministry of Education' },
  { name: 'Indian Institute of Technology, Madras', shortName: 'IIT Madras', location: 'Chennai, Tamil Nadu', country: 'India', state: 'Tamil Nadu', rating: 4.8, type: 'Public' as const, fees: 2850, ranking: 19, established: 1959, size: '617 Acres', criteria: 'JEE Advanced Rank (Top 3000)', accr: 'NBA, NAAC A++' },
  { name: 'Vellore Institute of Technology', shortName: 'VIT Vellore', location: 'Vellore, Tamil Nadu', country: 'India', state: 'Tamil Nadu', rating: 4.2, type: 'Private' as const, fees: 3200, ranking: 20, established: 1984, size: '372 Acres', criteria: 'VITEEE Entrance rank (Top 20000)', accr: 'NAAC A++' },
];

const MAJOR_CITIES_US = ['Austin, TX', 'Boston, MA', 'Seattle, WA', 'New York, NY', 'Chicago, IL', 'Atlanta, GA', 'Pittsburgh, PA', 'Los Angeles, CA', 'San Diego, CA', 'Miami, FL'];
const MAJOR_CITIES_IN = ['Pune, Maharashtra', 'Hyderabad, Telangana', 'Bangalore, Karnataka', 'Kolkata, West Bengal', 'Noida, Uttar Pradesh', 'Kanpur, Uttar Pradesh', 'Kharagpur, West Bengal', 'Roorkee, Uttarakhand', 'Indore, Madhya Pradesh', 'Ahmedabad, Gujarat'];

const UNIVERSITY_PREFIXES = ['Global Tech', 'Apex State', 'Vanguard', 'Heritage', 'Prism Science', 'Zenith Institute', 'Summit College', 'Beacon Hill', 'Ember Academic', 'Nova Alliance'];
const UNIVERSITY_SUFFIXES = ['University of Technology', 'State University', 'Institute of Applied Sciences', 'Collegiate Institute', 'Polytechnic Institute', 'Business School', 'Aeronautical Academy', 'Global College', 'National Academy', 'Union University'];

// Unsplash campus photos to cyclically attach
const CAMPUS_IMAGES = [
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
  // 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
  // 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=80',
  // 'https://images.unsplash.com/photo-1607237138185-eedd996c5c0c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&auto=format&fit=crop&q=80',
];

const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc518d?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=1600&auto=format&fit=crop&q=80',
];

// Seed list to 50 colleges
const generate50Colleges = (): College[] => {
  const list: College[] = [];

  // 1. Add famous ones first (20 entries)
  FAMOUS_COLLEGES_DATA.forEach((col, idx) => {
    const isIndia = col.country === 'India';
    const isUS = col.country === 'United States';
    
    // Create standard mock courses
    const courses: Course[] = [
      {
        id: `course-${col.shortName.toLowerCase().replace(/\s+/g, '-')}-cs`,
        name: 'Computer Science and Engineering',
        duration: '4 Years',
        fees: Math.round(col.fees * 1.05),
        seats: isIndia ? 120 : 250,
      },
      {
        id: `course-${col.shortName.toLowerCase().replace(/\s+/g, '-')}-ee`,
        name: 'Electrical and Electronics Engineering',
        duration: '4 Years',
        fees: col.fees,
        seats: isIndia ? 90 : 180,
      },
      {
        id: `course-${col.shortName.toLowerCase().replace(/\s+/g, '-')}-mba`,
        name: 'Master of Business Administration (MBA)',
        duration: '2 Years',
        fees: Math.round(col.fees * 1.3),
        seats: isIndia ? 60 : 120,
      },
      {
        id: `course-${col.shortName.toLowerCase().replace(/\s+/g, '-')}-ds`,
        name: 'M.Sc. in Data Science & Machine Learning',
        duration: '2 Years',
        fees: Math.round(col.fees * 1.15),
        seats: isIndia ? 40 : 80,
      },
    ];

    // Design salary outcomes based on reputation
    let avgSal = 140000; // default US / global
    let maxSal = 450000;
    
    if (isIndia) {
      // In INR, but keeping numeric currency general, e.g. represent as USD or convert. 
      // Let's model all numbers in general relative value. 
      // To keep side-by-side comparison consistent and robust, let's keep all numerical currency metrics representing US Dollar values
      // for international ones, and realistic Dollar levels for Indian ones too, e.g. Indian IIT average around $25,000 USD (or equivalent INR 20 LPA).
      // Let's use standard USD ($) values so they are directly comparable side-by-side! 
      // IIT average: $25,000, IIT highest: $180,000.
      avgSal = idx === 3 || idx === 4 ? 28000 : 18000; // IITs have excellent packages
      maxSal = idx === 3 || idx === 4 ? 190000 : 70000;
    } else {
      avgSal = Math.round(150000 - idx * 4000);
      maxSal = Math.round(500000 - idx * 12000);
    }

    const placementRate = Math.min(99, Math.max(88, 98 - (idx % 4)));

    const recruiters = isIndia 
      ? ['Microsoft', 'Google', 'Tata Consultancy Services', 'Goldman Sachs', 'Amazon', 'Reliance Industries']
      : ['Google LLC', 'Meta Platforms', 'Apple Inc', 'McKinsey & Company', 'NVIDIA Corp', 'SpaceX'];

    list.push({
      id: `college-${col.shortName.toLowerCase().replace(/\s+/g, '-')}`,
      name: col.name,
      shortName: col.shortName,
      location: col.location,
      state: col.state,
      country: col.country,
      rating: col.rating,
      type: col.type,
      feesPerYear: col.fees,
      overview: `${col.name} (${col.shortName}) is a premier ${col.type.toLowerCase()} research institution established in ${col.established}. Located in ${col.location}, it has earned a global reputation for cutting-edge innovation, highly structured academic curriculums, and deep-seated industry relationships. The campus extends across ${col.size} and offers a multi-cultural environment fostering top-tier leadership, technical capabilities, and entrepreneurial spirit.`,
      courses,
      placements: {
        averageSalary: avgSal,
        highestSalary: maxSal,
        placementRate,
        topRecruiters: recruiters,
      },
      reviews: generateReviews(col.name, col.rating),
      image: CAMPUS_IMAGES[idx % CAMPUS_IMAGES.length],
      bannerImage: BANNER_IMAGES[idx % BANNER_IMAGES.length],
      established: col.established,
      ranking: col.ranking,
      accreditation: col.accr,
      campusSize: col.size,
      admissionCriteria: col.criteria,
    });
  });

  // 2. Dynamically fill remaining to reach exactly 50
  for (let i = 21; i <= 50; i++) {
    const isIndia = i % 2 === 0;
    const country = isIndia ? 'India' : 'United States';
    const state = isIndia ? 'Maharashtra' : 'California';
    const city = isIndia ? MAJOR_CITIES_IN[i % MAJOR_CITIES_IN.length] : MAJOR_CITIES_US[i % MAJOR_CITIES_US.length];
    
    const prefix = UNIVERSITY_PREFIXES[(i * 3) % UNIVERSITY_PREFIXES.length];
    const suffix = UNIVERSITY_SUFFIXES[(i * 7) % UNIVERSITY_SUFFIXES.length];
    const name = `${prefix} ${suffix}`;
    const shortName = `${prefix.substring(0, 4)} ${suffix.split(' ')[0]}`;

    const rating = parseFloat((3.8 + (i % 11) * 0.1).toFixed(1));
    const fees = isIndia ? Math.round(1500 + (i * 120)) : Math.round(25000 + (i * 850));
    const type = i % 3 === 0 ? 'Private' as const : 'Public' as const;
    const established = 1850 + (i * 5);
    const size = `${100 + (i * 8)} Acres`;
    const criteria = isIndia ? 'State Entrance Exam Score (MHT CET / KCET / WBJEE)' : 'SAT (1200+) or high GPA (3.2+)';
    const accr = isIndia ? 'NAAC A Grade / NBA Accredit' : 'WASC Senior College Accredit';

    const courses: Course[] = [
      {
        id: `course-dyn-${i}-cs`,
        name: 'Computer Engineering & Information Tech',
        duration: '4 Years',
        fees: Math.round(fees * 1.1),
        seats: 120,
      },
      {
        id: `course-dyn-${i}-me`,
        name: 'Mechanical & Automation Engineering',
        duration: '4 Years',
        fees,
        seats: 90,
      },
      {
        id: `course-dyn-${i}-mba`,
        name: 'MBA in Operations and Business Analytics',
        duration: '2 Years',
        fees: Math.round(fees * 1.25),
        seats: 60,
      },
    ];

    const avgSal = isIndia ? Math.round(6000 + i * 200) : Math.round(65000 + i * 1100);
    const maxSal = isIndia ? Math.round(15000 + i * 800) : Math.round(140000 + i * 2500);
    const placementRate = Math.min(97, Math.max(82, 80 + (i % 15)));
    const recruiters = isIndia 
      ? ['Wipro Technologies', 'Infosys', 'HDFC Bank', 'Cognizant Technology Solutions', 'Tech Mahindra']
      : ['Intel Corp', 'Dell Technologies', 'Capital One', 'Boeing Company', 'Accenture Plc'];

    list.push({
      id: `college-dyn-${i}`,
      name,
      shortName,
      location: city,
      state,
      country,
      rating,
      type,
      feesPerYear: fees,
      overview: `${name} is an institutions of high esteem dedicated to practical learning, research excellence, and career acceleration. Catering to more than 6,000 active students, the campus is fully equipped with digital research workspaces, athletic complexes, and active industry-partnered technical laboratories designed to train students for future-proof engineering and business sectors.`,
      courses,
      placements: {
        averageSalary: avgSal,
        highestSalary: maxSal,
        placementRate,
        topRecruiters: recruiters,
      },
      reviews: generateReviews(name, rating),
      image: CAMPUS_IMAGES[i % CAMPUS_IMAGES.length],
      bannerImage: BANNER_IMAGES[i % BANNER_IMAGES.length],
      established,
      ranking: i,
      accreditation: accr,
      campusSize: size,
      admissionCriteria: criteria,
    });
  }

  return list;
};

export const COLLEGES = generate50Colleges();
