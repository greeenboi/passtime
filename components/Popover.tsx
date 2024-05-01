import React from 'react';
import { Adapt, Button, Input, Label, Popover, XStack, YStack } from 'tamagui'
import type { PopoverProps } from 'tamagui'

export function Info({
    Icon,
    Name,
    children,
    ...props
  }: PopoverProps & { Icon?: any; Name?: string, children: React.ReactNode}) {
    return (
      <Popover size="$5" allowFlip {...props}>
        <Popover.Trigger asChild>
          <Button icon={Icon} backgroundColor="$colorTransparent" padding={0} />
        </Popover.Trigger>
  
        <Adapt when="sm" platform="touch">
          <Popover.Sheet modal dismissOnSnapToBottom>
            <Popover.Sheet.Frame padding="$4">
              <Adapt.Contents />
            </Popover.Sheet.Frame>
            <Popover.Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Popover.Sheet>
        </Adapt>
  
        <Popover.Content
          borderWidth={1}
          borderColor="$borderColor"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
            {children}
        </Popover.Content>
      </Popover>
    )
  }