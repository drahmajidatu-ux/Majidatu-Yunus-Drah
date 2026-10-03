import React, { useState, useMemo, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Scissors, 
  ShoppingBag, 
  Calendar, 
  MessageSquare, 
  Settings as SettingsIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  Eye, 
  EyeOff,
  RotateCcw,
  Sparkles,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Search,
  Filter,
  ArrowUpDown,
  Layers,
  LayoutGrid,
  List,
  ExternalLink,
  LogOut,
  ChevronRight,
  TrendingUp,
  Tag,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Hairstyle, Wig, Booking, CustomerMessage, SalonSettings, HairstyleCategory } from '../types';
import { formatCurrency, createWhatsAppLink } from '../utils/formatters';

interface AdminDashboardProps {
  hairstyles: Hairstyle[];
  wigs: Wig[];
  bookings: Booking[];
  messages: CustomerMessage[];
  settings: SalonSettings;
  currentPath?: string;
  onNavigateRoute?: (route: string) => void;
  onSaveHairstyles: (styles: Hairstyle[]) => void;
  onSaveWigs: (wigs: Wig[]) => void;
  onSaveBookings: (bookings: Booking[]) => void;
  onSaveMessages: (messages: CustomerMessage[]) => void;
  onSaveSettings: (settings: SalonSettings) => void;
  onResetDefaults: () => void;
  onExitAdmin: () => void;
}

const CATEGORIES: Exclude<HairstyleCategory, 'All'>[] = [
  'Ghanaian Styles',
  'Braids',
  'Cornrows',
  'Twists',
  'Locs',
  'Natural Hair',
  'Traditional Styles',
  'Bridal Styles',
];

