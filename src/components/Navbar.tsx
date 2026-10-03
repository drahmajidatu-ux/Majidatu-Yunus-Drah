import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Calendar, 
  MessageCircle, 
  ShieldCheck, 
  Menu, 
  X, 
  Phone, 
  Layers, 
  ShoppingBag, 
  Scissors
} from 'lucide-react';
import { SalonSettings } from '../types';
import { createWhatsAppLink } from '../utils/formatters';

interface NavbarProps {
  settings: SalonSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenBooking: () => void;
  onOpenChat: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeTab,
  setActiveTab,
  compareCount,
  onOpenCompare,
  onOpenBooking,
  onOpenChat,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'hairstyles', label: 'Hairstyles', icon: Scissors },
    { id: 'wigs', label: 'Wig Atelier', icon: ShoppingBag },
    { id: 'contact', label: 'Contact & Hours', icon: Phone },
  ];

  return (
    <header id="site-header" className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] sm:text-xs tracking-wide">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Salon Open Today: {settings.openingHours.split('|')[0] || '8:00 AM - 7:30 PM'}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.phone}`}
              className="hover:text-amber-300 transition-colors hidden sm:flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{settings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <button
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-700 via-stone-800 to-amber-900 flex items-center justify-center text-amber-300 shadow-md shadow-amber-950/10 border border-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 block leading-none">
                Crown & Glam
              </span>
              <span className="text-[10px] tracking-widest text-amber-800 uppercase font-semibold block mt-1">
                Salon & Wig Atelier
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-100/70 text-amber-950 font-semibold shadow-xs'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-800' : 'text-stone-500'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}

            {/* Compare Button */}
            <button
              onClick={onOpenCompare}
              className="relative px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Compare hairstyles or wigs side by side"
            >
              <Layers className="w-4 h-4 text-stone-500" />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full bg-amber-700 text-white min-w-5 text-center animate-pulse">
                  {compareCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
              title="Search styles & wigs"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Chat with Us */}
            <button
              onClick={onOpenChat}
              className="p-2.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer relative"
              title="Ask a Question / Chat"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* WhatsApp Direct */}
            <a
              href="https://wa.link/ufocc9"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-full border border-emerald-600 text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Book Appointment CTA */}
            <button
              onClick={onOpenBooking}
              className="px-4 py-2.5 rounded-full bg-stone-900 hover:bg-amber-900 text-amber-100 text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-200/60"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenCompare}
              className="relative p-2 rounded-lg text-stone-700 hover:bg-stone-200/60"
              title="Compare"
            >
              <Layers className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-900 hover:bg-stone-200/60 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-200">
            <button
              onClick={() => {
                setActiveTab('hairstyles');
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-left flex items-center gap-2 font-medium"
            >
              <Scissors className="w-4 h-4 text-amber-800" />
              <span>Hairstyles</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('wigs');
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-left flex items-center gap-2 font-medium"
            >
              <ShoppingBag className="w-4 h-4 text-amber-800" />
              <span>Wig Atelier</span>
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'home' ? 'bg-amber-100 text-amber-950 font-semibold' : 'text-stone-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab('contact');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'contact' ? 'bg-amber-100 text-amber-950 font-semibold' : 'text-stone-700'
              }`}
            >
              Contact & Salon Hours
            </button>
          </div>

          <div className="pt-3 border-t border-stone-200 space-y-2">
            <button
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-stone-900 text-amber-100 text-sm font-semibold flex items-center justify-center gap-2 shadow"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Book an Appointment</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenChat();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 rounded-xl border border-stone-300 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-stone-600" />
                <span>Ask Question</span>
              </button>
              <a
                href="https://wa.link/ufocc9"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
