import React from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  MessageCircle, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Package, 
  Palette, 
  Share2,
  Check
} from 'lucide-react';
import { Hairstyle, SalonSettings } from '../types';
import { formatCurrency, createWhatsAppLink } from '../utils/formatters';

interface HairstyleDetailModalProps {
  style: Hairstyle | null;
  onClose: () => void;
  onBook: (style: Hairstyle) => void;
  onToggleCompare?: (style: Hairstyle, type: 'hairstyle') => void;
  isItemInCompare?: (id: string) => boolean;
  onAskQuestion?: (style: Hairstyle) => void;
  settings: SalonSettings;
}

export const HairstyleDetailModal: React.FC<HairstyleDetailModalProps> = ({
  style,
  onClose,
  onBook,
  onToggleCompare,
  isItemInCompare,
  onAskQuestion,
  settings,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!style) return null;

  const inCompare = isItemInCompare ? isItemInCompare(style.id) : false;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappInquiryUrl = createWhatsAppLink(
    settings.whatsapp,
    `Hello Crown & Glam! I am viewing "${style.name}" priced at ${formatCurrency(style.price, style.currency)}. Could you confirm availability and hair pack details for this style?`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-950/70 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 shadow-md flex items-center justify-center transition-all cursor-pointer"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Image with overlays */}
          <div className="md:col-span-5 relative bg-stone-900 min-h-[280px] md:min-h-full">
            <img
              src={style.imageUrl}
              alt={style.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />
            
            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-amber-900/90 text-amber-100 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs">
                {style.category}
              </span>
              {style.isTrending && (
                <span className="bg-amber-400 text-amber-950 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  Trending Style
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs text-stone-300 block">Exact Transparent Price</span>
              <span className="font-serif text-3xl font-bold text-amber-300">
                {formatCurrency(style.price, style.currency)}
              </span>
            </div>
          </div>

          {/* Right Column: Detailed Specs & Actions */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              
              {/* Header Title & Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      style.isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{style.isAvailable ? 'Available to Book' : 'Consultation Only'}</span>
                  </span>

                  <button
                    onClick={handleShare}
                    className="text-stone-400 hover:text-stone-700 text-xs flex items-center gap-1 cursor-pointer"
                    title="Share link"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Link Copied' : 'Share'}</span>
                  </button>
                </div>

                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  {style.name}
                </h2>
                
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-2">
                  <span className="flex items-center gap-1 font-medium text-stone-800">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Est. Time: {style.estimatedDuration}</span>
                  </span>
                  <span>•</span>
                  <span>Length: {style.lengthOption || 'Standard'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {style.description}
              </div>

              {/* Specifications Box */}
              <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-xs">
                
                {/* Hair Material Required */}
                <div className="flex items-start gap-2.5">
                  <Package className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block">
                      Hair Type / Material Required:
                    </span>
                    <span className="text-stone-600 leading-relaxed block mt-0.5">
                      {style.hairMaterialRequired}
                    </span>
                  </div>
                </div>

                {/* Available Colours */}
                <div className="flex items-start gap-2.5 pt-2 border-t border-stone-200/60">
                  <Palette className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block mb-1">
                      Available Hair Colours:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {style.availableColours.map((c, idx) => (
                        <span key={idx} className="bg-white border border-stone-200 px-2 py-0.5 rounded text-[11px] font-medium text-stone-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Styling & Care Advice */}
                {style.difficultyOrNotes && (
                  <div className="pt-2 border-t border-stone-200/60 text-stone-500 text-[11px]">
                    <strong className="text-stone-700">Salon Note:</strong> {style.difficultyOrNotes}
                  </div>
                )}
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-stone-200 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onClose();
                    onBook(style);
                  }}
                  className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-amber-900 text-amber-100 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Book This Style Now</span>
                </button>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask on WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onToggleCompare?.(style, 'hairstyle')}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    inCompare
                      ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-stone-500" />
                  <span>{inCompare ? '✓ Added to Compare Table' : '+ Add to Compare (Side-by-Side)'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onAskQuestion?.(style);
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  Ask Salon a Question
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
