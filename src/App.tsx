import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Stays from './pages/Stays';
import Tours from './pages/Tours';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import About from './pages/About';
import AgentLogin from './pages/AgentLogin';
import AgentRegister from './pages/AgentRegister';
import AgentDashboard from './pages/AgentDashboard';
import SupplierRegister from './pages/SupplierRegister';
import SupplierLogin from './pages/SupplierLogin';
import SupplierDashboard from './pages/SupplierDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import CookiePolicy from './pages/CookiePolicy';

import { AuthProvider, AdminGuard, AgencyGuard } from './components/Auth/AuthGuard';
import AdminDashboard from './components/Admin/AdminDashboard';
import AgencyDashboard from './components/Agency/AgencyDashboard';

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <AuthProvider>
      <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stays" element={<Stays />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/agent/login" element={<AgentLogin />} />
            <Route path="/agent/register" element={<AgentRegister />} />
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/supplier/register" element={<SupplierRegister />} />
            <Route path="/supplier/login" element={<SupplierLogin />} />
            <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route 
              path="/admin" 
              element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              } 
            />
            <Route 
              path="/agency" 
              element={
                <AgencyGuard>
                  <AgencyDashboard />
                </AgencyGuard>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
      </Router>
    </AuthProvider>
  );
}
