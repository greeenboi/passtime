import { useEffect, useRef, useState } from "react";
import { Button, Card, H2, H3, Image, Input, Spinner, Square, Text, XStack, YStack, useControllableState, useEvent } from "tamagui";
import { nationalizeAPIType, genderizeAPIType } from "../../constants/Types";
import { Paragraph } from "tamagui";
import { Eye, GaugeCircle, Users } from "@tamagui/lucide-icons";
import { Pressable, ToastAndroid } from "react-native";
import Codes  from '../../constants/CountryCode';
import AsyncStorage from "@react-native-async-storage/async-storage";


interface Codes {
    [key: string]: string;
}

export default function NationalizeAPI() {

    const [ busy, setBusy ] = useState(false);
    const [ content, setContent ] = useState<nationalizeAPIType | null>(null);
    const [myname, setMyname] = useState('');
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

    async function getNation() {
        setBusy(true)
        setReveal(false)
        try {
            const url = `https://api.nationalize.io/?name=${myname}`
            console.log(url)
            const response = await fetch(url)
            const data = await response.json()
            console.log(data)
            setContent(data) 
            console.log(content?.country[0].country_id)  
        } catch (error) {
            ToastAndroid.showWithGravity(`${error}`, ToastAndroid.SHORT, ToastAndroid.CENTER)
            console.log(error)
        }
        setBusy(false)
    }

    const [positionI, setPositionI] = useControllableState({
        strategy: 'most-recent-wins',
        prop: 100,
        defaultProp: 0,
      })
      const position = positions[positionI]
      const onPress = useEvent(() => {
        setPositionI((x) => {
          return (x + 1) % positions.length
        })
    })

    function getCountryName(country_id: string) {
        for (let key in Codes) {
            if (key === country_id) {
                return Codes[key];
            }
        }
    }
    
    
    
    return(
        <YStack alignItems="center" gap="$8" theme="green">
        <Button icon={busy  ? () => <Spinner /> : undefined} width={300} height="$4" theme="green" animation="superBouncy" onPress={getNation}>Find your Nationality!</Button>
        
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
                    <Paragraph theme="alt2">Your Predicted Country is....</Paragraph>
                    <XStack  alignSelf="center" backgroundColor="rgba(0,0,0, 0.3)"  padding="$2" borderRadius="$9" style={{ backdropFilter: 'blur(10px)' }} >
                        {reveal ? (
                            <Square 
                                animation={'bouncy'}
                                animateOnly={['transform']}
                                onPress={onPress}
                                size={160}
                                borderColor="$borderColor"
                                borderWidth={1}
                                borderRadius="$9"
                                backgroundColor="$color9"
                                hoverStyle={{
                                scale: 1.5,
                                }}
                                pressStyle={{
                                scale: 0.9,
                                }}
                                onLongPress={() => {
                                    let CountryName = getCountryName(content.country[0].country_id)
                                    ToastAndroid.show(`Country: ${CountryName}`, ToastAndroid.SHORT)
                                }}
                                {...position}
                            >
                                
                                <Image
                                    resizeMode="contain"
                                    alignSelf="center"
                                    source={{
                                        width: 150,
                                        height: 150,
                                        uri: `https://flagcdn.com/256x192/${content.country[0].country_id.toLocaleLowerCase()}.png`
                                    }}
                                />
                            </Square>
                        ) : (
                            <Pressable onPress={() => {
                                setReveal(true)
                            }}>
                                <Eye size={150} />
                            </Pressable>
                        )}
                    </XStack>
                </Card.Header>
                <Card.Footer padded justifyContent="space-between" alignItems="center">
                        {reveal && <Paragraph theme="green_alt2" alignItems="center" justifyContent="center" gap="$2" >
                            <GaugeCircle  size={12} /> {(Number(content.country[0].probability.toPrecision(2)) * 100)}%
                        </Paragraph> }
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

export const positions = [
    {
      x: 0,
      y: 0,
      scale: 1,
      rotate: '0deg',
    },
    {
      x: -50,
      y: -50,
      scale: 0.5,
      rotate: '-45deg',
      hoverStyle: {
        scale: 0.6,
      },
      pressStyle: {
        scale: 0.4,
      },
    },
    {
      x: 50,
      y: 50,
      scale: 1,
      rotate: '180deg',
      hoverStyle: {
        scale: 1.1,
      },
      pressStyle: {
        scale: 0.9,
      },
    },
  ]