import { Button, Card, H2, Paragraph, XStack, Image } from 'tamagui'
import type { Image as IMGType } from 'tamagui'
import { Circle, Info } from '@tamagui/lucide-icons'
import { Pressable } from 'react-native'
export function CardStack({
    children,
} : {
    children: React.ReactNode
}) {

  return (

    <XStack $sm={{ flexDirection: 'column' }} paddingHorizontal="$4" gap={18}>
      {children}
    </XStack>

  )

}
export function CardItem({
    Heading,
    Para,
    buttonText,
    longPress,
    pressableClick,
    isVisible,
    url,
} : {
    Heading: string
    Para: string
    buttonText: string
    longPress?: () => void
    isVisible?: boolean
    pressableClick?: () => void
    url: string
}) {

  return (
    <Card 
        elevate 
        size="$4"
        bordered 
        animation="bouncy"
        width={300}
        height={350}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
        onLongPress={longPress}
        theme="green"
    >

      <Card.Header padded>
        <H2>{Heading}</H2>
        <Paragraph theme="green_alt2">{Para}</Paragraph>
      </Card.Header>
      <Card.Footer padded alignItems='center' backgroundColor="rgba(13,25,18, 0.3)" >
        <Pressable onPress={pressableClick} disabled={!isVisible} style={isVisible ? {opacity : 1} : { opacity : 0 }}>
            <Info />
        </Pressable>
        <XStack flex={1} />
        <Button borderRadius="$10">{buttonText}</Button>
      </Card.Footer>
      <Card.Background alignContent='center' justifyContent='flex-end'>
        <Image
            resizeMode="contain"
            alignSelf="center"
            source={{
            width: 250,
            height: 250,
            uri: `data:image/png;base64,${url}`,
            }}
        />
      </Card.Background>
    </Card>
  )
}
