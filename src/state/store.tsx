import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Account,Booking,BookingDraft,Notice,Profile,Store} from '../types';
import {findHotel} from '../data/hotels';
import {addDays,canCancel,localISO,quoteBooking,validateBooking,validateEmail,validatePassword} from '../lib/domain';
import {checkPassword,clearCredentials,setPassword,uid} from '../lib/auth';
const KEY='helia.state.v1';
const notice=(title:string,body:string,kind:Notice['kind']='welcome',bookingId?:string):Notice=>({id:uid(),title,body,kind,bookingId,date:new Date().toISOString(),read:false});
function account(id:string,name:string,email:string):Account{
 return {id,profile:{name,nickname:name.split(' ')[0]||name,email,phone:'',country:'',avatar:'leaf'},profileComplete:true,saved:['palazzo','azure'],bookings:[],notifications:[notice('Welcome to Helia','Your next little escape starts here. Explore our sample stays and make yourself at home.')]};
}
function initial():Store{
 const demo=account('demo','Daniel Austin','demo@helia.app');
 const draft:BookingDraft={hotelId:'president',checkIn:addDays(localISO(),14),checkOut:addDays(localISO(),17),guests:2,rooms:1,roomType:'Deluxe',guestName:'Daniel Austin',guestEmail:'demo@helia.app',specialRequest:'',requestId:'sample-stay'};
 demo.bookings=[{...draft,id:'HL-SAMPLE',createdAt:new Date().toISOString(),status:'confirmed',payment:'Pay at hotel',promo:'',quote:quoteBooking(35,draft)}];
 return {version:1,onboarding:false,activeId:null,remember:true,dark:false,bookingAlerts:true,accounts:{demo}};
}
function validStored(value:unknown):value is Store{
 if(!value||typeof value!=='object')return false;
 const s=value as Store;
 return s.version===1&&typeof s.onboarding==='boolean'&&typeof s.dark==='boolean'&&typeof s.remember==='boolean'&&typeof s.bookingAlerts==='boolean'&&!!s.accounts&&typeof s.accounts==='object'&&(s.activeId===null||typeof s.activeId==='string')&&Object.values(s.accounts).every(a=>a&&typeof a.id==='string'&&a.profile&&typeof a.profile.name==='string'&&typeof a.profile.email==='string'&&typeof a.profileComplete==='boolean'&&Array.isArray(a.saved)&&Array.isArray(a.bookings)&&Array.isArray(a.notifications)&&a.bookings.every(b=>b&&typeof b.id==='string'&&typeof b.hotelId==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(b.checkIn)&&/^\d{4}-\d{2}-\d{2}$/.test(b.checkOut)&&b.quote&&Number.isFinite(b.quote.total)));
}
type Actions={
 state:Store;user:Account|null;ready:boolean;storageError:string;
 completeOnboarding:()=>void;signIn:(email:string,password:string,remember:boolean)=>Promise<void>;
 signUp:(name:string,email:string,password:string)=>Promise<void>;demo:()=>void;signOut:()=>void;
 updateProfile:(profile:Profile)=>void;toggleSaved:(id:string)=>void;
 createBooking:(draft:BookingDraft,payment:Booking['payment'],promo:string)=>string;
 cancelBooking:(id:string)=>void;markRead:()=>void;setDark:(value:boolean)=>void;setAlerts:(value:boolean)=>void;
 beginRecovery:(email:string)=>string;verifyRecovery:(email:string,code:string)=>void;resetPassword:(email:string,password:string)=>Promise<void>;
 resetAll:()=>Promise<void>;
};
const Context=createContext<Actions|null>(null);
export function StoreProvider({children}:{children:React.ReactNode}){
 const [state,setState]=useState<Store>(()=>initial());const ref=useRef(state);
 const [ready,setReady]=useState(false);const [storageError,setStorageError]=useState('');
 const queue=useRef(Promise.resolve());
 const recovery=useRef<{email:string;code:string;expires:number;attempts:number;verified:boolean}|null>(null);
 useEffect(()=>{let active=true;(async()=>{
  try { const raw=await AsyncStorage.getItem(KEY);if(raw){const parsed:unknown=JSON.parse(raw);if(!validStored(parsed))throw new Error('invalid'); if(parsed.activeId&&!parsed.accounts[parsed.activeId])parsed.activeId=null;if(active){ref.current=parsed;setState(parsed);}} }
  catch {if(active)setStorageError('Saved data could not be loaded. New changes may replace it.');}
  finally {if(active)setReady(true);}
 })();return()=>{active=false;};},[]);
 function commit(next:Store){
  ref.current=next;setState(next);
  const serialized=JSON.stringify({...next,activeId:next.remember?next.activeId:null});
  queue.current=queue.current.then(()=>AsyncStorage.setItem(KEY,serialized)).then(()=>setStorageError('')).catch(()=>setStorageError('Changes could not be saved. Check device storage.'));
 }
 const current=():Account=>{const s=ref.current;const a=s.activeId?s.accounts[s.activeId]:null;if(!a)throw new Error('Please sign in first.');return a;};
 const changeUser=(transform:(a:Account)=>Account)=>{const a=current();commit({...ref.current,accounts:{...ref.current.accounts,[a.id]:transform(a)}});};
 function beginRecovery(email:string){
  const normalized=email.trim().toLowerCase();if(!Object.values(ref.current.accounts).some(a=>a.profile.email.toLowerCase()===normalized))throw new Error('No local account found. Try demo@helia.app or create an account.');
  const code=String(Math.floor(1000+Math.random()*9000));recovery.current={email:normalized,code,expires:Date.now()+300000,attempts:0,verified:false};return code;
 }
 const actions:Actions={state,user:state.activeId?state.accounts[state.activeId]||null:null,ready,storageError,
  completeOnboarding:()=>commit({...ref.current,onboarding:true}),
  async signIn(email,password,remember){
   const a=Object.values(ref.current.accounts).find(a=>a.profile.email.toLowerCase()===email.trim().toLowerCase());
   if(!a||!await checkPassword(a.id,password))throw new Error('Email or password is incorrect. Demo: demo@helia.app / Helia@123');
   commit({...ref.current,activeId:a.id,remember,onboarding:true});
  },
  async signUp(name,email,password){
   email=email.trim().toLowerCase();if(name.trim().length<2)throw new Error('Enter your full name.');if(!validateEmail(email))throw new Error('Enter a valid email address.');
   const error=validatePassword(password);if(error)throw new Error(error);
   if(Object.values(ref.current.accounts).some(a=>a.profile.email.toLowerCase()===email))throw new Error('An account with this email already exists on this device.');
   const id=uid();await setPassword(id,password);const a=account(id,name.trim(),email);a.profileComplete=false;a.saved=[];
   commit({...ref.current,activeId:id,remember:true,onboarding:true,accounts:{...ref.current.accounts,[id]:a}});
  },
  demo(){commit({...ref.current,activeId:'demo',remember:true,onboarding:true});},
  signOut(){commit({...ref.current,activeId:null});recovery.current=null;},
  updateProfile(profile){if(profile.name.trim().length<2)throw new Error('Enter your full name.');if(profile.phone&&!/^[+\d\s()-]{7,20}$/.test(profile.phone))throw new Error('Enter a valid phone number.');changeUser(a=>({...a,profile:{...profile,name:profile.name.trim(),email:a.profile.email},profileComplete:true}));},
  toggleSaved(id){if(!findHotel(id))return;changeUser(a=>({...a,saved:a.saved.includes(id)?a.saved.filter(x=>x!==id):[id,...a.saved]}));},
  createBooking(draft,payment,promo){
   const a=current();const existing=a.bookings.find(b=>b.requestId===draft.requestId);if(existing)return existing.id;
   const error=validateBooking(draft);if(error)throw new Error(error);const hotel=findHotel(draft.hotelId);if(!hotel)throw new Error('This hotel is not available.');
   if(promo&&promo.trim().toUpperCase()!=='HELIA10')throw new Error('This promo code is not valid.');
   const id=`HL-${uid().replace(/-/g,'').slice(0,8).toUpperCase()}`;
   const b:Booking={...draft,id,createdAt:new Date().toISOString(),status:'confirmed',payment,promo:promo.trim().toUpperCase(),quote:quoteBooking(hotel.price,draft,promo)};
   changeUser(a=>({...a,bookings:[b,...a.bookings],notifications:ref.current.bookingAlerts?[notice('Booking confirmed',`Your demo stay at ${hotel.name} is ready to explore.`,'booking',id),...a.notifications]:a.notifications}));return id;
  },
  cancelBooking(id){const b=current().bookings.find(b=>b.id===id);if(!b||!canCancel(b))throw new Error('Only stays with a future check-in can be cancelled.');changeUser(a=>({...a,bookings:a.bookings.map(b=>b.id===id?{...b,status:'cancelled'}:b),notifications:ref.current.bookingAlerts?[notice('Booking cancelled','Your demo reservation has been cancelled. No money was charged.','cancel',id),...a.notifications]:a.notifications}));},
  markRead(){changeUser(a=>({...a,notifications:a.notifications.map(n=>({...n,read:true}))}));},
  setDark(dark){commit({...ref.current,dark});},setAlerts(bookingAlerts){commit({...ref.current,bookingAlerts});},beginRecovery,
  verifyRecovery(email,code){const r=recovery.current;if(!r||r.email!==email||Date.now()>r.expires)throw new Error('Code expired. Go back and request a new one.');if(r.attempts>=5)throw new Error('Too many attempts. Request a new code.');r.attempts++;if(r.code!==code)throw new Error('That code is incorrect.');r.verified=true;},
  async resetPassword(email,password){const r=recovery.current;if(!r||r.email!==email||!r.verified||Date.now()>r.expires)throw new Error('Verify a new code first.');const error=validatePassword(password);if(error)throw new Error(error);const a=Object.values(ref.current.accounts).find(a=>a.profile.email===email);if(!a)throw new Error('Account not found.');await setPassword(a.id,password);recovery.current=null;commit({...ref.current,accounts:{...ref.current.accounts,[a.id]:{...a,notifications:[notice('Password updated','Your local demo account password was changed.','security'),...a.notifications]}}});},
  async resetAll(){await queue.current;await clearCredentials();await AsyncStorage.removeItem(KEY);const next=initial();ref.current=next;setState(next);setStorageError('');recovery.current=null;},
 };
 return <Context.Provider value={actions}>{children}</Context.Provider>;
}
export function useApp(){const value=useContext(Context);if(!value)throw new Error('StoreProvider is required.');return value;}
