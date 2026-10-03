import React, { useState, useMemo } from 'react';
import { X, Search, Clock, Scissors, ShoppingBag, ArrowRight } from 'lucide-react';
import { Hairstyle, Wig } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  hairstyles: Hairstyle[];
  wigs: Wig[];
  onSelectHairstyle: (style: Hairstyle) => void;
  onSelectWig: (wig: Wig) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  hairstyles,
  wigs,
  onSelectHairstyle,
  onSelectWig,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { matchingStyles: [], matchingWigs: [] };
    const q = query.toLowerCase();

    const matchingStyles = hairstyles.filter(
      (h) =>
        !h.isHidden &&
        (h.name.toLowerCase().includes(q) ||
          h.category.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q) ||
          h.hairMaterialRequired.toLowerCase().includes(q) ||
          h.availableColours.some((c) => c.toLowerCase().includes(q)))
    );

    const matchingWigs = wigs.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.texture.toLowerCase().includes(q) ||
        w.hairType.toLowerCase().includes(q) ||
        w.colour.toLowerCase().includes(q) ||
        w.length.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q)
    );

    return { matchingStyles, matchingWigs };
  }, [query, hairstyles, wigs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-950/75 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3 bg-stone-50/50">
          <Search className="w-5 h-5 text-stone-400 shrink-0 ml-1" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hairstyles or wigs (e.g. knotless, bone straight, twists, 24 inches)..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggested Tags */}
        {!query && (
          <div className="p-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {['Ghana Braids', 'Ghana Weaving', 'Knotless Braids', 'Cornrows', 'Passion Twists', 'Fulani Braids', 'Butterfly Locs', 'Straight-back', 'Bone Straight Wig'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-950 text-xs font-medium transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query && (
          <div className="p-4 overflow-y-auto space-y-6 flex-1">
            {/* Hairstyles Results */}
            {results.matchingStyles.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 px-1">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Matching Hairstyles ({results.matchingStyles.length})</span>
                </div>
                <div className="divide-y divide-stone-100">
                  {results.matchingStyles.map((style) => (
                    <div
                      key={style.id}
                      onClick={() => {
                        onClose();
                        onSelectHairstyle(style);
                      }}
                      className="p-3 rounded-xl hover:bg-stone-50 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={style.imageUrl}
                          alt={style.name}
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <span className="text-xs text-amber-800 font-semibold block">{style.category}</span>
                          <h4 className="font-serif font-bold text-sm text-stone-900 group-hover:text-amber-900 truncate">
                            {style.name}
                          </h4>
                          <span className="text-xs text-stone-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {style.estimatedDuration}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-sm text-stone-900 block">
                          {formatCurrency(style.price, style.currency)}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-medium">
                          {style.isAvailable ? 'Available' : 'Consultation'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wigs Results */}
            {results.matchingWigs.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 px-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Matching Wigs ({results.matchingWigs.length})</span>
                </div>
                <div className="divide-y divide-stone-100">
                  {results.matchingWigs.map((wig) => (
                    <div
                      key={wig.id}
                      onClick={() => {
                        onClose();
                        onSelectWig(wig);
                      }}
                      className="p-3 rounded-xl hover:bg-stone-50 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={wig.imageUrl}
                          alt={wig.name}
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <span className="text-xs text-amber-800 font-semibold block">
                            {wig.length} • {wig.texture}
                          </span>
                          <h4 className="font-serif font-bold text-sm text-stone-900 group-hover:text-amber-900 truncate">
                            {wig.name}
                          </h4>
                          <span className="text-xs text-stone-400">{wig.hairType}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-sm text-stone-900 block">
                          {formatCurrency(wig.price, wig.currency)}
                        </span>
                        <span className="text-[11px] text-amber-700 font-medium">
                          {wig.availabilityStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.matchingStyles.length === 0 && results.matchingWigs.length === 0 && (
              <div className="py-12 text-center text-stone-500 text-xs space-y-2">
                <p className="font-semibold text-stone-700 text-sm">No hairstyles or wigs matched "{query}"</p>
                <p>Try searching for braids, twists, bone straight, bob, or closure.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
