import { ScrollView, XStack, YStack } from 'tamagui'

export function ScrollViewX({
    children,
    height,
    width,
    backgroundColor,
    padding,
    borderRadius,
}: {
    children: React.ReactNode
    height: string
    width: string
    backgroundColor: string
    padding: string
    borderRadius: any
}) {

  return (

    <ScrollView
      maxHeight={height}
      width={width}
      backgroundColor={backgroundColor}
      padding={padding}
      borderRadius={borderRadius}
    >
      <XStack flexWrap="wrap" alignItems="center" justifyContent="center">
        {children}
      </XStack>
    </ScrollView>

  )
}

export function ScrollViewY({
    children,
    height,
    width,
    backgroundColor,
    padding,
    borderRadius,
}: {
    children: React.ReactNode
    height: string | number
    width: string
    backgroundColor: string
    padding: string
    borderRadius: any
}) {

  return (

    <ScrollView
      maxHeight={height}
      height="99%"
      width={width}
      backgroundColor={backgroundColor}
      padding={padding}
      borderRadius={borderRadius}
      paddingVertical="110px"
    >
      <YStack  alignItems="center" justifyContent="center">
        {children}
      </YStack>
    </ScrollView>

  )
}
