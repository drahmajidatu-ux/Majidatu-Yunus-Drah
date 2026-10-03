import React, { useState, useEffect } from 'react';
import { 
  getStoredHairstyles, 
  saveStoredHairstyles, 
  getStoredWigs, 
  saveStoredWigs, 
  getStoredBookings, 
  saveStoredBookings, 
  getStoredMessages, 
  saveStoredMessages, 
  getStoredSettings, 
  saveStoredSettings, 
  resetToDefaults 
} from './services/storage';
import { Hairstyle, Wig, Booking, CustomerMessage, SalonSettings } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrendingSection } from './components/TrendingSection';
import { HairstyleCatalogue } from './components/HairstyleCatalogue';
import { HairstyleDetailModal } from './components/HairstyleDetailModal';
import { WigCatalogue } from './components/WigCatalogue';
import { WigDetailModal } from './components/WigDetailModal';
import { CompareModal } from './components/CompareModal';
import { BookingModal } from './components/BookingModal';
import { ChatInquiryModal } from './components/ChatInquiryModal';
import { SearchModal } from './components/SearchModal';
import { ContactSection } from './components/ContactSection';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { MessageCircle, Layers, Calendar, CheckCircle2, Sparkles, Phone } from 'lucide-react';
import { createWhatsAppLink } from './utils/formatters';

