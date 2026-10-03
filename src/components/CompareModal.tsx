import React from 'react';
import { X, Layers, Trash2, Calendar, MessageCircle, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { Hairstyle, Wig, SalonSettings } from '../types';
import { formatCurrency, createWhatsAppLink } from '../utils/formatters';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareItems: Array<{ item: Hairstyle | Wig; type: 'hairstyle' | 'wig' }>;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onBookItem: (type: 'hairstyle' | 'wig_install' | 'wig_purchase', item: Hairstyle | Wig) => void;
  settings: SalonSettings;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  compareItems,
  onRemoveItem,
  onClearAll,
  onBookItem,
  settings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-950/75 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Compare Styles &amp; Wigs Side-by-Side
              </h2>
              <p className="text-xs text-stone-500">
                Compare prices, lengths, textures, materials, and availability before deciding.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareItems.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Comparison</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-x-auto flex-1">
          {compareItems.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  No items added to comparison yet
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Browse the Hairstyle catalogue or Wig shop and click the <strong>"Compare"</strong> button on any 2 to 4 items to view them side-by-side!
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-amber-900 transition-colors cursor-pointer"
              >
                Browse Catalogue Now
              </button>
            </div>
          ) : (
            <div className="min-w-[650px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 w-40 text-xs font-bold uppercase tracking-wider text-stone-400 border-b border-stone-200 bg-stone-50/50">
                      Attributes
                    </th>
                    {compareItems.map(({ item, type }) => (
                      <th
                        key={item.id}
                        className="p-3 border-b border-stone-200 bg-stone-50/50 min-w-[200px]"
                      >
                        <div className="relative group">
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="absolute top-0 right-0 p-1 rounded-full bg-stone-200 hover:bg-red-500 hover:text-white text-stone-600 transition-colors cursor-pointer"
                            title="Remove from compare"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-36 object-cover rounded-xl border border-stone-200 mb-2"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                            {type === 'wig' ? 'Wig' : 'Hairstyle'}
                          </span>
                          <h4 className="font-serif font-bold text-sm text-stone-900 mt-1 line-clamp-1">
                            {item.name}
                          </h4>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-xs text-stone-800">
                  
                  {/* Row: Price */}
                  <tr className="hover:bg-stone-50/60">
                    <td className="p-3 font-bold text-stone-500 bg-stone-50/30">
                      Price
                    </td>
                    {compareItems.map(({ item }) => (
                      <td key={item.id} className="p-3 font-serif font-bold text-base text-amber-950">
                        {formatCurrency(item.price, item.currency)}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Length / Length Option */}
                  <tr className="hover:bg-stone-50/60">
                    <td className="p-3 font-bold text-stone-500 bg-stone-50/30">
                      Length
                    </td>
                    {compareItems.map(({ item, type }) => (
                      <td key={item.id} className="p-3 font-semibold text-stone-900">
                        {type === 'wig' 
                          ? (item as Wig).length 
                          : (item as Hairstyle).lengthOption || 'Mid-back / standard'}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Texture / Style Type */}
                  <tr className="hover:bg-stone-50/60">
                    <td className="p-3 font-bold text-stone-500 bg-stone-50/30">
                      Texture / Category
                    </td>
                    {compareItems.map(({ item, type }) => (
                      <td key={item.id} className="p-3">
                        <span className="bg-stone-100 px-2 py-1 rounded font-medium text-stone-800">
                          {type === 'wig' ? (item as Wig).texture : (item as Hairstyle).category}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Hair Type / Hair Material Required */}
                  <tr className="hover:bg-stone-50/60">
                    <td className="p-3 font-bold text-stone-500 bg-stone-50/30">
                      Hair Type / Material
                    </td>
                    {compareItems.map(({ item, type }) => (
                      <td key={item.id} className="p-3 text-stone-600 leading-relaxed">
                        {type === 'wig' ? (item as Wig).hairType : (item as Hairstyle).hairMaterialRequired}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Colour */}
                  <tr className="hover:bg-stone-50/60">
                    <td className="p-3 font-bold text-stone-500 bg-stone-50/30">
                      Colour(s)
                    </td>
                    {compareItems.map(({ item, type }) => (
                      <td key={item.id} className="p-3">
                        {type === 'wig' ? (
                          <span className="font-medium text-stone-800">{(item as Wig).colour}</span>
                        ) : (
                          <span className="font-medium text-stone-800">
                            {(item as Hairstyle).availableColours.slice(0, 2).join(', ')}...
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Density or Estimated Time */}
                  <tr className="hover:bg-stone-50/60">
                    <td className="p-3 font-bold text-stone-500 bg-stone-50/30">
                      Density / Duration
                    </td>
                    {compareItems.map(({ item, type }) => (
                      <td key={item.id} className="p-3 font-medium text-stone-700">
                        {type === 'wig' 
                          ? `${(item as Wig).density} density` 
                          : `${(item as Hairstyle).estimatedDuration} install time`}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Cap size or Parting */}
                  <tr className="hover:bg-stone-50/60">
                    <td className="p-3 font-bold text-stone-500 bg-stone-50/30">
                      Cap / Construction
                    </td>
                    {compareItems.map(({ item, type }) => (
                      <td key={item.id} className="p-3 text-stone-600">
                        {type === 'wig' 
                          ? (item as Wig).capSize 
                          : 'Custom tailored foundation'}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Availability */}
                  <tr className="hover:bg-stone-50/60">
                    <td className="p-3 font-bold text-stone-500 bg-stone-50/30">
                      Availability
                    </td>
                    {compareItems.map(({ item, type }) => {
                      const isAvail = type === 'wig' ? (item as Wig).isAvailable : (item as Hairstyle).isAvailable;
                      const statusText = type === 'wig' ? (item as Wig).availabilityStatus : (isAvail ? 'Available' : 'Fully Booked');
                      return (
                        <td key={item.id} className="p-3">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              isAvail
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{statusText}</span>
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Action CTAs */}
                  <tr>
                    <td className="p-3 bg-stone-50/30 font-bold text-stone-500">
                      Direct Action
                    </td>
                    {compareItems.map(({ item, type }) => {
                      const whatsappLink = 'https://wa.link/ufocc9';
                      return (
                        <td key={item.id} className="p-3 space-y-2">
                          <button
                            onClick={() => {
                              onClose();
                              onBookItem(type === 'wig' ? 'wig_install' : 'hairstyle', item);
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-amber-900 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            <span>Book Now</span>
                          </button>

                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1.5 px-3 rounded-xl border border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Inquire</span>
                          </a>
                        </td>
                      );
                    })}
                  </tr>

                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <span>
            {compareItems.length} of 4 maximum items compared.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
