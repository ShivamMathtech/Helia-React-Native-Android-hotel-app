export type Hotel = {
  id: string; name: string; city: string; country: string; address: string;
  price: number; rating: number; reviews: number; category: 'Recommended' | 'Popular' | 'Trending';
  photo: string; gallery: string[]; description: string; amenities: string[];
  latitude: number; longitude: number;
};
export type Profile = { name: string; nickname: string; email: string; phone: string; country: string; avatar: string };
export type RoomType = 'Deluxe' | 'Suite' | 'Family';
export type BookingDraft = { hotelId: string; checkIn: string; checkOut: string; guests: number; rooms: number; roomType: RoomType; guestName: string; guestEmail: string; specialRequest: string; requestId: string };
export type Quote = { nights: number; nightly: number; subtotal: number; discount: number; taxes: number; total: number };
export type Booking = BookingDraft & { id: string; createdAt: string; status: 'confirmed' | 'cancelled'; payment: 'Demo card' | 'Pay at hotel'; promo: string; quote: Quote };
export type Notice = { id: string; title: string; body: string; date: string; kind: 'booking' | 'cancel' | 'welcome' | 'security'; read: boolean; bookingId?: string };
export type Account = { id: string; profile: Profile; profileComplete: boolean; saved: string[]; bookings: Booking[]; notifications: Notice[] };
export type Store = { version: 1; onboarding: boolean; activeId: string | null; remember: boolean; dark: boolean; bookingAlerts: boolean; accounts: Record<string, Account> };
export type Filters = { country: string; maxPrice: number; minRating: number; sort: 'recommended' | 'price-low' | 'price-high' | 'rating'; amenities: string[] };
export type RootStackParams = {
  Welcome: undefined; Onboarding: undefined; AuthWelcome: undefined;
  SignIn: undefined; SignUp: undefined; FillProfile: undefined;
  ForgotPassword: undefined; VerifyCode: { email: string }; ResetPassword: { email: string };
  Main: { screen?: 'Home' | 'Search' | 'Saved' | 'Bookings' | 'Profile' } | undefined;
  HotelDetails: { hotelId: string }; Gallery: { hotelId: string }; Reviews: { hotelId: string };
  BookStay: { hotelId: string }; Checkout: { draft: BookingDraft };
  BookingSuccess: { bookingId: string }; BookingDetails: { bookingId: string };
  Notifications: undefined; EditProfile: undefined; Settings: undefined; Help: undefined; About: undefined;
};
