import { useTranslation } from 'react-i18next';

export default function TermsOfUse() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Terms of Use</h1>
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <p className="text-lg font-medium">Last updated: March 28, 2026</p>
          <p>Welcome to You Need Travel. By using our website and services, you agree to comply with and be bound by the following terms and conditions.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">1. Acceptance of Terms</h2>
          <p>By accessing or using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">2. Use of Services</h2>
          <p>You agree to use our services only for lawful purposes and in accordance with these terms. You are responsible for maintaining the confidentiality of your account information.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">3. Bookings and Payments</h2>
          <p>All bookings are subject to availability and confirmation. Payments must be made in full at the time of booking unless otherwise specified.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">4. Cancellations and Refunds</h2>
          <p>Cancellation policies vary by service provider. Please review the specific terms for each booking before confirming.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">5. Limitation of Liability</h2>
          <p>You Need Travel is not liable for any direct, indirect, or consequential damages arising from your use of our platform or services.</p>
        </div>
      </div>
    </div>
  );
}
