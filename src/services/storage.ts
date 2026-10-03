import { Hairstyle, Wig, Booking, CustomerMessage, SalonSettings } from '../types';
import { initialHairstyles, initialWigs, initialBookings, initialMessages, initialSalonSettings } from '../data/initialData';

const STORAGE_KEYS = {
  HAIRSTYLES: 'crown_hairstyles_v1',
  WIGS: 'crown_wigs_v1',
  BOOKINGS: 'crown_bookings_v1',
  MESSAGES: 'crown_messages_v1',
  SETTINGS: 'crown_settings_v1',
  CURRENCY: 'crown_selected_currency_v1',
};

export const getStoredHairstyles = (): Hairstyle[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HAIRSTYLES);
    return data ? JSON.parse(data) : initialHairstyles;
  } catch (e) {
    console.error('Failed to load hairstyles from storage', e);
    return initialHairstyles;
  }
};

export const saveStoredHairstyles = (hairstyles: Hairstyle[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.HAIRSTYLES, JSON.stringify(hairstyles));
  } catch (e) {
    console.error('Failed to save hairstyles', e);
  }
};

export const getStoredWigs = (): Wig[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WIGS);
    return data ? JSON.parse(data) : initialWigs;
  } catch (e) {
    console.error('Failed to load wigs from storage', e);
    return initialWigs;
  }
};

export const saveStoredWigs = (wigs: Wig[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WIGS, JSON.stringify(wigs));
  } catch (e) {
    console.error('Failed to save wigs', e);
  }
};

export const getStoredBookings = (): Booking[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : initialBookings;
  } catch (e) {
    console.error('Failed to load bookings', e);
    return initialBookings;
  }
};

export const saveStoredBookings = (bookings: Booking[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save bookings', e);
  }
};

export const getStoredMessages = (): CustomerMessage[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return data ? JSON.parse(data) : initialMessages;
  } catch (e) {
    console.error('Failed to load messages', e);
    return initialMessages;
  }
};

export const saveStoredMessages = (messages: CustomerMessage[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save messages', e);
  }
};

export const getStoredSettings = (): SalonSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : initialSalonSettings;
  } catch (e) {
    console.error('Failed to load settings', e);
    return initialSalonSettings;
  }
};

export const saveStoredSettings = (settings: SalonSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

export const resetToInitialDefaults = () => {
  localStorage.setItem(STORAGE_KEYS.HAIRSTYLES, JSON.stringify(initialHairstyles));
  localStorage.setItem(STORAGE_KEYS.WIGS, JSON.stringify(initialWigs));
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(initialBookings));
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initialMessages));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSalonSettings));
};

export const resetToDefaults = resetToInitialDefaults;
