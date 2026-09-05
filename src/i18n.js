// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

// import enTranslation from '../public/locales/en.json';
// import bnTranslation from '../public/locales/bn.json';

// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources: {
//       en: { translation: enTranslation },
//       bn: { translation: bnTranslation },
//     },
//     fallbackLng: 'en',
//     interpolation: { escapeValue: false },
//   });

// export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    backend: {
      // public ফোল্ডার অটোমেটিক রুট (/) হিসেবে কাজ করে
      loadPath: '/locales/{{lng}}.json',
    },
  });

export default i18n;
