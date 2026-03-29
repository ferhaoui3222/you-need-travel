import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Hotel, Map, Search, MapPin, Calendar, Users, Globe, Mail, Plus, Minus, Baby, User as UserIcon, Bed, ChevronDown, DoorOpen, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

import { Link } from 'react-router-dom';
import BookingModal from '../components/BookingModal';

const tabs = [
  { id: 'stays', label: 'Stays', icon: Hotel },
  { id: 'tours', label: 'Tours', icon: Map },
];

const DESTINATION_SUGGESTIONS = [
  'Kuala Lumpur, Malaysia',
  'Langkawi, Kedah',
  'George Town, Penang',
  'Malacca City, Malacca',
  'Kota Kinabalu, Sabah',
  'Kuching, Sarawak',
  'Ipoh, Perak',
  'Johor Bahru, Johor',
  'Genting Highlands, Pahang',
  'Cameron Highlands, Pahang',
];

const ROOM_TYPES = [
  'Standard Room',
  'Deluxe Room',
  'Executive Suite',
  'Family Suite',
  'Presidential Suite',
  'Connecting Rooms',
];

import { useAuth } from '../components/Auth/AuthGuard';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { user, role, login, agencyData } = useAuth();
  const [activeTab, setActiveTab] = useState('stays');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ name: string; price: number | string; type: string } | null>(null);

  // Booking.com Style Search State
  const [destination, setDestination] = useState('');
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [dates, setDates] = useState('');
  
  const [showOccupancyPopover, setShowOccupancyPopover] = useState(false);
  const [showRoomsPopover, setShowRoomsPopover] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState<{ id: string; type: 'child' | 'infant'; age: number; needsBed: boolean }[]>([]);
  const [rooms, setRooms] = useState<{ id: string; type: string }[]>([{ id: '1', type: 'Standard Room' }]);

  const occupancyRef = useRef<HTMLDivElement>(null);
  const roomsRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (occupancyRef.current && !occupancyRef.current.contains(event.target as Node)) setShowOccupancyPopover(false);
      if (roomsRef.current && !roomsRef.current.contains(event.target as Node)) setShowRoomsPopover(false);
      if (destRef.current && !destRef.current.contains(event.target as Node)) setShowDestSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addChild = () => {
    if (children.length < 10) {
      setChildren([...children, { id: Math.random().toString(36).substr(2, 9), type: 'child', age: 5, needsBed: false }]);
    }
  };

  const removeChild = (id: string) => {
    setChildren(children.filter(c => c.id !== id));
  };

  const updateChild = (id: string, updates: Partial<{ type: 'child' | 'infant'; age: number; needsBed: boolean }>) => {
    setChildren(children.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addRoom = () => {
    setRooms([...rooms, { id: Math.random().toString(36).substr(2, 9), type: 'Standard Room' }]);
  };

  const removeRoom = (id: string) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  const updateRoom = (id: string, type: string) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, type } : r));
  };

  const ROOM_TYPES = ['Standard Room', 'Deluxe Room', 'Suite', 'Family Room', 'Penthouse'];

  const filteredSuggestions = DESTINATION_SUGGESTIONS.filter(s => 
    s.toLowerCase().includes(destination.toLowerCase())
  );

  const handleBookNow = (item: any, type: string) => {
    setSelectedItem({ ...item, type });
    setIsModalOpen(true);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/malaysia/1920/1080"
            alt="Malaysia"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-5xl w-full px-4 text-center">
          {/* Welcome Section for Admin/Agency */}
          {user && (role === 'admin' || role === 'agency') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] inline-flex items-center gap-6 text-white"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                {role === 'admin' ? <Shield size={32} /> : <UserIcon size={32} />}
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold">مرحباً بك يا {role === 'admin' ? 'مدير الوكالة' : 'شريكنا العزيز'}!</h2>
                <p className="text-sm text-white/70">يمكنك الآن إدارة {role === 'admin' ? 'الفنادق والباقات' : 'حجوزاتك وعملائك'} من لوحة التحكم.</p>
              </div>
              <Link 
                to={role === 'admin' ? "/admin" : "/agency"}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
              >
                {role === 'admin' ? 'لوحة المدير' : 'لوحة الوكيل'}
              </Link>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg"
          >
            {t('Travel the way you love!')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-12 font-medium"
          >
            Book hotels and tours in Malaysia and worldwide.
          </motion.p>

          {/* Search Bar Container */}
          <div className="relative z-20 bg-white rounded-3xl shadow-2xl p-2 md:p-4 animate-in fade-in zoom-in duration-500">
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-6 border-b pb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all",
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{t(tab.label)}</span>
                </button>
              ))}
            </div>

            {/* Search Form */}
            <div className="mt-8 relative z-50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#febb02] p-1 rounded-xl shadow-xl relative z-50"
                >
                  {activeTab === 'stays' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 items-stretch">
                      {/* Destination */}
                      <div className="lg:col-span-4 relative" ref={destRef}>
                        <div className="h-full bg-white rounded-lg p-3 border-2 border-transparent focus-within:border-[#febb02] transition-all">
                          <div className="flex items-center gap-3">
                            <Bed className="text-gray-500 w-6 h-6 shrink-0" />
                            <input 
                              type="text" 
                              value={destination}
                              onChange={(e) => {
                                setDestination(e.target.value);
                                setShowDestSuggestions(true);
                              }}
                              onFocus={() => setShowDestSuggestions(true)}
                              placeholder="Where are you going?" 
                              className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium text-gray-900 placeholder:text-gray-500 text-sm" 
                            />
                          </div>
                        </div>
                        <AnimatePresence>
                          {showDestSuggestions && filteredSuggestions.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute z-[60] w-full mt-1 bg-white rounded-md shadow-xl border border-gray-200 overflow-hidden py-1"
                            >
                              {filteredSuggestions.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => {
                                    setDestination(s);
                                    setShowDestSuggestions(false);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-3"
                                >
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-700">{s}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Dates */}
                      <div className="lg:col-span-4">
                        <div className="h-full bg-white rounded-lg p-3 border-2 border-transparent focus-within:border-[#febb02] transition-all">
                          <div className="flex items-center gap-3">
                            <Calendar className="text-gray-500 w-6 h-6 shrink-0" />
                            <input 
                              type="text" 
                              value={dates}
                              onChange={(e) => setDates(e.target.value)}
                              placeholder="Check-in Date — Check-out Date" 
                              className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium text-gray-900 placeholder:text-gray-500 text-sm" 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Occupancy (Guests) */}
                      <div className="lg:col-span-2 relative" ref={occupancyRef}>
                        <button 
                          onClick={() => setShowOccupancyPopover(!showOccupancyPopover)}
                          className={cn(
                            "w-full h-full text-left bg-white rounded-lg p-3 border-2 border-transparent transition-all flex items-center gap-3",
                            showOccupancyPopover && "border-[#febb02]"
                          )}
                        >
                          <Users className="text-gray-500 w-6 h-6 shrink-0" />
                          <span className="font-medium text-gray-900 text-sm truncate">
                            {adults + children.length} guests
                          </span>
                        </button>
                        <AnimatePresence>
                          {showOccupancyPopover && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute z-[60] w-[350px] mt-1 bg-white rounded-md shadow-2xl border border-gray-200 p-6 right-0 lg:left-0"
                            >
                              {/* Adults */}
                              <div className="flex items-center justify-between mb-6">
                                <span className="text-sm font-bold text-gray-800">Adults</span>
                                <div className="flex items-center gap-4 border rounded-md p-1">
                                  <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 flex items-center justify-center text-blue-600 disabled:text-gray-300" disabled={adults <= 1}><Minus className="w-4 h-4" /></button>
                                  <span className="text-sm font-medium w-4 text-center">{adults}</span>
                                  <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 flex items-center justify-center text-blue-600"><Plus className="w-4 h-4" /></button>
                                </div>
                              </div>

                              {/* Children */}
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-gray-800">Children</span>
                                <button onClick={addChild} className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1">
                                  <Plus className="w-3 h-3" /> Add Child
                                </button>
                              </div>

                              {/* Children List */}
                              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {children.map((child, idx) => (
                                  <div key={child.id} className="p-3 bg-gray-50 rounded-lg space-y-3 relative">
                                    <button 
                                      onClick={() => removeChild(child.id)}
                                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Type</label>
                                        <select 
                                          value={child.type}
                                          onChange={(e) => updateChild(child.id, { type: e.target.value as 'child' | 'infant', age: e.target.value === 'infant' ? 1 : 5 })}
                                          className="w-full text-xs border rounded-md p-1.5"
                                        >
                                          <option value="child">Child</option>
                                          <option value="infant">Infant</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Age</label>
                                        <select 
                                          value={child.age}
                                          onChange={(e) => updateChild(child.id, { age: parseInt(e.target.value) })}
                                          className="w-full text-xs border rounded-md p-1.5"
                                        >
                                          {Array.from({length: child.type === 'infant' ? 3 : 18}, (_, i) => (
                                            <option key={i} value={i}>{i} years old</option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        checked={child.needsBed}
                                        onChange={(e) => updateChild(child.id, { needsBed: e.target.checked })}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="text-xs text-gray-600 font-medium">Needs extra bed?</span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Rooms */}
                      <div className="lg:col-span-2 relative" ref={roomsRef}>
                        <button 
                          onClick={() => setShowRoomsPopover(!showRoomsPopover)}
                          className={cn(
                            "w-full h-full text-left bg-white rounded-lg p-3 border-2 border-transparent transition-all flex items-center gap-3",
                            showRoomsPopover && "border-[#febb02]"
                          )}
                        >
                          <DoorOpen className="text-gray-500 w-6 h-6 shrink-0" />
                          <span className="font-medium text-gray-900 text-sm truncate">
                            {rooms.length} rooms
                          </span>
                        </button>
                        <AnimatePresence>
                          {showRoomsPopover && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute z-[60] w-[300px] mt-1 bg-white rounded-md shadow-2xl border border-gray-200 p-6 right-0"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-gray-800">Rooms</span>
                                <button onClick={addRoom} className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1">
                                  <Plus className="w-3 h-3" /> Add Room
                                </button>
                              </div>
                              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {rooms.map((room, idx) => (
                                  <div key={room.id} className="p-3 bg-gray-50 rounded-lg space-y-2 relative">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-gray-400 uppercase">Room {idx + 1}</span>
                                      {rooms.length > 1 && (
                                        <button onClick={() => removeRoom(room.id)} className="text-gray-400 hover:text-red-500">
                                          <Minus className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                    <select 
                                      value={room.type}
                                      onChange={(e) => updateRoom(room.id, e.target.value)}
                                      className="w-full text-xs border rounded-md p-1.5"
                                    >
                                      {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Search Button */}
                      <div className="lg:col-span-1">
                        <button 
                          onClick={() => {
                            if (role === 'agency' || role === 'admin') {
                              window.location.href = '/agency';
                            } else {
                              alert('Searching for: ' + destination);
                            }
                          }}
                          className="w-full h-full bg-[#006ce4] text-white rounded-lg font-bold text-lg hover:bg-[#0057b8] transition-all py-3 lg:py-0"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'tours' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 items-stretch">
                      <div className="lg:col-span-5">
                        <div className="h-full bg-white rounded-lg p-3 border-2 border-transparent focus-within:border-[#febb02] transition-all">
                          <div className="flex items-center gap-3">
                            <MapPin className="text-gray-500 w-6 h-6 shrink-0" />
                            <input 
                              type="text" 
                              placeholder="Where do you want to explore?" 
                              className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium text-gray-900 placeholder:text-gray-500 text-sm" 
                            />
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-4">
                        <div className="h-full bg-white rounded-lg p-3 border-2 border-transparent focus-within:border-[#febb02] transition-all">
                          <div className="flex items-center gap-3">
                            <Calendar className="text-gray-500 w-6 h-6 shrink-0" />
                            <input 
                              type="text" 
                              placeholder="Select date" 
                              className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium text-gray-900 placeholder:text-gray-500 text-sm" 
                            />
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-3">
                        <button 
                          onClick={() => {
                            if (role === 'agency' || role === 'admin') {
                              window.location.href = '/agency';
                            } else {
                              alert('Searching for tours');
                            }
                          }}
                          className="w-full h-full bg-[#006ce4] text-white rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-[#0057b8] transition-all py-4 lg:py-0"
                        >
                          <Search className="w-5 h-5" />
                          <span>Search Tours</span>
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Welcome Section */}
      {user && role === 'admin' && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h2 className="text-2xl font-bold mb-2">مرحباً بك يا مدير الوكالة! 👋</h2>
              <p className="text-blue-100">يمكنك الآن البدء بإضافة الفنادق، المواسم، والمصاريف من لوحة التحكم الخاصة بك.</p>
            </div>
            <Link 
              to="/admin" 
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              <Shield className="w-5 h-5" />
              الدخول إلى لوحة المدير
            </Link>
          </div>
        </section>
      )}

      {/* Popular Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Popular Destinations</h2>
            <p className="text-gray-500">Explore the most beautiful places in Malaysia</p>
          </div>
          <button className="text-blue-600 font-bold hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Kuala Lumpur', img: 'kl', count: '120 Hotels' },
            { name: 'Langkawi', img: 'langkawi', count: '85 Hotels' },
            { name: 'Penang', img: 'penang', count: '94 Hotels' },
            { name: 'Malacca', img: 'malacca', count: '45 Hotels' },
          ].map((city, i) => (
            <motion.div
              key={city.name}
              whileHover={{ y: -10 }}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg"
            >
              <img
                src={`https://picsum.photos/seed/${city.img}/400/600`}
                alt={city.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                <p className="text-white/80 text-sm font-medium">{city.count}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Hotels</h2>
              <p className="text-gray-600">Handpicked luxury stays for your next trip</p>
            </div>
            <Link to="/stays" className="text-blue-600 font-bold hover:underline">View All Hotels</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Grand Hyatt Kuala Lumpur', location: 'KLCC, Malaysia', price: '$245', rating: '4.9', img: 'https://picsum.photos/seed/hotel1/800/600' },
              { name: 'Shangri-La Langkawi', location: 'Langkawi, Malaysia', price: '$320', rating: '4.8', img: 'https://picsum.photos/seed/hotel2/800/600' },
              { name: 'The Ritz-Carlton', location: 'Bukit Bintang, Malaysia', price: '$280', rating: '4.9', img: 'https://picsum.photos/seed/hotel3/800/600' },
              { name: 'Four Seasons Resort', location: 'Langkawi, Malaysia', price: '$450', rating: '5.0', img: 'https://picsum.photos/seed/hotel4/800/600' },
            ].map((hotel, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600">
                    ★ {hotel.rating}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{hotel.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    {hotel.location}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-500 block">Starting from</span>
                      <span className="text-xl font-bold text-blue-600">{hotel.price}</span>
                    </div>
                    <button 
                      onClick={() => handleBookNow(hotel, 'Hotel')}
                      className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-16">Why Choose You Need Travel?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Best Price Guarantee', desc: 'We offer the most competitive rates in the market for all our services.', icon: '💰' },
              { title: 'Safe & Secure Booking', desc: 'Your data and payments are protected with industry-leading security.', icon: '🔒' },
              { title: '24/7 Customer Support', desc: 'Our dedicated team is always here to help you with your travel needs.', icon: '🎧' },
            ].map((item) => (
              <div key={item.title} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] p-12 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full -ml-32 -mb-32 opacity-50" />
            
            <div className="relative z-10 max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Get Special Offers & Travel Tips</h2>
              <p className="text-xl text-gray-600 mb-8">Subscribe to our newsletter and never miss out on our exclusive deals and latest travel guides.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-grow px-8 py-5 rounded-2xl bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium"
                />
                <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all whitespace-nowrap">
                  Subscribe Now
                </button>
              </div>
            </div>
            
            <div className="relative z-10 hidden lg:block">
              <div className="w-80 h-80 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <Mail className="w-32 h-32 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={selectedItem} 
      />
    </div>
  );
}
