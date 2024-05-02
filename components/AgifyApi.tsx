import { useEffect, useState } from "react";
import { Button, Card, H2, H3, Image, Input, Spinner, Text, XStack, YStack } from "tamagui";
import { agifyAPIType } from "../constants/Types";
import { Paragraph } from "tamagui";
import { Eye, Users } from "@tamagui/lucide-icons";
import { Pressable, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AgifyApi() {

    const [ busy, setBusy ] = useState(false);
    const [ content, setContent ] = useState<agifyAPIType | null>(null);
    const [myname, setMyname] = useState('');
    const [count, setCount] = useState(0);
    const [ reveal, setReveal ] = useState(false);

    useEffect(() => {
        const getmyname = async () => {
            const myname = await AsyncStorage.getItem('name');
            if (myname !== null){
                setMyname(myname);
            }
            else {
                ToastAndroid.show('Data Missing', 1000);
            }
        }

        getmyname();
    } , [])
    function countUp ( age : number ){
        const target = age;
        const duration = 1500;

        const intervalTime = duration / target;
        const intervalId = setInterval(() => {
        setCount((prevCount) => {
            if (prevCount === target) {
            clearInterval(intervalId);
            return prevCount;
            }
            return prevCount + 1;
        });
        }, intervalTime);
    };

    async function getAge() {
        setBusy(true)
        setReveal(false)
        setCount(0)
        try {
            const url = `https://api.agify.io?name=${myname}&country_id=IN`
            console.log(url)
            const response = await fetch(url)
            const data = await response.json()
            console.log(data)
            setContent(data)   
        } catch (error) {
            ToastAndroid.showWithGravity(`${error}`, ToastAndroid.SHORT, ToastAndroid.CENTER)
            console.log(error)
        }
        setBusy(false)
    }

    
    
    return(
        <YStack alignItems="center" gap="$8" theme="green">
        <Button icon={busy  ? () => <Spinner /> : undefined} width={300} height="$4" theme="green" animation="superBouncy" onPress={getAge}>Bored No Longer</Button>
        
        { content && (
            <Card
                elevate
                bordered
                animation="bouncy"
                size="$4"
                width={300}
                height={350}
                scale={0.9}
                hoverStyle={{ scale: 0.925 }}
                pressStyle={{ scale: 0.875 }}
            >
                <Card.Header padded gap={4}>
                    <H3 textAlign="justify" >{content.name}</H3>
                    <Paragraph theme="alt2">Your Estimated Age Is...</Paragraph>
                    <XStack  alignSelf="center" backgroundColor="rgba(13,25,18, 0.5)" padding="$10" borderRadius={24} >
                        {reveal ? (
                            <H2 animation="superBouncy" >
                                {count}
                            </H2>
                        ) : (
                            <Pressable onPress={() => {
                                setReveal(true)
                                countUp(content.age)
                            }}>
                                <Eye size={100} />
                            </Pressable>
                        )}
                    </XStack>
                </Card.Header>
                <Card.Footer padded justifyContent="space-between" alignItems="center">
                        {reveal && <Paragraph theme="green_alt2" >{
                            content.age < 30 ? 'You are young at heart' : content.age > 30 && content.age < 50 ? 'You are in your prime, Get to work!' : 'How are you still alive?'
                        }</Paragraph> }
                </Card.Footer>
                    
                <Card.Background justifyContent="center" alignItems="center">
                    
                <Image
                    resizeMode="contain"
                    alignSelf="center"
                    source={{
                        width: 300,
                        height: 300,
                        uri: 'data:image/png;base64,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',
                    }}
                />
                </Card.Background>
            </Card>
        )}
      </YStack>
    )
}