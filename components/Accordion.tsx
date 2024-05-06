import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertTriangle, ChevronDown, PenLine, ReplyAll } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { Accordion, Button, Input, ListItem, Paragraph, Separator, Spinner, Square, TextArea, XStack, YGroup, YStack } from 'tamagui'
import * as MailComposer from 'expo-mail-composer';

export function AccordionSettings() {

    const [ busy, setBusy ] = useState(false)
    const [ name, setName ] = useState<string>('')
    const [ description, setDescription ] = useState<string>('')
    const [ mailContent, setMailContent ] = useState<string | null>(null)

    const router = useRouter();
    
    useEffect(() => {
        async function getUserData() {
            const myname = await AsyncStorage.getItem('name');
            const mydescription = await AsyncStorage.getItem('description');
            if (myname !== null && mydescription !== null){
                setName(myname);
                setDescription(mydescription);
            }
            else {
                ToastAndroid.show('Data Missing', 1000);
            }
        }

        function checkIfMailReady(){
            const isMailReady = MailComposer.isAvailableAsync
            if (!isMailReady){
                ToastAndroid.show('Mail Not Ready', 1000);
            }
        }

        checkIfMailReady()
        getUserData()
    }, [])

    const sendMail = () => {
        setBusy(true)
        if(mailContent === null){
            ToastAndroid.show('Enter your Message', 2000)
            return;
        }
        if(name === null){
            ToastAndroid.show('Your Name is Missing', 2000)
            return;
        }
        try {
            MailComposer.composeAsync({
                recipients: ['suvan.gowrishanker.204@gmail.com'],
                subject: `Bug Report from ${name}`,
                body: mailContent,
                isHtml: false,

            })
        } catch (error) {
            ToastAndroid.show(`${error}`, 2000)
        }
        setBusy(false)
    }

    const clearUserdata = async() => {
        setBusy(true)
        try {
        await AsyncStorage.removeItem('name')
        await AsyncStorage.removeItem('description')
        ToastAndroid.showWithGravity('Data Cleared', ToastAndroid.SHORT, ToastAndroid.CENTER)
        router.replace('/');
        } catch (error) {
        ToastAndroid.showWithGravity(`${error}`, ToastAndroid.SHORT, ToastAndroid.CENTER)
        }
        setBusy(false)
    }

    const changeName = async() => {
        setBusy(true)
        try{
            await AsyncStorage.removeItem('name')
            await AsyncStorage.setItem('name', name)
            ToastAndroid.showWithGravity('Name Updated', ToastAndroid.SHORT, ToastAndroid.CENTER)
            router.replace('/(signup)/first');
        } catch(error) {
            ToastAndroid.show(`${error}`, 2000)
        }
        setBusy(false)
    }
    const changeDescription = async() => {
        setBusy(true)
        try{
            await AsyncStorage.removeItem('description')
            await AsyncStorage.setItem('description', description)
            ToastAndroid.showWithGravity('Description Updated', ToastAndroid.SHORT, ToastAndroid.CENTER)
            router.replace('/(signup)/first');
        } catch(error) {
            ToastAndroid.show(`${error}`, 2000)
        }
        setBusy(false)
    }

  return (
    <Accordion defaultValue={["account"]} overflow="hidden" width="$20" type="multiple" collapsable theme="green" marginVertical={20}>
      <Accordion.Item value="account">
        <Accordion.Trigger flexDirection="row" justifyContent="space-between">
          {({
            open,
          }: {
            open: boolean
          }) => (
            <>
              <Paragraph>Account Settings</Paragraph>
              <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                <ChevronDown size="$1" />
              </Square>
            </>
          )}
        </Accordion.Trigger>
        <Accordion.Content animation="lazy" exitStyle={{ opacity: 0 }}>
            <YGroup separator={<Separator />}>
                <YGroup.Item>
                    <ListItem title="My Name">
                        <XStack justifyContent="space-between" marginVertical="$3" alignItems='center' gap="$2">
                            <Input size="$4" flex={1} value={name || 'Name Missing'} placeholder="Name" onChangeText={setName} />
                            <Button icon={busy  ? () => <Spinner /> : undefined} size="$4" onPress={changeName}><PenLine /></Button>
                        </XStack>
                    </ListItem>
                </YGroup.Item>
                <YGroup.Item>
                    <ListItem title="About Me">
                        <YStack justifyContent="center" marginVertical="$3" alignItems='center' gap="$2">
                            <TextArea width="100%" value={description || 'Desc Missing'} placeholder="Description" onChangeText={setDescription} />
                            <Button icon={busy  ? () => <Spinner /> : undefined} size="$4" width="100%" onPress={changeDescription} ><PenLine /></Button>
                        </YStack>
                    </ListItem>
                </YGroup.Item>
                <YGroup.Item>
                    <ListItem title="Send Bug Report">
                        <XStack justifyContent="space-between" marginVertical="$3" alignItems='center' gap="$2">
                            <Input size="$4" flex={1} placeholder="Your Message" onChangeText={setMailContent} />
                            <Button icon={busy  ? () => <Spinner /> : undefined} size="$3" onPress={sendMail} ><ReplyAll /></Button>
                        </XStack>
                    </ListItem>
                </YGroup.Item>
                <YGroup.Item>
                    <ListItem subTitle="Coming Soon.." />
                </YGroup.Item>
            </YGroup>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="danger">
        <Accordion.Trigger flexDirection="row" justifyContent="space-between">
          {({
            open,
          }: {
            open: boolean
          }) => (
            <>
              <Paragraph>Danger Zone</Paragraph>
              <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                <ChevronDown size="$1" />
              </Square>
            </>
          )}
        </Accordion.Trigger>
        <Accordion.Content animation="lazy" exitStyle={{ opacity: 0 }}>
            <Button icon={busy  ? () => <Spinner /> : undefined} onPress={clearUserdata} theme="red"><AlertTriangle />Delete Account!</Button>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
}