export function App() {
  // Database state
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>(getStoredHairstyles);
  const [wigs, setWigs] = useState<Wig[]>(getStoredWigs);
  const [bookings, setBookings] = useState<Booking[]>(getStoredBookings);
  const [messages, setMessages] = useState<CustomerMessage[]>(getStoredMessages);
  const [settings, setSettings] = useState<SalonSettings>(getStoredSettings);

  // URL Path and Route state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const navigateRoute = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isAdminRoute = currentPath.startsWith('/admin');

  // Check authentication
  const checkIsAuthenticated = () => {
    try {
      return sessionStorage.getItem('crown_admin_auth_v1') === 'true';
    } catch {
      return false;
    }
  };

  // Protect admin routes: unauthenticated visits to /admin* are redirected to /admin/login
  useEffect(() => {
    if (isAdminRoute && !checkIsAuthenticated()) {
      if (currentPath !== '/admin/login') {
        window.history.replaceState({}, '', '/admin/login');
        setCurrentPath('/admin/login');
      }
    }
  }, [currentPath, isAdminRoute]);

  // Active tab derived from current URL path
  const activeTab: 'home' | 'hairstyles' | 'wigs' | 'contact' | 'admin' = isAdminRoute
    ? 'admin'
    : currentPath === '/hairstyles'
    ? 'hairstyles'
    : currentPath === '/wigs'
    ? 'wigs'
    : currentPath === '/contact'
    ? 'contact'
    : 'home';

  const setActiveTab = (tab: string) => {
    if (tab === 'admin' || tab.startsWith('/admin')) {
      navigateRoute(tab.startsWith('/admin') ? tab : '/admin');
    } else if (tab === 'hairstyles') {
      navigateRoute('/hairstyles');
    } else if (tab === 'wigs') {
      navigateRoute('/wigs');
    } else if (tab === 'contact') {
      navigateRoute('/contact');
    } else {
      navigateRoute('/');
    }
  };

  // Detail modals
  const [selectedHairstyle, setSelectedHairstyle] = useState<Hairstyle | null>(null);
  const [selectedWig, setSelectedWig] = useState<Wig | null>(null);

  // Compare side-by-side state
  const [compareItems, setCompareItems] = useState<Array<{ item: Hairstyle | Wig; type: 'hairstyle' | 'wig' }>>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState<{ type: 'hairstyle' | 'wig_install' | 'wig_purchase'; item: Hairstyle | Wig } | null>(null);

  // Chat / Inquiry modal state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSubject, setChatSubject] = useState<{ type: 'hairstyle' | 'wig'; item: Hairstyle | Wig } | null>(null);

  // Global Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Floating notification toast
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (text: string) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 3000);
  };

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Ensure WhatsApp and Phone settings are up to date
  useEffect(() => {
    if (
      !settings.whatsapp ||
      settings.whatsapp !== 'https://wa.link/ufocc9'
    ) {
      const updated: SalonSettings = {
        ...settings,
        whatsapp: 'https://wa.link/ufocc9',
      };
      setSettings(updated);
      saveStoredSettings(updated);
    }
  }, [settings]);

  // Ensure hairstyle catalogue migrates from any legacy format
  useEffect(() => {
    if (hairstyles.some((h) => h.id.startsWith('hs-'))) {
      const freshHairstyles = getStoredHairstyles();
      setHairstyles(freshHairstyles);
      saveStoredHairstyles(freshHairstyles);
    }
  }, [hairstyles]);

  // PERSISTENCE HANDLERS
  const handleUpdateHairstyles = (updated: Hairstyle[]) => {
    setHairstyles(updated);
    saveStoredHairstyles(updated);
  };

  const handleUpdateWigs = (updated: Wig[]) => {
    setWigs(updated);
    saveStoredWigs(updated);
  };

  const handleUpdateBookings = (updated: Booking[]) => {
    setBookings(updated);
    saveStoredBookings(updated);
  };

  const handleUpdateMessages = (updated: CustomerMessage[]) => {
    setMessages(updated);
    saveStoredMessages(updated);
  };

  const handleUpdateSettings = (updated: SalonSettings) => {
    setSettings(updated);
    saveStoredSettings(updated);
  };

  const handleResetDefaults = () => {
    resetToDefaults();
    setHairstyles(getStoredHairstyles());
    setWigs(getStoredWigs());
    setBookings(getStoredBookings());
    setMessages(getStoredMessages());
    setSettings(getStoredSettings());
    setCompareItems([]);
  };

  // COMPARE HANDLERS
  const isItemInCompare = (id: string): boolean => {
    return compareItems.some((ci) => ci.item.id === id);
  };

  const handleToggleCompare = (item: Hairstyle | Wig, type: 'hairstyle' | 'wig') => {
    const exists = compareItems.some((ci) => ci.item.id === item.id);
    if (exists) {
      setCompareItems((prev) => prev.filter((ci) => ci.item.id !== item.id));
      showNotification(`Removed "${item.name}" from comparison.`);
    } else {
      if (compareItems.length >= 4) {
        showNotification('You can compare up to 4 styles or wigs at a time. Remove one first.');
        setIsCompareOpen(true);
        return;
      }
      setCompareItems((prev) => [...prev, { type, item }]);
      showNotification(`Added "${item.name}" to comparison! (${compareItems.length + 1}/4)`);
    }
  };

  const handleRemoveCompareItem = (id: string) => {
    setCompareItems((prev) => prev.filter((ci) => ci.item.id !== id));
  };

  const handleClearCompare = () => {
    setCompareItems([]);
    setIsCompareOpen(false);
  };

  // BOOKING HANDLERS
  const handleOpenBooking = (
    type: 'hairstyle' | 'wig_install' | 'wig_purchase' = 'hairstyle',
    item?: Hairstyle | Wig
  ) => {
    if (item) {
      setBookingItem({ type, item });
    } else {
      setBookingItem(null);
    }
    setIsBookingOpen(true);
  };

  const handleBookingSubmitted = (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    handleUpdateBookings(updated);
    showNotification(`Booking reference ${newBooking.id} secured!`);
  };

  // CHAT / INQUIRY HANDLERS
  const handleOpenChat = (type?: 'hairstyle' | 'wig', item?: Hairstyle | Wig) => {
    if (type && item) {
      setChatSubject({ type, item });
    } else {
      setChatSubject(null);
    }
    setIsChatOpen(true);
  };

  const handleSendMessage = (newMsg: CustomerMessage) => {
    const updated = [newMsg, ...messages];
    handleUpdateMessages(updated);
    showNotification('Your question was sent directly to our salon desk!');
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-amber-800 selection:text-white">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-amber-100 px-4 py-3 rounded-2xl shadow-2xl border border-amber-900/40 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      {activeTab !== 'admin' && (
        <Navbar
          settings={settings}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenBooking={() => handleOpenBooking('hairstyle')}
          onOpenChat={() => handleOpenChat()}
          onOpenSearch={() => setIsSearchOpen(true)}
          compareCount={compareItems.length}
          onOpenCompare={() => setIsCompareOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-16 sm:space-y-24">
            {/* Hero Section with CTAs */}
            <HeroSection
              settings={settings}
              onBrowseHairstyles={() => setActiveTab('hairstyles')}
              onBrowseWigs={() => setActiveTab('wigs')}
              onBookAppointment={() => handleOpenBooking('hairstyle')}
            />

            {/* Trending & Featured Section */}
            <TrendingSection
              hairstyles={hairstyles}
              wigs={wigs}
              onSelectHairstyle={(style) => setSelectedHairstyle(style)}
              onSelectWig={(wig) => setSelectedWig(wig)}
              onBookItem={(type, item) => handleOpenBooking(type, item)}
              onToggleCompare={handleToggleCompare}
              isItemInCompare={isItemInCompare}
              onViewAllHairstyles={() => setActiveTab('hairstyles')}
              onViewAllWigs={() => setActiveTab('wigs')}
            />

            {/* Preview of Hairstyle Categories & Quick Highlights */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 max-w-xl text-center md:text-left">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block">
                    Zero Price Guesswork
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
                    Never Ask "How Much?" For Hair Again
                  </h3>
                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                    Browse every braid style, length, hair extension requirement, and raw virgin wig with exact pricing. Compare items side-by-side or message our stylists directly.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => setActiveTab('hairstyles')}
                    className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-md text-center"
                  >
                    Browse Hairstyles Menu
                  </button>
                  <button
                    onClick={() => setActiveTab('wigs')}
                    className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-colors cursor-pointer text-center"
                  >
                    Explore Wigs Atelier
                  </button>
                </div>
              </div>
            </div>

            {/* Contact & Salon Info Section */}
            <ContactSection
              settings={settings}
              onOpenBooking={() => handleOpenBooking('hairstyle')}
              onOpenChat={() => handleOpenChat()}
            />
          </div>
        )}

        {activeTab === 'hairstyles' && (
          <HairstyleCatalogue
            hairstyles={hairstyles}
            onSelectHairstyle={(style) => setSelectedHairstyle(style)}
            onBookHairstyle={(style) => handleOpenBooking('hairstyle', style)}
            onToggleCompare={handleToggleCompare}
            isItemInCompare={isItemInCompare}
            onAskQuestionAboutStyle={(style) => handleOpenChat('hairstyle', style)}
          />
        )}

        {activeTab === 'wigs' && (
          <WigCatalogue
            wigs={wigs}
            onSelectWig={(wig) => setSelectedWig(wig)}
            onBookWigInstall={(wig) => handleOpenBooking('wig_install', wig)}
            onToggleCompare={handleToggleCompare}
            isItemInCompare={isItemInCompare}
            onAskQuestionAboutWig={(wig) => handleOpenChat('wig', wig)}
          />
        )}

        {activeTab === 'contact' && (
          <ContactSection
            settings={settings}
            onOpenBooking={() => handleOpenBooking('hairstyle')}
            onOpenChat={() => handleOpenChat()}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            hairstyles={hairstyles}
            wigs={wigs}
            bookings={bookings}
            messages={messages}
            settings={settings}
            currentPath={currentPath}
            onNavigateRoute={navigateRoute}
            onSaveHairstyles={handleUpdateHairstyles}
            onSaveWigs={handleUpdateWigs}
            onSaveBookings={handleUpdateBookings}
            onSaveMessages={handleUpdateMessages}
            onSaveSettings={handleUpdateSettings}
            onResetDefaults={handleResetDefaults}
            onExitAdmin={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* FLOATING ACTION BAR FOR COMPARISON (When items are in comparison) */}
      {compareItems.length > 0 && activeTab !== 'admin' && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-stone-900/95 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            <Layers className="w-4 h-4" />
            <span>{compareItems.length} {compareItems.length === 1 ? 'item' : 'items'} in comparison</span>
          </div>

          <div className="h-4 w-px bg-stone-700" />

          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Compare Now
          </button>

          <button
            onClick={handleClearCompare}
            className="text-stone-400 hover:text-white text-xs cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* FLOATING QUICK CONTACT / WHATSAPP BUTTON */}
      {activeTab !== 'admin' && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
          <button
            onClick={() => handleOpenChat()}
            className="px-4 py-2.5 rounded-full bg-stone-900/90 backdrop-blur-md text-amber-200 border border-stone-700 shadow-xl hover:bg-stone-800 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Ask a Question</span>
          </button>

          <a
            href="https://wa.link/ufocc9"
            target="_blank"
            rel="noopener noreferrer"
            className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
          </a>
        </div>
      )}

      {/* Detail Modals */}
      <HairstyleDetailModal
        style={selectedHairstyle}
        onClose={() => setSelectedHairstyle(null)}
        settings={settings}
        onBook={(style) => handleOpenBooking('hairstyle', style)}
        onAskQuestion={(style) => handleOpenChat('hairstyle', style)}
        onToggleCompare={handleToggleCompare}
        isItemInCompare={isItemInCompare}
      />

      <WigDetailModal
        wig={selectedWig}
        onClose={() => setSelectedWig(null)}
        settings={settings}
        onBookInstall={(wig) => handleOpenBooking('wig_install', wig)}
        onAskQuestion={(wig) => handleOpenChat('wig', wig)}
        onToggleCompare={handleToggleCompare}
        isItemInCompare={isItemInCompare}
      />

      {/* Compare Side-by-Side Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compareItems={compareItems}
        onRemoveItem={handleRemoveCompareItem}
        onClearAll={handleClearCompare}
        onBookItem={(type, item) => handleOpenBooking(type, item)}
        settings={settings}
      />

      {/* Appointment Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        hairstyles={hairstyles}
        wigs={wigs}
        initialItem={bookingItem}
        onBookingSubmitted={handleBookingSubmitted}
        settings={settings}
      />

      {/* Ask a Question / Chat Desk Modal */}
      <ChatInquiryModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        settings={settings}
        subjectItem={chatSubject}
        onSendMessage={handleSendMessage}
      />

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        hairstyles={hairstyles}
        wigs={wigs}
        onSelectHairstyle={(style) => setSelectedHairstyle(style)}
        onSelectWig={(wig) => setSelectedWig(wig)}
      />

      {/* Website Footer */}
      {activeTab !== 'admin' && (
        <Footer
          settings={settings}
          onNavigate={setActiveTab}
          onOpenBooking={() => handleOpenBooking('hairstyle')}
          onOpenCompare={() => setIsCompareOpen(true)}
          compareCount={compareItems.length}
        />
      )}

    </div>
  );
}

export default App;
