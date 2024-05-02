import { Link, useRouter } from "expo-router";
import { Button, Text, XStack } from "tamagui";
import { SheetDemo } from "../components/Sheet";
import { useState } from "react";
import { Input } from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";
import { AlertTriangle } from "@tamagui/lucide-icons";
export default function ModalScreen() {
  const [open, setOpen] = useState(false)
  const [ busy, setBusy ] = useState(false)

  const router = useRouter();

  const clearUserdata = async() => {
    setBusy(true)
    try {
      await AsyncStorage.removeItem('name')
      await AsyncStorage.removeItem('description')
      ToastAndroid.showWithGravity('Data Cleared', ToastAndroid.SHORT, ToastAndroid.CENTER)
      router.replace('/');
    } catch (error) {
      ToastAndroid.showWithGravity(`${error}`, ToastAndroid.SHORT, ToastAndroid.CENTER)
    }
    setBusy(false)
  }
  return (
    <>
      <Link href="/(signup)/first">
        <Text>Go to first screen</Text>
      </Link>
      <Text>Info about me goes here</Text>
      <Button onPress={() => setOpen(true)}>Open</Button>
      {open && <Text>Sheet is open</Text>}
      <SheetDemo 
        open={open} 
        setOpen={setOpen} 
        children={
          <XStack alignItems="center" gap="$2">
            <Input flex={1} size="$4"  />
            <Button size='$4'>Go</Button>
          </XStack>
        }
      />

      <Button onPress={clearUserdata} theme="red"><AlertTriangle />Close</Button>
    </>
  )
}
