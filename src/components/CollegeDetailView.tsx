import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Grid,
  Award,
  BookOpen,
  Briefcase,
  Users,
  PenTool,
  MessageSquare,
  Volume2,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';
import { College, Review, Course } from '../lib/types';

interface CollegeDetailViewProps {
  college: College;
  onBack: () => void;
  onToggleCompare: (id: string) => void;
  isComparing: boolean;
  onUpdateCollegeReviews?: (collegeId: string, updatedReviews: Review[]) => void;
}

export const CollegeDetailView: React.FC<CollegeDetailViewProps> = ({
  college,
  onBack,
  onToggleCompare,
  isComparing,
  onUpdateCollegeReviews,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'reviews'>('overview');
  
  // States for write-a-review form
  const [newUsername, setNewUsername] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [academics, setAcademics] = useState(5);
  const [infrastructure, setInfrastructure] = useState(5);
  const [accommodation, setAccommodation] = useState(5);
  const [campusLife, setCampusLife] = useState(5);
  const [formSuccess, setFormSuccess] = useState(false);
  const [reviewsList, setReviewsList] = useState<Review[]>(college.reviews);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newComment.trim()) return;

    const generatedReview: Review = {
      id: `rev-custom-${Date.now()}`,
      username: newUsername,
      rating: parseFloat(((academics + infrastructure + accommodation + campusLife) / 4).toFixed(1)),
      comment: newComment,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      categoryRatings: {
        academics,
        infrastructure,
        accommodation,
        campusLife,
      },
    };

    const nextReviews = [generatedReview, ...reviewsList];
    setReviewsList(nextReviews);
    
    // Notify parent to persist if hook exists
    if (onUpdateCollegeReviews) {
      onUpdateCollegeReviews(college.id, nextReviews);
    }

    // Reset inputs
    setNewUsername('');
    setNewComment('');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 4000);
  };

  return (
    <div id={`college-[${college.id}]-detail-page`} className="space-y-6">
      {/* Detail View Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          id="back-to-catalog-top-btn"
          type="button"
          onClick={onBack}
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Search Engine
        </button>

        <div className="flex gap-2.5">
          <button
            id={`detail-compare-btn-${college.id}`}
            type="button"
            onClick={() => onToggleCompare(college.id)}
            className={`rounded-xl px-5 py-2 text-sm font-bold shadow-xs transition-colors focus:outline-none ${
              isComparing
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isComparing ? 'Remove from Comparison' : 'Add to Comparison List'}
          </button>
        </div>
      </div>

      {/* Hero Interactive Banner */}
      <div id="detail-hero-banner" className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 text-white shadow-md">
        <div className="absolute inset-0 h-full w-full opacity-40">
          <img
            src={college.bannerImage}
            alt={college.name}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        <div className="relative z-10 p-6 md:p-10">
          <div className="flex flex-wrap gap-2.5">
            <span className="inline-flex items-center rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-slate-900">
              Rank #{college.ranking}
            </span>
            <span className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white">
              {college.type} Institution
            </span>
            <span className="inline-flex items-center rounded-lg bg-slate-800 px-3 py-1 text-xs font-bold text-white">
              ESTD {college.established}
            </span>
          </div>

          <h1 id="detail-title" className="mt-4 font-sans text-2xl font-black md:text-4xl tracking-tight leading-tight">
            {college.name}
          </h1>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-200">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4.5 w-4.5 text-blue-400" />
              {college.location}, {college.state}, {college.country}
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-amber-400">
              <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-500" />
              {college.rating} out of 5 ({reviewsList.length} global student reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div id="detail-sub-navigation" className="flex border-b border-slate-200 bg-white px-2 rounded-xl py-1 shadow-xs">
        {([
          { id: 'overview', label: 'Overview', icon: BookOpen },
          { id: 'courses', label: 'Offered Courses', icon: Grid },
          { id: 'placements', label: 'Placements & Packages', icon: Briefcase },
          { id: 'reviews', label: 'Review Hub', icon: MessageSquare },
        ] as const).map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`tab-btn-${tab.id}`}
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 py-3 text-center text-xs font-bold transition-all sm:text-sm ${
                isActive
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div id="detail-tab-content" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs min-h-[300px]">
        {/* PANEL: OVERVIEW */}
        {activeTab === 'overview' && (
          <div id="tab-overview" className="space-y-8 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile overview detail */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-sans text-base font-bold text-slate-800">
                  Institution Executive Overview
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {college.overview}
                </p>
              </div>

              {/* Sidebar Quick specifications */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
                <h4 className="font-sans text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Quick Details
                </h4>
                <div className="space-y-3.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Campus Size</span>
                    <span className="font-semibold">{college.campusSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Accreditation</span>
                    <span className="font-semibold">{college.accreditation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Admission Criteria</span>
                    <span className="font-semibold text-right max-w-[150px] line-clamp-2 leading-tight">
                      {college.admissionCriteria}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual Average Fees</span>
                    <span className="font-mono font-semibold">${college.feesPerYear.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: COURSES */}
        {activeTab === 'courses' && (
          <div id="tab-courses" className="space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="font-sans text-base font-bold text-slate-800">
                Offered Programs & Fee Structure
              </h3>
              <p className="text-xs text-slate-500">
                Listed below are the annual tuition costs, seats quota, and overall duration for flagship majors.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {college.courses.map((course) => (
                <div
                  id={`course-detail-card-${course.id}`}
                  key={course.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/30 p-5 shadow-xs hover:border-slate-200"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-sans text-sm font-bold text-slate-800 line-clamp-1">
                      {course.name}
                    </h4>
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 font-sans text-[10px] font-semibold text-blue-700">
                      {course.duration}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100/60 pt-3 text-xs">
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Annual Tuition Cost
                      </span>
                      <span className="font-mono text-sm font-bold text-slate-700">
                        ${course.fees.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Sanctioned Seats (Intake)
                      </span>
                      <span className="font-mono text-sm font-semibold text-slate-700">
                        {course.seats} Students
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL: PLACEMENTS */}
        {activeTab === 'placements' && (
          <div id="tab-placements" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans text-base font-bold text-slate-800">
                  Career Placements & Salary Packages ({college.shortName})
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Audited statistics for the graduating cohorts of students.
                </p>
              </div>
              <div className="rounded-lg bg-teal-50 px-3 py-1 text-center text-teal-800">
                <span className="block text-[10px] font-bold text-teal-600 uppercase tracking-wide">Employment Rate</span>
                <span className="font-mono text-lg font-black leading-tight">{college.placements.placementRate || 95}%</span>
              </div>
            </div>

            {/* Placement stats card matrix */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-emerald-50/20 p-4 text-center">
                <span className="font-sans text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Average Salary Offered
                </span>
                <span className="mt-1 block font-mono text-xl font-bold text-emerald-700">
                  ${college.placements.averageSalary.toLocaleString()}
                </span>
              </div>

              <div className="rounded-xl border border-slate-100 bg-blue-50/20 p-4 text-center">
                <span className="font-sans text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Highest Domestic Package
                </span>
                <span className="mt-1 block font-mono text-xl font-bold text-blue-700">
                  ${college.placements.highestSalary.toLocaleString()}
                </span>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
                <span className="font-sans text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Employment rate index
                </span>
                <span className="mt-1 block font-mono text-xl font-semibold text-slate-700">
                  {college.placements.placementRate}% of batch
                </span>
              </div>
            </div>

            {/* Recruiter List */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
              <span className="mb-3 block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Marquee Corporate recruiters
              </span>
              <div className="flex flex-wrap gap-2">
                {college.placements.topRecruiters.map((recruiter) => (
                  <span
                    key={recruiter}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {recruiter}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PANEL: REVIEWS */}
        {activeTab === 'reviews' && (
          <div id="tab-reviews" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Aggregated reviews and scores left */}
              <div className="space-y-4 lg:col-span-2">
                <h3 className="font-sans text-base font-bold text-slate-800">
                  Student Assessment Indices
                </h3>
                
                {/* Specific category scorebars */}
                <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  {[
                    { label: 'Academics & Study', score: college.reviews[0]?.categoryRatings.academics || 4.8 },
                    { label: 'Infrastructure & Research', score: college.reviews[0]?.categoryRatings.infrastructure || 4.7 },
                    { label: 'Accommodation & Dorm Support', score: college.reviews[0]?.categoryRatings.accommodation || 4.4 },
                    { label: 'Campus Culture & Activities', score: college.reviews[0]?.categoryRatings.campusLife || 4.6 },
                  ].map((category) => (
                    <div id={`idx-bar-${category.label.toLowerCase().replace(/\s+/g, '-')}`} key={category.label}>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>{category.label}</span>
                        <span className="font-bold">{category.score} / 5</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-200">
                        <div
                          style={{ width: `${(category.score / 5) * 100}%` }}
                          className="h-full rounded-full bg-blue-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit review interactive form */}
                <form id="write-review-form" onSubmit={handleReviewSubmit} className="rounded-xl border border-slate-150 p-4 space-y-4.5 bg-white">
                  <h4 className="flex items-center gap-1 font-sans text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <PenTool className="h-4 w-4 text-blue-600" /> Share Student Feedback
                  </h4>

                  {formSuccess && (
                     <div className="rounded-lg bg-teal-50 p-2.5 text-xs font-semibold text-teal-800">
                      Feedback published! You review has been aggregated below.
                     </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. Samuel Jones"
                      className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-400 uppercase font-semibold">Academics Rating</label>
                      <select
                        value={academics}
                        onChange={(e) => setAcademics(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                      >
                        {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-400 uppercase font-semibold">Infrastructure</label>
                      <select
                        value={infrastructure}
                        onChange={(e) => setInfrastructure(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                      >
                        {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-400 uppercase font-semibold">Dormitories</label>
                      <select
                        value={accommodation}
                        onChange={(e) => setAccommodation(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                      >
                        {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-400 uppercase font-semibold">Campus Life</label>
                      <select
                        value={campusLife}
                        onChange={(e) => setCampusLife(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                      >
                        {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold">Review Comment</label>
                    <textarea
                      required
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share detailed review comments, placement guidance..."
                      className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    id="submit-custom-review-btn"
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    Publish My Review
                  </button>
                </form>
              </div>

              {/* Feed of Reviews right */}
              <div className="space-y-4 lg:col-span-3">
                <h3 className="font-sans text-sm font-bold text-slate-500 uppercase tracking-widest">
                  Verified Scholar Feed ({reviewsList.length})
                </h3>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {reviewsList.map((review) => (
                    <div
                      id={`student-review-${review.id}`}
                      key={review.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/30 p-4 space-y-2.5 transition-colors hover:bg-slate-50/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800 text-sm">{review.username}</span>
                          <span className="ml-2 font-mono text-[10px] text-slate-400">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                          {review.rating} / 5
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{review.comment}"
                      </p>

                      {/* Display breakdown parameters */}
                      <div className="flex flex-wrap gap-2 text-[9px] font-semibold text-slate-400">
                        <span>Academics: {review.categoryRatings.academics}/5</span>
                        <span>•</span>
                        <span>Infrastructure: {review.categoryRatings.infrastructure}/5</span>
                        <span>•</span>
                        <span>Dorms: {review.categoryRatings.accommodation}/5</span>
                        <span>•</span>
                        <span>Campus: {review.categoryRatings.campusLife}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
