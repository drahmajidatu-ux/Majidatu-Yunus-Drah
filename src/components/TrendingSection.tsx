import React from 'react';
import { Sparkles, Clock, Check, Scissors, ShoppingBag, ArrowRight } from 'lucide-react';
import { Hairstyle, Wig } from '../types';
import { formatCurrency } from '../utils/formatters';

interface TrendingSectionProps {
  hairstyles: Hairstyle[];
  wigs: Wig[];
  onSelectHairstyle: (style: Hairstyle) => void;
  onSelectWig: (wig: Wig) => void;
  onBookItem: (type: 'hairstyle' | 'wig_install' | 'wig_purchase', item: Hairstyle | Wig) => void;
  onToggleCompare?: (item: Hairstyle | Wig, type: 'hairstyle' | 'wig') => void;
  isItemInCompare?: (id: string) => boolean;
  onViewAllHairstyles?: () => void;
  onViewAllWigs?: () => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  hairstyles,
  wigs,
  onSelectHairstyle,
  onSelectWig,
  onBookItem,
  onToggleCompare,
  isItemInCompare,
  onViewAllHairstyles,
  onViewAllWigs,
}) => {
  const trendingStyles = hairstyles.filter((h) => h.isTrending).slice(0, 4);
  const trendingWigs = wigs.filter((w) => w.isTrending).slice(0, 4);

  return (
    <section id="trending-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* 1. Trending Hairstyles */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trending & Most Requested</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Popular Salon Hairstyles
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Client favorites this month. No hidden charges — exact prices and estimated durations listed.
            </p>
          </div>
          <button
            onClick={onViewAllHairstyles}
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-stone-900 transition-colors group cursor-pointer shrink-0"
          >
            <span>View All Hairstyles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid of Trending Styles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingStyles.map((style) => {
            const inCompare = isItemInCompare ? isItemInCompare(style.id) : false;
            return (
              <div
                key={style.id}
                className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Image Container */}
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
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {style.category}
                  </span>

                  {/* Availability Badge */}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      style.isAvailable
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-stone-500/90 text-white'
                    }`}
                  >
                    {style.isAvailable ? 'Available' : 'Fully Booked'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      onClick={() => onSelectHairstyle(style)}
                      className="font-serif font-bold text-base text-stone-900 line-clamp-1 hover:text-amber-800 transition-colors cursor-pointer"
                      title={style.name}
                    >
                      {style.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-stone-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>{style.estimatedDuration}</span>
                      </span>
                      <span className="truncate max-w-[120px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                        {style.lengthOption || 'Standard'}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                      {style.description}
                    </p>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Price</span>
                      <span className="font-serif font-bold text-lg text-amber-950">
                        {formatCurrency(style.price, style.currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleCompare?.(style, 'hairstyle')}
                        className={`p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          inCompare
                            ? 'bg-amber-100 border-amber-400 text-amber-900 font-semibold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                        title={inCompare ? 'Remove from comparison' : 'Add to compare'}
                      >
                        {inCompare ? '✓ Compared' : 'Compare'}
                      </button>

                      <button
                        onClick={() => onBookItem('hairstyle', style)}
                        className="px-3 py-2 rounded-lg bg-stone-900 hover:bg-amber-900 text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Featured Wigs in High Demand */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Ready-to-Wear Wigs</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Featured Luxury Wigs
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              100% Virgin & Raw Human Hair. Pre-plucked HD lace frontals and easy glueless closures.
            </p>
          </div>
          <button
            onClick={onViewAllWigs}
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-stone-900 transition-colors group cursor-pointer shrink-0"
          >
            <span>Explore All Wigs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid of Trending Wigs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingWigs.map((wig) => {
            const inCompare = isItemInCompare ? isItemInCompare(wig.id) : false;
            return (
              <div
                key={wig.id}
                className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Image Container */}
                <div
                  className="relative aspect-[4/5] bg-stone-100 overflow-hidden cursor-pointer"
                  onClick={() => onSelectWig(wig)}
                >
                  <img
                    src={wig.imageUrl}
                    alt={wig.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />

                  {/* Length & Texture pill */}
                  <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {wig.length} • {wig.texture}
                  </span>

                  {/* Stock Status Badge */}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      wig.availabilityStatus === 'In stock'
                        ? 'bg-emerald-500/90 text-white'
                        : wig.availabilityStatus === 'Only 2 left'
                        ? 'bg-amber-600/90 text-white'
                        : 'bg-stone-500/90 text-white'
                    }`}
                  >
                    {wig.availabilityStatus}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      onClick={() => onSelectWig(wig)}
                      className="font-serif font-bold text-base text-stone-900 line-clamp-1 hover:text-amber-800 transition-colors cursor-pointer"
                      title={wig.name}
                    >
                      {wig.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-1.5 flex-wrap">
                      <span className="bg-stone-100 px-2 py-0.5 rounded font-medium text-stone-700">
                        {wig.hairType}
                      </span>
                      <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-medium">
                        {wig.density}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                      {wig.description}
                    </p>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Price</span>
                      <span className="font-serif font-bold text-lg text-amber-950">
                        {formatCurrency(wig.price, wig.currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleCompare?.(wig, 'wig')}
                        className={`p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          inCompare
                            ? 'bg-amber-100 border-amber-400 text-amber-900 font-semibold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                        title={inCompare ? 'Remove from comparison' : 'Add to compare'}
                      >
                        {inCompare ? '✓ Compared' : 'Compare'}
                      </button>

                      <button
                        onClick={() => onSelectWig(wig)}
                        className="px-3 py-2 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
