export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  stars: number;
  description?: string;
  images?: string[];
}

export interface RoomRate {
  id: string;
  hotelId: string;
  seasonName: string;
  startDate: string;
  endDate: string;
  singleRate: number;
  doubleRate: number;
  tripleRate: number;
  childWithBedRate: number;
  childNoBedRate: number;
  infantRate: number;
}

export interface Expense {
  id: string;
  name: string;
  type: 'Transfer' | 'Tour' | 'Flight' | 'Ferry' | 'Meal';
  city: string;
  country: string;
  price: number;
  calculationType: 'Per Person' | 'Per Group';
  description?: string;
}

export interface Package {
  id: string;
  name: string;
  country: string;
  cities: string[];
  hotelOptions: string[];
  includedExpenses: string[];
  baseMarkup: number;
}

export interface Agency {
  id: string;
  name: string;
  email: string;
  commissionRate: number;
  walletBalance: number;
  role: 'admin' | 'agency';
}

export interface Booking {
  id: string;
  agencyId: string;
  packageId: string;
  travelerName: string;
  adults: number;
  children: { age: number; needsBed: boolean }[];
  startDate: string;
  itinerary: { city: string; hotelId: string; nights: number }[];
  totalCost: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}
