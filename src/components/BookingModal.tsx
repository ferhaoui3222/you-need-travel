import { X, Calendar, Users, CreditCard, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    name: string;
    price: number | string;
    type: string;
  } | null;
}

export default function BookingModal({ isOpen, onClose, item }: BookingModalProps) {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Booking</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Item Summary */}
              <div className="bg-blue-50 p-6 rounded-3xl flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase mb-1">{item.type}</p>
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-blue-600">${item.price}</p>
                  <p className="text-xs text-gray-500 font-bold">Total Amount</p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="Select Date" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="number" placeholder="Guests" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="pt-6 border-t">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <span className="font-bold text-gray-900">Payment Method</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {['Visa', 'Mastercard', 'PayPal'].map((method) => (
                    <button key={method} className="py-3 border-2 border-gray-100 rounded-2xl font-bold text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all">
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                <ShieldCheck className="w-6 h-6" />
                Confirm & Pay Now
              </button>
              
              <p className="text-center text-xs text-gray-400 font-medium">
                By clicking "Confirm & Pay Now", you agree to our <a href="/terms" className="text-blue-600 underline">Terms of Use</a> and <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a>.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
