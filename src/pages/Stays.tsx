import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Star, MapPin, Filter, Search, Wifi, Coffee, Wind, Car, Waves } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const stays = [
  { id: 1, name: 'Grand Hyatt Kuala Lumpur', location: 'KLCC, Kuala Lumpur', price: 180, rating: 4.9, img: 'hotel1', amenities: ['wifi', 'coffee', 'pool', 'ac'] },
  { id: 2, name: 'The Ritz-Carlton, Langkawi', location: 'Langkawi, Kedah', price: 450, rating: 5.0, img: 'hotel2', amenities: ['wifi', 'coffee', 'pool', 'parking'] },
  { id: 3, name: 'Shangri-La Rasa Sayang', location: 'Batu Ferringhi, Penang', price: 220, rating: 4.8, img: 'hotel3', amenities: ['wifi', 'pool', 'parking', 'ac'] },
  { id: 4, name: 'Mandarin Oriental', location: 'KLCC, Kuala Lumpur', price: 250, rating: 4.9, img: 'hotel4', amenities: ['wifi', 'coffee', 'pool', 'ac'] },
  { id: 5, name: 'Four Seasons Resort', location: 'Langkawi, Kedah', price: 550, rating: 5.0, img: 'hotel5', amenities: ['wifi', 'pool', 'parking', 'ac'] },
  { id: 6, name: 'The Majestic Hotel', location: 'Kuala Lumpur City Centre', price: 150, rating: 4.7, img: 'hotel6', amenities: ['wifi', 'coffee', 'parking', 'ac'] },
];

const AmenityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'wifi': return <Wifi className="w-4 h-4" />;
    case 'coffee': return <Coffee className="w-4 h-4" />;
    case 'pool': return <Waves className="w-4 h-4" />;
    case 'ac': return <Wind className="w-4 h-4" />;
    case 'parking': return <Car className="w-4 h-4" />;
    default: return null;
  }
};

export default function Stays() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ name: string; price: number; type: string } | null>(null);

  const handleBookNow = (stay: any) => {
    setSelectedItem({ name: stay.name, price: stay.price, type: 'Hotel' });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Search Header */}
      <div className="bg-blue-600 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Search Hotels in Malaysia</h1>
          <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-grow w-full relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Where are you going?"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <div className="w-full md:w-48">
              <input
                type="date"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
            <button className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="w-full lg:w-64 space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Filters</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase mb-4">Price Range</p>
                <input type="range" className="w-full accent-blue-600" />
                <div className="flex justify-between text-sm font-bold text-gray-700 mt-2">
                  <span>$0</span>
                  <span>$1000+</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-400 uppercase mb-4">Star Rating</p>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <label key={star} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <div className="flex gap-1">
                        {[...Array(star)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-500 font-medium">Showing <span className="text-gray-900 font-bold">124</span> hotels found</p>
            <select className="bg-white border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stays.map((stay) => (
              <div key={stay.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${stay.img}/600/400`}
                    alt={stay.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-900">{stay.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{stay.name}</h3>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4" />
                        {stay.location}
                      </div>
                      <div className="flex gap-2">
                        {stay.amenities.map((amenity) => (
                          <div key={amenity} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500" title={amenity}>
                            <AmenityIcon type={amenity} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Price per night</p>
                      <p className="text-2xl font-extrabold text-blue-600">${stay.price}</p>
                    </div>
                    <button 
                      onClick={() => handleBookNow(stay)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={selectedItem} 
      />
    </div>
  );
}
