import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Settings, LogOut, User, PlusCircle } from 'lucide-react';
import { useState } from 'react';

export default function SupplierDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { label: 'Active Listings', value: '12', icon: Package, color: 'bg-green-500' },
    { label: 'Total Bookings', value: '85', icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Revenue', value: '$28,450', icon: BarChart3, color: 'bg-purple-500' },
    { label: 'Avg. Rating', value: '4.8', icon: Settings, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
      {/* Add Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Add New Service Listing</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Service Name</label>
                  <input type="text" placeholder="e.g. Deluxe Suite" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Service Type</label>
                  <select className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium">
                    <option>Hotel Room</option>
                    <option>Tour Package</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Base Price ($)</label>
                  <input type="number" placeholder="0.00" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Location</label>
                  <input type="text" placeholder="City, Country" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Description</label>
                <textarea placeholder="Describe your service..." className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium h-32" />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-grow py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all">Cancel</button>
                <button className="flex-grow py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200">Create Listing</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl hidden lg:block">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <div>
              <p className="font-bold text-gray-900">Supplier Portal</p>
              <p className="text-xs text-gray-500">Verified Partner</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'listings', label: 'My Listings', icon: Package },
            { id: 'bookings', label: 'Bookings', icon: ShoppingBag },
            { id: 'reports', label: 'Revenue Reports', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === item.id ? 'bg-green-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'
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
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Supplier!</h1>
            <p className="text-gray-500">Manage your travel services and track your performance.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-green-700 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              Add New Listing
            </button>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <span className="font-bold text-gray-700">Grand Hyatt KL</span>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
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

        {/* Listings Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
            <button className="text-green-600 font-bold text-sm hover:underline">Manage All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Listing Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'Deluxe Suite KLCC View', type: 'Hotel Room', price: '$250', status: 'Active', views: '1,240' },
                  { name: 'Family Room Garden View', type: 'Hotel Room', price: '$180', status: 'Active', views: '850' },
                  { name: 'Executive Lounge Access', type: 'Service', price: '$50', status: 'Inactive', views: '320' },
                ].map((listing) => (
                  <tr key={listing.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{listing.name}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{listing.type}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold">{listing.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        listing.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{listing.views}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 font-bold hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
