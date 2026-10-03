import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  ShoppingBag, 
  Layers, 
  SlidersHorizontal, 
  CheckCircle2, 
  Info, 
  Calendar,
  X,
  Filter
} from 'lucide-react';
import { Wig } from '../types';
import { formatCurrency } from '../utils/formatters';

interface WigCatalogueProps {
  wigs: Wig[];
  onSelectWig: (wig: Wig) => void;
  onBookWigInstall: (wig: Wig) => void;
  onToggleCompare?: (wig: Wig, type: 'wig') => void;
  isItemInCompare?: (id: string) => boolean;
  onAskQuestionAboutWig?: (wig: Wig) => void;
}

export const WigCatalogue: React.FC<WigCatalogueProps> = ({
  wigs,
  onSelectWig,
  onBookWigInstall,
  onToggleCompare,
  isItemInCompare,
  onAskQuestionAboutWig,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLength, setSelectedLength] = useState<string>('All');
  const [selectedTexture, setSelectedTexture] = useState<string>('All');
  const [selectedHairType, setSelectedHairType] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [priceMax, setPriceMax] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'length'>('recommended');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Extract unique options for filters
  const lengthOptions = useMemo(() => {
    const set = new Set<string>();
    wigs.forEach((w) => set.add(w.length));
    return ['All', ...Array.from(set).sort()];
  }, [wigs]);

  const textureOptions = useMemo(() => {
    const set = new Set<string>();
    wigs.forEach((w) => set.add(w.texture));
    return ['All', ...Array.from(set)];
  }, [wigs]);

  const hairTypeOptions = useMemo(() => {
    const set = new Set<string>();
    wigs.forEach((w) => set.add(w.hairType));
    return ['All', ...Array.from(set)];
  }, [wigs]);

  // Filter & Sort
  const filteredWigs = useMemo(() => {
    return wigs
      .filter((wig) => {
        // Price limit
        if (wig.price > priceMax) return false;
        // Length
        if (selectedLength !== 'All' && wig.length !== selectedLength) return false;
        // Texture
        if (selectedTexture !== 'All' && wig.texture !== selectedTexture) return false;
        // Hair type
        if (selectedHairType !== 'All' && wig.hairType !== selectedHairType) return false;
        // Availability
        if (selectedAvailability === 'In stock' && !wig.isAvailable) return false;
        if (selectedAvailability === 'Only 2 left' && wig.availabilityStatus !== 'Only 2 left') return false;
        if (selectedAvailability === 'Pre-order' && wig.availabilityStatus !== 'Pre-order') return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = wig.name.toLowerCase().includes(q);
          const matchTexture = wig.texture.toLowerCase().includes(q);
          const matchHairType = wig.hairType.toLowerCase().includes(q);
          const matchColor = wig.colour.toLowerCase().includes(q);
          const matchDesc = wig.description.toLowerCase().includes(q);
          const matchLength = wig.length.toLowerCase().includes(q);
          if (!matchName && !matchTexture && !matchHairType && !matchColor && !matchDesc && !matchLength) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'length') return parseInt(a.length) - parseInt(b.length);
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
        return 0;
      });
  }, [wigs, searchQuery, selectedLength, selectedTexture, selectedHairType, selectedAvailability, priceMax, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLength('All');
    setSelectedTexture('All');
    setSelectedHairType('All');
    setSelectedAvailability('All');
    setPriceMax(3000);
  };

  const hasActiveFilters = 
    searchQuery || 
    selectedLength !== 'All' || 
    selectedTexture !== 'All' || 
    selectedHairType !== 'All' || 
    selectedAvailability !== 'All' || 
    priceMax < 3000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Luxe Wig Boutique & Atelier</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Raw &amp; Virgin Human Hair Wigs
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Pre-customized Swiss HD Lace Frontals and Glueless closures. Filter by length, density, texture, and real-time inventory availability.
        </p>
      </div>

      {/* Main Filter & Search Control Panel */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
        
        {/* Top search & sorting bar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wig name, texture (e.g. body wave, bone straight), colour, length..."
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

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <span className="font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="recommended">Featured Wigs</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="length">Length</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className="md:hidden px-3.5 py-2 rounded-xl bg-amber-100 text-amber-950 font-semibold text-xs flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Detailed Filter Selectors (Desktop visible, mobile collapsible) */}
        <div className={`pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs ${showFilterDrawer ? 'block' : 'hidden md:grid'}`}>
          
          {/* Texture Filter */}
          <div className="space-y-1">
            <label className="text-stone-500 font-medium block">Texture</label>
            <select
              value={selectedTexture}
              onChange={(e) => setSelectedTexture(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium text-stone-800 focus:outline-none"
            >
              {textureOptions.map((t) => (
                <option key={t} value={t}>{t === 'All' ? 'All Textures' : t}</option>
              ))}
            </select>
          </div>

          {/* Length Filter */}
          <div className="space-y-1">
            <label className="text-stone-500 font-medium block">Length</label>
            <select
              value={selectedLength}
              onChange={(e) => setSelectedLength(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium text-stone-800 focus:outline-none"
            >
              {lengthOptions.map((l) => (
                <option key={l} value={l}>{l === 'All' ? 'All Lengths' : l}</option>
              ))}
            </select>
          </div>

          {/* Hair Type Filter */}
          <div className="space-y-1">
            <label className="text-stone-500 font-medium block">Hair Type & Lace</label>
            <select
              value={selectedHairType}
              onChange={(e) => setSelectedHairType(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium text-stone-800 focus:outline-none"
            >
              {hairTypeOptions.map((ht) => (
                <option key={ht} value={ht}>{ht === 'All' ? 'All Hair Types' : ht}</option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="space-y-1">
            <label className="text-stone-500 font-medium block">Stock Status</label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium text-stone-800 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="In stock">In Stock Only</option>
              <option value="Only 2 left">Only 2 Left</option>
              <option value="Pre-order">Pre-Order</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <div className="flex justify-between items-center text-stone-500 font-medium">
              <span>Max Price</span>
              <span className="font-semibold text-stone-900">GH₵ {priceMax}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="3000"
              step="50"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-amber-800 cursor-pointer"
            />
          </div>

        </div>

      </div>

      {/* Filter Status & Reset */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <strong>{filteredWigs.length}</strong> {filteredWigs.length === 1 ? 'wig' : 'wigs'}
          {selectedTexture !== 'All' && <span> • Texture: {selectedTexture}</span>}
          {selectedLength !== 'All' && <span> • Length: {selectedLength}</span>}
          {priceMax < 3000 && <span> • Under GH₵ {priceMax}</span>}
        </span>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-amber-800 hover:underline font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Wigs */}
      {filteredWigs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWigs.map((wig) => {
            const inCompare = isItemInCompare ? isItemInCompare(wig.id) : false;
            return (
              <div
                key={wig.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-semibold flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      View specs, lace type &amp; care
                    </span>
                  </div>

                  {/* Length & Texture pill */}
                  <span className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {wig.length} • {wig.texture}
                  </span>

                  {/* Stock Status Badge */}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                      wig.availabilityStatus === 'In stock'
                        ? 'bg-emerald-600 text-white'
                        : wig.availabilityStatus === 'Only 2 left'
                        ? 'bg-amber-600 text-white'
                        : wig.availabilityStatus === 'Pre-order'
                        ? 'bg-blue-600 text-white'
                        : 'bg-stone-500 text-white'
                    }`}
                  >
                    {wig.availabilityStatus}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-2">
                    <h3
                      onClick={() => onSelectWig(wig)}
                      className="font-serif font-bold text-base text-stone-900 hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
                      title={wig.name}
                    >
                      {wig.name}
                    </h3>

                    {/* Spec badges */}
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium">
                        {wig.hairType}
                      </span>
                      <span className="bg-amber-50 text-amber-900 border border-amber-200/50 px-2 py-0.5 rounded font-medium">
                        {wig.density} Density
                      </span>
                      <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                        {wig.colour}
                      </span>
                    </div>

                    {/* Quality Snippet */}
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed pt-1">
                      {wig.qualitySpecs}
                    </p>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-3 border-t border-stone-100 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Wig Price</span>
                        <span className="font-serif font-bold text-xl text-amber-950">
                          {formatCurrency(wig.price, wig.currency)}
                        </span>
                      </div>

                      {/* Compare toggle */}
                      <button
                        onClick={() => onToggleCompare?.(wig, 'wig')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                          inCompare
                            ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                        title={inCompare ? 'Remove from comparison' : 'Compare with other wigs'}
                      >
                        <Layers className="w-3 h-3" />
                        <span>{inCompare ? 'Compared' : 'Compare'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectWig(wig)}
                        className="py-2.5 px-3 rounded-xl border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold text-center transition-colors cursor-pointer"
                      >
                        Specs &amp; Care
                      </button>

                      <button
                        onClick={() => onBookWigInstall(wig)}
                        className="py-2.5 px-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold text-center transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Install</span>
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
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900">No wigs match your filters</h3>
            <p className="text-xs text-stone-500 mt-1">
              Try adjusting your price range, length, or texture selections to see available inventory.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
