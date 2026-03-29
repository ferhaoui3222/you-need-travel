import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FileText, BarChart3, Settings, LogOut, User, DollarSign, Package, Search } from 'lucide-react';
import { useState } from 'react';

export default function AgentDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Bookings', value: '124', icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Total Sales', value: '$45,230', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Commission Earned', value: '$4,523', icon: BarChart3, color: 'bg-purple-500' },
    { label: 'Pending Reports', value: '3', icon: FileText, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl hidden lg:block">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <div>
              <p className="font-bold text-gray-900">Agent Portal</p>
              <p className="text-xs text-gray-500">Premium Partner</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'packages', label: 'Browse Packages', icon: Package },
            { id: 'bookings', label: 'My Bookings', icon: ShoppingBag },
            { id: 'reports', label: 'Reports', icon: BarChart3 },
            { id: 'markup', label: 'Markup Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-all mt-10">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Agent!</h1>
            <p className="text-gray-500">Here's what's happening with your agency today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-white p-2 rounded-full shadow-sm border">
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <span className="font-bold text-gray-700">John Doe</span>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4">Booking ID</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { id: '#BK-9021', service: 'Grand Hyatt KL', customer: 'Ahmed Ali', date: 'Mar 24, 2026', status: 'Confirmed', amount: '$450' },
                      { id: '#BK-9022', service: 'KL City Tour', customer: 'Sarah Tan', date: 'Mar 25, 2026', status: 'Pending', amount: '$120' },
                    ].map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-blue-600">{booking.id}</td>
                        <td className="px-6 py-4 text-gray-700 font-medium">{booking.service}</td>
                        <td className="px-6 py-4 text-gray-700">{booking.customer}</td>
                        <td className="px-6 py-4 text-gray-500">{booking.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">{booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'packages' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Browse B2B Packages</h2>
              <div className="flex gap-4">
                <select className="bg-white border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500">
                  <option>All Categories</option>
                  <option>Hotels</option>
                  <option>Tours</option>
                </select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" placeholder="Search packages..." className="pl-10 pr-4 py-2 bg-white border-none rounded-xl text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Luxury Langkawi Escape', price: 450, commission: '15%', img: 'https://picsum.photos/seed/langkawi/400/250', type: 'Package' },
                { name: 'KL City Explorer', price: 120, commission: '10%', img: 'https://picsum.photos/seed/kl/400/250', type: 'Tour' },
                { name: 'Borneo Wildlife Adventure', price: 850, commission: '12%', img: 'https://picsum.photos/seed/borneo/400/250', type: 'Package' },
                { name: 'Penang Foodie Trail', price: 85, commission: '8%', img: 'https://picsum.photos/seed/penang/400/250', type: 'Tour' },
                { name: 'Genting Highlands Getaway', price: 220, commission: '10%', img: 'https://picsum.photos/seed/genting/400/250', type: 'Package' },
                { name: 'Malacca Heritage Walk', price: 65, commission: '10%', img: 'https://picsum.photos/seed/malacca/400/250', type: 'Tour' },
              ].map((pkg, idx) => (
                <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img src={pkg.img} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {pkg.commission} Commission
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-blue-600 uppercase mb-1">{pkg.type}</p>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{pkg.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Net Price</p>
                        <p className="text-xl font-black text-gray-900">${pkg.price}</p>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
                        Sell Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'markup' && (
          <div className="max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Global Markup Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Default Markup (%)</label>
                <input type="number" defaultValue="10" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-bold" />
                <p className="text-xs text-gray-500 mt-2">This percentage will be added to the base price of all packages.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Hotel Markup (%)</label>
                  <input type="number" defaultValue="12" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 font-bold" />
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg">Save Settings</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
