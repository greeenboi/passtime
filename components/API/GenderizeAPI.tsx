import { useEffect, useRef, useState } from "react";
import { Button, Card, H3, Image, Spinner, XStack, YStack } from "tamagui";
import { genderizeAPIType } from "../../constants/Types";
import { Paragraph } from "tamagui";
import { Eye, GaugeCircle } from "@tamagui/lucide-icons";
import { Pressable, ToastAndroid } from "react-native";
import LottieView from 'lottie-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { genderizeAPIBackground } from "../../constants/ImageBase64";

export default function GenderizeAPI() {

    const [ busy, setBusy ] = useState(false);
    const [ content, setContent ] = useState<genderizeAPIType | null>(null);
    const [myname, setMyname] = useState('');
    const [ reveal, setReveal ] = useState(false);

    const animation = useRef(null);

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

    async function getGender() {
        setBusy(true)
        setReveal(false)
        try {
            const url = `https://api.genderize.io?name=${myname}`
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
        <Button icon={busy  ? () => <Spinner /> : undefined} width={300} height="$4" theme="green" animation="superBouncy" onPress={getGender}>Find your Gender!</Button>
        
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
                    <Paragraph theme="alt2">Your Predicted Gender is....</Paragraph>
                    <XStack  alignSelf="center" backgroundColor="rgba(0,0,0, 0.3)"  padding="$1" borderRadius={24} style={{ backdropFilter: 'blur(10px)' }} >
                        {reveal ? (
                            <Pressable 
                                onPress={() => { 
                                    (animation.current as any)?.reset();
                                    (animation.current as any)?.play();
                                    
                                }}
                            >
                                { content.gender === 'female' ?
                                    <LottieView
                                        ref={animation}
                                        loop={false}
                                        style={{
                                            width: 200,
                                            height: 200,
                                            backgroundColor: 'transparent',
                                        }}
                                        source={require('../../assets/images/female_lottie.json')}
                                    /> 
                                    :
                                    <LottieView
                                        ref={animation}
                                        style={{
                                            width: 200,
                                            height: 200,
                                            backgroundColor: 'transparent',
                                        }}
                                        source={require('../../assets/images/male_lottie.json')}
                                    />
                                }
                            </Pressable>
                        ) : (
                            <Pressable onPress={() => {
                                setReveal(true)
                            }}>
                                <Eye size={100} />
                            </Pressable>
                        )}
                    </XStack>
                </Card.Header>
                <Card.Footer padded justifyContent="space-between" alignItems="center">
                        {reveal && <Paragraph theme="green_alt2" alignItems="center" justifyContent="center" gap="$2" >
                            <GaugeCircle  size={12} /> {content.probability}
                        </Paragraph> }
                </Card.Footer>
                    
                <Card.Background justifyContent="center" alignItems="center">
                    
                <Image
                    resizeMode="contain"
                    alignSelf="center"
                    source={{
                        width: 300,
                        height: 300,
                        uri: `data:image/png;base64,${genderizeAPIBackground}`,
                    }}
                />
                </Card.Background>
            </Card>
        )}
      </YStack>
    )
}

