import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  Scissors, 
  ShoppingBag,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { Hairstyle, Wig, Booking, SalonSettings } from '../types';
import { formatCurrency, generateBookingId, createWhatsAppLink } from '../utils/formatters';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hairstyles: Hairstyle[];
  wigs: Wig[];
  initialItem?: { type: 'hairstyle' | 'wig_install' | 'wig_purchase'; item: Hairstyle | Wig } | null;
  onBookingSubmitted: (booking: Booking) => void;
  settings: SalonSettings;
}

const TIME_SLOTS = [
  '08:30 AM',
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  hairstyles,
  wigs,
  initialItem,
  onBookingSubmitted,
  settings,
}) => {
  const [serviceType, setServiceType] = useState<'hairstyle' | 'wig_install' | 'wig_purchase'>('hairstyle');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  
  // Date & Time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState<string>(defaultDateStr);
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM');

  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [hairColourChosen, setHairColourChosen] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initialItem when opened
  useEffect(() => {
    if (initialItem) {
      setServiceType(initialItem.type);
      setSelectedServiceId(initialItem.item.id);
    } else {
      const visible = hairstyles.filter((h) => !h.isHidden);
      if (visible.length > 0) {
        setServiceType('hairstyle');
        setSelectedServiceId(visible[0].id);
      }
    }
    setConfirmedBooking(null);
  }, [initialItem, hairstyles]);

  if (!isOpen) return null;

  // Selected item reference
  const currentItem = serviceType === 'hairstyle'
    ? hairstyles.find((h) => h.id === selectedServiceId) || hairstyles[0]
    : wigs.find((w) => w.id === selectedServiceId) || wigs[0];

  const currentPrice = currentItem ? currentItem.price : 0;
  const currentCurrency = currentItem ? currentItem.currency : 'GH₵';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !currentItem) return;

    setIsSubmitting(true);

    const newBooking: Booking = {
      id: generateBookingId(),
      serviceType,
      serviceId: currentItem.id,
      serviceName: currentItem.name,
      price: currentPrice,
      currency: currentCurrency,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      date,
      timeSlot,
      hairColourChosen: hairColourChosen.trim() || undefined,
      specialRequests: specialRequests.trim() || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onBookingSubmitted(newBooking);
      setConfirmedBooking(newBooking);
      setIsSubmitting(false);
    }, 400);
  };

  const handleCopyConfirmation = () => {
    if (!confirmedBooking) return;
    const summary = `Crown & Glam Salon Booking\nID: ${confirmedBooking.id}\nService: ${confirmedBooking.serviceName}\nPrice: ${formatCurrency(confirmedBooking.price, confirmedBooking.currency)}\nDate: ${confirmedBooking.date} at ${confirmedBooking.timeSlot}\nClient: ${confirmedBooking.customerName}\nPhone: ${confirmedBooking.customerPhone}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-950/75 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                {confirmedBooking ? 'Appointment Confirmed!' : 'Book Salon Appointment'}
              </h2>
              <p className="text-xs text-stone-500">
                {confirmedBooking 
                  ? 'Your reservation is secured in our salon schedule' 
                  : 'Transparent pricing with instant booking confirmation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
          
          {/* STATE 1: BOOKING CONFIRMED */}
          {confirmedBooking ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce-slow">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full">
                  Booking Reference: {confirmedBooking.id}
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-2">
                  Thank You, {confirmedBooking.customerName}!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  We look forward to giving you an exceptional hair experience at our Osu salon atelier.
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 text-left space-y-3 max-w-md mx-auto text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Selected Service</span>
                  <span className="font-serif font-bold text-sm text-stone-900">{confirmedBooking.serviceName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Date &amp; Time</span>
                  <span className="font-bold text-stone-800">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Exact Price</span>
                  <span className="font-serif font-bold text-base text-amber-950">
                    {formatCurrency(confirmedBooking.price, confirmedBooking.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Client Contact</span>
                  <span className="font-medium text-stone-800">{confirmedBooking.customerPhone}</span>
                </div>
                {confirmedBooking.hairColourChosen && (
                  <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Colour Preference</span>
                    <span className="font-medium text-stone-800">{confirmedBooking.hairColourChosen}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 text-[11px] text-stone-500">
                  <span>Salon Location</span>
                  <span>{settings.address}</span>
                </div>
              </div>

              {/* Action Buttons for Confirmed State */}
              <div className="space-y-2 max-w-md mx-auto pt-2">
                {/* Send to WhatsApp for fast confirmation */}
                <a
                  href="https://wa.link/ufocc9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Send Confirmation via WhatsApp</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyConfirmation}
                    className="py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Copy Details'}</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    Done &amp; Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            
            /* STATE 2: ACTIVE BOOKING FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Select Service Category & Item */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  1. Select Service / Style
                </label>
                
                {/* Service Type Switcher */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setServiceType('hairstyle');
                      if (hairstyles.length > 0) setSelectedServiceId(hairstyles[0].id);
                    }}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      serviceType === 'hairstyle' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5 text-amber-800" />
                    <span>Hairstyle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setServiceType('wig_install');
                      if (wigs.length > 0) setSelectedServiceId(wigs[0].id);
                    }}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      serviceType === 'wig_install' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-800" />
                    <span>Wig Install</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setServiceType('wig_purchase');
                      if (wigs.length > 0) setSelectedServiceId(wigs[0].id);
                    }}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      serviceType === 'wig_purchase' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                    <span>Wig Order</span>
                  </button>
                </div>

                {/* Dropdown for item in selected category */}
                <div>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-amber-800/20 focus:outline-none"
                  >
                    {serviceType === 'hairstyle' ? (
                      hairstyles.filter((h) => !h.isHidden).map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} — {formatCurrency(h.price, h.currency)} ({h.estimatedDuration})
                        </option>
                      ))
                    ) : (
                      wigs.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.length}, {w.texture}) — {formatCurrency(w.price, w.currency)}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Selected Item Preview Chip */}
                {currentItem && (
                  <div className="flex items-center gap-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl">
                    <img
                      src={currentItem.imageUrl}
                      alt={currentItem.name}
                      className="w-12 h-12 rounded-lg object-cover border border-amber-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-serif font-bold text-sm text-stone-900 block truncate">
                        {currentItem.name}
                      </span>
                      <span className="text-xs text-stone-500">
                        {serviceType === 'hairstyle'
                          ? `Duration: ${(currentItem as Hairstyle).estimatedDuration}`
                          : `Texture: ${(currentItem as Wig).texture} • ${(currentItem as Wig).length}`}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-stone-400 block uppercase">Price</span>
                      <span className="font-serif font-bold text-base text-amber-950">
                        {formatCurrency(currentPrice, currentCurrency)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Date & Available Time Slot */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  2. Preferred Date &amp; Time
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-stone-600 block mb-1">Appointment Date:</span>
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                    />
                  </div>

                  <div>
                    <span className="text-xs text-stone-600 block mb-1">Available Time Slot:</span>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Customer Details */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  3. Customer Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      placeholder="Phone / WhatsApp Number *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      placeholder="Email Address (optional)"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Preferred Hair Colour (e.g. #1B, #30)"
                      value={hairColourChosen}
                      onChange={(e) => setHairColourChosen(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Special requests or hair notes (e.g. sensitive edges, bringing own bundles, tender scalp...)"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                  />
                </div>
              </div>

              {/* Submit Button & Price Recap */}
              <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Total Service Price</span>
                  <span className="font-serif font-bold text-2xl text-amber-950">
                    {formatCurrency(currentPrice, currentCurrency)}
                  </span>
                  <span className="text-[11px] text-stone-500 block">Pay at the salon upon completion</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !customerName || !customerPhone}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-stone-900 hover:bg-amber-900 text-amber-100 text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Securing Slot...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        <span>Confirm Appointment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
