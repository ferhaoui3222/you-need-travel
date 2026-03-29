import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, setDoc, doc, deleteDoc, OperationType, handleFirestoreError } from '../../firebase';
import { Hotel, RoomRate, Expense, Package, Booking } from '../../types';
import { Plus, Trash2, Edit3, Calendar, DollarSign, MapPin, Star, LayoutDashboard, Hotel as HotelIcon, Receipt, Package as PackageIcon, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../Auth/AuthGuard';
import { cn } from '../../lib/utils';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'hotels' | 'expenses' | 'packages' | 'browse' | 'bookings'>('hotels');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [rates, setRates] = useState<RoomRate[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking State
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: '',
    adults: 2,
    children: [] as { age: number; needsBed: boolean }[],
    itinerary: [] as { city: string; hotelId: string; nights: number }[]
  });

  // Forms State
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [newHotel, setNewHotel] = useState<Partial<Hotel & RoomRate>>({ 
    name: '', city: '', country: '', stars: 5, description: '',
    singleRate: 0, doubleRate: 0, tripleRate: 0,
    childWithBedRate: 0, childNoBedRate: 0, infantRate: 0
  });
  
  const [showRateForm, setShowRateForm] = useState<string | null>(null); // Hotel ID
  const [newRate, setNewRate] = useState<Partial<RoomRate>>({
    seasonName: '', startDate: '', endDate: '',
    singleRate: 0, doubleRate: 0, tripleRate: 0,
    childWithBedRate: 0, childNoBedRate: 0, infantRate: 0
  });

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    name: '', type: 'Transfer', city: '', country: '', price: 0, calculationType: 'Per Person', description: ''
  });

  const [showPackageForm, setShowPackageForm] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [newPackage, setNewPackage] = useState<Partial<Package>>({
    name: '', country: '', cities: [], hotelOptions: [], includedExpenses: [], baseMarkup: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const hotelSnap = await getDocs(collection(db, 'hotels'));
      const expenseSnap = await getDocs(collection(db, 'expenses'));
      const packageSnap = await getDocs(collection(db, 'packages'));
      const rateSnap = await getDocs(collection(db, 'roomRates'));
      const bookingSnap = await getDocs(collection(db, 'bookings'));
      
      setHotels(hotelSnap.docs.map(d => ({ id: d.id, ...d.data() } as Hotel)));
      setExpenses(expenseSnap.docs.map(d => ({ id: d.id, ...d.data() } as Expense)));
      setPackages(packageSnap.docs.map(d => ({ id: d.id, ...d.data() } as Package)));
      setRates(rateSnap.docs.map(d => ({ id: d.id, ...d.data() } as RoomRate)));
      setBookings(bookingSnap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'hotels/expenses/packages/rates/bookings');
    }
    setLoading(false);
  };

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hotelId = Math.random().toString(36).substr(2, 9);
      const { 
        singleRate, doubleRate, tripleRate, 
        childWithBedRate, childNoBedRate, infantRate,
        ...hotelData 
      } = newHotel;

      await setDoc(doc(db, 'hotels', hotelId), hotelData);
      
      // Create initial rate (Standard Season)
      const rateId = Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, 'roomRates', rateId), {
        hotelId,
        seasonName: 'السعر الأساسي',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        singleRate: singleRate || 0,
        doubleRate: doubleRate || 0,
        tripleRate: tripleRate || 0,
        childWithBedRate: childWithBedRate || 0,
        childNoBedRate: childNoBedRate || 0,
        infantRate: infantRate || 0
      });

      setShowHotelForm(false);
      setNewHotel({ 
        name: '', city: '', country: '', stars: 5, description: '',
        singleRate: 0, doubleRate: 0, tripleRate: 0,
        childWithBedRate: 0, childNoBedRate: 0, infantRate: 0
      });
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'hotels');
    }
  };

  const handleAddRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRateForm) return;
    try {
      const id = Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, 'roomRates', id), { ...newRate, hotelId: showRateForm });
      setShowRateForm(null);
      setNewRate({
        seasonName: '', startDate: '', endDate: '',
        singleRate: 0, doubleRate: 0, tripleRate: 0,
        childWithBedRate: 0, childNoBedRate: 0, infantRate: 0
      });
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'roomRates');
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, 'expenses', id), newExpense);
      setShowExpenseForm(false);
      setNewExpense({ name: '', type: 'Transfer', city: '', country: '', price: 0, calculationType: 'Per Person', description: '' });
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'expenses');
    }
  };

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = Math.random().toString(36).substr(2, 9);
      await setDoc(doc(db, 'packages', id), { ...newPackage, country: selectedCountry, cities: [selectedCity] });
      setShowPackageForm(false);
      setNewPackage({ name: '', country: '', cities: [], hotelOptions: [], includedExpenses: [], baseMarkup: 0 });
      setSelectedCountry('');
      setSelectedCity('');
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'packages');
    }
  };

  const startBooking = (pkg: Package) => {
    setSelectedPackage(pkg);
    setBookingDetails({
      ...bookingDetails,
      itinerary: pkg.cities.map(city => ({
        city,
        hotelId: pkg.hotelOptions.find(hId => hotels.find(h => h.id === hId)?.city === city) || '',
        nights: 2
      }))
    });
    setBookingStep(2);
    setActiveTab('browse');
  };

  const calculatePrice = () => {
    if (!selectedPackage) return 0;
    
    let total = 0;

    // 1. Hotel Costs
    bookingDetails.itinerary.forEach(item => {
      const hotelRates = rates.filter(r => r.hotelId === item.hotelId);
      const activeRate = hotelRates.find(r => {
        const start = new Date(r.startDate);
        const end = new Date(r.endDate);
        const bookingStart = new Date(bookingDetails.startDate);
        return bookingStart >= start && bookingStart <= end;
      }) || hotelRates[0];

      if (activeRate) {
        const roomCount = Math.ceil(bookingDetails.adults / 2);
        const hotelCost = item.nights * (roomCount * activeRate.doubleRate);
        
        const childrenCost = bookingDetails.children.reduce((acc, child) => {
          const rate = child.needsBed ? activeRate.childWithBedRate : activeRate.childNoBedRate;
          return acc + (item.nights * rate);
        }, 0);

        total += hotelCost + childrenCost;
      }
    });

    // 2. Included Expenses
    selectedPackage.includedExpenses.forEach(expId => {
      const expense = expenses.find(e => e.id === expId);
      if (expense) {
        if (expense.calculationType === 'Per Person') {
          total += expense.price * (bookingDetails.adults + bookingDetails.children.length);
        } else {
          total += expense.price;
        }
      }
    });

    // 3. Admin Markup
    total += selectedPackage.baseMarkup;

    return Math.round(total);
  };

  const handleConfirmBooking = async () => {
    if (!selectedPackage) return;
    try {
      const bookingId = Math.random().toString(36).substr(2, 9);
      const totalCost = calculatePrice();
      
      const newBooking: Booking = {
        id: bookingId,
        agencyId: 'admin',
        packageId: selectedPackage.id,
        travelerName: 'حجز مباشر من الإدارة',
        adults: bookingDetails.adults,
        children: bookingDetails.children,
        startDate: bookingDetails.startDate,
        itinerary: bookingDetails.itinerary,
        totalCost,
        status: 'Confirmed'
      };

      await setDoc(doc(db, 'bookings', bookingId), newBooking);
      setBookingStep(1);
      setSelectedPackage(null);
      fetchData();
      setActiveTab('bookings');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    }
  };

  const handleDelete = async (coll: string, id: string) => {
    if (confirm('Are you sure you want to delete this?')) {
      try {
        await deleteDoc(doc(db, coll, id));
        fetchData();
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, coll);
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Data...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-[#1A1A1A] font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-[#E9ECEF] flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-[#E9ECEF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#006CE4] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">
              Y
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">لوحة التحكم</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">You Need Travel</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'hotels', label: 'الفنادق والمواسم', icon: HotelIcon },
            { id: 'expenses', label: 'مكتبة المصاريف', icon: Receipt },
            { id: 'packages', label: 'تصميم الباقات', icon: PackageIcon },
            { id: 'browse', label: 'تصفح الباقات', icon: PackageIcon },
            { id: 'bookings', label: 'الحجوزات', icon: Calendar },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === item.id 
                  ? "bg-[#006CE4] text-white shadow-lg shadow-blue-100" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#006CE4]"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} className="mr-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E9ECEF]">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'hotels' && 'إدارة الفنادق والمواسم'}
              {activeTab === 'expenses' && 'مكتبة المصاريف'}
              {activeTab === 'packages' && 'تصميم الباقات'}
              {activeTab === 'browse' && 'تصفح الباقات'}
              {activeTab === 'bookings' && 'سجل الحجوزات'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">أهلاً بك في لوحة تحكم وكالة ماليزيا</p>
          </div>
          
          <div className="flex gap-3">
            {activeTab === 'hotels' && (
              <button 
                onClick={() => setShowHotelForm(true)}
                className="bg-[#006CE4] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 font-bold text-sm"
              >
                <Plus size={18} /> إضافة فندق
              </button>
            )}
            {activeTab === 'expenses' && (
              <button 
                onClick={() => setShowExpenseForm(true)}
                className="bg-[#006CE4] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 font-bold text-sm"
              >
                <Plus size={18} /> إضافة مصروف
              </button>
            )}
            {activeTab === 'packages' && (
              <button 
                onClick={() => setShowPackageForm(true)}
                className="bg-[#006CE4] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 font-bold text-sm"
              >
                <Plus size={18} /> تصميم باقة
              </button>
            )}
          </div>
        </header>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'hotels' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {hotels.map(hotel => (
                <div key={hotel.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#E9ECEF] hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#006CE4] group-hover:bg-[#006CE4] group-hover:text-white transition-all">
                      <HotelIcon size={28} />
                    </div>
                    <button onClick={() => handleDelete('hotels', hotel.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{hotel.name}</h3>
                  <div className="flex items-center text-gray-400 text-xs gap-1 mb-3 font-medium">
                    <MapPin size={12} /> {hotel.city}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < hotel.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} 
                      />
                    ))}
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">المواسم الحالية</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                      {rates.filter(r => r.hotelId === hotel.id).length > 0 ? (
                        rates.filter(r => r.hotelId === hotel.id).map(rate => (
                          <div key={rate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group/rate">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-700">{rate.seasonName}</span>
                              <span className="text-[10px] text-gray-400">{rate.startDate} - {rate.endDate}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-[#006CE4]">${rate.doubleRate}</span>
                              <button onClick={() => handleDelete('roomRates', rate.id)} className="opacity-0 group-hover/rate:opacity-100 text-red-400 hover:text-red-600 transition-all">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">لا توجد أسعار مضافة لهذا الفندق</p>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowRateForm(hotel.id)}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                  >
                    <Plus size={16} /> إضافة أسعار المواسم
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-[#E9ECEF] overflow-hidden">
              <div className="p-6 border-b border-[#E9ECEF] flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">جميع المصاريف</h3>
                <span className="text-xs font-bold text-gray-400">{expenses.length} مصروف مسجل</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">الاسم</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">النوع</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">المدينة</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">السعر</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">طريقة الحساب</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9ECEF]">
                    {expenses.map(expense => (
                      <tr key={expense.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#006CE4]">
                              <Receipt size={16} />
                            </div>
                            <span className="font-bold text-sm text-gray-900">{expense.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-600 uppercase">
                            {expense.type}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-500 font-medium">{expense.city}</td>
                        <td className="px-6 py-5">
                          <span className="font-bold text-sm text-[#006CE4]">${expense.price}</span>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-500 font-medium">{expense.calculationType}</td>
                        <td className="px-6 py-5 text-left">
                          <button onClick={() => handleDelete('expenses', expense.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {packages.map(pkg => (
                <div key={pkg.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#E9ECEF] hover:shadow-2xl transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:bg-[#006CE4] transition-all duration-500 opacity-20 group-hover:opacity-10" />
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {pkg.cities.map(city => (
                          <span key={city} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleDelete('packages', pkg.id)} className="bg-red-50 text-red-500 p-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">الفنادق</p>
                      <p className="text-lg font-bold text-gray-900">{pkg.hotelOptions.length} خيارات</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">البرنامج</p>
                      <p className="text-lg font-bold text-gray-900">{pkg.includedExpenses.length} أيام/فعاليات</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-100 relative z-10">
                    <div>
                      <p className="text-[10px] font-bold text-white/70 uppercase mb-1">فائدة الوكالة</p>
                      <p className="text-3xl font-bold">${pkg.baseMarkup}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <DollarSign size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'browse' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map(pkg => (
                <div key={pkg.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#E9ECEF] hover:shadow-2xl transition-all group">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{pkg.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {pkg.cities.map(city => (
                      <span key={city} className="bg-blue-50 text-[#006CE4] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {city}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => startBooking(pkg)}
                    className="w-full bg-[#006CE4] text-white py-4 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    بدء الحجز الآن
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-[#E9ECEF] overflow-hidden">
              <div className="p-8 border-b border-[#E9ECEF] bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900">سجل الحجوزات</h3>
                <p className="text-sm text-gray-400 mt-1">عرض جميع الحجوزات المؤكدة</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">المسافر</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">الباقة</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">التاريخ</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">التكلفة</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9ECEF]">
                    {bookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6">
                          <span className="font-bold text-gray-900">{booking.travelerName}</span>
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                          {packages.find(p => p.id === booking.packageId)?.name}
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-500 font-medium">{booking.startDate}</td>
                        <td className="px-8 py-6">
                          <span className="text-lg font-bold text-[#006CE4]">${booking.totalCost}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-bold uppercase">
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals - Refactored for better design */}
        {/* Booking Modal */}
        {selectedPackage && bookingStep > 1 && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E9ECEF]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">تخصيص الحجز: {selectedPackage.name}</h3>
                <button onClick={() => { setSelectedPackage(null); setBookingStep(1); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">تاريخ البدء</label>
                    <input 
                      type="date" 
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm"
                      value={bookingDetails.startDate}
                      onChange={e => setBookingDetails({...bookingDetails, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">عدد البالغين</label>
                    <input 
                      type="number" 
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm"
                      value={bookingDetails.adults}
                      onChange={e => setBookingDetails({...bookingDetails, adults: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900">تخصيص الفنادق والليالي</h4>
                  {bookingDetails.itinerary.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">{item.city}</label>
                        <select 
                          className="w-full px-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-[#006CE4] font-bold text-xs"
                          value={item.hotelId}
                          onChange={e => {
                            const newItinerary = [...bookingDetails.itinerary];
                            newItinerary[index].hotelId = e.target.value;
                            setBookingDetails({...bookingDetails, itinerary: newItinerary});
                          }}
                        >
                          {hotels.filter(h => h.city === item.city).map(h => (
                            <option key={h.id} value={h.id}>{h.name} ({h.stars} نجوم)</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">عدد الليالي</label>
                        <input 
                          type="number"
                          className="w-full px-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-[#006CE4] font-bold text-xs text-center"
                          value={item.nights}
                          onChange={e => {
                            const newItinerary = [...bookingDetails.itinerary];
                            newItinerary[index].nights = parseInt(e.target.value) || 0;
                            setBookingDetails({...bookingDetails, itinerary: newItinerary});
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-blue-600 rounded-[2rem] text-white flex justify-between items-center shadow-xl shadow-blue-100">
                  <div>
                    <p className="text-sm font-bold text-white/70 mb-1">إجمالي التكلفة</p>
                    <p className="text-4xl font-bold">${calculatePrice()}</p>
                  </div>
                  <button 
                    onClick={handleConfirmBooking}
                    className="bg-white text-[#006CE4] px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-lg"
                  >
                    تأكيد الحجز النهائي
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPackageForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E9ECEF]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">تصميم باقة سياحية جديدة</h3>
                <button onClick={() => setShowPackageForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleAddPackage} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">اسم الباقة</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm" 
                      placeholder="مثال: سحر ماليزيا العائلي"
                      value={newPackage.name} 
                      onChange={e => setNewPackage({...newPackage, name: e.target.value})} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">الدولة</label>
                    <select 
                      required
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm"
                      value={selectedCountry}
                      onChange={e => {
                        setSelectedCountry(e.target.value);
                        setSelectedCity('');
                      }}
                    >
                      <option value="">اختر الدولة</option>
                      {Array.from(new Set(hotels.map(h => h.country))).filter(Boolean).map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">المدينة</label>
                    <select 
                      required
                      disabled={!selectedCountry}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm disabled:opacity-50"
                      value={selectedCity}
                      onChange={e => setSelectedCity(e.target.value)}
                    >
                      <option value="">اختر المدينة</option>
                      {Array.from(new Set(hotels.filter(h => h.country === selectedCountry).map(h => h.city))).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">الفنادق المتاحة (في {selectedCity || 'المدينة المختارة'})</label>
                    <div className="max-h-60 overflow-y-auto bg-gray-50 rounded-2xl p-4 space-y-2 custom-scrollbar">
                      {hotels.filter(h => h.city === selectedCity).length > 0 ? (
                        hotels.filter(h => h.city === selectedCity).map(hotel => (
                          <label key={hotel.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-transparent hover:border-[#006CE4] cursor-pointer transition-all">
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 rounded-lg text-[#006CE4] focus:ring-[#006CE4]"
                              checked={newPackage.hotelOptions?.includes(hotel.id)}
                              onChange={e => {
                                const options = newPackage.hotelOptions || [];
                                setNewPackage({
                                  ...newPackage, 
                                  hotelOptions: e.target.checked ? [...options, hotel.id] : options.filter(id => id !== hotel.id)
                                });
                              }}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-700">{hotel.name}</span>
                              <span className="text-[10px] text-gray-400">{hotel.stars} نجوم</span>
                            </div>
                          </label>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 p-4 text-center">لا توجد فنادق مضافة لهذه المدينة</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">المصاريف المشمولة (في {selectedCity || 'المدينة المختارة'})</label>
                    <div className="max-h-60 overflow-y-auto bg-gray-50 rounded-2xl p-4 space-y-2 custom-scrollbar">
                      {expenses.filter(e => e.city === selectedCity).length > 0 ? (
                        expenses.filter(e => e.city === selectedCity).map(exp => (
                          <label key={exp.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-transparent hover:border-[#006CE4] cursor-pointer transition-all">
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 rounded-lg text-[#006CE4] focus:ring-[#006CE4]"
                              checked={newPackage.includedExpenses?.includes(exp.id)}
                              onChange={e => {
                                const options = newPackage.includedExpenses || [];
                                setNewPackage({
                                  ...newPackage, 
                                  includedExpenses: e.target.checked ? [...options, exp.id] : options.filter(id => id !== exp.id)
                                });
                              }}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-700">{exp.name}</span>
                              <span className="text-[10px] text-gray-400">${exp.price} - {exp.type}</span>
                            </div>
                          </label>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 p-4 text-center">لا توجد خدمات مضافة لهذه المدينة</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 block">فائدة الوكالة (الربح الأساسي)</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                      <DollarSign size={24} />
                    </div>
                    <input 
                      required 
                      type="number" 
                      className="flex-grow bg-transparent border-none focus:ring-0 text-3xl font-bold text-blue-600 placeholder:text-blue-200" 
                      placeholder="0.00"
                      value={newPackage.baseMarkup} 
                      onChange={e => setNewPackage({...newPackage, baseMarkup: parseFloat(e.target.value) || 0})} 
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowPackageForm(false)} 
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-[#006CE4] text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                  >
                    حفظ الباقة
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showHotelForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E9ECEF]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">إضافة فندق جديد مع الأسعار</h3>
                <button onClick={() => setShowHotelForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleAddHotel} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">الدولة</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm"
                      placeholder="مثال: ماليزيا"
                      value={newHotel.country}
                      onChange={e => setNewHotel({...newHotel, country: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">المدينة</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm"
                      placeholder="مثال: كوالالمبور"
                      value={newHotel.city}
                      onChange={e => setNewHotel({...newHotel, city: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">اسم الفندق</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm"
                      value={newHotel.name}
                      onChange={e => setNewHotel({...newHotel, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">التصنيف (نجوم)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setNewHotel({...newHotel, stars: n})}
                          className={cn(
                            "flex-1 py-3 rounded-xl font-bold transition-all border-2",
                            newHotel.stars === n 
                              ? "bg-blue-50 border-[#006CE4] text-[#006CE4]" 
                              : "bg-white border-gray-100 text-gray-300 hover:border-gray-200"
                          )}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">أسعار الغرف الأساسية (للفرد)</label>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-6 rounded-3xl space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">سنجل</span>
                      <input required type="number" className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-gray-900" value={newHotel.singleRate} onChange={e => setNewHotel({...newHotel, singleRate: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">دبل</span>
                      <input required type="number" className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-gray-900" value={newHotel.doubleRate} onChange={e => setNewHotel({...newHotel, doubleRate: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">تربل</span>
                      <input required type="number" className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-gray-900" value={newHotel.tripleRate} onChange={e => setNewHotel({...newHotel, tripleRate: parseFloat(e.target.value) || 0})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">أسعار الأطفال والرضع</label>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-3xl space-y-2 border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">طفل بسرير</span>
                      <input required type="number" className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-[#006CE4]" value={newHotel.childWithBedRate} onChange={e => setNewHotel({...newHotel, childWithBedRate: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="bg-blue-50 p-6 rounded-3xl space-y-2 border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">طفل بدون سرير</span>
                      <input required type="number" className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-[#006CE4]" value={newHotel.childNoBedRate} onChange={e => setNewHotel({...newHotel, childNoBedRate: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="bg-blue-50 p-6 rounded-3xl space-y-2 border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">رضيع</span>
                      <input required type="number" className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-[#006CE4]" value={newHotel.infantRate} onChange={e => setNewHotel({...newHotel, infantRate: parseFloat(e.target.value) || 0})} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowHotelForm(false)} 
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-[#006CE4] text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                  >
                    حفظ الفندق والأسعار
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showRateForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E9ECEF]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">إضافة أسعار المواسم</h3>
                <button onClick={() => setShowRateForm(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleAddRate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">اسم الموسم</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm" 
                      placeholder="مثال: موسم الصيف 2024"
                      value={newRate.seasonName} 
                      onChange={e => setNewRate({...newRate, seasonName: e.target.value})} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">من تاريخ</label>
                      <input required type="date" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm" value={newRate.startDate} onChange={e => setNewRate({...newRate, startDate: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">إلى تاريخ</label>
                      <input required type="date" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm" value={newRate.endDate} onChange={e => setNewRate({...newRate, endDate: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">أسعار الغرف (للفرد)</label>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-6 rounded-3xl space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">سنجل</span>
                      <input required type="number" className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-gray-900" value={newRate.singleRate} onChange={e => setNewRate({...newRate, singleRate: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">دبل</span>
                      <input required type="number" className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-gray-900" value={newRate.doubleRate} onChange={e => setNewRate({...newRate, doubleRate: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">تربل</span>
                      <input required type="number" className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-gray-900" value={newRate.tripleRate} onChange={e => setNewRate({...newRate, tripleRate: parseFloat(e.target.value) || 0})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">أسعار الأطفال والرضع</label>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-3xl space-y-2 border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">طفل بسرير</span>
                      <input required type="number" className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-[#006CE4]" value={newRate.childWithBedRate} onChange={e => setNewRate({...newRate, childWithBedRate: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="bg-blue-50 p-6 rounded-3xl space-y-2 border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">طفل بدون سرير</span>
                      <input required type="number" className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-[#006CE4]" value={newRate.childNoBedRate} onChange={e => setNewRate({...newRate, childNoBedRate: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div className="bg-blue-50 p-6 rounded-3xl space-y-2 border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">رضيع</span>
                      <input required type="number" className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-[#006CE4]" value={newRate.infantRate} onChange={e => setNewRate({...newRate, infantRate: parseFloat(e.target.value) || 0})} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowRateForm(null)} 
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-[#006CE4] text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                  >
                    حفظ الأسعار
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showExpenseForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-[#E9ECEF]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">إضافة مصروف جديد</h3>
                <button onClick={() => setShowExpenseForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">اسم المصروف</label>
                  <input required type="text" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm" value={newExpense.name} onChange={e => setNewExpense({...newExpense, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">الدولة</label>
                    <input required type="text" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm" value={newExpense.country} onChange={e => setNewExpense({...newExpense, country: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">المدينة</label>
                    <input required type="text" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm" value={newExpense.city} onChange={e => setNewExpense({...newExpense, city: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">النوع</label>
                    <select className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm" value={newExpense.type} onChange={e => setNewExpense({...newExpense, type: e.target.value as any})}>
                      {['Transfer', 'Tour', 'Flight', 'Ferry', 'Meal'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">السعر ($)</label>
                    <input required type="number" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm" value={newExpense.price} onChange={e => setNewExpense({...newExpense, price: parseFloat(e.target.value) || 0})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">طريقة الحساب</label>
                  <select className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm" value={newExpense.calculationType} onChange={e => setNewExpense({...newExpense, calculationType: e.target.value as any})}>
                    <option value="Per Person">لكل فرد</option>
                    <option value="Per Group">لكل مجموعة/سيارة</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">وصف اليوم (للبرنامج)</label>
                  <textarea className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm min-h-[100px]" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
                </div>
                <div className="flex gap-4 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowExpenseForm(false)} 
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-[#006CE4] text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                  >
                    حفظ المصروف
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
};

export default AdminDashboard;
