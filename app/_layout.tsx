import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { SplashScreen, Stack, useRouter } from 'expo-router'
import { ToastAndroid, useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'

import '../tamagui-web.css'

import { config } from '../tamagui.config'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import * as Network from 'expo-network';

import NetInfo from '@react-native-community/netinfo';
import * as NavigationBar from 'expo-navigation-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()
NavigationBar.setBehaviorAsync('overlay-swipe')

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })
  const router = useRouter();

  useEffect(() => {
    if (interLoaded || interError) {
      const checkOnboarding = async () => {
        console.log('checking onboarding')
        const value = await AsyncStorage.getItem('name');
        console.log('value', value);
        if (value !== null) {
          console.log('hasBeenOnboarded', value);
          router.replace('/(signup)/first');
        }
        else {
          router.replace('/');
        }
        SplashScreen.hideAsync()
      }
      
      checkOnboarding();
    }
  }, [interLoaded, interError])

  useEffect(() => {
    const intervalId = setInterval(() => {
      NavigationBar.setVisibilityAsync('hidden');
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (!interLoaded && !interError) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('isreachable: ', state.isInternetReachable);
      if(!state.isInternetReachable){
        ToastAndroid.show('Please check your internet connectivity', 2000)
      }
    });  

    const getStuffs = async () => {
      try {
        const ip = await Network.getIpAddressAsync();
        // console.log('ip: ', ip);
        AsyncStorage.setItem('ip', ip);
      } catch (error) {
        console.log('error: ', error);
      }
    }
    
    getStuffs();
    unsubscribe();
  }, [])

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(signup)" options={{ presentation: 'modal', headerShown: false }}  />
            <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  )
}
