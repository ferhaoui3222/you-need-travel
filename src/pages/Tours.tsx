import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { MapPin, Search, Clock, Users, Star, Calendar } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const tours = [
  { id: 1, name: 'Kuala Lumpur City Half-Day Tour', location: 'Kuala Lumpur', duration: '4 Hours', price: 25, rating: 4.8, img: 'tour1' },
  { id: 2, name: 'Batu Caves & Genting Highlands', location: 'Selangor', duration: '8 Hours', price: 55, rating: 4.9, img: 'tour2' },
  { id: 3, name: 'Langkawi Island Hopping', location: 'Langkawi', duration: '4 Hours', price: 35, rating: 4.7, img: 'tour3' },
  { id: 4, name: 'Penang Street Food Tour', location: 'Penang', duration: '3 Hours', price: 30, rating: 5.0, img: 'tour4' },
  { id: 5, name: 'Malacca Historical Day Trip', location: 'Malacca', duration: '10 Hours', price: 65, rating: 4.8, img: 'tour5' },
  { id: 6, name: 'Cameron Highlands Nature Tour', location: 'Pahang', duration: '12 Hours', price: 75, rating: 4.6, img: 'tour6' },
];

export default function Tours() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ name: string; price: number; type: string } | null>(null);

  const handleBookNow = (tour: any) => {
    setSelectedItem({ name: tour.name, price: tour.price, type: 'Tour' });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Search Header */}
      <div className="bg-blue-600 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Discover Amazing Tours</h1>
          <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-grow w-full relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Where do you want to go?" className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 font-medium" />
            </div>
            <div className="w-full md:w-48">
              <input type="date" className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 font-medium" />
            </div>
            <button className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <div key={tour.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all">
            <div className="relative h-64 overflow-hidden">
              <img
                src={`https://picsum.photos/seed/${tour.img}/600/400`}
                alt={tour.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-900">{tour.rating}</span>
              </div>
              <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                {tour.location}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 h-14 line-clamp-2">{tour.name}</h3>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Group Tour</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Price per person</p>
                  <p className="text-2xl font-extrabold text-blue-600">${tour.price}</p>
                </div>
                <button 
                  onClick={() => handleBookNow(tour)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                  Book Tour
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={selectedItem} 
      />
    </div>
  );
}
