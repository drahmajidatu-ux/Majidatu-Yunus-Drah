export type HairstyleCategory =
  | 'All'
  | 'Braids'
  | 'Ghana weaving'
  | 'Cornrows'
  | 'Knotless braids'
  | 'Twists'
  | 'Natural hairstyles'
  | 'Locs'
  | 'Wig installation'
  | 'Hair extensions'
  | 'Other hairstyles';

export interface Hairstyle {
  id: string;
  name: string;
  category: Exclude<HairstyleCategory, 'All'>;
  price: number;
  currency: string;
  estimatedDuration: string;
  availableColours: string[];
  hairMaterialRequired: string;
  description: string;
  isAvailable: boolean;
  imageUrl: string;
  isTrending?: boolean;
  difficultyOrNotes?: string;
  lengthOption?: string;
}

export interface Wig {
  id: string;
  name: string;
  price: number;
  currency: string;
  length: string; // e.g., "18\"", "22\"", "26\""
  texture: 'Straight' | 'Body wave' | 'Deep curl' | 'Water wave' | 'Kinky straight' | 'Pixie cut' | 'Loose wave';
  hairType: '100% Virgin Human Hair' | 'Raw Cambodian Hair' | 'HD Lace Frontal' | 'Glueless Closure' | 'Premium Blend';
  colour: string;
  density: string; // e.g. "150%", "180%", "200%", "250%"
  capSize: string; // e.g. "Medium (22-22.5\"), adjustable straps"
  availabilityStatus: 'In stock' | 'Only 2 left' | 'Pre-order' | 'Sold out';
  isAvailable: boolean;
  description: string;
  careInstructions: string;
  qualitySpecs: string;
  imageUrl: string;
  isTrending?: boolean;
}

export interface Booking {
  id: string;
  serviceType: 'hairstyle' | 'wig_purchase' | 'wig_install';
  serviceId: string;
  serviceName: string;
  price: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  timeSlot: string;
  hairColourChosen?: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CustomerMessage {
  id: string;
  customerName: string;
  contact: string;
  channel: 'whatsapp' | 'phone' | 'email';
  subjectItemType?: 'hairstyle' | 'wig' | 'general';
  subjectItemId?: string;
  subjectItemName?: string;
  message: string;
  replyStatus: 'pending' | 'answered';
  salonReply?: string;
  createdAt: string;
}

export interface SalonSettings {
  salonName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  openingHours: string;
  currency: string;
  instagramHandle: string;
  adminPin: string;
}
