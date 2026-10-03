import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Mail, 
  Instagram, 
  MessageCircle, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { SalonSettings } from '../types';
import { createWhatsAppLink } from '../utils/formatters';

interface ContactSectionProps {
  settings: SalonSettings;
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

const FAQS = [
  {
    q: 'Do I need to bring my own hair extensions or does the salon provide them?',
    a: 'Both options are welcome! In our catalogue, we clearly state the exact recommended hair materials (e.g., 4 packs of X-Pression pre-stretched). We also stock premium braiding hair and raw human hair bundles in the salon for your convenience.',
  },
  {
    q: 'Why choose Knotless Braids over traditional box braids?',
    a: 'Knotless braids start with your natural hair and feed in extensions gradually. This means zero scalp tension, no tight painful bumps, immediate styling flexibility into high buns or ponytails, and protection for sensitive hairlines.',
  },
  {
    q: 'How long do your Raw Virgin Hair Wigs last?',
    a: 'Our 100% Raw and Virgin Human Hair wigs last 2 to 3+ years with proper maintenance. They can be washed, heat styled up to 450°F, bleached to blonde 613, and re-installed repeatedly.',
  },
  {
    q: 'Are your prices fixed or will they change when I arrive?',
    a: 'All prices shown on our website catalogue are 100% transparent and upfront. The price you see is the price you pay. If you request extra lengths (e.g., floor length) or custom coloring, we confirm any adjustment before beginning.',
  },
];

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  onOpenBooking,
  onOpenChat,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div id="contact-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Location &amp; Inquiries</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Visit Our Salon &amp; Contact Us
        </h2>
        <p className="text-stone-600 text-sm sm:text-base">
          Located in the heart of Osu, Accra. Stop by for your appointment or reach out for custom orders.
        </p>
      </div>

      {/* Main Grid: Info Cards & Interactive CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Contact Info & Opening Hours */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <h3 className="font-serif text-xl font-bold text-stone-900 pb-3 border-b border-stone-100">
              Salon Details
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900">Location &amp; Address:</strong>
                  <span className="text-stone-600 leading-relaxed block mt-0.5">
                    {settings.address}, {settings.city}
                  </span>
                  <span className="text-[11px] text-amber-800 font-medium block mt-0.5">
                    Easy parking available • Air-conditioned private styling suites
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900">Salon Working Hours:</strong>
                  <span className="text-stone-600 leading-relaxed block mt-0.5">
                    {settings.openingHours}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900">Phone Consultation:</strong>
                  <a href={`tel:${settings.phone}`} className="text-stone-600 hover:text-amber-800 font-medium block mt-0.5">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <strong className="block text-stone-900">WhatsApp Desk:</strong>
                  <a
                    href={createWhatsAppLink(settings.whatsapp, 'Hello! I would like to make an inquiry.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-semibold hover:underline block mt-0.5"
                  >
                    +{settings.whatsapp} (Instant Chat)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-stone-900">Email:</strong>
                  <span className="text-stone-600 block mt-0.5">{settings.email}</span>
                </div>
              </div>
            </div>

            {/* Direct Quick Action buttons */}
            <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-3">
              <button
                onClick={onOpenBooking}
                className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-amber-900 text-amber-100 font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Book Online</span>
              </button>

              <button
                onClick={onOpenChat}
                className="py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-stone-600" />
                <span>Ask a Question</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Salon FAQs Accordion */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif text-xl font-bold text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Frequently Asked Questions</span>
              <span className="text-xs text-stone-400 font-normal">Got Questions?</span>
            </h3>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-stone-200/80 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-stone-900 hover:text-amber-900 flex items-center justify-between gap-3 cursor-pointer bg-stone-50/50"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-amber-800 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-white text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0" />
                <span className="text-stone-800 font-medium">Have a specific style request not listed?</span>
              </div>
              <button
                onClick={onOpenChat}
                className="font-bold text-amber-950 underline hover:text-stone-900 shrink-0 cursor-pointer"
              >
                Inquire Now
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
