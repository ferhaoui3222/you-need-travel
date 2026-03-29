import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Globe, User, Menu, X, Phone, Mail, Facebook, Twitter, Instagram, ChevronDown, Shield, LogOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { useAuth } from './Auth/AuthGuard';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, role, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsLangOpen(false);
  };

  const navLinks = [
    { name: t('Home'), path: '/' },
    { name: t('Stays'), path: '/stays' },
  ];

  const services = [
    { name: t('Tours'), path: '/tours' },
    { name: t('Blog'), path: '/blog' },
    { name: t('About Us'), path: '/about' },
    { name: t('Contact Us'), path: '/contact' },
  ];

  const partners = [
    { name: t('Agent Login'), path: '/agent/login' },
    { name: t('Agent Register'), path: '/agent/register' },
    { name: t('Supplier Login'), path: '/supplier/login' },
    { name: t('Supplier Register'), path: '/supplier/register' },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="hidden lg:block bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs font-bold">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>+60 12-345 6789</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>info@youneedtravel.com</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-blue-400 transition-colors">Facebook</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Instagram</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              Y
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 leading-tight">You Need Travel</span>
              <span className="text-xs text-blue-600 font-medium tracking-wide uppercase">Travel the way you love!</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative group" onMouseEnter={() => setIsServicesOpen(true)} onMouseLeave={() => setIsServicesOpen(false)}>
              <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition-colors py-8">
                {t('Services')}
                <ChevronDown className="w-4 h-4" />
              </button>
              {isServicesOpen && (
                <div className="absolute top-full left-0 w-48 bg-white border rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {services.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Partners Dropdown */}
            <div className="relative group" onMouseEnter={() => setIsPartnersOpen(true)} onMouseLeave={() => setIsPartnersOpen(false)}>
              <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition-colors py-8">
                {t('Partners')}
                <ChevronDown className="w-4 h-4" />
              </button>
              {isPartnersOpen && (
                <div className="absolute top-full left-0 w-56 bg-white border rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {partners.map((partner) => (
                    <Link
                      key={partner.path}
                      to={partner.path}
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {partner.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold transition-colors"
              >
                <Shield className="w-4 h-4" />
                {t('Admin')}
              </Link>
            )}

            {(role === 'agency' || role === 'admin') && (
              <Link
                to="/agency"
                className="flex items-center gap-1 text-green-600 hover:text-green-700 font-bold transition-colors"
              >
                <User className="w-4 h-4" />
                {t('Agency Dashboard')}
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                <Globe className="w-5 h-5" />
                <span className="uppercase font-semibold text-sm">{i18n.language}</span>
              </button>
              {isLangOpen && (
                <div className={cn(
                  "absolute mt-2 w-48 bg-white border rounded-xl shadow-xl py-2 z-50",
                  i18n.language === 'ar' ? "left-0" : "right-0"
                )}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth */}
            <div className="flex items-center gap-2 border-l pl-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-gray-900 truncate max-w-[120px]">{user.email}</span>
                    <span className="text-[10px] text-blue-600 font-bold uppercase">{role}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  {t('Login')}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="p-2 text-gray-600"
            >
              <Globe className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4 space-y-6 shadow-xl animate-in slide-in-from-top duration-300 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Main Menu')}</p>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium text-gray-800 hover:text-blue-600 py-2"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Services')}</p>
            {services.map((service) => (
              <Link
                key={service.path}
                to={service.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium text-gray-800 hover:text-blue-600 py-2"
              >
                {service.name}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('Partners')}</p>
            {partners.map((partner) => (
              <Link
                key={partner.path}
                to={partner.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium text-gray-800 hover:text-blue-600 py-2"
              >
                {partner.name}
              </Link>
            ))}
            {(role === 'agency' || role === 'admin') && (
              <Link
                to="/agency"
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-bold text-green-600 hover:text-green-700 py-2"
              >
                {t('Agency Dashboard')}
              </Link>
            )}
            {role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-bold text-blue-600 hover:text-blue-700 py-2"
              >
                {t('Admin Dashboard')}
              </Link>
            )}
          </div>

          <div className="pt-4 border-t flex flex-col gap-3">
            <Link
              to="/agent/login"
              onClick={() => setIsMenuOpen(false)}
              className="text-center py-3 font-bold text-white bg-blue-600 rounded-xl"
            >
              {t('Login')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
