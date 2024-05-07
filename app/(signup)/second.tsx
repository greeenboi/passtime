import { Button, Form, H4, Image, Input, Label, Spinner, Text, View, XStack, YStack } from 'tamagui'
import { comingSoon } from '../../constants/ImageBase64'
import { Info, Mail } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { SheetDemo } from '../../components/Sheet'
import * as Haptics from 'expo-haptics';
import { ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

export default function SecondScreen() {

  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [mail, setMail] = useState<string | null>(null)
  const [data, setData] = useState({
    name: '',
    desc: '',
    hmm: '',
  })

  const router = useRouter()

  async function sendDataToServer() {
    if(!email) {
      ToastAndroid.show('Please enter your email', ToastAndroid.SHORT)
      return;
    }
    setBusy(true)
    const response = await fetch('https://passtime-server.vercel.app/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          emailid: email,
          name: data.name,
          desc: data.desc,
          hmm: data.hmm,
      }),
    });
  
    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      throw new Error(message);
    }
    setBusy(false)
    const responseData = await response.json();
    await AsyncStorage.setItem('maillist', 'true')
    setOpen(false)
    ToastAndroid.show('You have successfully signed up! We shall mail you when its ready!', ToastAndroid.LONG)
    router.replace('/(signup)/first')
    return responseData;
  }

  useEffect(() => {
    async function getUserDetails() {
      const name =await AsyncStorage.getItem('name')
      const desc =await AsyncStorage.getItem('description')
      const hmm = await AsyncStorage.getItem('ip')
      const mail = await AsyncStorage.getItem('maillist')
      if(!name || !desc || !hmm) {
        ToastAndroid.show('Error Fetching details', ToastAndroid.SHORT)
        return;
      }
      setData({
        name: name,
        desc: desc,
        hmm: hmm,
      })
      setMail(mail)
    }

    getUserDetails()
  }, [])

  return (
    <View 
      flex={1} 
      alignItems="center"
      enterStyle={{
        opacity: 0,
        scale: 1.5,
        y: -10,
      }}
      animation="superBouncy"
      opacity={1}
    >
      <Image
        source={{
          uri: `data:image/png;base64,${comingSoon}`,
          width: 390,
          height: 844,
        }}
        resizeMode="contain"
        alignSelf="center"
        width="98%"
        height='98%'
      />
          <Button
            size="$4"
            icon={busy  ? () => <Spinner /> : <Mail />}
            elevation="$4"
            style={{
              position: 'absolute',
              bottom: 100,
              marginBottom: 20,
            }}
            theme="green"
            enterStyle={{
              opacity: 0,
            }}
            animation="bouncy"
            opacity={1}
            onPress={() =>{
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              )
              setOpen(true)
            }}
          >
            Sign Up Now! 
          </Button>
      <SheetDemo open={open} setOpen={setOpen}>
        { mail !== null && <Text fontSize="$4" fontFamily="$heading" textAlign="center">You have already registered.</Text> }
        <Form
          alignItems="center"
          minWidth={300}
          gap="$2"
          onSubmit={sendDataToServer}
          padding="$8"
        >
          <XStack alignItems="center" gap="$4" width="$18">
            <Label width='$3' htmlFor="email">
              Email
            </Label>
            <Input flex={1} id="email" onChangeText={setEmail} placeholder='Your email' />
          </XStack>


          <XStack gap="$4" width="$18" alignItems='center' justifyContent='space-between' marginVertical="$2">
            <Info onPress={()=>{
              ToastAndroid.show('We will never share your email with anyone else.', ToastAndroid.SHORT)
            }}/>
            <Form.Trigger asChild disabled={busy} >
                <Button flex={1} icon={busy ? <Spinner /> : undefined}>
                  Submit
                </Button>
            </Form.Trigger>
          </XStack>
        </Form>
      </SheetDemo>
    </View>
  )
}
