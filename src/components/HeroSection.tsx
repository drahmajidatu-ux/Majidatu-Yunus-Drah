import React from 'react';
import { Sparkles, Calendar, Scissors, ShoppingBag, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import { SalonSettings } from '../types';

interface HeroSectionProps {
  settings: SalonSettings;
  onBrowseHairstyles: () => void;
  onBrowseWigs: () => void;
  onBookAppointment: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onBrowseHairstyles,
  onBrowseWigs,
  onBookAppointment,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEA] to-[#FAF8F5] border-b border-stone-200/80 pt-8 pb-16 lg:py-20">
      {/* Background ambient gold aura */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-stone-300/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Description, 3 Main Action Buttons, and Badges */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Salon Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/60 text-amber-950 text-xs font-semibold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>Digital Salon Catalogue & Price Book</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.12] tracking-tight">
                Flawless Braids, <br className="hidden sm:inline" />
                <span className="italic font-normal text-amber-900">Virgin Hair Wigs</span> &amp; Precision Styling
              </h1>
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Welcome to {settings.salonName}. Browse our full hairstyle and wig collections with transparent prices, duration estimates, required hair packs, and real-time availability — with zero need to ask for a price list.
              </p>
            </div>

            {/* 3 Prominent Action Buttons Required by User */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              {/* Browse Hairstyles */}
              <button
                onClick={onBrowseHairstyles}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-100 font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md shadow-stone-900/10 hover:shadow-lg transition-all cursor-pointer group"
              >
                <Scissors className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Browse Hairstyles</span>
              </button>

              {/* Browse Wigs */}
              <button
                onClick={onBrowseWigs}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md shadow-amber-950/15 hover:shadow-lg transition-all cursor-pointer group"
              >
                <ShoppingBag className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                <span>Browse Wigs</span>
              </button>

              {/* Book an Appointment */}
              <button
                onClick={onBookAppointment}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>Book Appointment</span>
              </button>
            </div>

            {/* Salon Assurance Badges */}
            <div className="pt-4 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-medium text-stone-700">100% Upfront Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-medium text-stone-700">Pain-Free Knotless</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-medium text-stone-700">Raw Virgin Hair Wigs</span>
              </div>
            </div>

            {/* Quick Contact & Location Preview */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-stone-500 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{settings.address}, {settings.city}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>{settings.phone}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Open Mon–Sat 8am–7:30pm</span>
              </div>
            </div>
          </div>

          {/* Right Column: Beautiful Curated Hair Imagery Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Featured Photo */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1000&q=85"
                  alt="Knotless Goddess Braids Showcase"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                
                {/* Overlay Card on bottom of image */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-lg text-stone-900 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                      Client Favorite
                    </span>
                    <h3 className="font-serif font-bold text-sm text-stone-900">
                      Boho Goddess Knotless Braids
                    </h3>
                    <p className="text-xs text-stone-500">4h 30m • Mid-Back</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Starting at</span>
                    <span className="font-serif font-bold text-lg text-amber-900">GH₵ 380</span>
                  </div>
                </div>
              </div>

              {/* Floating Secondary Photo Badge - Wig Spotlight */}
              <div className="hidden sm:flex absolute -bottom-6 -left-8 p-3 rounded-2xl bg-white shadow-xl border border-stone-200/90 items-center gap-3.5 max-w-xs animate-bounce-slow">
                <img
                  src="https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?auto=format&fit=crop&w=200&q=80"
                  alt="Raw Hair Straight Frontal Wig"
                  className="w-14 h-14 rounded-xl object-cover border border-stone-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider block">
                    ● In Stock • Ready to Wear
                  </span>
                  <p className="text-xs font-bold text-stone-900">Raw Bone Straight 24"</p>
                  <p className="text-xs font-semibold text-amber-800">GH₵ 1,850</p>
                </div>
              </div>

              {/* Floating Review Badge */}
              <div className="absolute -top-4 -right-4 bg-stone-900 text-white px-3.5 py-2 rounded-xl shadow-lg border border-stone-700 flex items-center gap-2">
                <div className="text-amber-400 text-xs font-bold flex">★ ★ ★ ★ ★</div>
                <div className="text-[11px] font-medium text-stone-300">4.9 / 5.0 Salon</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
