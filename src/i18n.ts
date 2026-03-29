import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "Home": "Home",
      "Stays": "Stays",
      "Tours": "Tours",
      "Blog": "Blog",
      "Contact Us": "Contact Us",
      "About Us": "About Us",
      "Agent Login": "Agent Login",
      "Supplier Login": "Supplier Login",
      "Search": "Search",
      "Travel the way you love!": "Travel the way you love!",
      "Language": "Language",
      "Agency Dashboard": "Agency Dashboard",
      "Admin": "Admin",
      "Admin Dashboard": "Admin Dashboard"
    }
  },
  ar: {
    translation: {
      "Home": "الرئيسية",
      "Stays": "الإقامة",
      "Tours": "الجولات",
      "Blog": "المدونة",
      "Contact Us": "اتصل بنا",
      "About Us": "من نحن",
      "Agent Login": "دخول الوكيل",
      "Supplier Login": "دخول المورد",
      "Search": "بحث",
      "Travel the way you love!": "سافر بالطريقة التي تحبها!",
      "Language": "اللغة",
      "Agency Dashboard": "لوحة الوكيل",
      "Admin": "المدير",
      "Admin Dashboard": "لوحة المدير"
    }
  },
  ms: {
    translation: {
      "Home": "Utama",
      "Stays": "Penginapan",
      "Tours": "Lawatan",
      "Blog": "Blog",
      "Contact Us": "Hubungi Kami",
      "About Us": "Tentang Kami",
      "Agent Login": "Log Masuk Ejen",
      "Supplier Login": "Log Masuk Pembekal",
      "Search": "Cari",
      "Travel the way you love!": "Melancong mengikut citarasa anda!",
      "Language": "Bahasa",
      "Agency Dashboard": "Papan Pemuka Ejen",
      "Admin": "Admin",
      "Admin Dashboard": "Papan Pemuka Admin"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
