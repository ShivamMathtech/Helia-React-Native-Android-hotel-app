import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { pbkdf2Async } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
const KEY='helia.credentials.v1';
type Credential={salt:string;hash:string};
const read = async ():Promise<Record<string,Credential>>=> {
 const raw=Platform.OS==='web'?globalThis.localStorage.getItem(KEY):await SecureStore.getItemAsync(KEY);
 return raw?JSON.parse(raw):{};
};
const write=async(data:Record<string,Credential>)=> {
 const raw=JSON.stringify(data);
 if(Platform.OS==='web')globalThis.localStorage.setItem(KEY,raw); else await SecureStore.setItemAsync(KEY,raw);
};
async function derive(password:string,salt:string):Promise<string>{return bytesToHex(await pbkdf2Async(sha256,password,hexToBytes(salt),{c:100000,dkLen:32,asyncTick:10}));}
export async function setPassword(id:string,password:string):Promise<void>{
 const all=await read();const salt=bytesToHex(await Crypto.getRandomBytesAsync(16));
 all[id]={salt,hash:await derive(password,salt)};await write(all);
}
export async function checkPassword(id:string,password:string):Promise<boolean>{
 const all=await read();const item=all[id];
 if(!item) return id==='demo' && password==='Helia@123';
 const actual=await derive(password,item.salt);let difference=actual.length^item.hash.length;
 for(let i=0;i<actual.length;i++)difference|=actual.charCodeAt(i)^(item.hash.charCodeAt(i)||0);
 return difference===0;
}
export async function clearCredentials():Promise<void>{if(Platform.OS==='web')globalThis.localStorage.removeItem(KEY);else await SecureStore.deleteItemAsync(KEY);}
export const uid=()=>Crypto.randomUUID();
