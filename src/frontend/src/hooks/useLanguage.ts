import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../backend';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  hasSelectedLanguage: boolean;
  markLanguageSelected: () => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      language: Language.hindi,
      hasSelectedLanguage: false,
      setLanguage: (language: Language) => set({ language }),
      markLanguageSelected: () => set({ hasSelectedLanguage: true }),
    }),
    {
      name: 'as19-language-preference',
    }
  )
);
