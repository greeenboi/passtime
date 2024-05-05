import { Button, Input, SizeTokens, Spinner, Text, TextArea, View, XStack, YStack, styled } from 'tamagui'
import { Image } from 'expo-image';
import { Pressable, StyleSheet, ToastAndroid } from 'react-native';
import { BadgeInfo } from "@tamagui/lucide-icons";
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(false);
    const router = useRouter();

    const handleGoPress = useCallback(async () => {
        setStatus(true);
        if (name === '') {
            ToastAndroid.show('Please enter your name', ToastAndroid.SHORT);
            return;
        }
        if (description === '') {
            ToastAndroid.show('Please enter a description', ToastAndroid.SHORT);
            return;
        }
        if (name.length < 3) {
            ToastAndroid.show('Name must be at least 3 characters', ToastAndroid.SHORT);
            return;
        }
        if (description.length < 10) {
            ToastAndroid.show('Description must be at least 10 characters', ToastAndroid.SHORT);
            return;
        }
        if (description.length > 100) {
            ToastAndroid.show('Description must be at most 100 characters', ToastAndroid.SHORT);
            return;
        }
        try {
            await AsyncStorage.setItem('name', name);
            await AsyncStorage.setItem('description', description);
        } catch (error) {
            ToastAndroid.showWithGravity(`${error}`, ToastAndroid.SHORT, ToastAndroid.CENTER)
            return;
        }
        setStatus(false);
        ToastAndroid.showWithGravity('Welcome to the app', ToastAndroid.SHORT, ToastAndroid.CENTER);
        router.replace('/(signup)/first');
    }, [name, description]);

  return (
    <View flex={1} alignItems="center" justifyContent='flex-start' flexDirection='column'>
      {/* <Text fontSize={20}>First here</Text> */}
      <Image
        style={styles.image}
        source={require('../assets/images/welcome.svg')}
        contentFit='contain'
        focusable
        cachePolicy={'memory-disk'}
      />
      <FormContainer>
        <XStack alignItems='center' display='flex' gap={10} width="full" justifyContent='center'>
            <Text fontSize={15} textAlign='center' fontFamily="$heading">Welcome to the app!</Text>
            <Pressable onPress={() => ToastAndroid.show('Your data is safely NOT with us ;)', 1000)}>
                <BadgeInfo />
            </Pressable>
        </XStack>
        <InputField size="$3" placeholder='Name??' value={name} onChangeText={setName} />
        <TextArea placeholder="What do you do ..." backgroundColor="#0C1F17" borderColor="#133929" color="#257B52" value={description} onChangeText={setDescription} />
        <Button icon={status  ? () => <Spinner /> : undefined} size="$3" backgroundColor="#113123" onPress={handleGoPress}>Go</Button>
      </FormContainer>
    </View>
  )
}

function InputField(props: { size: SizeTokens, placeholder: string, value: string, onChangeText: React.Dispatch<React.SetStateAction<string>> }) {
    return(
        <XStack alignItems="center" gap="$2">
            <Input flex={1} size={props.size} placeholder={props.placeholder} value={props.value} onChangeText={props.onChangeText} backgroundColor="#0C1F17" borderColor="#133929" color="#257B52" />
        </XStack>
    )
}

const FormContainer= styled(YStack, {
    padding: 10,
    backgroundColor: '#0D1912',
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#66A4A4',
    gap: 10,
    width: "94%",
    minHeight: 250
})
  

const styles = StyleSheet.create({
    image: {
        marginTop: 20,
        marginBottom: 10,
        width: "94%",
        height: 256,
      },
});
