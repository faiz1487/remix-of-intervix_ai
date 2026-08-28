export interface CookieConsent {
  version: number;
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  updatedAt: string;
}

export const CONSENT_VERSION = 1;
const STORAGE_KEY = "intervixa.cookie-consent";
const EVENT = "intervixa:cookie-consent";

export const readConsent = (): CookieConsent | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;
    if (parsed?.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const writeConsent = (choice: { preferences: boolean; analytics: boolean }) => {
  const value: CookieConsent = {
    version: CONSENT_VERSION,
    necessary: true,
    preferences: choice.preferences,
    analytics: choice.analytics,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable — consent simply isn't persisted */
  }
  window.dispatchEvent(new CustomEvent<CookieConsent>(EVENT, { detail: value }));
  return value;
};

/** Reopen the preferences dialog from anywhere (e.g. the footer link). */
export const openCookiePreferences = () => {
  window.dispatchEvent(new CustomEvent("intervixa:cookie-preferences"));
};

export const subscribeConsent = (cb: (c: CookieConsent) => void) => {
  const handler = (e: Event) => cb((e as CustomEvent<CookieConsent>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
};
