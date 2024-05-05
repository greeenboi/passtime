import { View} from 'tamagui'
import { CardItem, CardStack } from '../../components/Card'
import { ScrollViewY } from '../../components/ScrollView'
import { SheetDemo } from '../../components/Sheet'
import React, { useState } from 'react'
import { ToastAndroid } from 'react-native'
import * as Haptics from 'expo-haptics';
import BoredAPI from '../../components/API/BoredApi'
import AgifyApi from '../../components/API/AgifyApi'
import RoboHashAPI from '../../components/API/RoboHashAPI'
import GenderizeAPI from '../../components/API/GenderizeAPI'
import NationalizeAPI from '../../components/API/NationalizeApi'
import { agifyAPIBanner, boredAPIBanner, genderizeAPIBanner, nationalizeAPIBanner, robohashAPIBanner } from '../../constants/ImageBase64'

export default function FirstScreen() {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState<string>('')
  return (
      
    <View display='flex' alignItems='center' justifyContent='center'>
      <ScrollViewY
        height={1000}
        width="94%"
        backgroundColor="#0D1912"
        padding="$4"
        borderRadius="$4"
        >
        <CardStack>
          <CardItem
            Heading='Feeling Bored?'
            Para='Press to know more'
            buttonText='Get a Task'
            longPress={() => {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              )
              setOpen(true)
              setContent(
                'BoredAPI'
              )
            }}
            press={() => {
              Haptics.selectionAsync()
              setOpen(true)
              setContent(
                'BoredAPI'
              )
            }}
            url= {boredAPIBanner}
          />
          <CardItem
            Heading='Agify'
            Para='Estimate the age of a person based on their name.'
            buttonText='Find Out!'
            isVisible={true}
            pressableClick={() => ToastAndroid.show('This feature may require your Name / Description', ToastAndroid.SHORT)}
            longPress={() => {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              )
              setOpen(true)
              setContent(
                'AgifyAPI'
              ) 
            }}
            press={() => {
              Haptics.selectionAsync()
              setOpen(true)
              setContent(
                'AgifyAPI'
              )
            }}
            url={agifyAPIBanner}
          />
          <CardItem
            Heading='Genderize'
            Para='Find the Gender of your name.'
            buttonText='Find Out!'
            isVisible={true}
            pressableClick={() => ToastAndroid.show('This feature may require your Name / Description', ToastAndroid.SHORT)}
            longPress={() => {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
              )
              setOpen(true)
              setContent(
                'GenderizeAPI'
              ) 
            }}
            press={() => {
              Haptics.selectionAsync()
              setOpen(true)
              setContent(
                'GenderizeAPI'
              )
            }}
            url={genderizeAPIBanner}
          />
          <CardItem
            Heading='Nationalize'
            Para='Find your Nationality'
            buttonText='Find Out!'
            isVisible={true}
            pressableClick={() => ToastAndroid.show('This feature may require your Name / Description', ToastAndroid.SHORT)}
            longPress={() => {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
              )
              setOpen(true)
              setContent(
                'NationalizeAPI'
              ) 
            }}
            press={() => {
              Haptics.selectionAsync()
              setOpen(true)
              setContent(
                'NationalizeAPI'
              )
            }}
            url={nationalizeAPIBanner}
          />
          <CardItem
            Heading='RoboHash'
            Para='Find out what kind of Robo you are!'
            buttonText='Press Me!'
            isVisible={true}
            pressableClick={() => ToastAndroid.show('This feature may require your Name / Description', ToastAndroid.SHORT)}
            longPress={() => {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
              )
              setOpen(true)
              setContent(
                'RoboHashAPI'
              ) 
            }}
            press={() => {
              Haptics.selectionAsync()
              setOpen(true)
              setContent(
                'RoboHashAPI'
              )
            }}
            url={robohashAPIBanner}
          />
        </CardStack>
      </ScrollViewY>
      <SheetDemo open={open} setOpen={setOpen}>
        { content === 'BoredAPI' && <BoredAPI /> }
        { content === 'AgifyAPI' && <AgifyApi /> }
        { content === 'GenderizeAPI' && <GenderizeAPI /> }
        { content === 'NationalizeAPI' && <NationalizeAPI /> }
        { content === 'RoboHashAPI' && <RoboHashAPI />}
      </SheetDemo>
    </View>
  )
}


