export const formatCurrency = (amount: number, currency: string = 'GH₵'): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${currency} ${formatted}`;
};

export const createWhatsAppLink = (phone: string, text: string): string => {
  // strip non-numeric
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
};

export const generateBookingId = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `BK-${randomNum}`;
};

export const generateMessageId = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MSG-${randomNum}`;
};
