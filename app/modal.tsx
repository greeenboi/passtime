import { Link } from "expo-router";
import { Button, Text, XStack } from "tamagui";
import { SheetDemo } from "../components/Sheet";
import { useState } from "react";
import { Input } from "tamagui";

export default function ModalScreen() {
  const [open, setOpen] = useState(false)
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
    </>
  )
}
