import { Sheet } from '@tamagui/sheet'
import { useState } from 'react'
import { Separator } from 'tamagui'


export const SheetDemo = ({
    open,
    setOpen,
    children
}: {
    open : boolean,
    setOpen : React.Dispatch<React.SetStateAction<boolean>>
    children: React.ReactNode
}) => {
  const [position, setPosition] = useState(0)
  const snapPoints = [85, 50, 25]
    

  return (
    <Sheet
        forceRemoveScrollEnabled={open}
        modal={true}
        open={open}
        onOpenChange={setOpen}
        snapPoints={snapPoints}
        snapPointsMode='percent'
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
    >
    <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
    />
    <Sheet.Handle theme="green" />
    <Sheet.Frame padding="$4" paddingTop="$5" justifyContent="flex-start" alignItems="center" gap="$5" theme="green" >
        {/* <Button width="$18" height="$2" icon={ChevronDown} onPress={() => setOpen(false)} /> */}
        <Separator theme="green" />
        {children}
    </Sheet.Frame>
    </Sheet>
  )
}
