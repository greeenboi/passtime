import { useEffect, useState } from "react";
import { Button, Card, H3, Image, Spinner, Square, XStack, YStack, useControllableState, useEvent } from "tamagui";
import { nationalizeAPIType } from "../../constants/Types";
import { Paragraph } from "tamagui";
import { Eye, GaugeCircle } from "@tamagui/lucide-icons";
import { Pressable, ToastAndroid } from "react-native";
import Codes  from '../../constants/CountryCode';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { nationalizeAPIBackground } from "../../constants/ImageBase64";


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
                        uri: `data:image/png;base64,${nationalizeAPIBackground}`,
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