import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  Sparkles, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { Hairstyle, HairstyleCategory } from '../types';
import { formatCurrency } from '../utils/formatters';

interface HairstyleCatalogueProps {
  hairstyles: Hairstyle[];
  onSelectHairstyle: (style: Hairstyle) => void;
  onBookHairstyle: (style: Hairstyle) => void;
  onToggleCompare?: (style: Hairstyle, type: 'hairstyle') => void;
  isItemInCompare?: (id: string) => boolean;
  onAskQuestionAboutStyle?: (style: Hairstyle) => void;
}

const CATEGORIES: HairstyleCategory[] = [
  'All',
  'Braids',
  'Ghana weaving',
  'Cornrows',
  'Knotless braids',
  'Twists',
  'Natural hairstyles',
  'Locs',
  'Wig installation',
  'Hair extensions',
  'Other hairstyles',
];

export const HairstyleCatalogue: React.FC<HairstyleCatalogueProps> = ({
  hairstyles,
  onSelectHairstyle,
  onBookHairstyle,
  onToggleCompare,
  isItemInCompare,
  onAskQuestionAboutStyle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HairstyleCategory>('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'duration'>('recommended');

  // Filter and sort logic
  const filteredHairstyles = useMemo(() => {
    return hairstyles
      .filter((style) => {
        // Category filter
        if (selectedCategory !== 'All' && style.category !== selectedCategory) {
          return false;
        }
        // Availability filter
        if (onlyAvailable && !style.isAvailable) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = style.name.toLowerCase().includes(q);
          const matchCategory = style.category.toLowerCase().includes(q);
          const matchDesc = style.description.toLowerCase().includes(q);
          const matchMaterial = style.hairMaterialRequired.toLowerCase().includes(q);
          const matchColors = style.availableColours.some((c) => c.toLowerCase().includes(q));
          if (!matchName && !matchCategory && !matchDesc && !matchMaterial && !matchColors) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'duration') return a.estimatedDuration.localeCompare(b.estimatedDuration);
        // Default: trending first
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
        return 0;
      });
  }, [hairstyles, selectedCategory, onlyAvailable, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hairstyle Price Book & Lookbook</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Explore All Salon Hairstyles
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Detailed specifications, duration estimates, required hair extensions, and upfront pricing.
          Find your look and book directly without waiting for a physical salon price list.
        </p>
      </div>

      {/* Search & Main Filter Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Instant Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search braids, twists, knotless, cornrows, materials..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all text-stone-900 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filters: Sort & Availability */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sort selector */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <span className="font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="recommended">Featured / Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration">Estimated Time</option>
              </select>
            </div>

            {/* Availability Toggle */}
            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                onlyAvailable
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${onlyAvailable ? 'text-emerald-600' : 'text-stone-400'}`} />
              <span>Available to Book</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips Bar */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {CATEGORIES.map((category) => {
              const count = category === 'All' 
                ? hairstyles.length 
                : hairstyles.filter((h) => h.category === category).length;
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-900 text-amber-50 font-semibold shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-800 text-amber-200' : 'bg-stone-200/80 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Filter summary */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <strong>{filteredHairstyles.length}</strong> {filteredHairstyles.length === 1 ? 'hairstyle' : 'hairstyles'}
          {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
          {searchQuery && <span> matching "<em>{searchQuery}</em>"</span>}
        </span>
        {(selectedCategory !== 'All' || searchQuery || onlyAvailable) && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setOnlyAvailable(false);
            }}
            className="text-amber-800 hover:underline font-semibold cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Grid of Hairstyles */}
      {filteredHairstyles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHairstyles.map((style) => {
            const inCompare = isItemInCompare ? isItemInCompare(style.id) : false;
            return (
              <div
                key={style.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image & Badges */}
                <div
                  className="relative aspect-[4/5] bg-stone-100 overflow-hidden cursor-pointer"
                  onClick={() => onSelectHairstyle(style)}
                >
                  <img
                    src={style.imageUrl}
                    alt={style.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-semibold flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      Click for full specs & material guide
                    </span>
                  </div>

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {style.category}
                  </span>

                  {/* Availability Badge */}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                      style.isAvailable
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-600 text-white'
                    }`}
                  >
                    {style.isAvailable ? 'Available' : 'Consultation Only'}
                  </span>
                </div>

                {/* Content Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    
                    {/* Title & Quick Info */}
                    <div>
                      <h3
                        onClick={() => onSelectHairstyle(style)}
                        className="font-serif font-bold text-lg text-stone-900 hover:text-amber-800 transition-colors cursor-pointer"
                      >
                        {style.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                        <span className="flex items-center gap-1 font-medium text-stone-700">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>{style.estimatedDuration}</span>
                        </span>
                        <span>•</span>
                        <span className="text-stone-600 truncate">{style.lengthOption || 'Standard length'}</span>
                      </div>
                    </div>

                    {/* Hair Material Required */}
                    <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-xs text-stone-800">
                      <span className="font-semibold text-amber-950 block mb-0.5">
                        Hair Material Required:
                      </span>
                      <p className="text-stone-700 text-[11px] leading-relaxed line-clamp-2">
                        {style.hairMaterialRequired}
                      </p>
                    </div>

                    {/* Available Colours Chips */}
                    <div>
                      <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-1">
                        Available Hair Colours:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {style.availableColours.map((color, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Description excerpt */}
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {style.description}
                    </p>
                  </div>

                  {/* Bottom Price & Action Footer */}
                  <div className="pt-3 border-t border-stone-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Total Style Price</span>
                        <span className="font-serif font-bold text-2xl text-amber-950">
                          {formatCurrency(style.price, style.currency)}
                        </span>
                      </div>
                      
                      {/* Compare toggle */}
                      <button
                        onClick={() => onToggleCompare?.(style, 'hairstyle')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                          inCompare
                            ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                        title={inCompare ? 'Remove from comparison' : 'Compare with other styles'}
                      >
                        <Layers className="w-3 h-3" />
                        <span>{inCompare ? 'Compared' : 'Compare'}</span>
                      </button>
                    </div>

                    {/* Main CTA Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectHairstyle(style)}
                        className="py-2.5 px-3 rounded-xl border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold text-center transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                      
                      <button
                        onClick={() => onBookHairstyle(style)}
                        className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-amber-900 text-white text-xs font-semibold text-center transition-colors shadow-xs hover:shadow cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>Book Style</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900">No matching hairstyles found</h3>
            <p className="text-xs text-stone-500 mt-1">
              Try adjusting your search query or choosing another category like Braids, Twists, or Knotless.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setOnlyAvailable(false);
            }}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};
