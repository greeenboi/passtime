import { Button, Input, XStack } from "tamagui";

export default function AgifyApi() {
    return(
        <XStack alignItems="center" gap="$2" theme="green">
            <Button size='$4' theme="green">Go</Button>
            <Input flex={1} size="$4" theme="green" />
        </XStack>
    )
}