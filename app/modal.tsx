import { Link } from "expo-router";
import { Text } from "tamagui";

export default function ModalScreen() {
  return (
    <>
      <Link href="/(signup)/first">
        <Text>Go to first screen</Text>
      </Link>
      <Text>Info about me goes here</Text>
    </>
  )
}