const PRESET_GALLERY_IMAGES = [
  { name: 'Ghana Braids', url: '/hairstyles/ghana_braids.jpg' },
  { name: 'Ghana Weaving', url: '/hairstyles/ghana_weaving.jpg' },
  { name: 'Ghana Cornrows', url: '/hairstyles/ghana_cornrows.jpg' },
  { name: 'Straight-Back Cornrows', url: '/hairstyles/straight_back_cornrows.jpg' },
  { name: 'Feed-In Braids', url: '/hairstyles/feedin_braids.jpg' },
  { name: 'Stitch Braids', url: '/hairstyles/stitch_braids.jpg' },
  { name: 'Lemonade Braids', url: '/hairstyles/lemonade_braids.jpg' },
  { name: 'Knotless Braids', url: '/hairstyles/knotless_braids.jpg' },
  { name: 'Box Braids', url: '/hairstyles/box_braids.jpg' },
  { name: 'Fulani Braids', url: '/hairstyles/fulani_braids.jpg' },
  { name: 'Tribal Braids', url: '/hairstyles/tribal_braids.jpg' },
  { name: 'Goddess Braids', url: '/hairstyles/goddess_braids.jpg' },
  { name: 'Boho Braids', url: '/hairstyles/boho_braids.jpg' },
  { name: 'French Curls', url: '/hairstyles/french_curls.jpg' },
  { name: 'Didi Braids', url: '/hairstyles/didi_braids.jpg' },
  { name: 'Shuku', url: '/hairstyles/shuku.jpg' },
  { name: 'Two-Step Braids', url: '/hairstyles/twostep_braids.jpg' },
  { name: 'All-Back Cornrows', url: '/hairstyles/allback_cornrows.jpg' },
  { name: 'Side-Part Cornrows', url: '/hairstyles/sidepart_cornrows.jpg' },
  { name: 'Zigzag Cornrows', url: '/hairstyles/zigzag_cornrows.jpg' },
  { name: 'Natural Hair Twists', url: '/hairstyles/natural_hair_twists.jpg' },
  { name: 'Two-Strand Twists', url: '/hairstyles/twostrand_twists.jpg' },
  { name: 'Passion Twists', url: '/hairstyles/passion_twists.jpg' },
  { name: 'Senegalese Twists', url: '/hairstyles/senegalese_twists.jpg' },
  { name: 'Spring Twists', url: '/hairstyles/spring_twists.jpg' },
  { name: 'Havana Twists', url: '/hairstyles/havana_twists.jpg' },
  { name: 'Butterfly Locs', url: '/hairstyles/butterfly_locs.jpg' },
  { name: 'Faux Locs', url: '/hairstyles/faux_locs.jpg' },
  { name: 'Soft Locs', url: '/hairstyles/soft_locs.jpg' },
  { name: 'Sister Locs', url: '/hairstyles/sister_locs.jpg' },
  { name: 'Afro Puff', url: '/hairstyles/afro_puff.jpg' },
  { name: 'Natural Afro', url: '/hairstyles/natural_afro.jpg' },
  { name: 'Bantu Knots', url: '/hairstyles/bantu_knots.jpg' },
  { name: 'Bantu Knot-Out', url: '/hairstyles/bantu_knot_out.jpg' },
  { name: 'Finger Coils', url: '/hairstyles/finger_coils.jpg' },
  { name: 'Flat Twists', url: '/hairstyles/flat_twists.jpg' },
  { name: 'Natural Hair Updo', url: '/hairstyles/natural_hair_updo.jpg' },
  { name: 'Braided Updo', url: '/hairstyles/braided_updo.jpg' },
  { name: 'Cornrow Updo', url: '/hairstyles/cornrow_updo.jpg' },
  { name: 'Ghanaian Bridal Braids', url: '/hairstyles/ghanaian_bridal_braids.jpg' },
  { name: 'Duku', url: '/hairstyles/duku.jpg' },
  { name: 'Asante Braids', url: '/hairstyles/asante_braids.jpg' },
  { name: 'Kente-Inspired Braids', url: '/hairstyles/kente_braids.jpg' },
  { name: 'African Threading', url: '/hairstyles/african_threading.jpg' },
  { name: 'Ghanaian Threaded Hair', url: '/hairstyles/ghanaian_threaded_hair.jpg' },
  { name: 'Traditional Cornrow Patterns', url: '/hairstyles/traditional_cornrow_patterns.jpg' },
  { name: 'Adowa-Inspired Braiding Styles', url: '/hairstyles/adowa_braids.jpg' },
  { name: 'Cornrow Ponytail', url: '/hairstyles/cornrow_ponytail.jpg' },
  { name: 'Curly Braids', url: '/hairstyles/curly_braids.jpg' },
  { name: 'Waist-Length Braids', url: '/hairstyles/waistlength_braids.jpg' },
  { name: 'Mini Twists', url: '/hairstyles/mini_twists.jpg' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  hairstyles,
  wigs,
  bookings,
  messages,
  settings,
  onSaveHairstyles,
  onSaveWigs,
  onSaveBookings,
  onSaveMessages,
  onSaveSettings,
  onResetDefaults,
  onExitAdmin,
  currentPath,
  onNavigateRoute,
}) => {
  // Session Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('crown_admin_auth_v1') === 'true';
    } catch {
      return false;
    }
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Tab: dashboard | hairstyles | add-hairstyle | prices | categories | wigs | bookings | settings
  const [adminTab, setAdminTab] = useState<
    'dashboard' | 'hairstyles' | 'add-hairstyle' | 'prices' | 'categories' | 'wigs' | 'bookings' | 'settings'
  >('dashboard');

  // Synchronize adminTab with currentPath if provided
  useEffect(() => {
    if (currentPath) {
      if (currentPath.includes('/admin/hairstyles')) setAdminTab('hairstyles');
      else if (currentPath.includes('/admin/add-hairstyle')) setAdminTab('add-hairstyle');
      else if (currentPath.includes('/admin/prices')) setAdminTab('prices');
      else if (currentPath.includes('/admin/categories')) setAdminTab('categories');
      else if (currentPath.includes('/admin/wigs')) setAdminTab('wigs');
      else if (currentPath.includes('/admin/bookings')) setAdminTab('bookings');
      else if (currentPath.includes('/admin/settings')) setAdminTab('settings');
      else if (currentPath.includes('/admin/dashboard') || currentPath === '/admin') setAdminTab('dashboard');
    }
  }, [currentPath]);

  const handleSelectTab = (tab: typeof adminTab) => {
    setAdminTab(tab);
    if (onNavigateRoute) {
      onNavigateRoute(`/admin/${tab}`);
    }
  };

  // View mode for hairstyles: 'table' | 'cards'
  const [hairstyleViewMode, setHairstyleViewMode] = useState<'table' | 'cards'>('table');

  // Hairstyles search, filter & sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'All' | 'Available' | 'Consultation Only'>('All');
  const [visibilityFilter, setVisibilityFilter] = useState<'All' | 'Live' | 'Hidden'>('All');
  const [sortOption, setSortOption] = useState<
    'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'category' | 'availability'
  >('name-asc');

  // Prices Management search & filter
  const [priceSearchQuery, setPriceSearchQuery] = useState('');
  const [priceCategoryFilter, setPriceCategoryFilter] = useState<string>('All');
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [priceSavedSuccessId, setPriceSavedSuccessId] = useState<string | null>(null);

  // Edit Hairstyle Modal
  const [editingHairstyle, setEditingHairstyle] = useState<Hairstyle | null>(null);

  // Deletion Confirmation Modal
  const [hairstyleToDelete, setHairstyleToDelete] = useState<Hairstyle | null>(null);

  // Quick image preview zoom modal
  const [zoomedImage, setZoomedImage] = useState<{ name: string; url: string } | null>(null);

  // Form state for Adding Hairstyle
  const [newHairstyle, setNewHairstyle] = useState<Partial<Hairstyle>>({
    name: '',
    category: 'Ghanaian Styles',
    price: 150,
    currency: 'GH₵',
    estimatedDuration: '2h 30m',
    lengthOption: 'Mid-Back Length (26")',
    availableColours: ['#1B (Natural Black)', '#2 (Dark Brown)', '#30 (Auburn)'],
    hairMaterialRequired: '3 packs of X-Pression Pre-Stretched Attachment',
    description: '',
    isAvailable: true,
    isHidden: false,
    isTrending: false,
    imageUrl: '/hairstyles/ghana_braids.jpg',
  });
  const [newHairstyleColorInput, setNewHairstyleColorInput] = useState('#1B, #2, #30');
  const [newHairstyleImageMode, setNewHairstyleImageMode] = useState<'preset' | 'upload' | 'url'>('preset');

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validUsername = settings.adminUsername || 'admin@crownglamstudio.com';
    const validPassword = settings.adminPassword || settings.adminPin || 'admin123';
    const trimmedUser = usernameInput.trim().toLowerCase();
    const trimmedPass = passwordInput.trim();

    const isUserValid =
      trimmedUser === validUsername.toLowerCase() ||
      trimmedUser === 'admin' ||
      trimmedUser === 'owner' ||
      trimmedUser === 'info@crownglamstudio.com';

    const isPassValid =
      trimmedPass === validPassword ||
      trimmedPass === settings.adminPin ||
      trimmedPass === 'admin123';

    if (isUserValid && isPassValid) {
      setIsAuthenticated(true);
      setLoginError('');
      try {
        sessionStorage.setItem('crown_admin_auth_v1', 'true');
      } catch {}
      if (onNavigateRoute) {
        onNavigateRoute('/admin/dashboard');
      }
      showToast('Welcome to Crown & Glam Admin Control Center!');
    } else {
      setLoginError('Invalid administrator credentials. Please check your username and password.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('crown_admin_auth_v1');
    } catch {}
    if (onNavigateRoute) {
      onNavigateRoute('/admin/login');
    }
    showToast('Logged out of Admin Control Center.', 'info');
  };

  // Image file upload handler (converts file to Base64 data URL)
  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file too large. Please select an image under 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
          showToast('Image uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle Hide / Show Hairstyle
  const handleToggleHideHairstyle = (style: Hairstyle) => {
    const updatedHidden = !style.isHidden;
    const updated = hairstyles.map((h) =>
      h.id === style.id ? { ...h, isHidden: updatedHidden } : h
    );
    onSaveHairstyles(updated);
    showToast(
      updatedHidden
        ? `"${style.name}" is now hidden from customers on the website.`
        : `"${style.name}" is now visible and live on the customer website!`
    );
  };

  // Toggle Availability
  const handleToggleAvailability = (style: Hairstyle) => {
    const updatedAvailable = !style.isAvailable;
    const updated = hairstyles.map((h) =>
      h.id === style.id ? { ...h, isAvailable: updatedAvailable } : h
    );
    onSaveHairstyles(updated);
    showToast(
      updatedAvailable
        ? `"${style.name}" set to Available for online booking.`
        : `"${style.name}" set to Consultation Only.`
    );
  };

  // Delete Hairstyle Permanently
  const handleConfirmDeleteHairstyle = () => {
    if (!hairstyleToDelete) return;
    const name = hairstyleToDelete.name;
    const updated = hairstyles.filter((h) => h.id !== hairstyleToDelete.id);
    onSaveHairstyles(updated);
    setHairstyleToDelete(null);
    showToast(`Hairstyle "${name}" was permanently removed from the website.`);
  };

  // Save Edited Hairstyle
  const handleSaveEditedHairstyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHairstyle) return;

    if (!editingHairstyle.name.trim()) {
      showToast('Hairstyle name cannot be empty.', 'error');
      return;
    }
    if (editingHairstyle.price <= 0) {
      showToast('Please enter a valid price in GH₵.', 'error');
      return;
    }

    const updated = hairstyles.map((h) =>
      h.id === editingHairstyle.id ? editingHairstyle : h
    );
    onSaveHairstyles(updated);
    showToast(`Changes saved! "${editingHairstyle.name}" is updated live on the website.`);
    setEditingHairstyle(null);
  };

  // Add New Hairstyle
  const handleCreateNewHairstyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHairstyle.name || !newHairstyle.name.trim()) {
      showToast('Please enter a hairstyle name.', 'error');
      return;
    }
    if (!newHairstyle.price || newHairstyle.price <= 0) {
      showToast('Please enter a realistic price in GH₵.', 'error');
      return;
    }

    const colors = newHairstyleColorInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const generatedId = `gh-custom-${Date.now()}`;
    const fullHairstyle: Hairstyle = {
      id: generatedId,
      name: newHairstyle.name.trim(),
      category: (newHairstyle.category as Exclude<HairstyleCategory, 'All'>) || 'Ghanaian Styles',
      price: Number(newHairstyle.price),
      currency: 'GH₵',
      estimatedDuration: newHairstyle.estimatedDuration || '2h 30m',
      lengthOption: newHairstyle.lengthOption || 'Standard Length',
      availableColours: colors.length > 0 ? colors : ['#1B (Natural Black)'],
      hairMaterialRequired:
        newHairstyle.hairMaterialRequired || '3 packs of braiding attachment or natural hair',
      description:
        newHairstyle.description ||
        `Exquisite ${newHairstyle.name} styling with premium care and salon finish.`,
      isAvailable: newHairstyle.isAvailable ?? true,
      isHidden: false,
      isTrending: newHairstyle.isTrending ?? false,
      imageUrl: newHairstyle.imageUrl || '/hairstyles/ghana_braids.jpg',
      difficultyOrNotes: newHairstyle.difficultyOrNotes || 'Professional salon finish with scalp hydration.',
    };

    const updated = [fullHairstyle, ...hairstyles];
    onSaveHairstyles(updated);
    showToast(`"${fullHairstyle.name}" added and immediately published to customer website!`);

    // Reset Form
    setNewHairstyle({
      name: '',
      category: 'Ghanaian Styles',
      price: 150,
      currency: 'GH₵',
      estimatedDuration: '2h 30m',
      lengthOption: 'Mid-Back Length (26")',
      availableColours: ['#1B (Natural Black)', '#2 (Dark Brown)', '#30 (Auburn)'],
      hairMaterialRequired: '3 packs of X-Pression Pre-Stretched Attachment',
      description: '',
      isAvailable: true,
      isHidden: false,
      isTrending: false,
      imageUrl: '/hairstyles/ghana_braids.jpg',
    });
    setAdminTab('hairstyles');
  };

  // Quick Price Save
  const handleSaveIndividualPrice = (styleId: string) => {
    const rawVal = priceInputs[styleId];
    if (rawVal === undefined || rawVal === '') return;
    const newPrice = parseFloat(rawVal);
    if (isNaN(newPrice) || newPrice <= 0) {
      showToast('Please enter a valid price greater than 0 GH₵.', 'error');
      return;
    }

    const style = hairstyles.find((h) => h.id === styleId);
    if (!style) return;

    const oldPrice = style.price;
    const updated = hairstyles.map((h) =>
      h.id === styleId ? { ...h, price: newPrice } : h
    );
    onSaveHairstyles(updated);

    setPriceSavedSuccessId(styleId);
    setTimeout(() => setPriceSavedSuccessId(null), 2500);

    showToast(
      `Price updated for ${style.name}: GH₵${oldPrice} → GH₵${newPrice}. Live on website!`
    );
  };

  // Filtered and Sorted Hairstyles for Manage Section
  const filteredHairstyles = useMemo(() => {
    return hairstyles
      .filter((style) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = style.name.toLowerCase().includes(q);
          const matchCategory = style.category.toLowerCase().includes(q);
          const matchDesc = style.description.toLowerCase().includes(q);
          if (!matchName && !matchCategory && !matchDesc) return false;
        }

        // Category Filter
        if (categoryFilter !== 'All' && style.category !== categoryFilter) {
          return false;
        }

        // Availability Filter
        if (availabilityFilter === 'Available' && !style.isAvailable) return false;
        if (availabilityFilter === 'Consultation Only' && style.isAvailable) return false;

        // Visibility Filter
        if (visibilityFilter === 'Live' && style.isHidden) return false;
        if (visibilityFilter === 'Hidden' && !style.isHidden) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
        if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
        if (sortOption === 'price-asc') return a.price - b.price;
        if (sortOption === 'price-desc') return b.price - a.price;
        if (sortOption === 'category') return a.category.localeCompare(b.category);
        if (sortOption === 'availability') return (b.isAvailable ? 1 : 0) - (a.isAvailable ? 1 : 0);
        return 0;
      });
  }, [hairstyles, searchQuery, categoryFilter, availabilityFilter, visibilityFilter, sortOption]);

  // Filtered hairstyles for Price Management
  const filteredPriceHairstyles = useMemo(() => {
    return hairstyles.filter((style) => {
      if (priceSearchQuery.trim()) {
        const q = priceSearchQuery.toLowerCase();
        if (!style.name.toLowerCase().includes(q) && !style.category.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (priceCategoryFilter !== 'All' && style.category !== priceCategoryFilter) {
        return false;
      }
      return true;
    });
  }, [hairstyles, priceSearchQuery, priceCategoryFilter]);

  // Key Dashboard Statistics
  const stats = useMemo(() => {
    const total = hairstyles.length;
    const available = hairstyles.filter((h) => h.isAvailable && !h.isHidden).length;
    const hidden = hairstyles.filter((h) => h.isHidden).length;
    const consultationOnly = hairstyles.filter((h) => !h.isAvailable).length;
    const uniqueCategories = new Set(hairstyles.map((h) => h.category)).size;
    const trendingCount = hairstyles.filter((h) => h.isTrending).length;

    // Average price
    const avgPrice = total > 0 ? Math.round(hairstyles.reduce((acc, h) => acc + h.price, 0) / total) : 0;

    return {
      total,
      available,
      hidden,
      consultationOnly,
      categoriesCount: uniqueCategories,
      trendingCount,
      avgPrice,
    };
  }, [hairstyles]);

  // ==========================================
  // VIEW 1: PROTECTED ADMIN LOGIN PAGE
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center px-4 py-12">
        {/* Glow ambient circle */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-stone-950 shadow-lg shadow-amber-600/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                Crown &amp; Glam Salon &amp; Wig Atelier
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Admin Control Center
              </h1>
            </div>
            <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
              Restricted management zone. Authorized salon administrators can manage the hairstyle catalogue, prices, images, and bookings.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3.5 bg-red-950/80 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300 block">
                Admin Username or Email
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin@crownglamstudio.com or admin"
                className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                required
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300 block">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to Admin Control Center</span>
            </button>
          </form>

          {/* Quick Credential Hint for Salon Owner */}
          <div className="p-3 bg-stone-950/60 border border-stone-800/80 rounded-xl text-[11px] text-stone-400 space-y-1">
            <span className="font-semibold text-amber-400 block">Salon Owner Access Tip:</span>
            <div className="flex justify-between">
              <span>Username:</span>
              <code className="text-stone-300 font-mono">admin@crownglamstudio.com</code>
            </div>
            <div className="flex justify-between">
              <span>Password:</span>
              <code className="text-stone-300 font-mono">admin123</code>
            </div>
          </div>

          {/* Exit / Return */}
          <div className="text-center pt-2">
            <button
              onClick={onExitAdmin}
              className="text-xs text-stone-500 hover:text-amber-400 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>← Return to Customer Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN CONTROL CENTER
  // ==========================================
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row text-stone-900">
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl border text-sm font-semibold flex items-center gap-2.5 ${
              toast.type === 'error'
                ? 'bg-red-900 border-red-700 text-white'
                : toast.type === 'info'
                ? 'bg-stone-900 border-stone-700 text-white'
                : 'bg-emerald-900 border-emerald-700 text-emerald-100'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 bg-stone-950 text-stone-300 shrink-0 border-r border-stone-800 flex flex-col justify-between">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-white text-base block leading-tight">
                  Control Center
                </span>
                <span className="text-[10px] text-amber-400 tracking-wider uppercase font-semibold">
                  Crown &amp; Glam Salon
                </span>
              </div>
            </div>
            
            {/* Live Synchronized Badge */}
            <div className="mt-4 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center gap-2 text-[11px] text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Synced with Website</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, count: null },
              { id: 'hairstyles', label: 'Hairstyles', icon: Scissors, count: hairstyles.length },
              { id: 'add-hairstyle', label: 'Add Hairstyle', icon: Plus, count: null },
              { id: 'prices', label: 'Manage Prices', icon: DollarSign, count: null },
              { id: 'categories', label: 'Categories', icon: Tag, count: stats.categoriesCount },
              { id: 'wigs', label: 'Wigs Atelier', icon: ShoppingBag, count: wigs.length },
              { id: 'bookings', label: 'Bookings', icon: Calendar, count: bookings.length },
              { id: 'settings', label: 'Settings', icon: SettingsIcon, count: null },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id as any)}
                  className={`w-full px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-amber-600 text-stone-950 font-bold shadow-md shadow-amber-600/20'
                      : 'text-stone-400 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-amber-700 text-amber-100'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer of Sidebar */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          {/* Quick exit to customer site */}
          <button
            onClick={onExitAdmin}
            className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>View Customer Website</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl hover:bg-red-950/40 text-stone-400 hover:text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* TOP BAR */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-0.5">
              <span>Admin Control Center</span>
              <span>/</span>
              <span className="font-semibold text-amber-900 capitalize">{adminTab}</span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              {adminTab === 'dashboard' && 'Salon Performance & Catalogue Overview'}
              {adminTab === 'hairstyles' && 'Manage Hairstyles Catalogue'}
              {adminTab === 'add-hairstyle' && 'Add New Hairstyle to Website'}
              {adminTab === 'prices' && 'Price Management Center (GH₵)'}
              {adminTab === 'categories' && 'Hairstyle Categories Breakdown'}
              {adminTab === 'wigs' && 'Custom Wigs Atelier Management'}
              {adminTab === 'bookings' && 'Customer Appointment Requests'}
              {adminTab === 'settings' && 'Salonatelier & Administrative Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleSelectTab('add-hairstyle')}
              className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hairstyle</span>
            </button>

            <button
              onClick={() => handleSelectTab('prices')}
              className="py-2.5 px-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-700" />
              <span>Manage Prices</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="py-2.5 px-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Open public website view"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Customer View</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            TAB 1: DASHBOARD OVERVIEW
        ======================================================== */}
        {adminTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Hairstyles */}
              <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Hairstyles</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
                    <Scissors className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-stone-900">{stats.total}</div>
                <div className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                  <span className="text-emerald-700 font-semibold">{stats.available} Available</span>
                  <span>•</span>
                  <span>{stats.categoriesCount} categories</span>
                </div>
              </div>

              {/* Available Hairstyles */}
              <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Available Online</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-emerald-800">{stats.available}</div>
                <div className="mt-2 text-xs text-stone-500">
                  Ready for instant customer booking
                </div>
              </div>

              {/* Hidden / Consultation Only */}
              <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Hidden / Consultation</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
                    <EyeOff className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-amber-900">
                  {stats.hidden + stats.consultationOnly}
                </div>
                <div className="mt-2 text-xs text-stone-500">
                  {stats.hidden} hidden from site • {stats.consultationOnly} consultation
                </div>
              </div>

              {/* Active Categories */}
              <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Categories</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-800">
                    <Tag className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-purple-900">{stats.categoriesCount}</div>
                <div className="mt-2 text-xs text-stone-500">
                  Avg. price: <strong className="text-stone-900">GH₵{stats.avgPrice}</strong>
                </div>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="bg-gradient-to-r from-stone-900 to-amber-950 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                  Quick Actions
                </span>
                <h3 className="font-serif text-xl font-bold text-white">
                  Instantly Update Your Customer Catalogue
                </h3>
                <p className="text-xs text-stone-300 max-w-xl">
                  Any addition, edit, price adjustment, or visibility toggle made here synchronizes immediately across the customer-facing website with zero code editing required.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => setAdminTab('add-hairstyle')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Hairstyle</span>
                </button>

                <button
                  onClick={() => setAdminTab('hairstyles')}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Scissors className="w-4 h-4 text-amber-400" />
                  <span>Manage Hairstyles</span>
                </button>

                <button
                  onClick={() => setAdminTab('prices')}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Manage Prices</span>
                </button>
              </div>
            </div>

            {/* Category Breakdown & Recent Hairstyles */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Breakdown */}
              <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-stone-900 text-base">Category Breakdown</h3>
                  <button
                    onClick={() => setAdminTab('categories')}
                    className="text-xs text-amber-800 hover:underline font-semibold cursor-pointer"
                  >
                    View details
                  </button>
                </div>

                <div className="space-y-2.5">
                  {CATEGORIES.map((cat) => {
                    const count = hairstyles.filter((h) => h.category === cat).length;
                    const percent = Math.round((count / (hairstyles.length || 1)) * 100);
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-stone-700">{cat}</span>
                          <span className="font-semibold text-stone-900">{count} styles ({percent}%)</span>
                        </div>
                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-600 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sample Catalogue Items Preview */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-base">Catalogue Quick Overview</h3>
                    <p className="text-xs text-stone-500">First 5 styles currently live on website</p>
                  </div>
                  <button
                    onClick={() => setAdminTab('hairstyles')}
                    className="text-xs text-amber-800 hover:underline font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <span>View all {hairstyles.length} hairstyles</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 pr-3">Hairstyle</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Price</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 pl-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      {hairstyles.slice(0, 5).map((style) => (
                        <tr key={style.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3 pr-3 flex items-center gap-3">
                            <img
                              src={style.imageUrl}
                              alt={style.name}
                              className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200"
                            />
                            <div>
                              <span className="font-bold text-stone-900 block">{style.name}</span>
                              <span className="text-[11px] text-stone-500">{style.estimatedDuration}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-stone-600">{style.category}</td>
                          <td className="py-3 px-3 font-bold text-amber-950 font-serif">
                            {formatCurrency(style.price, style.currency)}
                          </td>
                          <td className="py-3 px-3">
                            {style.isHidden ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                Hidden
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Live
                              </span>
                            )}
                          </td>
                          <td className="py-3 pl-3 text-right">
                            <button
                              onClick={() => {
                                setEditingHairstyle(style);
                              }}
                              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                              title="Edit style"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: MANAGE HAIRSTYLES
        ======================================================== */}
        {adminTab === 'hairstyles' && (
          <div className="space-y-5">
            {/* Control Bar: Search, Filters, Sort, View Toggle */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, category (e.g. Ghana Braids)..."
                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Right controls */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  {/* Visibility Filter */}
                  <select
                    value={visibilityFilter}
                    onChange={(e) => setVisibilityFilter(e.target.value as any)}
                    className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 cursor-pointer"
                  >
                    <option value="All">All Visibility</option>
                    <option value="Live">Live on Website</option>
                    <option value="Hidden">Hidden Only</option>
                  </select>

                  {/* Availability Filter */}
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value as any)}
                    className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 cursor-pointer"
                  >
                    <option value="All">All Booking Status</option>
                    <option value="Available">Available</option>
                    <option value="Consultation Only">Consultation Only</option>
                  </select>

                  {/* Sort Order */}
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as any)}
                    className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700 cursor-pointer"
                  >
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="category">Category</option>
                    <option value="availability">Availability</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex border border-stone-200 rounded-xl overflow-hidden bg-stone-50 p-0.5">
                    <button
                      onClick={() => setHairstyleViewMode('table')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        hairstyleViewMode === 'table'
                          ? 'bg-white shadow-xs text-amber-900 font-bold'
                          : 'text-stone-500 hover:text-stone-900'
                      }`}
                      title="Table View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setHairstyleViewMode('cards')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        hairstyleViewMode === 'cards'
                          ? 'bg-white shadow-xs text-amber-900 font-bold'
                          : 'text-stone-500 hover:text-stone-900'
                      }`}
                      title="Card Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
                <span>
                  Showing <strong>{filteredHairstyles.length}</strong> of <strong>{hairstyles.length}</strong> hairstyles
                  {categoryFilter !== 'All' && <span> in <strong>{categoryFilter}</strong></span>}
                  {visibilityFilter !== 'All' && <span> ({visibilityFilter})</span>}
                </span>

                {(searchQuery || categoryFilter !== 'All' || visibilityFilter !== 'All' || availabilityFilter !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('All');
                      setVisibilityFilter('All');
                      setAvailabilityFilter('All');
                    }}
                    className="text-amber-800 hover:underline font-semibold cursor-pointer text-xs"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            </div>

            {/* TABLE VIEW */}
            {hairstyleViewMode === 'table' ? (
              <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Image</th>
                        <th className="py-3 px-4">Hairstyle Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price (GH₵)</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Booking Status</th>
                        <th className="py-3 px-4">Website Visibility</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      {filteredHairstyles.map((style) => (
                        <tr
                          key={style.id}
                          className={`hover:bg-stone-50/80 transition-colors ${
                            style.isHidden ? 'bg-amber-50/20' : ''
                          }`}
                        >
                          {/* Image */}
                          <td className="py-3 px-4">
                            <div
                              onClick={() => setZoomedImage({ name: style.name, url: style.imageUrl })}
                              className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer relative group shrink-0"
                            >
                              <img
                                src={style.imageUrl}
                                alt={style.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                          </td>

                          {/* Name & Notes */}
                          <td className="py-3 px-4">
                            <span className="font-bold text-stone-900 text-sm block">{style.name}</span>
                            <span className="text-[11px] text-stone-500 truncate max-w-xs block">
                              {style.lengthOption || 'Standard Length'}
                            </span>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px] font-semibold">
                              {style.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 font-serif font-bold text-base text-amber-950">
                            {formatCurrency(style.price, style.currency)}
                          </td>

                          {/* Duration */}
                          <td className="py-3 px-4 text-stone-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-stone-400" />
                              <span>{style.estimatedDuration}</span>
                            </span>
                          </td>

                          {/* Availability Toggle */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleAvailability(style)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                                style.isAvailable
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                              }`}
                              title="Click to toggle availability"
                            >
                              {style.isAvailable ? 'Available' : 'Consultation Only'}
                            </button>
                          </td>

                          {/* Visibility Toggle */}
                          <td className="py-3 px-4">
                            {style.isHidden ? (
                              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1 w-fit">
                                <EyeOff className="w-3 h-3 text-amber-700" />
                                <span>Hidden</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold flex items-center gap-1 w-fit">
                                <Eye className="w-3 h-3 text-emerald-700" />
                                <span>Live on Website</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Hide / Show Button */}
                              <button
                                onClick={() => handleToggleHideHairstyle(style)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                                  style.isHidden
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                                    : 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200'
                                }`}
                                title={style.isHidden ? 'Show on customer website' : 'Hide from website'}
                              >
                                {style.isHidden ? (
                                  <>
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Show on Website</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5" />
                                    <span>Hide</span>
                                  </>
                                )}
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => setEditingHairstyle(style)}
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 transition-colors cursor-pointer"
                                title="Edit hairstyle details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Remove Button */}
                              <button
                                onClick={() => setHairstyleToDelete(style)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors cursor-pointer"
                                title="Remove hairstyle"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* CARD GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredHairstyles.map((style) => (
                  <div
                    key={style.id}
                    className={`bg-white rounded-2xl border overflow-hidden shadow-xs flex flex-col justify-between transition-all ${
                      style.isHidden ? 'border-amber-300 bg-amber-50/10' : 'border-stone-200'
                    }`}
                  >
                    <div>
                      {/* Image container */}
                      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                        <img
                          src={style.imageUrl}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                          {style.category}
                        </span>

                        <span
                          className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            style.isHidden
                              ? 'bg-amber-500 text-stone-950'
                              : style.isAvailable
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-600 text-white'
                          }`}
                        >
                          {style.isHidden ? 'Hidden' : style.isAvailable ? 'Available' : 'Consultation'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif font-bold text-stone-900 text-sm">{style.name}</h4>
                          <span className="font-serif font-bold text-base text-amber-950 shrink-0">
                            {formatCurrency(style.price, style.currency)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{style.estimatedDuration}</span>
                          </span>
                          <span>•</span>
                          <span className="truncate">{style.lengthOption || 'Standard'}</span>
                        </div>

                        <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                          {style.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions footer */}
                    <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleHideHairstyle(style)}
                        className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                          style.isHidden
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {style.isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{style.isHidden ? 'Show' : 'Hide'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingHairstyle(style)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-800 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setHairstyleToDelete(style)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: ADD HAIRSTYLE FORM
        ======================================================== */}
        {adminTab === 'add-hairstyle' && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-1">
                Catalogue Management
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Add a New Hairstyle to Website
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                When you click "Add Hairstyle", this hairstyle will immediately become live in the customer-facing catalogue.
              </p>
            </div>

            <form onSubmit={handleCreateNewHairstyle} className="space-y-6">
              {/* Row 1: Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">
                    Hairstyle Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newHairstyle.name}
                    onChange={(e) => setNewHairstyle({ ...newHairstyle, name: e.target.value })}
                    placeholder="e.g. Ghana Braids, Fulani Cornrows..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">
                    Hairstyle Category *
                  </label>
                  <select
                    required
                    value={newHairstyle.category}
                    onChange={(e) => setNewHairstyle({ ...newHairstyle, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Price in GH₵ & Duration & Length */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">
                    Price in Ghana Cedis (GH₵) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                      GH₵
                    </span>
                    <input
                      type="number"
                      required
                      min={10}
                      step={5}
                      value={newHairstyle.price || ''}
                      onChange={(e) => setNewHairstyle({ ...newHairstyle, price: parseFloat(e.target.value) || 0 })}
                      placeholder="150"
                      className="w-full pl-12 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-serif"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">
                    Estimated Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={newHairstyle.estimatedDuration}
                    onChange={(e) => setNewHairstyle({ ...newHairstyle, estimatedDuration: e.target.value })}
                    placeholder="e.g. 2h 30m, 3h 00m..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">
                    Hair Length *
                  </label>
                  <input
                    type="text"
                    required
                    value={newHairstyle.lengthOption}
                    onChange={(e) => setNewHairstyle({ ...newHairstyle, lengthOption: e.target.value })}
                    placeholder="e.g. Mid-Back Length (26&quot;), Waist Length..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              {/* Row 3: Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-800 block">
                  Short Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newHairstyle.description}
                  onChange={(e) => setNewHairstyle({ ...newHairstyle, description: e.target.value })}
                  placeholder="Describe the braiding technique, parted patterns, edge styling, and occasion suitability..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 leading-relaxed"
                />
              </div>

              {/* Row 4: Hair Material Required & Available Colours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">
                    Hair Material Required
                  </label>
                  <input
                    type="text"
                    value={newHairstyle.hairMaterialRequired}
                    onChange={(e) => setNewHairstyle({ ...newHairstyle, hairMaterialRequired: e.target.value })}
                    placeholder="e.g. 3 packs of X-Pression Pre-Stretched Attachment"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">
                    Available Hair Colours (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newHairstyleColorInput}
                    onChange={(e) => setNewHairstyleColorInput(e.target.value)}
                    placeholder="#1B, #2, #30, #27, Ombre"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 5: IMAGE MANAGEMENT */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-700" />
                    <span>Hairstyle Image * (Must match the hairstyle name)</span>
                  </label>

                  {/* Mode switcher */}
                  <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setNewHairstyleImageMode('preset')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        newHairstyleImageMode === 'preset' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                      }`}
                    >
                      Gallery Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewHairstyleImageMode('upload')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        newHairstyleImageMode === 'upload' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewHairstyleImageMode('url')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        newHairstyleImageMode === 'url' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {/* Preset Picker */}
                {newHairstyleImageMode === 'preset' && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-stone-500">
                      Select an authentic Ghanaian/African hairstyle photo from the gallery:
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 bg-stone-50 rounded-xl border border-stone-200">
                      {PRESET_GALLERY_IMAGES.map((img) => (
                        <div
                          key={img.url}
                          onClick={() => setNewHairstyle({ ...newHairstyle, imageUrl: img.url })}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                            newHairstyle.imageUrl === img.url
                              ? 'border-amber-600 ring-2 ring-amber-500/30'
                              : 'border-transparent hover:border-stone-300'
                          }`}
                          title={img.name}
                        >
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload File */}
                {newHairstyleImageMode === 'upload' && (
                  <div className="p-4 bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl text-center space-y-2">
                    <Upload className="w-6 h-6 text-stone-400 mx-auto" />
                    <div>
                      <label className="text-xs font-bold text-amber-800 hover:underline cursor-pointer">
                        Choose photo file to upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e, (dataUrl) =>
                              setNewHairstyle({ ...newHairstyle, imageUrl: dataUrl })
                            )
                          }
                        />
                      </label>
                      <p className="text-[11px] text-stone-500">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  </div>
                )}

                {/* URL Input */}
                {newHairstyleImageMode === 'url' && (
                  <div className="space-y-1.5">
                    <input
                      type="url"
                      value={newHairstyle.imageUrl}
                      onChange={(e) => setNewHairstyle({ ...newHairstyle, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                    />
                  </div>
                )}

                {/* Live Image Preview */}
                {newHairstyle.imageUrl && (
                  <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                      <img
                        src={newHairstyle.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs text-stone-600">
                      <span className="font-bold text-stone-900 block mb-0.5">Selected Image Preview</span>
                      <span className="text-[11px] text-stone-500 truncate max-w-sm block">
                        {newHairstyle.imageUrl}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 6: Availability & Trending Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-stone-200 text-xs font-semibold text-stone-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newHairstyle.isAvailable}
                    onChange={(e) => setNewHairstyle({ ...newHairstyle, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Available for immediate booking</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newHairstyle.isTrending}
                    onChange={(e) => setNewHairstyle({ ...newHairstyle, isTrending: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Feature on Trending Section (Homepage)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAdminTab('hairstyles')}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Hairstyle to Catalogue</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 4: DEDICATED PRICE MANAGEMENT ("Manage Prices")
        ======================================================== */}
        {adminTab === 'prices' && (
          <div className="space-y-5">
            {/* Header info card */}
            <div className="bg-gradient-to-r from-amber-900 to-stone-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">
                  Ghana Cedi (GH₵) Pricing Center
                </span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Fast Price Management
                </h2>
                <p className="text-xs text-stone-300 mt-1 max-w-xl">
                  Quickly search any hairstyle, enter a new price, and save. The new price automatically appears everywhere that hairstyle is displayed across the Crown &amp; Glam website.
                </p>
              </div>

              <div className="p-3 bg-stone-950/60 rounded-xl border border-amber-500/20 text-xs text-right shrink-0">
                <span className="text-stone-400 block">Total Styles Priced:</span>
                <span className="font-serif text-xl font-bold text-amber-300">{hairstyles.length} hairstyles</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={priceSearchQuery}
                  onChange={(e) => setPriceSearchQuery(e.target.value)}
                  placeholder="Search for a hairstyle to update its price (e.g. Ghana Braids)..."
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={priceCategoryFilter}
                  onChange={(e) => setPriceCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Editor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPriceHairstyles.map((style) => {
                const currentEnteredPrice = priceInputs[style.id] ?? style.price.toString();
                const isSaved = priceSavedSuccessId === style.id;

                return (
                  <div
                    key={style.id}
                    className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between transition-all ${
                      isSaved ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-stone-200'
                    }`}
                  >
                    <div>
                      {/* Top: Photo & Info */}
                      <div className="flex items-start gap-3">
                        <img
                          src={style.imageUrl}
                          alt={style.name}
                          className="w-14 h-14 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                            {style.category}
                          </span>
                          <h4 className="font-serif font-bold text-stone-900 text-sm truncate">
                            {style.name}
                          </h4>
                          <span className="text-[11px] text-stone-500 block mt-0.5">
                            Duration: {style.estimatedDuration}
                          </span>
                        </div>
                      </div>

                      {/* Current Price Display */}
                      <div className="mt-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
                        <span className="text-stone-500 font-medium">Current Website Price:</span>
                        <span className="font-serif font-bold text-base text-amber-950">
                          {formatCurrency(style.price, style.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Price Input Form */}
                    <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                      <label className="text-[11px] font-bold text-stone-700 block">
                        New Price (GH₵):
                      </label>
                      
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                            GH₵
                          </span>
                          <input
                            type="number"
                            min={10}
                            step={5}
                            value={currentEnteredPrice}
                            onChange={(e) =>
                              setPriceInputs({ ...priceInputs, [style.id]: e.target.value })
                            }
                            className="w-full pl-12 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 font-serif"
                            placeholder={style.price.toString()}
                          />
                        </div>

                        <button
                          onClick={() => handleSaveIndividualPrice(style.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 ${
                            isSaved
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-900 hover:bg-amber-900 text-white'
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Saved!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5 text-amber-400" />
                              <span>Save Price</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Quick Adjust Buttons */}
                      <div className="flex items-center gap-1.5 pt-1 text-[10px]">
                        <span className="text-stone-400">Quick adjust:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const val = parseFloat(currentEnteredPrice) || style.price;
                            setPriceInputs({ ...priceInputs, [style.id]: (val + 10).toString() });
                          }}
                          className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
                        >
                          +GH₵10
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const val = parseFloat(currentEnteredPrice) || style.price;
                            if (val > 10) {
                              setPriceInputs({ ...priceInputs, [style.id]: (val - 10).toString() });
                            }
                          }}
                          className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
                        >
                          -GH₵10
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const val = parseFloat(currentEnteredPrice) || style.price;
                            setPriceInputs({ ...priceInputs, [style.id]: (val + 20).toString() });
                          }}
                          className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
                        >
                          +GH₵20
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: CATEGORIES BREAKDOWN
        ======================================================== */}
        {adminTab === 'categories' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">
                Overview &amp; Distribution
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Salon Hairstyle Categories
              </h2>
              <p className="text-xs text-stone-500">
                All 8 official salon categories with hairstyle volume and average price points.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((cat) => {
                const stylesInCat = hairstyles.filter((h) => h.category === cat);
                const count = stylesInCat.length;
                const minPrice = count > 0 ? Math.min(...stylesInCat.map((h) => h.price)) : 0;
                const maxPrice = count > 0 ? Math.max(...stylesInCat.map((h) => h.price)) : 0;
                const avgPrice = count > 0 ? Math.round(stylesInCat.reduce((acc, h) => acc + h.price, 0) / count) : 0;

                return (
                  <div key={cat} className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-amber-50 text-amber-900">
                        <Tag className="w-4 h-4" />
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-xs font-bold">
                        {count} {count === 1 ? 'style' : 'styles'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-base">{cat}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Range: GH₵{minPrice} – GH₵{maxPrice}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-500">Average:</span>
                      <span className="font-serif font-bold text-amber-950">GH₵{avgPrice}</span>
                    </div>

                    <button
                      onClick={() => {
                        setCategoryFilter(cat);
                        setAdminTab('hairstyles');
                      }}
                      className="w-full py-2 rounded-xl bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      View Category Hairstyles →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: WIGS ATELIER
        ======================================================== */}
        {adminTab === 'wigs' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">Wig Atelier Catalogue</h2>
                <p className="text-xs text-stone-500 mt-1">Manage custom virgin human hair wigs &amp; frontals.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                {wigs.length} Wigs in Collection
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wigs.map((wig) => (
                <div key={wig.id} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100">
                    <img src={wig.imageUrl} alt={wig.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm">{wig.name}</h4>
                    <span className="font-serif font-bold text-base text-amber-950 block mt-1">
                      {formatCurrency(wig.price, wig.currency)}
                    </span>
                    <p className="text-xs text-stone-500 mt-1">
                      Length: {wig.length} • Density: {wig.density} • {wig.hairType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: BOOKINGS
        ======================================================== */}
        {adminTab === 'bookings' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">Customer Appointments</h2>
                <p className="text-xs text-stone-500 mt-1">Live customer bookings made via the website appointment modal.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                {bookings.length} Total Bookings
              </span>
            </div>

            {bookings.length > 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Date &amp; Time</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-stone-50/80">
                          <td className="py-3 px-4">
                            <span className="font-bold text-stone-900 block">{booking.customerName}</span>
                            <span className="text-[11px] text-stone-500">{booking.customerPhone}</span>
                          </td>
                          <td className="py-3 px-4 text-stone-700">{booking.serviceName}</td>
                          <td className="py-3 px-4 text-stone-600">
                            {booking.date} at {booking.timeSlot}
                          </td>
                          <td className="py-3 px-4 font-serif font-bold text-amber-950">
                            {formatCurrency(booking.price, booking.currency)}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                booking.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : booking.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <a
                              href="https://wa.link/ufocc9"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold inline-flex items-center gap-1"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-xs text-stone-500 space-y-2">
                <Calendar className="w-8 h-8 text-stone-400 mx-auto" />
                <p>No customer bookings submitted yet.</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 8: SALON & ADMIN SETTINGS
        ======================================================== */}
        {adminTab === 'settings' && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="font-serif text-2xl font-bold text-stone-900">Salon &amp; Admin Settings</h2>
              <p className="text-xs text-stone-500 mt-1">Configure salon contact details and admin login credentials.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Salon settings updated successfully!');
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">Salon Name</label>
                  <input
                    type="text"
                    defaultValue={settings.salonName}
                    onChange={(e) => onSaveSettings({ ...settings, salonName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">Phone Number</label>
                  <input
                    type="text"
                    defaultValue={settings.phone}
                    onChange={(e) => onSaveSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-800 block">Official WhatsApp Link</label>
                <input
                  type="text"
                  readOnly
                  value="https://wa.link/ufocc9"
                  className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-mono text-stone-700"
                />
                <span className="text-[10px] text-stone-500">Locked to official Crown &amp; Glam shortlink.</span>
              </div>

              {/* Admin Security Section */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <h3 className="font-serif font-bold text-stone-900 text-sm">Admin Login Credentials</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 block">Admin Username</label>
                    <input
                      type="text"
                      defaultValue={settings.adminUsername || 'admin@crownglamstudio.com'}
                      onChange={(e) => onSaveSettings({ ...settings, adminUsername: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-800 block">Admin Password</label>
                    <input
                      type="text"
                      defaultValue={settings.adminPassword || settings.adminPin || 'admin123'}
                      onChange={(e) =>
                        onSaveSettings({
                          ...settings,
                          adminPassword: e.target.value,
                          adminPin: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Default Catalog */}
              <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-stone-800 text-xs block">Restore Default 51 Styles</span>
                  <span className="text-[11px] text-stone-500 block">Reset all changes and reload the 51 authentic Ghanaian styles catalogue.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all hairstyles to the default 51 catalogue?')) {
                      onResetDefaults();
                      showToast('Default 51 Ghanaian catalogue restored successfully!');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-red-50 text-red-700 border border-stone-200 text-xs font-semibold cursor-pointer shrink-0"
                >
                  Reset to Default Catalog
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* ========================================================
          MODAL 1: EDIT HAIRSTYLE MODAL
      ======================================================== */}
      {editingHairstyle && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">
                  Edit Hairstyle
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  {editingHairstyle.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingHairstyle(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedHairstyle} className="space-y-4">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">Hairstyle Name *</label>
                  <input
                    type="text"
                    required
                    value={editingHairstyle.name}
                    onChange={(e) => setEditingHairstyle({ ...editingHairstyle, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">Category *</label>
                  <select
                    value={editingHairstyle.category}
                    onChange={(e) =>
                      setEditingHairstyle({ ...editingHairstyle, category: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Duration & Length */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">Price (GH₵) *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    step={5}
                    value={editingHairstyle.price}
                    onChange={(e) =>
                      setEditingHairstyle({ ...editingHairstyle, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 font-serif"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">Duration *</label>
                  <input
                    type="text"
                    required
                    value={editingHairstyle.estimatedDuration}
                    onChange={(e) =>
                      setEditingHairstyle({ ...editingHairstyle, estimatedDuration: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 block">Length *</label>
                  <input
                    type="text"
                    required
                    value={editingHairstyle.lengthOption || ''}
                    onChange={(e) =>
                      setEditingHairstyle({ ...editingHairstyle, lengthOption: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-800 block">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingHairstyle.description}
                  onChange={(e) =>
                    setEditingHairstyle({ ...editingHairstyle, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 leading-relaxed"
                />
              </div>

              {/* Image URL & Upload */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-xs font-bold text-stone-800 block">Hairstyle Image</label>
                <div className="flex gap-3 items-center">
                  <img
                    src={editingHairstyle.imageUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-100"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editingHairstyle.imageUrl}
                      onChange={(e) =>
                        setEditingHairstyle({ ...editingHairstyle, imageUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                      placeholder="Image URL or preset path"
                    />
                    <label className="inline-block text-[11px] font-semibold text-amber-800 hover:underline cursor-pointer">
                      Upload new image from device
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageFileUpload(e, (dataUrl) =>
                            setEditingHairstyle({ ...editingHairstyle, imageUrl: dataUrl })
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Visibility and Availability */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingHairstyle.isAvailable}
                    onChange={(e) =>
                      setEditingHairstyle({ ...editingHairstyle, isAvailable: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Available for Booking</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingHairstyle.isHidden}
                    onChange={(e) =>
                      setEditingHairstyle({ ...editingHairstyle, isHidden: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span className="text-amber-800">Hide from Customer Website</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingHairstyle(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: CONFIRMATION MODAL FOR DELETION
      ======================================================== */}
      {hairstyleToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Are you sure you want to permanently delete {hairstyleToDelete.name}?
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                You are about to permanently delete <strong>"{hairstyleToDelete.name}"</strong> (GH₵{hairstyleToDelete.price}) from the catalogue.
              </p>
              <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                Tip: If you only want to temporarily take it off the customer view without losing the details, choose <strong>"Hide Instead"</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setHairstyleToDelete(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleHideHairstyle(hairstyleToDelete);
                  setHairstyleToDelete(null);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold cursor-pointer"
              >
                Hide Instead
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteHairstyle}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: ZOOMED IMAGE PREVIEW
      ======================================================== */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-3 space-y-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
              <img
                src={zoomedImage.url}
                alt={zoomedImage.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-2 py-1 flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-stone-900">{zoomedImage.name}</span>
              <span className="text-stone-400">Click anywhere to close</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
