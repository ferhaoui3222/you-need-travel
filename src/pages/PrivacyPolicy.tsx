import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <p className="text-lg font-medium">Last updated: March 28, 2026</p>
          <p>At You Need Travel, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">1. Information We Collect</h2>
          <p>We collect information that you provide to us directly, such as your name, email address, phone number, and payment details when you make a booking or register as an agent or supplier.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">2. How We Use Your Information</h2>
          <p>We use your information to process your bookings, manage your account, provide customer support, and send you updates about our services and special offers.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or modification.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">4. Third-Party Sharing</h2>
          <p>We may share your information with our trusted partners, such as hotels, airlines, and tour operators, to fulfill your travel requests.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information at any time. Please contact us if you wish to exercise these rights.</p>
        </div>
      </div>
    </div>
  );
}
