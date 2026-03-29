import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                Y
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">You Need Travel</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              {t('Travel the way you love!')} Your ultimate partner for exploring Malaysia and beyond. We provide seamless booking experiences for stays and tours.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">{t('Explore')}</h3>
            <ul className="space-y-4">
              <li><Link to="/stays" className="hover:text-blue-500 transition-colors">{t('Hotels')}</Link></li>
              <li><Link to="/tours" className="hover:text-blue-500 transition-colors">{t('Tours')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">{t('Company')}</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="hover:text-blue-500 transition-colors">{t('About Us')}</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 transition-colors">{t('Contact Us')}</Link></li>
              <li><Link to="/blog" className="hover:text-blue-500 transition-colors">{t('Blog')}</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-500 transition-colors">{t('Privacy Policy')}</Link></li>
              <li><Link to="/terms" className="hover:text-blue-500 transition-colors">{t('Terms of Use')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">{t('Contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Kuala Lumpur, Malaysia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span>+60 12-345 6789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span>info@youneedtravel.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">{t('Newsletter')}</h3>
            <p className="text-gray-400 mb-6 text-sm">Subscribe to get the latest travel news and special offers.</p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border-none focus:ring-2 focus:ring-blue-600 text-white placeholder-gray-500"
              />
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} You Need Travel. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/supplier/register" className="hover:text-white transition-colors">{t('Become a Supplier')}</Link>
            <Link to="/agent/register" className="hover:text-white transition-colors">{t('Agent Registration')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
