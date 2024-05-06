import { useState } from "react"
import { Linking, Pressable, ToastAndroid } from "react-native"
import { Button, Card, H3, H4, Image, Paragraph, Spinner, Text, XStack, YStack } from "tamagui"
import { boredAPIType } from "../../constants/Types"
import { IndianRupee, Link, Users, X } from "@tamagui/lucide-icons"
import { boredAPIBackground } from "../../constants/ImageBase64"

export default function BoredAPI () {

    const [ busy, setBusy ] = useState(false)
    const [ content, setContent ] = useState<boredAPIType | null>(null)
    async function getActivities() {
      setBusy(true)
      console.log('Getting activity...')
      try{
        const res = await fetch('https://www.boredapi.com/api/activity')
        const data = await res.json()
        console.log(data)
        setContent(data)
      } catch (error) {
        console.log(error)
        ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT)
      }
      setBusy(false)
    }
  
    return(
      <YStack alignItems="center" gap="$8" theme="green">
        <Button icon={busy  ? () => <Spinner /> : undefined} width={300} height="$4" theme="green" onPress={getActivities}>Press to get a random activity</Button>
        { content && (
            <Card
                elevate
                bordered
                animation="bouncy"
                size="$4"
                width={300}
                height={350}
                scale={0.9}
                hoverStyle={{ scale: 0.925 }}
                pressStyle={{ scale: 0.875 }}
            >
                <Card.Header padded gap={4}>
                    <XStack alignItems='center' justifyContent='space-between'>
                        <H4 textAlign="center"><IndianRupee scale={1} />{content.price}</H4>
                        <Paragraph theme="alt2">{content.type}</Paragraph>
                        <X onPress={() => setContent(null)} />
                    </XStack>
                    <H3 textAlign="justify" >{content.activity}</H3>
                </Card.Header>
                <Card.Footer padded justifyContent="space-between" alignItems="center">
                    <XStack backgroundColor="rgba(13,25,18, 0.5)" padding={3} borderRadius={8} >
                        <Users />
                        <Text>{content.participants}</Text>
                    </XStack>
                    <XStack >
                        <Text>Difficulty: {content.accessibility}</Text>
                    </XStack>
                    {
                        content.link != '' && (
                            <Pressable onPress={() => {
                                Linking.openURL(content.link)
                                ToastAndroid.show('Redirecting...', ToastAndroid.SHORT)
                            }}>
                                <Link />
                            </Pressable>
                        )
                    }
                </Card.Footer>
                <Card.Background>
                <Image
                    resizeMode="contain"
                    alignSelf="center"
                    source={{
                    width: 300,
                    height: 300,
                    uri: `data:image/png;base64,${boredAPIBackground}`,
                    }}
                />
                </Card.Background>
            </Card>
        )}
      </YStack>
    )
  }