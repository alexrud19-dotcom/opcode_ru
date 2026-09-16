import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "./locales/ru.json";
import en from "./locales/en.json";

export const SUPPORTED_LANGUAGES = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "ru";
const STORAGE_KEY = "opcode:language";

/**
 * Reads the persisted language, falling back to the default when storage is
 * unavailable (private mode, embedded webview) or holds an unknown value.
 */
export function getStoredLanguage(): LanguageCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
      return stored as LanguageCode;
    }
  } catch {
    // Non-fatal: fall through to the default.
  }
  return DEFAULT_LANGUAGE;
}

export async function setLanguage(code: LanguageCode): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Non-fatal: the change still applies for this session.
  }
  document.documentElement.lang = code;
  await i18n.changeLanguage(code);
}

const initialLanguage = getStoredLanguage();

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: {
    // React already escapes rendered values.
    escapeValue: false,
  },
  returnNull: false,
});

document.documentElement.lang = initialLanguage;

export default i18n;
