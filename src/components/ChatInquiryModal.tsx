import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { CustomerMessage, SalonSettings, Hairstyle, Wig } from '../types';
import { generateMessageId, createWhatsAppLink } from '../utils/formatters';

interface ChatInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SalonSettings;
  subjectItem?: { type: 'hairstyle' | 'wig'; item: Hairstyle | Wig } | null;
  onSendMessage: (msg: CustomerMessage) => void;
}

const PRESET_QUESTIONS = [
  'Is this wig available for immediate purchase?',
  'How much is installation if I bring my own wig?',
  'Do you have this hairstyle in another colour?',
  'Can I book this hairstyle for Saturday morning?',
  'Do you provide the hair extensions or do I bring mine?',
];

export const ChatInquiryModal: React.FC<ChatInquiryModalProps> = ({
  isOpen,
  onClose,
  settings,
  subjectItem,
  onSendMessage,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [contact, setContact] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [message, setMessage] = useState(
    subjectItem
      ? `Hello, I'm inquiring about "${subjectItem.item.name}". Is it available and how do I schedule?`
      : ''
  );
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (q: string) => {
    setMessage(q);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !contact.trim() || !message.trim()) return;

    const newMsg: CustomerMessage = {
      id: generateMessageId(),
      customerName: customerName.trim(),
      contact: contact.trim(),
      channel,
      subjectItemType: subjectItem?.type,
      subjectItemId: subjectItem?.item.id,
      subjectItemName: subjectItem?.item.name,
      message: message.trim(),
      replyStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    onSendMessage(newMsg);
    setSubmitted(true);
  };

  const directWhatsAppUrl = 'https://wa.link/ufocc9';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-950/75 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800 text-amber-200 flex items-center justify-center shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Chat With Us / Ask a Question
              </h2>
              <p className="text-xs text-stone-500">
                Direct inquiry desk with salon owner &amp; senior stylists
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

        {/* Content */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto space-y-6">
          
          {submitted ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Message Sent to Salon!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-sm mx-auto">
                  Thank you, <strong>{customerName}</strong>. Your inquiry has been delivered directly to the salon desk. We typically respond within 15–30 minutes via {channel}.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Also Open on WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Preset Quick Questions Requested in Prompt */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                  Quick Questions (Click to Fill):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(q)}
                      className="text-[11px] bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-950 px-2.5 py-1 rounded-full border border-stone-200 transition-colors text-left cursor-pointer"
                    >
                      "{q}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject item if inquiry initiated from specific style/wig */}
              {subjectItem && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-3">
                  <img
                    src={subjectItem.item.imageUrl}
                    alt={subjectItem.item.name}
                    className="w-10 h-10 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-xs">
                    <span className="text-stone-400 uppercase tracking-wider text-[10px] block">
                      Inquiring About {subjectItem.type}:
                    </span>
                    <span className="font-bold text-stone-900">{subjectItem.item.name}</span>
                  </div>
                </div>
              )}

              {/* Message text area */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 block">
                  Your Question or Message *
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your question here (e.g. availability, booking dates, colours)..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jessica Mensah"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +233 24 123 4567"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                  />
                </div>
              </div>

              {/* Preferred Channel */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  How should we reply to you?
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`py-2 px-3 rounded-lg border font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                      channel === 'whatsapp'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('phone')}
                    className={`py-2 px-3 rounded-lg border font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                      channel === 'phone'
                        ? 'bg-amber-50 border-amber-400 text-amber-900 font-semibold'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-800" />
                    <span>Phone Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`py-2 px-3 rounded-lg border font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                      channel === 'email'
                        ? 'bg-stone-100 border-stone-400 text-stone-900 font-semibold'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-stone-600" />
                    <span>Email</span>
                  </button>
                </div>
              </div>

              {/* Submission & Instant WhatsApp Action */}
              <div className="pt-3 border-t border-stone-200 space-y-2.5">
                <button
                  type="submit"
                  disabled={!customerName || !contact || !message}
                  className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Send Question to Salon Desk</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-stone-200" />
                  <span className="flex-shrink mx-3 text-stone-400 text-[11px] uppercase">Or Instant WhatsApp</span>
                  <div className="flex-grow border-t border-stone-200" />
                </div>

                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Directly with Hairdresser on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </form>
          )}

          {/* Salon Direct Contact Footnote */}
          <div className="pt-2 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-500">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-stone-400" />
              <span>Call: {settings.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>{settings.openingHours.split('|')[0]}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
