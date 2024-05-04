import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cog } from '@tamagui/lucide-icons';
import { Link, SplashScreen, Tabs, useRouter } from 'expo-router'
import { useEffect, useState } from 'react';
import { Pressable, ToastAndroid } from 'react-native'
import { Text } from 'tamagui'

export default function SignUpLayout() {
  const [name, setName] = useState('');
  const router = useRouter();
  useEffect(() => {
    async function getName() {
      SplashScreen.preventAutoHideAsync()
      const myname = await AsyncStorage.getItem('name');
      if (myname !== null){
        setName(myname);
        SplashScreen.hideAsync()
      }
      else {
        ToastAndroid.show('Data Missing', 1000);
      }
    }

    getName();
  }, [])
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'teal',
        
      }}
    >
      <Tabs.Screen
        name="first"
        options={{
          title: `Welcome ${name}`,
          href: '/first',
          tabBarIcon: ({ color }) => <Text>Fun</Text>,
          headerRight: () => (
            <Pressable onLongPress={() => ToastAndroid.show('stop touching me onisan', 1000)}>
              <Link href="/settings">
                <Cog color="$green9Dark" />
              </Link>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="second"
        options={{
          title: 'Fun Things',
          href: '/second',
          tabBarIcon: ({ color }) => <Text>Hello!</Text>,
        }}
      />
    </Tabs>
  )
}
