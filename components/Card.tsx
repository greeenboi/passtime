import { Button, Card, H2, Paragraph, XStack, Image, YStack } from 'tamagui'
import type { Image as IMGType } from 'tamagui'
import { Circle, Info } from '@tamagui/lucide-icons'
import { Pressable, ToastAndroid } from 'react-native'
import { SheetDemo } from './Sheet'
import { useState } from 'react'
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
    press,
} : {
    Heading: string
    Para: string
    buttonText: string
    longPress?: () => void
    isVisible?: boolean
    pressableClick?: () => void
    url: string
    press: () => void
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
        onPress={() => ToastAndroid.show('Oooh That tickles... Press me longer', ToastAndroid.SHORT)}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
        onLongPress={longPress}
        theme="green"
    >

      <Card.Header padded>
        <XStack alignItems='center' justifyContent='space-between'>
            <YStack alignItems='flex-start' justifyContent='center' gap={2}>
                <H2>{Heading}</H2>
                <Paragraph theme="green_alt2" maxWidth="$16">
                    {Para} 
                </Paragraph>
            </YStack>
            <Pressable onPress={pressableClick} disabled={!isVisible} style={isVisible ? {opacity : 1} : { opacity : 0 }}>
                <Info />
            </Pressable>
            
        </XStack>
      </Card.Header>
      <Card.Footer padded alignItems='center' backgroundColor="rgba(13,25,18, 0.3)" >
        
        <XStack flex={1} />
        <Button borderRadius="$10" marginBottom='10px' onPress={press}>{buttonText}</Button>
      </Card.Footer>
      <Card.Background alignContent='center' justifyContent='flex-end'>
        <Image
            resizeMode="contain"
            alignSelf="center"
            source={{
            width: 260,
            height: 260,
            uri: `data:image/png;base64,${url}`,
            }}
        />
      </Card.Background>
    </Card>
  )
}
