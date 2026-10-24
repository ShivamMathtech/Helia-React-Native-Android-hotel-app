import React,{useState} from 'react';
import {Pressable,View} from 'react-native';
import {addDays,localISO,parseISO} from '../lib/domain';
import {IconButton,T,useColors} from './ui';
export function CalendarRange({checkIn,checkOut,onChange}:{checkIn:string;checkOut:string;onChange:(start:string,end:string)=>void}){
 const c=useColors();const [month,setMonth]=useState(()=>{const d=parseISO(checkIn);d.setDate(1);return d;});const [startNext,setStartNext]=useState(true);
 const today=localISO();const horizon=addDays(today,365);
 const first=(month.getDay()+6)%7;const total=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
 const cells=Array.from({length:Math.ceil((first+total)/7)*7},(_,i)=>i-first+1);
 const move=(offset:number)=>setMonth(new Date(month.getFullYear(),month.getMonth()+offset,1,12));
 const thisMonth=localISO(month).slice(0,7);
 return <View><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10}}><IconButton name="chevron-back" label="Previous month" onPress={()=>{if(thisMonth>today.slice(0,7))move(-1);}}/><T weight="bold" size={17}>{month.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</T><IconButton name="chevron-forward" label="Next month" onPress={()=>{if(thisMonth<horizon.slice(0,7))move(1);}}/></View><View style={{flexDirection:'row'}}>{['M','T','W','T','F','S','S'].map((day,i)=><T key={i} size={12} color={c.muted} weight="bold" style={{width:'14.285714%',textAlign:'center',marginBottom:10}}>{day}</T>)}</View><View style={{flexDirection:'row',flexWrap:'wrap'}}>{cells.map((day,i)=>{
 if(day<1||day>total)return <View key={i} style={{width:'14.285714%',height:43}}/>;
 const iso=localISO(new Date(month.getFullYear(),month.getMonth(),day,12));const disabled=iso<today||iso>horizon;const edge=iso===checkIn||iso===checkOut;const inRange=checkOut&&iso>checkIn&&iso<checkOut;
 return <Pressable key={i} accessibilityRole="button" accessibilityLabel={`Select ${iso}`} accessibilityState={{disabled,selected:edge}} disabled={disabled} onPress={()=>{if(startNext||iso<=checkIn){onChange(iso,'');setStartNext(false);}else{onChange(checkIn,iso);setStartNext(true);}}} style={{width:'14.285714%',height:43,padding:2}}><View style={{flex:1,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:edge?c.green:inRange?c.tint:'transparent'}}><T size={14} weight={edge?'bold':'medium'} color={edge?'white':disabled?c.line:c.text}>{day}</T></View></Pressable>;
 })}</View><T size={12} color={c.muted} style={{textAlign:'center',marginTop:12}}>{startNext?'Tap a date to start a new selection.':'Now choose your check-out date.'}</T></View>;
}
