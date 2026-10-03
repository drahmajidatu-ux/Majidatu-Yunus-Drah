import React, { useState } from 'react';
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
  RotateCcw,
  Sparkles,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Hairstyle, Wig, Booking, CustomerMessage, SalonSettings, HairstyleCategory } from '../types';
import { formatCurrency, createWhatsAppLink } from '../utils/formatters';

interface AdminDashboardProps {
  hairstyles: Hairstyle[];
  wigs: Wig[];
  bookings: Booking[];
  messages: CustomerMessage[];
  settings: SalonSettings;
  onSaveHairstyles: (styles: Hairstyle[]) => void;
  onSaveWigs: (wigs: Wig[]) => void;
  onSaveBookings: (bookings: Booking[]) => void;
  onSaveMessages: (messages: CustomerMessage[]) => void;
  onSaveSettings: (settings: SalonSettings) => void;
  onResetDefaults: () => void;
  onExitAdmin: () => void;
}

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1579610564115-f4d12c758587?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
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
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'hairstyles' | 'wigs' | 'bookings' | 'messages' | 'settings'>('hairstyles');

  // Hairstyle Form modal state
  const [editingHairstyle, setEditingHairstyle] = useState<Hairstyle | null>(null);
  const [isAddingHairstyle, setIsAddingHairstyle] = useState(false);

  // Wig Form modal state
  const [editingWig, setEditingWig] = useState<Wig | null>(null);
  const [isAddingWig, setIsAddingWig] = useState(false);

  // Message reply modal state
  const [replyingToMessage, setReplyingToMessage] = useState<CustomerMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  // Toast message
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === settings.adminPin || pinInput.trim() === 'admin123') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. The default PIN is admin123');
    }
  };

  // Image upload handler (converts file to base64 Data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // HAIRSTYLE OPERATIONS
  const handleSaveHairstyle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updatedStyle: Hairstyle = {
      id: editingHairstyle ? editingHairstyle.id : `hs-${Date.now()}`,
      name: formData.get('name') as string,
      category: formData.get('category') as any,
      price: Number(formData.get('price')),
      currency: settings.currency,
      estimatedDuration: formData.get('estimatedDuration') as string,
      availableColours: (formData.get('availableColours') as string)
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      hairMaterialRequired: formData.get('hairMaterialRequired') as string,
      description: formData.get('description') as string,
      isAvailable: formData.get('isAvailable') === 'on',
      isTrending: formData.get('isTrending') === 'on',
      lengthOption: formData.get('lengthOption') as string,
      difficultyOrNotes: formData.get('difficultyOrNotes') as string,
      imageUrl: (formData.get('imageUrl') as string) || SAMPLE_PHOTO_PRESETS[0],
    };

    if (editingHairstyle) {
      const updated = hairstyles.map((h) => (h.id === editingHairstyle.id ? updatedStyle : h));
      onSaveHairstyles(updated);
      showToast('Hairstyle updated successfully!');
    } else {
      onSaveHairstyles([updatedStyle, ...hairstyles]);
      showToast('New hairstyle added to catalogue!');
    }

    setEditingHairstyle(null);
    setIsAddingHairstyle(false);
  };

  const handleDeleteHairstyle = (id: string) => {
    if (confirm('Are you sure you want to remove this hairstyle from your catalogue?')) {
      onSaveHairstyles(hairstyles.filter((h) => h.id !== id));
      showToast('Hairstyle removed.');
    }
  };

  const handleQuickToggleHairstyleAvail = (style: Hairstyle) => {
    const updated = hairstyles.map((h) =>
      h.id === style.id ? { ...h, isAvailable: !h.isAvailable } : h
    );
    onSaveHairstyles(updated);
    showToast(`"${style.name}" marked as ${!style.isAvailable ? 'Available' : 'Unavailable'}`);
  };

  const handleQuickPriceChangeHairstyle = (style: Hairstyle, newPrice: number) => {
    const updated = hairstyles.map((h) =>
      h.id === style.id ? { ...h, price: newPrice } : h
    );
    onSaveHairstyles(updated);
  };

  // WIG OPERATIONS
  const handleSaveWig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const availabilityStatus = formData.get('availabilityStatus') as any;
    const isAvailable = availabilityStatus !== 'Sold out';

    const updatedWig: Wig = {
      id: editingWig ? editingWig.id : `wig-${Date.now()}`,
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      currency: settings.currency,
      length: formData.get('length') as string,
      texture: formData.get('texture') as any,
      hairType: formData.get('hairType') as any,
      colour: formData.get('colour') as string,
      density: formData.get('density') as string,
      capSize: formData.get('capSize') as string,
      availabilityStatus,
      isAvailable,
      description: formData.get('description') as string,
      careInstructions: formData.get('careInstructions') as string,
      qualitySpecs: formData.get('qualitySpecs') as string,
      imageUrl: (formData.get('imageUrl') as string) || SAMPLE_PHOTO_PRESETS[5],
      isTrending: formData.get('isTrending') === 'on',
    };

    if (editingWig) {
      const updated = wigs.map((w) => (w.id === editingWig.id ? updatedWig : w));
      onSaveWigs(updated);
      showToast('Wig updated successfully!');
    } else {
      onSaveWigs([updatedWig, ...wigs]);
      showToast('New wig added to inventory!');
    }

    setEditingWig(null);
    setIsAddingWig(false);
  };

  const handleDeleteWig = (id: string) => {
    if (confirm('Are you sure you want to remove this wig?')) {
      onSaveWigs(wigs.filter((w) => w.id !== id));
      showToast('Wig removed from inventory.');
    }
  };

  // BOOKINGS OPERATIONS
  const handleUpdateBookingStatus = (id: string, newStatus: Booking['status']) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    onSaveBookings(updated);
    showToast(`Booking ${id} updated to ${newStatus}`);
  };

  // MESSAGE REPLY
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingToMessage || !replyText.trim()) return;

    const updated = messages.map((m) =>
      m.id === replyingToMessage.id
        ? { ...m, replyStatus: 'answered' as const, salonReply: replyText.trim() }
        : m
    );
    onSaveMessages(updated);
    showToast('Reply saved!');
    setReplyingToMessage(null);
    setReplyText('');
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl max-w-md w-full space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-900 text-amber-200 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
              Salon Owner Portal
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
              Owner Management Access
            </h2>
            <p className="text-xs text-stone-500 mt-2">
              Enter your salon administrator PIN to manage prices, inventory, bookings, and customer messages.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Salon PIN (Default: admin123)"
                className="w-full text-center tracking-widest text-lg p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800"
                autoFocus
              />
              {pinError && <p className="text-xs text-red-600 mt-2 font-medium">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-amber-900 text-white font-semibold text-sm shadow transition-all cursor-pointer"
            >
              Sign In to Salon Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
            <span>Demo PIN: <strong className="text-stone-600">admin123</strong></span>
            <button
              onClick={onExitAdmin}
              className="hover:text-stone-700 underline cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 bg-stone-900 text-amber-200 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Salon Owner Control Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            {settings.salonName} Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Update hairstyle prices, add wigs, handle appointment bookings, and reply to client inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExitAdmin}
            className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-stone-500" />
            <span>View Live Website</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Admin Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto text-xs sm:text-sm">
        <button
          onClick={() => setAdminTab('hairstyles')}
          className={`px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            adminTab === 'hairstyles'
              ? 'bg-stone-900 text-amber-200 shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Hairstyles Catalogue ({hairstyles.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('wigs')}
          className={`px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            adminTab === 'wigs'
              ? 'bg-stone-900 text-amber-200 shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Wig Shop ({wigs.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('bookings')}
          className={`px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            adminTab === 'bookings'
              ? 'bg-stone-900 text-amber-200 shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('messages')}
          className={`px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            adminTab === 'messages'
              ? 'bg-stone-900 text-amber-200 shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Client Questions ({messages.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            adminTab === 'settings'
              ? 'bg-stone-900 text-amber-200 shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Salon Info &amp; Prices</span>
        </button>
      </div>

      {/* TAB 1: HAIRSTYLES MANAGER */}
      {adminTab === 'hairstyles' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Manage Hairstyles &amp; Prices
              </h2>
              <p className="text-xs text-stone-500">
                Edit prices directly, toggle availability, or add brand-new styles to the client catalogue.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingHairstyle(null);
                setIsAddingHairstyle(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Hairstyle</span>
            </button>
          </div>

          {/* Hairstyles List */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Style Details</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price ({settings.currency})</th>
                    <th className="p-3.5">Est. Duration</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {hairstyles.map((style) => (
                    <tr key={style.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={style.imageUrl}
                          alt={style.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-serif font-bold text-sm text-stone-900 block">
                            {style.name}
                          </span>
                          <span className="text-[11px] text-stone-500 line-clamp-1 max-w-xs">
                            {style.hairMaterialRequired}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-stone-100 px-2.5 py-1 rounded font-medium text-stone-700">
                          {style.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-stone-500">{style.currency}</span>
                          <input
                            type="number"
                            defaultValue={style.price}
                            onBlur={(e) => handleQuickPriceChangeHairstyle(style, Number(e.target.value))}
                            className="w-20 p-1 border border-stone-200 rounded font-serif font-bold text-amber-950 focus:ring-1 focus:ring-amber-800"
                          />
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-stone-700">
                        {style.estimatedDuration}
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleQuickToggleHairstyleAvail(style)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                            style.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                          }`}
                        >
                          {style.isAvailable ? '✓ Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingHairstyle(style);
                            setIsAddingHairstyle(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 cursor-pointer"
                          title="Edit Style"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteHairstyle(style.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Delete Style"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WIGS MANAGER */}
      {adminTab === 'wigs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Manage Wig Inventory &amp; Specifications
              </h2>
              <p className="text-xs text-stone-500">
                Update wig stock status, lengths, densities, prices, and upload new photos.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingWig(null);
                setIsAddingWig(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Wig</span>
            </button>
          </div>

          {/* Wigs List */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Wig Details</th>
                    <th className="p-3.5">Specs</th>
                    <th className="p-3.5">Price ({settings.currency})</th>
                    <th className="p-3.5">Inventory Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {wigs.map((wig) => (
                    <tr key={wig.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={wig.imageUrl}
                          alt={wig.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-serif font-bold text-sm text-stone-900 block">
                            {wig.name}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {wig.hairType} • {wig.colour}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <span className="bg-stone-100 px-2 py-0.5 rounded font-medium text-stone-800">
                            {wig.length} • {wig.texture}
                          </span>
                          <span className="block text-stone-500 text-[10px] mt-0.5">
                            {wig.density} density
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 font-serif font-bold text-base text-amber-950">
                        {formatCurrency(wig.price, wig.currency)}
                      </td>
                      <td className="p-3.5">
                        <select
                          value={wig.availabilityStatus}
                          onChange={(e) => {
                            const newStatus = e.target.value as any;
                            const updated = wigs.map((w) =>
                              w.id === wig.id
                                ? { ...w, availabilityStatus: newStatus, isAvailable: newStatus !== 'Sold out' }
                                : w
                            );
                            onSaveWigs(updated);
                            showToast(`Updated "${wig.name}" status`);
                          }}
                          className={`p-1.5 rounded-lg text-xs font-semibold border ${
                            wig.availabilityStatus === 'In stock'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : wig.availabilityStatus === 'Only 2 left'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-stone-100 text-stone-700 border-stone-300'
                          }`}
                        >
                          <option value="In stock">In Stock</option>
                          <option value="Only 2 left">Only 2 Left</option>
                          <option value="Pre-order">Pre-Order</option>
                          <option value="Sold out">Sold Out</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingWig(wig);
                            setIsAddingWig(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 cursor-pointer"
                          title="Edit Wig"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWig(wig.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Delete Wig"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS MANAGER */}
      {adminTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Customer Appointments &amp; Bookings
              </h2>
              <p className="text-xs text-stone-500">
                Review appointments, confirm slots, call clients, or message on WhatsApp.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            {bookings.length === 0 ? (
              <div className="p-12 text-center text-stone-500 text-xs">
                No customer bookings recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                      <th className="p-3.5">Ref &amp; Service</th>
                      <th className="p-3.5">Client Information</th>
                      <th className="p-3.5">Date &amp; Time</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Client Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {bookings.map((booking) => {
                      const clientWa = createWhatsAppLink(
                        booking.customerPhone,
                        `Hello ${booking.customerName}! This is ${settings.salonName} confirming your appointment for ${booking.serviceName} on ${booking.date} at ${booking.timeSlot}.`
                      );
                      return (
                        <tr key={booking.id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="p-3.5">
                            <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
                              {booking.id}
                            </span>
                            <span className="font-serif font-bold text-sm text-stone-900 block mt-1">
                              {booking.serviceName}
                            </span>
                            {booking.specialRequests && (
                              <span className="text-[11px] text-stone-500 block italic mt-0.5 max-w-xs">
                                Note: {booking.specialRequests}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-stone-900 block">{booking.customerName}</span>
                            <span className="text-stone-500">{booking.customerPhone}</span>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1 font-semibold text-stone-800">
                              <Calendar className="w-3.5 h-3.5 text-amber-800" />
                              <span>{booking.date}</span>
                            </div>
                            <span className="text-stone-500">{booking.timeSlot}</span>
                          </td>
                          <td className="p-3.5 font-serif font-bold text-base text-amber-950">
                            {formatCurrency(booking.price, booking.currency)}
                          </td>
                          <td className="p-3.5">
                            <select
                              value={booking.status}
                              onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value as any)}
                              className={`p-1.5 rounded-lg text-xs font-semibold border ${
                                booking.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : booking.status === 'completed'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : booking.status === 'pending'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-stone-100 text-stone-700 border-stone-300'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <a
                              href={clientWa}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={`tel:${booking.customerPhone}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MESSAGES & QUESTIONS */}
      {adminTab === 'messages' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Customer Inquiries &amp; Questions
            </h2>
            <p className="text-xs text-stone-500">
              Questions submitted by clients directly from the hairstyle and wig catalogue.
            </p>
          </div>

          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500 text-xs">
                No customer questions submitted yet.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-stone-900">{msg.customerName}</span>
                        <span className="text-stone-400">•</span>
                        <span className="text-xs text-stone-500">{msg.contact}</span>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded uppercase">
                          Via {msg.channel}
                        </span>
                      </div>
                      {msg.subjectItemName && (
                        <span className="text-xs text-amber-800 font-medium block mt-0.5">
                          Topic: {msg.subjectItemName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          msg.replyStatus === 'answered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {msg.replyStatus === 'answered' ? '✓ Answered' : 'Pending Reply'}
                      </span>

                      <a
                        href={createWhatsAppLink(msg.contact, `Hello ${msg.customerName}! Regarding your question on ${settings.salonName}:`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>

                      <button
                        onClick={() => {
                          setReplyingToMessage(msg);
                          setReplyText(msg.salonReply || '');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-900 text-white text-xs font-semibold cursor-pointer"
                      >
                        Write Reply
                      </button>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl text-xs text-stone-800">
                    <span className="text-stone-400 block text-[10px] uppercase mb-0.5">Question:</span>
                    <p className="text-stone-900 leading-relaxed font-medium">"{msg.message}"</p>
                  </div>

                  {msg.salonReply && (
                    <div className="bg-emerald-50 border border-emerald-200/60 p-3 rounded-xl text-xs text-emerald-950">
                      <span className="text-emerald-800 font-bold block text-[10px] uppercase mb-0.5">Your Saved Reply:</span>
                      <p className="leading-relaxed">{msg.salonReply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SALON SETTINGS */}
      {adminTab === 'settings' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6 max-w-3xl">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Salon Contact Info, Hours &amp; Currency
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Changes made here are reflected throughout the website immediately.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const updated: SalonSettings = {
                salonName: form.get('salonName') as string,
                tagline: form.get('tagline') as string,
                phone: form.get('phone') as string,
                whatsapp: form.get('whatsapp') as string,
                email: form.get('email') as string,
                address: form.get('address') as string,
                city: form.get('city') as string,
                openingHours: form.get('openingHours') as string,
                currency: form.get('currency') as string,
                instagramHandle: form.get('instagramHandle') as string,
                adminPin: (form.get('adminPin') as string) || 'admin123',
              };
              onSaveSettings(updated);
              showToast('Salon settings updated!');
            }}
            className="space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Salon Name</label>
                <input
                  type="text"
                  name="salonName"
                  defaultValue={settings.salonName}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Currency Symbol</label>
                <input
                  type="text"
                  name="currency"
                  defaultValue={settings.currency}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">WhatsApp Number (clean digits)</label>
                <input
                  type="text"
                  name="whatsapp"
                  defaultValue={settings.whatsapp}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Display Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={settings.phone}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={settings.email}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Admin Dashboard PIN</label>
                <input
                  type="text"
                  name="adminPin"
                  defaultValue={settings.adminPin}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 block mb-1">Salon Address &amp; Landmarks</label>
                <input
                  type="text"
                  name="address"
                  defaultValue={settings.address}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 block mb-1">Opening Hours String</label>
                <input
                  type="text"
                  name="openingHours"
                  defaultValue={settings.openingHours}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-amber-900 text-white font-semibold text-sm cursor-pointer shadow"
              >
                Save Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset entire catalogue, wigs, bookings, and settings back to original defaults?')) {
                    onResetDefaults();
                    showToast('Reset to original sample data.');
                  }
                }}
                className="px-4 py-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All to Defaults</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* HAIRSTYLE ADD/EDIT MODAL */}
      {isAddingHairstyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 p-6 my-auto max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {editingHairstyle ? 'Edit Hairstyle' : 'Add New Hairstyle to Catalogue'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingHairstyle(false);
                  setEditingHairstyle(null);
                }}
                className="p-1 rounded-full text-stone-500 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHairstyle} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Hairstyle Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingHairstyle?.name || ''}
                  placeholder="e.g. Bohemian Knotless Braids"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingHairstyle?.category || 'Braids'}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  >
                    {[
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
                    ].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Price ({settings.currency}) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    defaultValue={editingHairstyle?.price || 250}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-amber-950"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    name="estimatedDuration"
                    defaultValue={editingHairstyle?.estimatedDuration || '3h 30m'}
                    placeholder="e.g. 3h 30m"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Length Option</label>
                  <input
                    type="text"
                    name="lengthOption"
                    defaultValue={editingHairstyle?.lengthOption || 'Waist Length'}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Hair Material Required *
                </label>
                <input
                  type="text"
                  name="hairMaterialRequired"
                  required
                  defaultValue={editingHairstyle?.hairMaterialRequired || '4 packs of pre-stretched X-pression'}
                  placeholder="e.g. 4 packs of X-pression + 2 bulk human hair curls"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Available Colours (comma separated)
                </label>
                <input
                  type="text"
                  name="availableColours"
                  defaultValue={editingHairstyle?.availableColours?.join(', ') || '#1B, #30, #27, Ombre #1B/30'}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingHairstyle?.description || ''}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              {/* Image Input: File or URL */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Photo URL or Upload
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  id="hs-image-url-input"
                  defaultValue={editingHairstyle?.imageUrl || SAMPLE_PHOTO_PRESETS[0]}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
                <div className="mt-2 flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer hover:bg-stone-100 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileUpload(e, (url) => {
                          const el = document.getElementById('hs-image-url-input') as HTMLInputElement;
                          if (el) el.value = url;
                        })
                      }
                    />
                  </label>
                  <span className="text-[11px] text-stone-400">or pick from preset library</span>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    defaultChecked={editingHairstyle ? editingHairstyle.isAvailable : true}
                    className="rounded text-amber-800"
                  />
                  <span className="font-semibold text-stone-800">Currently Available to Book</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isTrending"
                    defaultChecked={editingHairstyle?.isTrending}
                    className="rounded text-amber-800"
                  />
                  <span className="font-semibold text-stone-800">Show in Popular / Trending</span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingHairstyle(false);
                    setEditingHairstyle(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 text-white font-semibold"
                >
                  Save Hairstyle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WIG ADD/EDIT MODAL */}
      {isAddingWig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 p-6 my-auto max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {editingWig ? 'Edit Wig Details' : 'Add New Wig to Inventory'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingWig(false);
                  setEditingWig(null);
                }}
                className="p-1 rounded-full text-stone-500 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWig} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Wig Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingWig?.name || ''}
                  placeholder="e.g. Raw Bone Straight HD Frontal Wig"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Price ({settings.currency}) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    defaultValue={editingWig?.price || 1500}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-amber-950"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Length (e.g. 22")</label>
                  <input
                    type="text"
                    name="length"
                    required
                    defaultValue={editingWig?.length || '22"'}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Texture</label>
                  <select
                    name="texture"
                    defaultValue={editingWig?.texture || 'Body wave'}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    {['Straight', 'Body wave', 'Deep curl', 'Water wave', 'Kinky straight', 'Pixie cut', 'Loose wave'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Hair Type / Origin</label>
                  <select
                    name="hairType"
                    defaultValue={editingWig?.hairType || '100% Virgin Human Hair'}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    {['100% Virgin Human Hair', 'Raw Cambodian Hair', 'HD Lace Frontal', 'Glueless Closure', 'Premium Blend'].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Density</label>
                  <input
                    type="text"
                    name="density"
                    defaultValue={editingWig?.density || '180%'}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Colour</label>
                  <input
                    type="text"
                    name="colour"
                    defaultValue={editingWig?.colour || 'Natural Black #1B'}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Cap Size</label>
                  <input
                    type="text"
                    name="capSize"
                    defaultValue={editingWig?.capSize || 'Medium (22-22.5") with adjustable straps'}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Stock Availability</label>
                  <select
                    name="availabilityStatus"
                    defaultValue={editingWig?.availabilityStatus || 'In stock'}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option value="In stock">In Stock</option>
                    <option value="Only 2 left">Only 2 Left</option>
                    <option value="Pre-order">Pre-Order</option>
                    <option value="Sold out">Sold Out</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Quality / Lace Specs</label>
                <input
                  type="text"
                  name="qualitySpecs"
                  defaultValue={editingWig?.qualitySpecs || '13x4 Swiss HD Lace, pre-plucked with baby hair'}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Care Instructions</label>
                <input
                  type="text"
                  name="careInstructions"
                  defaultValue={editingWig?.careInstructions || 'Wash with sulfate-free shampoo every 2 weeks. Apply light serum.'}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Photo URL or Upload</label>
                <input
                  type="text"
                  name="imageUrl"
                  id="wig-image-url-input"
                  defaultValue={editingWig?.imageUrl || SAMPLE_PHOTO_PRESETS[5]}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
                <div className="mt-2 flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer hover:bg-stone-100 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Wig Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileUpload(e, (url) => {
                          const el = document.getElementById('wig-image-url-input') as HTMLInputElement;
                          if (el) el.value = url;
                        })
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingWig(false);
                    setEditingWig(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 text-white font-semibold"
                >
                  Save Wig
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPLY MODAL */}
      {replyingToMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Reply to {replyingToMessage.customerName}
              </h3>
              <button
                onClick={() => setReplyingToMessage(null)}
                className="p-1 rounded-full text-stone-500 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl text-xs text-stone-700 space-y-1">
              <span className="font-bold block text-stone-900">Question asked:</span>
              <p className="italic">"{replyingToMessage.message}"</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-3">
              <textarea
                rows={4}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response to the client..."
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyingToMessage(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold"
                >
                  Save &amp; Mark Answered
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
