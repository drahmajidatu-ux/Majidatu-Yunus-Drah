export const formatCurrency = (amount: number, currency: string = 'GH₵'): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${currency} ${formatted}`;
};

export const CROWN_WHATSAPP_LINK = 'https://wa.link/ufocc9';

export const createWhatsAppLink = (_phone?: string, _text?: string): string => {
  return CROWN_WHATSAPP_LINK;
};

export const generateBookingId = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `BK-${randomNum}`;
};

export const generateMessageId = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MSG-${randomNum}`;
};
