import { Button, Form, H4, Image, Input, Label, Spinner, Text, View, XStack, YStack } from 'tamagui'
import comingSoon from '../../constants/ImageBase64'
import { Info, Mail } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { SheetDemo } from '../../components/Sheet'
import * as Haptics from 'expo-haptics';
import { ToastAndroid } from 'react-native'

export default function SecondScreen() {

  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(false)


  function handleSubmit() {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
    }, 2000)
  }

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
        <Form
          alignItems="center"
          minWidth={300}
          gap="$2"
          onSubmit={handleSubmit}
          padding="$8"
        >
          <XStack alignItems="center" gap="$4" width="$18">
            <Label width='$3' htmlFor="email">
              Email
            </Label>
            <Input flex={1} id="email" placeholder='Your email' />
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
