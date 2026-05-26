import React, { useState, useMemo } from 'react';
import { COLLEGES } from '../lib/data';
import { College } from '../lib/types';
import { 
  GraduationCap, 
  Search, 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Info,
  DollarSign,
  ShieldCheck,
  AlertCircle,
  Award,
  BookOpen,
  Bookmark,
  Globe,
  Home,
  Compass
} from 'lucide-react';

interface PredictorToolProps {
  onViewDetails: (id: string) => void;
  savedColleges: College[];
  onToggleSave: (college: College) => void;
}

type ExamType = 'jee-advanced' | 'sat' | 'bitsat' | 'cuet' | 'viteee' | 'state-cet';

interface PredictionResult {
  college: College;
  matchScore: number; // probability percentage 0-100
  tier: 'Dream / Reach' | 'Target / Moderate' | 'Safety / High';
  badgeColor: string;
  reason: string;
}

export function PredictorTool({ onViewDetails, savedColleges, onToggleSave }: PredictorToolProps) {
  // Input states
  const [selectedExam, setSelectedExam] = useState<ExamType>('sat');
  const [scoreVal, setScoreVal] = useState<string>('1450');
  const [gpaVal, setGpaVal] = useState<string>('3.7');
  const [maxFees, setMaxFees] = useState<number>(65000);
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchedText, setSearchedText] = useState<string>('');
  const [homeCountry, setHomeCountry] = useState<string>('India');
  const [classificationFilter, setClassificationFilter] = useState<'all' | 'national' | 'international'>('all');

  // Default values when switching exams to prevent out-of-bounds metrics
  const handleExamChange = (exam: ExamType) => {
    setSelectedExam(exam);
    if (exam === 'jee-advanced') {
      setScoreVal('3500');
    } else if (exam === 'sat') {
      setScoreVal('1480');
      setGpaVal('3.8');
    } else if (exam === 'bitsat') {
      setScoreVal('310');
    } else if (exam === 'cuet') {
      setScoreVal('97.5');
    } else if (exam === 'viteee') {
      setScoreVal('12000');
    } else if (exam === 'state-cet') {
      setScoreVal('92.0');
    }
  };

  // Get dynamic ranges / recommendations
  const examMetadata = useMemo(() => {
    switch (selectedExam) {
      case 'jee-advanced':
        return {
          title: 'JEE Advanced Rank',
          placeholder: 'e.g. 2500',
          min: 1,
          max: 100000,
          description: 'Top Indian Institute of Technology (IITs) and Indian Institute of Science (IISc). Lower ranks indicate higher academic standing.'
        };
      case 'sat':
        return {
          title: 'SAT Score',
          placeholder: 'e.g. 1450',
          min: 400,
          max: 1600,
          description: 'Standardized test for United States, UK, and key international universities (range: 400 - 1600).'
        };
      case 'bitsat':
        return {
          title: 'BITSAT Score',
          placeholder: 'e.g. 330',
          min: 100,
          max: 400,
          description: 'Entrance score for BITS Pilani, Goa and Hyderabad campuses (range: 100 - 400).'
        };
      case 'cuet':
        return {
          title: 'CUET Percentile',
          placeholder: 'e.g. 98.5',
          min: 1,
          max: 100,
          description: 'Common University Entrance Test percentile for central/state universities in India like Delhi University.'
        };
      case 'viteee':
        return {
          title: 'VITEEE All India Rank',
          placeholder: 'e.g. 15000',
          min: 1,
          max: 150000,
          description: 'All India Entrance Examination rank for Vellore Institute of Technology campuses.'
        };
      case 'state-cet':
        return {
          title: 'State CET Percentile',
          placeholder: 'e.g. 95.8',
          min: 1,
          max: 100,
          description: 'State entrance exam percentiles such as MH-CET, KCET, WBJEE (range: 1.0 - 100.0%).'
        };
    }
  }, [selectedExam]);

  // Matches dataset to compute admission probability
  const predictions: PredictionResult[] = useMemo(() => {
    const parsedScore = parseFloat(scoreVal) || 0;
    const parsedGpa = parseFloat(gpaVal) || 0;
    const list: PredictionResult[] = [];

    // Loop through all 50 colleges
    COLLEGES.forEach((college) => {
      let score = 0; // probability 0-100
      let reason = '';

      const isIndia = college.country.toLowerCase() === 'india';
      const isUS = college.country.toLowerCase() === 'united states' || college.country.toLowerCase() === 'usa';

      if (selectedExam === 'jee-advanced') {
        const adminLower = college.admissionCriteria.toLowerCase();
        
        if (college.id === 'college-iit-bombay') {
          if (parsedScore <= 1200) {
            score = 90;
            reason = 'Your rank comfortably clears the historical IIT Bombay CSE/EE cutoffs.';
          } else if (parsedScore <= 2000) {
            score = 65;
            reason = 'Within competitive range. You are highly likely to acquire admissions in premium core disciplines.';
          } else if (parsedScore <= 3200) {
            score = 30;
            reason = 'Ambitious/Dream reach. Requires open seats under specialized program preferences.';
          } else {
            score = 5;
            reason = 'Rank sits above competitive historical cutoffs.';
          }
        } else if (college.id === 'college-iit-delhi') {
          if (parsedScore <= 1800) {
            score = 90;
            reason = 'Excellent rank. Historic trends guarantee premium engineering choices at Delhi.';
          } else if (parsedScore <= 2500) {
            score = 65;
            reason = 'Highly competitive range. Satisfies the fundamental cutoff requirements.';
          } else if (parsedScore <= 3800) {
            score = 25;
            reason = 'Ambitious target. Dynamic allocation rounds may open up choices.';
          } else {
            score = 5;
            reason = 'Bypasses historical limits for central programs.';
          }
        } else if (college.id === 'college-iit-madras') {
          if (parsedScore <= 2200) {
            score = 92;
            reason = 'Rank places you comfortably in the upper benchmark of historical cutoffs.';
          } else if (parsedScore <= 3000) {
            score = 68;
            reason = 'Excellent alignment with general seat availability across Core Engineering.';
          } else if (parsedScore <= 4500) {
            score = 30;
            reason = 'Reach range. Possible admission in advanced dual-degree options.';
          } else {
            score = 5;
            reason = 'Above standard national seat allocations.';
          }
        } else if (college.id === 'college-iisc') {
          if (parsedScore <= 1500) {
            score = 90;
            reason = 'Perfect for BS Research programs.';
          } else if (parsedScore <= 3500) {
            score = 60;
            reason = 'Good alignment with historical Science dual program indices.';
          } else if (parsedScore <= 6000) {
            score = 25;
            reason = 'Dream reach. Highly dependent on personal statement and board grades.';
          } else {
            score = 5;
            reason = 'Above standard IISc historical allocations.';
          }
        } else if (isIndia) {
          // Other generic Indian Colleges
          if (parsedScore <= 12000) {
            score = 95;
            reason = 'Outstanding performance for this regional institute. Safe option.';
          } else if (parsedScore <= 30000) {
            score = 75;
            reason = 'Highly compatible. Very solid target option.';
          } else if (parsedScore <= 60000) {
            score = 45;
            reason = 'Moderate opportunity. Admission possible in multiple batches.';
          } else {
            score = 15;
            reason = 'Consider as a reach alternative.';
          }
        } else {
          score = 0; // standard non-match
        }

      } else if (selectedExam === 'sat') {
        const isIvyOrElite = ['college-mit', 'college-stanford', 'college-harvard', 'college-caltech', 'college-princeton'].includes(college.id);
        const isOxfordCambridge = ['college-oxford', 'college-cambridge'].includes(college.id);

        if (isIvyOrElite) {
          if (parsedScore >= 1550 && parsedGpa >= 3.9) {
            score = 80;
            reason = 'Extremely strong SAT/GPA metrics. Excellent match but Ivy admissions remain holistic.';
          } else if (parsedScore >= 1480 && parsedGpa >= 3.7) {
            score = 55;
            reason = 'Fully competitive within Ivy League percentiles. Standout portfolio recommended.';
          } else if (parsedScore >= 1420 && parsedGpa >= 3.4) {
            score = 25;
            reason = 'Ambitious target. Portfolio and essays will carry maximum weight.';
          } else {
            score = 5;
            reason = 'Score falls beneath the primary benchmark for tier-1 US research centers.';
          }
        } else if (isOxfordCambridge) {
          if (parsedScore >= 1530 && parsedGpa >= 3.85) {
            score = 75;
            reason = 'Strong academic credentials matching Oxbridge TSA and subject test requirements.';
          } else if (parsedScore >= 1450 && parsedGpa >= 3.65) {
            score = 45;
            reason = 'Eligible for pre-selection interviews. Match hinges on subject-wise aptitude.';
          } else if (parsedScore >= 1380 && parsedGpa >= 3.4) {
            score = 15;
            reason = 'Challenging range. High-intensity supplementary written test score needed.';
          } else {
            score = 5;
            reason = 'Below typical international admission thresholds.';
          }
        } else if (college.id === 'college-uc-berkeley' || college.id === 'college-nus' || college.id === 'college-ntu' || college.id === 'college-imperial') {
          if (parsedScore >= 1500) {
            score = 90;
            reason = 'Excellent fit. SAT score aligns perfectly with highest tier entrance records.';
          } else if (parsedScore >= 1380) {
            score = 65;
            reason = 'In range. Historical applicants with these scores are routinely admitted.';
          } else if (parsedScore >= 1250) {
            score = 35;
            reason = 'Dream range. Possible with exemplary GPA or local diplomas.';
          } else {
            score = 10;
            reason = 'Slightly below average requirements.';
          }
        } else if (isUS) {
          // Dynamic US colleges
          if (parsedScore >= 1350 || parsedGpa >= 3.6) {
            score = 95;
            reason = 'Highly competitive indicators. Excellent safe/safety option.';
          } else if (parsedScore >= 1200 || parsedGpa >= 3.2) {
            score = 75;
            reason = 'Warm matching index. Clear alignment with target academic profile.';
          } else if (parsedScore >= 1050 || parsedGpa >= 2.8) {
            score = 40;
            reason = 'Moderate opportunity. Fits well with standard admissions rules.';
          } else {
            score = 15;
            reason = 'Under typical percentile ranges.';
          }
        } else if (college.id === 'college-nanyang-technological-university' || college.id === 'college-national-university-of-singapore') {
          if (parsedScore >= 1440) {
            score = 80;
            reason = 'Strong SAT alignment. Highly likely to receive an admissions invite.';
          } else if (parsedScore >= 1350) {
            score = 45;
            reason = 'Moderate chance. Local polytechnic grades or curriculum profiles can influence.';
          } else {
            score = 10;
            reason = 'Below the classic tier-1 Singaporian entrance expectations.';
          }
        } else {
          // General SAT conversion
          if (parsedScore >= 1420) {
            score = 70;
            reason = 'Excellent global fit indices.';
          } else if (parsedScore >= 1250) {
            score = 45;
            reason = 'Moderate compatibility for generalized international boards.';
          } else {
            score = 15;
            reason = 'High-threshold curriculum, challenging reach.';
          }
        }

      } else if (selectedExam === 'bitsat') {
        if (college.id === 'college-bits-pilani') {
          if (parsedScore >= 340) {
            score = 95;
            reason = 'Exceptional BITSAT score. Almost guarantees prime streams like Computer Science.';
          } else if (parsedScore >= 320) {
            score = 70;
            reason = 'Strong competitive stance. Highly likely to obtain core engineering streams.';
          } else if (parsedScore >= 290) {
            score = 35;
            reason = 'Dream reach. Admissions will target dual degrees or specialized branches.';
          } else {
            score = 5;
            reason = 'Below the fundamental cutoff for PILANI historic seat metrics.';
          }
        } else if (isIndia) {
          // BITSAT score also implies smart engineering candidate, matches other private/state colleges
          if (parsedScore >= 260) {
            score = 95;
            reason = 'Strong baseline analytical profile. Superb safe/target candidate.';
          } else if (parsedScore >= 180) {
            score = 75;
            reason = 'Good academic rating. Matches general admission criteria.';
          } else {
            score = 30;
            reason = 'Considered as a moderate option.';
          }
        }

      } else if (selectedExam === 'cuet') {
        if (college.id === 'college-delhi-university') {
          if (parsedScore >= 99.2) {
            score = 92;
            reason = 'Perfect percentile. Clears top-tier college cutoffs (SRCC, St. Stephen\'s, etc).';
          } else if (parsedScore >= 98.0) {
            score = 65;
            reason = 'Competent scoring. High chances in primary on-campus colleges.';
          } else if (parsedScore >= 96.0) {
            score = 30;
            reason = 'Dream target. Off-campus or specialized honors options are probable.';
          } else {
            score = 5;
            reason = 'Percentile sits below the benchmark for competitive programs.';
          }
        } else if (isIndia) {
          // matches generic Indian Colleges
          if (parsedScore >= 95) {
            score = 95;
            reason = 'Highly eligible candidates. Excellent fallback institute.';
          } else if (parsedScore >= 85) {
            score = 70;
            reason = 'A solid match for general admission seats.';
          } else {
            score = 40;
            reason = 'Acceptable baseline for matching profiles.';
          }
        }

      } else if (selectedExam === 'viteee') {
        if (college.id === 'college-vit-vellore') {
          if (parsedScore <= 5000) {
            score = 98;
            reason = 'Top VitEEE rank. High likelihood of priority slot 1 or 2 allocation.';
          } else if (parsedScore <= 20000) {
            score = 80;
            reason = 'Satisfies primary criteria. Expected seat allocations in high-demand streams.';
          } else if (parsedScore <= 45000) {
            score = 45;
            reason = 'Moderate target. Allocations may fall under higher categories (Category 3-5).';
          } else {
            score = 15;
            reason = 'Fails to clear top category competitive historical seat limits.';
          }
        } else if (isIndia && college.id !== 'college-iit-bombay' && college.id !== 'college-iit-delhi' && college.id !== 'college-iit-madras' && college.id !== 'college-iisc') {
          if (parsedScore <= 30000) {
            score = 90;
            reason = 'Comfortable technical profile, highly acceptable target.';
          } else {
            score = 55;
            reason = 'Potential matching alternative.';
          }
        }

      } else if (selectedExam === 'state-cet') {
        // match state level entrance CET percentiles
        const criteriaLower = college.admissionCriteria.toLowerCase();
        const hasStateCrit = criteriaLower.includes('state entrance') || criteriaLower.includes('cet');
        
        if (hasStateCrit && isIndia) {
          if (parsedScore >= 95) {
            score = 92;
            reason = 'Excellent percentile. Historical records lock in top choice departments.';
          } else if (parsedScore >= 85) {
            score = 68;
            reason = 'In standard target range. Solid prospects for technical allocation.';
          } else if (parsedScore >= 75) {
            score = 35;
            reason = 'Competitive, placement subject to subsequent counselling rounds.';
          } else {
            score = 10;
            reason = 'Scores trail typical cutoffs.';
          }
        } else if (isIndia && !['college-iit-bombay', 'college-iit-delhi', 'college-iit-madras', 'college-iisc', 'college-bits-pilani'].includes(college.id)) {
          if (parsedScore >= 90) {
            score = 85;
            reason = 'Highly eligible for direct admission routes.';
          } else if (parsedScore >= 80) {
            score = 60;
            reason = 'Acceptable target for mid-tier selections.';
          } else {
            score = 30;
            reason = 'Considered reach/supplementary.';
          }
        }
      }

      // Filter according to score to see if it qualifies
      if (score >= 10) {
        let tier: 'Dream / Reach' | 'Target / Moderate' | 'Safety / High' = 'Dream / Reach';
        let badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
        if (score >= 75) {
          tier = 'Safety / High';
          badgeColor = 'bg-teal-50 text-teal-700 border-teal-200';
        } else if (score >= 40) {
          tier = 'Target / Moderate';
          badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
        }

        list.push({
          college,
          matchScore: score,
          tier,
          badgeColor,
          reason
        });
      }
    });

    // Sort by compatibility score
    return list.sort((a, b) => b.matchScore - a.matchScore);
  }, [selectedExam, scoreVal, gpaVal]);

  // Apply visual-filters (Country + Tuition Fees + Type + Text)
  const filteredPredictions = useMemo(() => {
    return predictions.filter((pred) => {
      // 1. Fee search check
      if (pred.college.feesPerYear > maxFees) return false;

      // 2. State select country
      if (selectedCountry !== 'All' && pred.college.country !== selectedCountry) {
        return false;
      }

      // 3. Entity Type
      if (selectedType !== 'All' && pred.college.type !== selectedType) {
        return false;
      }

      // 4. Text search
      if (searchedText.trim() !== '') {
        const term = searchedText.toLowerCase();
        const matchesName = pred.college.name.toLowerCase().includes(term);
        const matchesShort = pred.college.shortName.toLowerCase().includes(term);
        const matchesLoc = pred.college.location.toLowerCase().includes(term);
        if (!matchesName && !matchesShort && !matchesLoc) return false;
      }

      return true;
    });
  }, [predictions, maxFees, selectedCountry, selectedType, searchedText]);

  // Classification logic (National vs International) based on designated homeCountry
  const { nationalMatches, internationalMatches } = useMemo(() => {
    const national: PredictionResult[] = [];
    const international: PredictionResult[] = [];
    
    filteredPredictions.forEach((pred) => {
      const isNational = pred.college.country.toLowerCase() === homeCountry.toLowerCase();
      if (isNational) {
        national.push(pred);
      } else {
        international.push(pred);
      }
    });

    return { nationalMatches: national, internationalMatches: international };
  }, [filteredPredictions, homeCountry]);

  // Compute final visible list depending on classification tabs
  const visiblePredictions = useMemo(() => {
    if (classificationFilter === 'national') {
      return nationalMatches;
    }
    if (classificationFilter === 'international') {
      return internationalMatches;
    }
    return filteredPredictions;
  }, [classificationFilter, filteredPredictions, nationalMatches, internationalMatches]);

  // Unique list of countries for filters
  const countries = useMemo(() => {
    const list = new Set<string>();
    predictions.forEach((p) => list.add(p.college.country));
    return ['All', ...Array.from(list)];
  }, [predictions]);

  // Regional comparisons (National vs International fees & matching probability averages)
  const comparisons = useMemo(() => {
    const natFees = nationalMatches.map(p => p.college.feesPerYear);
    const intFees = internationalMatches.map(p => p.college.feesPerYear);

    const natAvg = natFees.length ? Math.round(natFees.reduce((a, b) => a + b, 0) / natFees.length) : 0;
    const intAvg = intFees.length ? Math.round(intFees.reduce((a, b) => a + b, 0) / intFees.length) : 0;

    const natSChance = nationalMatches.map(p => p.matchScore);
    const intSChance = internationalMatches.map(p => p.matchScore);

    const natChanceAvg = natSChance.length ? Math.round(natSChance.reduce((a, b) => a + b, 0) / natSChance.length) : 0;
    const intChanceAvg = intSChance.length ? Math.round(intSChance.reduce((a, b) => a + b, 0) / intSChance.length) : 0;

    return { natAvg, intAvg, natChanceAvg, intChanceAvg };
  }, [nationalMatches, internationalMatches]);

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/40 via-white to-transparent p-6 shadow-xs">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 font-sans text-[11px] font-bold tracking-wider text-blue-700 uppercase">
              <Sparkles className="h-3 w-3" /> Admission Engine Live
            </span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              Academic Admission Predictor
            </h2>
            <p className="max-w-xl text-xs leading-relaxed text-slate-500">
              Input your competitive standardized test outcomes and grade indices below. Our prediction matrix cross-references historical admission criteria and thresholds across all 50 global institutions.
            </p>
          </div>
          
          <div className="rounded-xl border border-slate-100 bg-white p-4 text-center shadow-xs md:w-56">
            <GraduationCap className="mx-auto h-7 w-7 text-blue-600" />
            <span className="mt-1.5 block font-sans text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Success Matcher
            </span>
            <span className="font-sans text-xs font-semibold text-slate-800">
              Personalized Evaluation
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Input Panel & Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-sans text-sm font-extrabold uppercase tracking-wider text-slate-800">
              <BookOpen className="h-4.5 w-4.5 text-blue-600" /> Academic Profile
            </h3>

            <div className="space-y-5">
              {/* Define Home Country */}
              <div className="rounded-xl bg-slate-50 p-3.5 space-y-1.5 border border-slate-100">
                <label className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                  <Home className="h-3.5 w-3.5 text-blue-600" /> Choose Home Country
                </label>
                <select
                  value={homeCountry}
                  onChange={(e) => {
                    setHomeCountry(e.target.value);
                    setClassificationFilter('all'); // reset to all to reflect changes
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-bold text-slate-700 hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                >
                  <option value="India">🇮🇳 India</option>
                  <option value="United States">🇺🇸 United States</option>
                  <option value="United Kingdom">🇬🇧 United Kingdom</option>
                  <option value="Singapore">🇸🇬 Singapore</option>
                  <option value="Switzerland">🇨🇭 Switzerland</option>
                  <option value="China">🇨🇳 China</option>
                </select>
                <p className="text-[10px] leading-relaxed text-slate-400">
                  Used to dynamically classify matching institutes into <strong className="text-slate-600">National ({homeCountry})</strong> vs <strong className="text-slate-600">International (Overseas)</strong> lists.
                </p>
              </div>

              {/* Exam Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Target / Completed Exam
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => handleExamChange(e.target.value as ExamType)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 bg-slate-50/50 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="sat">SAT General Test</option>
                  <option value="jee-advanced">JEE Advanced (India IITs)</option>
                  <option value="bitsat">BITSAT Entry (BITS Pilani)</option>
                  <option value="cuet">CUET Percentile (Central Univs)</option>
                  <option value="viteee">VITEEE Rank (VIT Vellore)</option>
                  <option value="state-cet">State level CET (MHT / WBJEE)</option>
                </select>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {examMetadata.description}
                </p>
              </div>

              {/* Dynamic Score Input */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <span>{examMetadata.title}</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Range: {examMetadata.min} - {examMetadata.max}
                  </span>
                </label>
                <input
                  type="number"
                  min={examMetadata.min}
                  max={examMetadata.max}
                  value={scoreVal}
                  onChange={(e) => setScoreVal(e.target.value)}
                  placeholder={examMetadata.placeholder}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* SAT Specific GPA */}
              {selectedExam === 'sat' && (
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <span>High School GPA</span>
                    <span className="font-mono text-[10px] text-slate-400">Range: 1.0 - 4.0</span>
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="4.0"
                    value={gpaVal}
                    onChange={(e) => setGpaVal(e.target.value)}
                    placeholder="e.g. 3.85"
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    GPA improves predictive calculations for holistic programs.
                  </p>
                </div>
              )}

              {/* Optional Tuition Cap Filter */}
              <div id="fees-filter-section" className="space-y-2 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <DollarSign className="h-4 w-4 text-slate-400" /> Max Fees (USD/Yr)
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-600">
                    ${maxFees.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={65000}
                  step={500}
                  value={maxFees}
                  onChange={(e) => setMaxFees(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 focus:outline-none"
                />
                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                  <span>$100</span>
                  <span>$65k+</span>
                </div>
              </div>

              {/* Preferred Country */}
              <div className="space-y-1.5 border-t border-slate-100 pt-5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Preferred Region
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {countries.map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => setSelectedCountry(country)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold tracking-tight transition-colors border ${
                        selectedCountry === country
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>

              {/* Public vs Private */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Institution Type
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['All', 'Public', 'Private'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`rounded-lg py-1.5 text-center text-xs font-semibold tracking-tight transition-all border ${
                        selectedType === type
                          ? 'bg-white border-blue-600 text-blue-600 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Saved Colleges section */}
          {savedColleges.length > 0 && (
            <div id="saved-colleges-sidebar-panel" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 font-sans text-xs font-extrabold uppercase tracking-wider text-slate-800">
                <Bookmark className="h-4 w-4 fill-amber-500 text-amber-500" /> Saved Institutions ({savedColleges.length})
              </h3>
              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                {savedColleges.map((college) => (
                  <div key={college.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onViewDetails(college.id)}
                        className="block font-sans font-bold text-slate-700 hover:text-blue-600 transition-colors text-left truncate"
                      >
                        {college.name}
                      </button>
                      <span className="block font-sans text-[10px] text-slate-400 capitalize">
                        {college.location}, {college.country}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleSave(college)}
                      className="text-[10px] font-semibold text-red-500 hover:text-red-700 shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Notice Card */}
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-5 space-y-3">
            <div className="flex gap-2.5 text-slate-700">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <span className="font-sans text-xs font-bold text-slate-800">Note on Admissions</span>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  Cutoffs represent aggregated historical minimum limits. Actual admission incorporates secondary components like state quotas, diversity quotas, visual portfolios, and recommendation letters.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Matched Colleges List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick results status bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="font-sans text-sm font-extrabold text-slate-800">
                Evaluation Matches ({filteredPredictions.length} Institutes)
              </h4>
              <p className="text-[11px] text-slate-400">
                Sorted by predicted entry probability based on "{examMetadata.title}"
              </p>
            </div>

            {/* In-match search bar */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search matching..."
                value={searchedText}
                onChange={(e) => setSearchedText(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-9 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none w-full sm:w-52"
              />
            </div>
          </div>

          {/* Classified Segmentation Tabs */}
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setClassificationFilter('all')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${
                classificationFilter === 'all'
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200/40'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Compass className="h-4 w-4 text-blue-500" />
              <span className="hidden sm:inline">All Matches</span>
              <span className="sm:hidden">All</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                classificationFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
              }`}>
                {filteredPredictions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setClassificationFilter('national')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${
                classificationFilter === 'national'
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200/40'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="h-4 w-4 text-emerald-500" />
              <span className="hidden sm:inline">National ({homeCountry})</span>
              <span className="sm:hidden">Local</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                classificationFilter === 'national' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}>
                {nationalMatches.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setClassificationFilter('international')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${
                classificationFilter === 'international'
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200/40'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Globe className="h-4 w-4 text-violet-500" />
              <span className="hidden sm:inline">International</span>
              <span className="sm:hidden">Overseas</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                classificationFilter === 'international' ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-500'
              }`}>
                {internationalMatches.length}
              </span>
            </button>
          </div>

          {/* Regional Comparisons Insights widget */}
          {(nationalMatches.length > 0 || internationalMatches.length > 0) && (
            <div className="rounded-2xl border border-slate-200 bg-linear-to-b from-slate-50/50 to-white p-4.5 space-y-4 shadow-3xs">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  <Award className="h-4 w-4 text-amber-500" /> Regional Admissions Comparison Matrix
                </span>
                <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-500 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Home Base: {homeCountry}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Cost compares */}
                <div className="space-y-2 rounded-xl border border-slate-100 bg-white p-3 shadow-3xs">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Average Annual Tuition Expense
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-500">National ({homeCountry})</span>
                      <strong className="font-mono text-slate-700">${comparisons.natAvg.toLocaleString()}/yr</strong>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(6, (comparisons.natAvg / 65000) * 100))}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-medium text-slate-500">International (Global)</span>
                      <strong className="font-mono text-slate-700">${comparisons.intAvg.toLocaleString()}/yr</strong>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-violet-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(6, (comparisons.intAvg / 65000) * 100))}%` }} />
                    </div>
                  </div>
                </div>

                {/* Acceptance probability compares */}
                <div className="space-y-2 rounded-xl border border-slate-100 bg-white p-3 shadow-3xs">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Average Success Match Probability
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-500">National Programs</span>
                      <strong className="font-mono text-slate-700">{comparisons.natChanceAvg}%</strong>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-emerald-550 h-full rounded-full" style={{ width: `${comparisons.natChanceAvg}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-medium text-slate-500">International Programs</span>
                      <strong className="font-mono text-slate-700">{comparisons.intChanceAvg}%</strong>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-violet-550 h-full rounded-full" style={{ width: `${comparisons.intChanceAvg}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Advisories */}
              <div className="flex items-start gap-2 rounded-lg bg-blue-50/50 p-2.5 text-[10px] text-blue-800 leading-relaxed border border-blue-100/40">
                <Globe className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                <p>
                  <span className="font-bold">International Advisory:</span> Overseas tuition fees may carry external international student levies. Standardized domestic quotas (MHT, state boards, or Indian Central quotas) do not apply for foreign matching.
                </p>
              </div>
            </div>
          )}

          {visiblePredictions.length > 0 ? (
            <div className="space-y-4">
              {visiblePredictions.map((pred) => {
                const isSafety = pred.tier === 'Safety / High';
                const isTarget = pred.tier === 'Target / Moderate';
                const isSaved = savedColleges.some((c) => c.id === pred.college.id);
                const isNational = pred.college.country.toLowerCase() === homeCountry.toLowerCase();

                return (
                  <div
                    key={pred.college.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-md"
                  >
                    {/* Visual left edge marker colored based on tier */}
                    <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                      isSafety ? 'bg-teal-500' : isTarget ? 'bg-blue-500' : 'bg-amber-500'
                    }`} />

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      {/* Left: Metadata & matching rating */}
                      <div className="space-y-3 pl-2.5">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-sans text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {pred.college.name}
                            </h3>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              {pred.college.shortName}
                            </span>
                            
                            {isNational ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                                <Home className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />
                                National
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-100 px-2 py-0.5 text-[10px] font-extrabold text-violet-700">
                                <Globe className="h-2.5 w-2.5 text-violet-500" />
                                International
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-400 font-medium">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              {pred.college.location}, {pred.college.country}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                              Fees: <strong className="text-slate-600">${pred.college.feesPerYear.toLocaleString()}/yr</strong>
                            </span>
                            <span className="rounded bg-slate-50 px-1.5 py-0.5 text-[10px] uppercase font-bold text-slate-500">
                              Rank #{pred.college.ranking}
                            </span>
                          </div>
                        </div>

                        {/* Admissions match explanation */}
                        <div className="flex items-start gap-2 rounded-xl bg-slate-50/80 p-3 text-xs leading-relaxed text-slate-600 border border-slate-100/50">
                          {isSafety ? (
                            <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-teal-600" />
                          ) : isTarget ? (
                            <TrendingUp className="h-4.5 w-4.5 shrink-0 text-blue-500" />
                          ) : (
                            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-500" />
                          )}
                          <p>
                            <span className="font-bold text-slate-700">Admission Index Match:</span> {pred.reason}
                          </p>
                        </div>
                      </div>

                      {/* Right: Score Gauge & View Profile buttons */}
                      <div className="flex flex-col items-center justify-between gap-3 text-center sm:items-end sm:text-right shrink-0">
                        {/* Gauge Metric */}
                        <div className="space-y-1">
                          <span className={`inline-block rounded-full border px-2.5 py-1 text-2xs font-bold tracking-tight uppercase ${pred.badgeColor}`}>
                            {pred.tier}
                          </span>
                          <div className="flex items-baseline justify-center gap-0.5 sm:justify-end">
                            <span className={`font-mono text-2xl font-black ${
                              isSafety ? 'text-teal-600' : isTarget ? 'text-blue-600' : 'text-amber-500'
                            }`}>
                              {pred.matchScore}%
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Chance</span>
                          </div>
                          {/* Animated line indicator */}
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div
                              style={{ width: `${pred.matchScore}%` }}
                              className={`h-full rounded-full ${
                                isSafety ? 'bg-teal-500' : isTarget ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Action buttons (Save College / Profile) */}
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                          <button
                            type="button"
                            onClick={() => onToggleSave(pred.college)}
                            className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all shadow-2xs ${
                              isSaved
                                ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onViewDetails(pred.college.id)}
                            className="flex cursor-pointer items-center gap-1 font-sans text-xs font-bold text-blue-600 hover:text-blue-700"
                          >
                            <span>Full Profile</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center">
              <div className="rounded-full bg-slate-50 p-4 text-slate-300">
                <AlertCircle className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="mt-5 font-sans text-base font-extrabold text-slate-700">No Matched Institutions Found</h3>
              <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">
                Your credentials are below standard historical limits or other active filters (like maximum fees or preferred country limits) have restricted the evaluation. Try loosening criteria ranges.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMaxFees(65000);
                  setSelectedCountry('All');
                  setSelectedType('All');
                  setSearchedText('');
                  setClassificationFilter('all');
                }}
                className="mt-6 rounded-xl bg-blue-600 px-4.5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 focus:outline-none"
              >
                Clear Results Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
