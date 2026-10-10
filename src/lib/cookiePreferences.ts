export type CookieChoice = 'all' | 'necessary';

export interface CookiePreferences {
  version: 1;
  choice: CookieChoice;
  savedAt: string;
}

export const COOKIE_PREFERENCES_KEY = 'montserrat-cookie-preferences-v1';
export const COOKIE_PREFERENCES_EVENT = 'montserrat-cookie-preferences-changed';
export const OPEN_COOKIE_PREFERENCES_EVENT = 'montserrat-open-cookie-preferences';

export function readCookiePreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<CookiePreferences>;
    if (value.version !== 1 || (value.choice !== 'all' && value.choice !== 'necessary')) return null;
    return value as CookiePreferences;
  } catch {
    return null;
  }
}

export function saveCookiePreferences(choice: CookieChoice): CookiePreferences {
  const preferences: CookiePreferences = { version: 1, choice, savedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // Keep the selection for the current page even if the browser blocks local storage.
  }
  window.dispatchEvent(new CustomEvent<CookiePreferences>(COOKIE_PREFERENCES_EVENT, { detail: preferences }));
  return preferences;
}

export function allowsExternalImages(): boolean {
  return readCookiePreferences()?.choice === 'all';
}
