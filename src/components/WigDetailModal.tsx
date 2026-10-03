import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  MessageCircle, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Share2, 
  Check, 
  Droplets
} from 'lucide-react';
import { Wig, SalonSettings } from '../types';
import { formatCurrency, createWhatsAppLink } from '../utils/formatters';

interface WigDetailModalProps {
  wig: Wig | null;
  onClose: () => void;
  onBookInstall: (wig: Wig) => void;
  onToggleCompare?: (wig: Wig, type: 'wig') => void;
  isItemInCompare?: (id: string) => boolean;
  onAskQuestion?: (wig: Wig) => void;
  settings: SalonSettings;
}

export const WigDetailModal: React.FC<WigDetailModalProps> = ({
  wig,
  onClose,
  onBookInstall,
  onToggleCompare,
  isItemInCompare,
  onAskQuestion,
  settings,
}) => {
  const [copied, setCopied] = useState(false);

  if (!wig) return null;

  const inCompare = isItemInCompare ? isItemInCompare(wig.id) : false;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappInquiryUrl = createWhatsAppLink(
    settings.whatsapp,
    `Hello Crown & Glam! Is "${wig.name}" (${wig.length}, ${wig.texture}, ${formatCurrency(wig.price, wig.currency)}) currently available for immediate pickup or salon installation?`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-950/70 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200"
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

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[88vh] overflow-y-auto">
          
          {/* Left Column: Big Imagery & Visual Tag */}
          <div className="md:col-span-5 relative bg-stone-900 min-h-[300px] md:min-h-full">
            <img
              src={wig.imageUrl}
              alt={wig.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-black/20" />

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-amber-900/90 text-amber-100 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs">
                {wig.length} • {wig.texture}
              </span>
              <span className="bg-white/95 text-stone-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                {wig.hairType}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs text-stone-300 block">Wig Price</span>
              <span className="font-serif text-3xl font-bold text-amber-300">
                {formatCurrency(wig.price, wig.currency)}
              </span>
            </div>
          </div>

          {/* Right Column: Complete Specs, Quality & Care */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              
              {/* Header Title & Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      wig.availabilityStatus === 'In stock'
                        ? 'bg-emerald-100 text-emerald-800'
                        : wig.availabilityStatus === 'Only 2 left'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Status: {wig.availabilityStatus}</span>
                  </span>

                  <button
                    onClick={handleShare}
                    className="text-stone-400 hover:text-stone-700 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Link Copied' : 'Share'}</span>
                  </button>
                </div>

                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  {wig.name}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {wig.description}
                </p>
              </div>

              {/* Specifications Matrix */}
              <div className="bg-stone-50 rounded-2xl border border-stone-200/90 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Wig Specifications &amp; Construction</span>
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Length</span>
                    <span className="font-semibold text-stone-800">{wig.length}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Texture</span>
                    <span className="font-semibold text-stone-800">{wig.texture}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Hair Density</span>
                    <span className="font-semibold text-stone-800">{wig.density} (Full Volume)</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Hair Colour</span>
                    <span className="font-semibold text-stone-800">{wig.colour}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-400 block text-[10px] uppercase">Cap Size &amp; Band</span>
                    <span className="font-semibold text-stone-800">{wig.capSize}</span>
                  </div>
                </div>

                {/* Quality / Lace specs */}
                <div className="pt-2.5 border-t border-stone-200 text-xs">
                  <span className="text-stone-400 block text-[10px] uppercase mb-0.5">Quality &amp; Lace Specs</span>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {wig.qualitySpecs}
                  </p>
                </div>
              </div>

              {/* Care Instructions Box */}
              <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <Droplets className="w-3.5 h-3.5 text-amber-800" />
                  <span>Care &amp; Maintenance Instructions:</span>
                </div>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  {wig.careInstructions}
                </p>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-stone-200 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onClose();
                    onBookInstall(wig);
                  }}
                  className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-amber-900 text-amber-100 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Book Custom Installation</span>
                </button>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask: Is This Wig Available?</span>
                </a>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onToggleCompare?.(wig, 'wig')}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    inCompare
                      ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-stone-500" />
                  <span>{inCompare ? '✓ In Compare Table' : '+ Add to Compare (Side-by-Side)'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onAskQuestion?.(wig);
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                >
                  Send Inquiry Message
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
