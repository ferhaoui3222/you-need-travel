import { useTranslation } from 'react-i18next';

export default function CookiePolicy() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Cookie Policy</h1>
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <p className="text-lg font-medium">Last updated: March 28, 2026</p>
          <p>This Cookie Policy explains how You Need Travel uses cookies and similar technologies to recognize you when you visit our website.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">1. What are Cookies?</h2>
          <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide reporting information.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">2. Why do we use Cookies?</h2>
          <p>We use cookies to enhance your browsing experience, remember your preferences, analyze our website traffic, and provide personalized content and advertisements.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">3. Types of Cookies we use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
            <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website.</li>
            <li><strong>Functional Cookies:</strong> Remember your choices and provide enhanced features.</li>
            <li><strong>Targeting Cookies:</strong> Used to deliver relevant advertisements to you.</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 pt-6">4. How can you control Cookies?</h2>
          <p>You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website, though your access to some functionality may be restricted.</p>
        </div>
      </div>
    </div>
  );
}
