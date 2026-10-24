import React,{useEffect} from 'react';
import {Pressable,Text,View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useFonts} from 'expo-font';
const Urbanist_400Regular=require('@expo-google-fonts/urbanist/400Regular/Urbanist_400Regular.ttf');
const Urbanist_500Medium=require('@expo-google-fonts/urbanist/500Medium/Urbanist_500Medium.ttf');
const Urbanist_600SemiBold=require('@expo-google-fonts/urbanist/600SemiBold/Urbanist_600SemiBold.ttf');
const Urbanist_700Bold=require('@expo-google-fonts/urbanist/700Bold/Urbanist_700Bold.ttf');
const Urbanist_800ExtraBold=require('@expo-google-fonts/urbanist/800ExtraBold/Urbanist_800ExtraBold.ttf');
import * as SplashScreen from 'expo-splash-screen';
import {StoreProvider} from './src/state/store';
import {RootNavigator} from './src/navigation/RootNavigator';
SplashScreen.preventAutoHideAsync().catch(()=>{});
class ErrorBoundary extends React.Component<{children:React.ReactNode},{error:boolean}>{
 state={error:false};static getDerivedStateFromError(){return {error:true};}
 componentDidCatch(error:Error){console.error('Helia screen error:',error);}
 render(){if(this.state.error)return <View style={{flex:1,justifyContent:'center',padding:32,backgroundColor:'white',gap:20}}><Text style={{fontSize:28,fontWeight:'700'}}>A little detour.</Text><Text>Something went wrong while opening this screen. Try reloading the app.</Text><Pressable onPress={()=>this.setState({error:false})} style={{backgroundColor:'#16B66A',padding:18,borderRadius:28,alignItems:'center'}}><Text style={{color:'white',fontWeight:'700'}}>Try again</Text></Pressable></View>;return this.props.children;}
}
export default function App(){const [loaded,error]=useFonts({Urbanist_400Regular,Urbanist_500Medium,Urbanist_600SemiBold,Urbanist_700Bold,Urbanist_800ExtraBold});useEffect(()=>{if(loaded||error)SplashScreen.hideAsync().catch(()=>{});},[loaded,error]);if(!loaded&&!error)return null;return <ErrorBoundary><SafeAreaProvider><StoreProvider><RootNavigator/></StoreProvider></SafeAreaProvider></ErrorBoundary>;}
