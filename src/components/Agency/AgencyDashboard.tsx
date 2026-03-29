import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, query, where, OperationType, handleFirestoreError } from '../../firebase';
import { Package, Hotel, Expense, RoomRate, Agency } from '../../types';
import { useAuth } from '../../components/Auth/AuthGuard';
import { Search, Calendar, Users, MapPin, ArrowRight, Info, CheckCircle, LayoutDashboard, Package as PackageIcon, History, Wallet, LogOut, ChevronRight, Star, Clock, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const AgencyDashboard: React.FC = () => {
  const { user, agencyData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'bookings' | 'wallet'>('browse');
  const [packages, setPackages] = useState<Package[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [rates, setRates] = useState<RoomRate[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking State
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [bookingStep, setBookingStep] = useState(1); // 1: Browse, 2: Customize, 3: Review
  
  const [bookingDetails, setBookingDetails] = useState({
    startDate: '',
    adults: 2,
    children: [] as { age: number; needsBed: boolean }[],
    itinerary: [] as { city: string; hotelId: string; nights: number }[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pkgSnap = await getDocs(collection(db, 'packages'));
      const hotelSnap = await getDocs(collection(db, 'hotels'));
      const expenseSnap = await getDocs(collection(db, 'expenses'));
      const rateSnap = await getDocs(collection(db, 'roomRates'));

      setPackages(pkgSnap.docs.map(d => ({ id: d.id, ...d.data() } as Package)));
      setHotels(hotelSnap.docs.map(d => ({ id: d.id, ...d.data() } as Hotel)));
      setExpenses(expenseSnap.docs.map(d => ({ id: d.id, ...d.data() } as Expense)));
      setRates(rateSnap.docs.map(d => ({ id: d.id, ...d.data() } as RoomRate)));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'agency_data');
    }
    setLoading(false);
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
  };

  const calculatePrice = () => {
    if (!selectedPackage) return 0;
    
    let total = 0;

    // 1. Hotel Costs
    bookingDetails.itinerary.forEach(item => {
      const hotelRates = rates.filter(r => r.hotelId === item.hotelId);
      // Find rate for the start date (simplified for now, should check each night)
      const activeRate = hotelRates.find(r => {
        const start = new Date(r.startDate);
        const end = new Date(r.endDate);
        const bookingStart = new Date(bookingDetails.startDate);
        return bookingStart >= start && bookingStart <= end;
      }) || hotelRates[0]; // Fallback to first rate if no season match

      if (activeRate) {
        // Simplified logic: Assume double rooms for adults
        const roomCount = Math.ceil(bookingDetails.adults / 2);
        const hotelCost = item.nights * (roomCount * activeRate.doubleRate);
        
        // Children costs
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
          total += expense.price; // Per Group
        }
      }
    });

    // 3. Admin Markup
    total += selectedPackage.baseMarkup;

    // 4. Agency Commission (Added on top)
    const agencyCommission = agencyData?.commissionRate || 0;
    total = total * (1 + agencyCommission / 100);

    return Math.round(total);
  };

  if (loading) return <div className="p-8 text-center">جاري تحميل البيانات...</div>;

  return (
    <div className="flex h-screen bg-white font-sans text-[#1A1A1A]" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-[#E9ECEF] flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-[#E9ECEF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#006CE4] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">
              A
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">{agencyData?.name || 'وكالة شريكة'}</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">لوحة تحكم الوكيل</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'browse', label: 'تصفح الباقات', icon: PackageIcon },
            { id: 'bookings', label: 'حجوزاتي', icon: History },
            { id: 'wallet', label: 'المحفظة', icon: Wallet },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setBookingStep(1);
                setSelectedPackage(null);
              }}
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
          <div className="bg-blue-50 p-4 rounded-2xl mb-4">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">الرصيد المتاح</span>
            <span className="text-xl font-black text-[#006CE4]">${agencyData?.walletBalance || 0}</span>
          </div>
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
      <main className="flex-grow p-10 overflow-y-auto bg-[#F8F9FA] custom-scrollbar">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'browse' && 'تصفح الباقات السياحية'}
              {activeTab === 'bookings' && 'سجل الحجوزات'}
              {activeTab === 'wallet' && 'إدارة المحفظة'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">مرحباً بك مجدداً في نظام الحجوزات الموحد</p>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'browse' && bookingStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {packages.map(pkg => (
                <div key={pkg.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-[#E9ECEF] hover:shadow-2xl transition-all group">
                  <div className="h-64 relative overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${pkg.id}/800/600`} 
                      alt={pkg.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 right-6 left-6">
                      <div className="flex gap-2 mb-3">
                        {pkg.cities.slice(0, 2).map(city => (
                          <span key={city} className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/30">
                            {city}
                          </span>
                        ))}
                        {pkg.cities.length > 2 && (
                          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/30">
                            +{pkg.cities.length - 2}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white leading-tight">{pkg.name}</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">{pkg.hotelOptions.length * 2} أيام</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-gray-900">4.9</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => startBooking(pkg)}
                      className="w-full bg-[#006CE4] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      تخصيص وحجز الباقة <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'browse' && bookingStep === 2 && selectedPackage && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              <div className="xl:col-span-2 space-y-10">
                {/* Basic Info */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#E9ECEF]">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#006CE4]">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">تفاصيل الرحلة الأساسية</h3>
                      <p className="text-xs text-gray-400">حدد تاريخ البدء وعدد المسافرين</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">تاريخ البدء</label>
                      <input 
                        type="date" 
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm" 
                        value={bookingDetails.startDate}
                        onChange={e => setBookingDetails({...bookingDetails, startDate: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">عدد البالغين</label>
                        <input 
                          type="number" 
                          min="1"
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm" 
                          value={bookingDetails.adults}
                          onChange={e => setBookingDetails({...bookingDetails, adults: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">عدد الأطفال</label>
                        <input 
                          type="number" 
                          min="0"
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#006CE4] font-bold text-sm" 
                          value={bookingDetails.children.length}
                          onChange={e => {
                            const count = parseInt(e.target.value) || 0;
                            const newChildren = [...bookingDetails.children];
                            if (count > newChildren.length) {
                              for (let i = newChildren.length; i < count; i++) newChildren.push({ age: 5, needsBed: false });
                            } else {
                              newChildren.splice(count);
                            }
                            setBookingDetails({...bookingDetails, children: newChildren});
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Itinerary Customization */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#E9ECEF]">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#006CE4]">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">تخصيص الفنادق والليالي</h3>
                      <p className="text-xs text-gray-400">اختر الفندق المفضل وعدد الليالي في كل مدينة</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {bookingDetails.itinerary.map((item, index) => (
                      <div key={index} className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold text-xl text-[#006CE4]">{item.city}</h3>
                          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-gray-100">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">الليالي:</label>
                            <input 
                              type="number" 
                              min="1"
                              className="w-12 bg-transparent border-none focus:ring-0 text-lg font-bold text-gray-900 text-center" 
                              value={item.nights}
                              onChange={e => {
                                const newItinerary = [...bookingDetails.itinerary];
                                newItinerary[index].nights = parseInt(e.target.value) || 0;
                                setBookingDetails({...bookingDetails, itinerary: newItinerary});
                              }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedPackage.hotelOptions
                            .filter(hId => hotels.find(h => h.id === hId)?.city === item.city)
                            .map(hId => {
                              const hotel = hotels.find(h => h.id === hId);
                              return (
                                <label 
                                  key={hId} 
                                  className={cn(
                                    "p-5 border-2 rounded-2xl cursor-pointer transition-all relative group",
                                    item.hotelId === hId 
                                      ? "border-[#006CE4] bg-blue-50/50" 
                                      : "bg-white border-transparent hover:border-gray-200"
                                  )}
                                >
                                  <input 
                                    type="radio" 
                                    className="hidden" 
                                    name={`hotel-${index}`}
                                    checked={item.hotelId === hId}
                                    onChange={() => {
                                      const newItinerary = [...bookingDetails.itinerary];
                                      newItinerary[index].hotelId = hId;
                                      setBookingDetails({...bookingDetails, itinerary: newItinerary});
                                    }}
                                  />
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-bold text-gray-900">{hotel?.name}</div>
                                      <div className="flex items-center gap-1 mt-1">
                                        {[...Array(hotel?.stars || 0)].map((_, i) => (
                                          <Star key={i} size={10} className="text-yellow-400 fill-yellow-400" />
                                        ))}
                                      </div>
                                    </div>
                                    {item.hotelId === hId && (
                                      <div className="w-6 h-6 bg-[#006CE4] rounded-full flex items-center justify-center text-white">
                                        <CheckCircle size={14} />
                                      </div>
                                    )}
                                  </div>
                                </label>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Summary Sticky */}
              <div className="xl:col-span-1">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-[#E9ECEF] sticky top-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-8">ملخص الحجز</h3>
                  
                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 font-medium">الباقة المختارة</span>
                      <span className="text-sm font-bold text-gray-900">{selectedPackage.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 font-medium">إجمالي الليالي</span>
                      <span className="text-sm font-bold text-gray-900">{bookingDetails.itinerary.reduce((acc, i) => acc + i.nights, 0)} ليالي</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 font-medium">المسافرون</span>
                      <span className="text-sm font-bold text-gray-900">{bookingDetails.adults} بالغ، {bookingDetails.children.length} طفل</span>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">السعر الإجمالي</span>
                          <span className="text-4xl font-black text-[#006CE4]">${calculatePrice()}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest block mb-1">حالة الحجز</span>
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">مبدئي</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => setBookingStep(3)}
                      className="w-full bg-[#006CE4] text-white py-5 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                    >
                      تأكيد الحجز المبدئي
                    </button>
                    <button 
                      onClick={() => setBookingStep(1)}
                      className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-all"
                    >
                      إلغاء والعودة
                    </button>
                  </div>

                  <p className="mt-8 text-[10px] text-gray-400 leading-relaxed text-center">
                    * السعر يشمل الفنادق، المصاريف المحددة، وعمولة الوكالة. <br />
                    * سيتم مراجعة الحجز من قبل الإدارة قبل التأكيد النهائي.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'browse' && bookingStep === 3 && (
            <div className="max-w-2xl mx-auto bg-white p-16 rounded-[3rem] shadow-xl border border-[#E9ECEF] text-center">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-50">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">تم تأكيد الحجز المبدئي!</h2>
              <p className="text-gray-400 mb-12 leading-relaxed">
                لقد تم إرسال تفاصيل الحجز للمدير للمراجعة. <br />
                سيتم خصم المبلغ من محفظتك بمجرد التأكيد النهائي من قبل الإدارة.
              </p>
              
              <div className="bg-gray-50 p-10 rounded-[2rem] text-right mb-12 border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-6 border-b border-gray-200 pb-4">ملخص الحجز المؤكد:</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">الباقة:</span>
                    <span className="font-bold text-gray-900">{selectedPackage?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">تاريخ البدء:</span>
                    <span className="font-bold text-gray-900">{bookingDetails.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">التكلفة الإجمالية:</span>
                    <span className="font-bold text-[#006CE4] text-xl">${calculatePrice()}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setBookingStep(1);
                  setSelectedPackage(null);
                  setActiveTab('bookings');
                }}
                className="bg-[#006CE4] text-white px-12 py-5 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                عرض سجل الحجوزات
              </button>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-[#E9ECEF] text-center">
              <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <History size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد حجوزات سابقة</h3>
              <p className="text-gray-400 mb-8">ابدأ بتصفح الباقات المتاحة وقم بأول حجز لك الآن</p>
              <button 
                onClick={() => setActiveTab('browse')}
                className="bg-[#006CE4] text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all"
              >
                تصفح الباقات
              </button>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="bg-[#006CE4] p-10 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest block mb-2">الرصيد الحالي</span>
                    <h3 className="text-5xl font-black mb-10">${agencyData?.walletBalance || 0}</h3>
                    <div className="flex items-center gap-2 text-blue-100 text-xs font-bold">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      حساب نشط ومفعل
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#E9ECEF] h-full">
                  <h3 className="text-xl font-bold text-gray-900 mb-8">آخر العمليات المالية</h3>
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <DollarSign size={24} />
                    </div>
                    <p className="text-gray-400 text-sm">لا توجد عمليات مالية مسجلة حالياً</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AgencyDashboard;
