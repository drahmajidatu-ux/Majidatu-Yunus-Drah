import React from 'react';
import { Crown, Heart, Phone, Mail, MapPin, Instagram, MessageCircle, Lock, Sparkles, Layers } from 'lucide-react';
import { SalonSettings } from '../types';
import { createWhatsAppLink } from '../utils/formatters';

interface FooterProps {
  settings: SalonSettings;
  onNavigate: (tabOrRoute: string) => void;
  onOpenBooking: () => void;
  onOpenCompare: () => void;
  compareCount: number;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenBooking,
  onOpenCompare,
  compareCount,
}) => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-stone-800">
          
          {/* Col 1: Salon Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Crown className="w-6 h-6 text-amber-100" />
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white block">
                  {settings.salonName}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
                  Digital Salon Catalogue &amp; Wig Atelier
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Discover all luxury braids, weaving, natural hair styling, and raw virgin lace wigs with 100% upfront pricing. Book your seat online and chat directly with our expert stylists.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.link/ufocc9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                title="WhatsApp Us"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:bg-amber-700 hover:text-white flex items-center justify-center transition-colors"
                title="Call Salon"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:bg-pink-700 hover:text-white flex items-center justify-center transition-colors"
                title="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Hairstyles Directory */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm tracking-wide">
              Hairstyles Menu
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('hairstyles')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Knotless Braids
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hairstyles')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Ghana Weaving &amp; Cornrows
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hairstyles')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Bohemian &amp; Passion Twists
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hairstyles')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Natural Haircare &amp; Silk Press
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hairstyles')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Lace Frontal &amp; Closure Installs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Wigs & Services */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm tracking-wide">
              Wig Atelier
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('wigs')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Raw Bone Straight Frontals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wigs')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Body Wave &amp; Deep Wave Units
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wigs')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Glueless HD Closures
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCompare}
                  className="text-amber-400 hover:text-amber-200 transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Compare Styles / Wigs ({compareCount})</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer font-semibold text-amber-200"
                >
                  Book Consultation Slot
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Salon Location & Hours */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm tracking-wide">
              Salon Atelier
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address}, {settings.city}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.email}</span>
              </div>
              <div className="pt-2">
                <span className="text-white font-medium block">Working Hours:</span>
                <span className="text-[11px] block mt-0.5 text-stone-400">{settings.openingHours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {settings.salonName}. All rights reserved. Transparent Salon Pricing &amp; Digital Catalogue.</p>

          <div className="flex items-center gap-4">
            <a
              href="/admin/login"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/admin/login');
              }}
              className="text-stone-500 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              title="Administrator Login"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
