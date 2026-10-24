import type { Booking, BookingDraft, Filters, Hotel, Quote, RoomType } from '../types';
export const DEFAULT_FILTERS: Filters = {country:'All',maxPrice:150,minRating:0,sort:'recommended',amenities:[]};
export const ROOM_EXTRA: Record<RoomType, number> = {Deluxe:0,Suite:20,Family:35};
export const money = (value: number) => `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`;
export function localISO(date: Date = new Date()): string {return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function addDays(iso: string, amount: number): string { const d = parseISO(iso); d.setDate(d.getDate()+amount); return localISO(d); }
export function parseISO(iso: string): Date {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new Error('Choose a valid date.');
 const [y,m,d] = iso.split('-').map(Number) as [number,number,number];
 const date = new Date(y,m-1,d,12);
 if(localISO(date)!==iso) throw new Error('Choose a valid date.');
 return date;
}
export function nightsBetween(a: string,b: string): number {
 const x=parseISO(a),y=parseISO(b);
 return Math.round((Date.UTC(y.getFullYear(),y.getMonth(),y.getDate())-Date.UTC(x.getFullYear(),x.getMonth(),x.getDate()))/86400000);
}
export function shortDate(iso:string):string { return parseISO(iso).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }
export function validateEmail(email: string): boolean {return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());}
export function validatePassword(password: string): string | null {return password.length>=8 ? null : 'Use at least 8 characters for your password.';}
export function filterHotels(hotels: Hotel[],query: string,filters: Filters=DEFAULT_FILTERS,category?: string): Hotel[] {
 const q=query.trim().toLowerCase();
 const found=hotels.filter(h=> (!q || `${h.name} ${h.city} ${h.country}`.toLowerCase().includes(q)) &&
  (filters.country==='All'||h.country===filters.country) && h.price<=filters.maxPrice && h.rating>=filters.minRating && filters.amenities.every(a=>h.amenities.includes(a)) && (!category||category==='All'||h.category===category));
 return found.sort((a,b)=>filters.sort==='price-low'?a.price-b.price:filters.sort==='price-high'?b.price-a.price:filters.sort==='rating'?b.rating-a.rating:0);
}
export function validateBooking(d: BookingDraft,today=localISO()):string|null {
 try {
  const nights=nightsBetween(d.checkIn,d.checkOut);
  if(d.checkIn<today) return 'Check-in cannot be in the past.';
  if(nights<1) return 'Check-out must be after check-in.';
  if(nights>30) return 'Choose a stay of 30 nights or fewer.';
  if(nightsBetween(today,d.checkIn)>365) return 'Choose a date within the next year.';
 } catch { return 'Choose valid check-in and check-out dates.'; }
 if(!Number.isInteger(d.rooms)||d.rooms<1||d.rooms>4) return 'Choose 1–4 rooms.';
 if(!Number.isInteger(d.guests)||d.guests<1||d.guests>8) return 'Choose 1–8 guests.';
 const capacity=d.roomType==='Family'?4:2;
 if(d.guests>d.rooms*capacity) return `This room fits ${capacity} guests. Add a room or choose Family.`;
 if(!Object.prototype.hasOwnProperty.call(ROOM_EXTRA,d.roomType)) return 'Choose a valid room type.';
 if(d.guestName.trim().length<2) return 'Enter the guest’s full name.';
 if(!validateEmail(d.guestEmail)) return 'Enter a valid guest email.';
 if(d.specialRequest.length>400) return 'Keep special requests under 400 characters.';
 return null;
}
export function quoteBooking(price: number,d: Pick<BookingDraft,'checkIn'|'checkOut'|'rooms'|'roomType'>,promo=''):Quote {
 const nights=nightsBetween(d.checkIn,d.checkOut);
 if(nights<1||nights>30||!Number.isInteger(d.rooms)||d.rooms<1||d.rooms>4||!Number.isFinite(price)||price<=0||!Object.prototype.hasOwnProperty.call(ROOM_EXTRA,d.roomType))throw new Error('Invalid booking details.');
 const nightly=price+ROOM_EXTRA[d.roomType];
 const subtotal=Math.round(nightly*100)*nights*d.rooms;
 const discount=promo.trim().toUpperCase()==='HELIA10'?Math.round(subtotal*.1):0;
 const taxes=Math.round((subtotal-discount)*.1);
 return {nights,nightly,subtotal:subtotal/100,discount:discount/100,taxes:taxes/100,total:(subtotal-discount+taxes)/100};
}
export function bookingStage(b:Booking,today=localISO()):'Upcoming'|'Completed'|'Cancelled' {
 return b.status==='cancelled'?'Cancelled':b.checkOut<=today?'Completed':'Upcoming';
}
export function canCancel(b:Booking,today=localISO()):boolean {return b.status==='confirmed'&&b.checkIn>today;}
export function receiptText(b:Booking,hotelName:string):string {
 return `HELIA • DEMO BOOKING\n${b.id}\n${hotelName}\n${shortDate(b.checkIn)} – ${shortDate(b.checkOut)}\n${b.rooms} room(s) • ${b.guests} guest(s) • ${b.roomType}\nGuest: ${b.guestName}\nTotal: ${money(b.quote.total)} USD\nPayment: ${b.payment}\nStatus: ${b.status}\n\nDemo only. No real reservation or charge was made.`;
}
