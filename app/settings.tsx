import { View } from "tamagui";
import { ScrollViewY } from "../components/ScrollView";
import { AccordionSettings } from "../components/Accordion";


export default function SettingsScreen() {
  
  return (
      
    <View display='flex' alignItems='center' justifyContent='center'>
      <ScrollViewY
        height={1000}
        width="94%"
        backgroundColor="#0D1912"
        padding="$4"
        borderRadius="$4"
      >
        <AccordionSettings />
      </ScrollViewY>
    </View>
  )
}
