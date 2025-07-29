import React, { createContext, useContext, useState } from 'react';
import { getCurrentLanguage, setCurrentLanguage, t } from './i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLang] = useState(getCurrentLanguage());

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    setCurrentLang(langCode);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};