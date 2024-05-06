import { useEffect, useState } from "react";
import { Button, Card, H3, Image, Spinner, Text, XStack, YStack } from "tamagui";
import * as MediaLibrary from 'expo-media-library';
import { Paragraph } from "tamagui";
import { Eye, Share } from "@tamagui/lucide-icons";
import * as Sharing from 'expo-sharing';
import { Image as Img } from "expo-image"
import { Pressable, ToastAndroid } from "react-native";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { robohashAPIBackground } from "../../constants/ImageBase64";

export default function RoboHashAPI() {

    const [ busy, setBusy ] = useState(false);
    const [ content, setContent ] = useState<string | null>(null);
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

    async function getRobot() {
        setBusy(true);
        setReveal(false);
        try {
          const url = `https://robohash.org/${myname}`;
          console.log(url);
          setContent(url);
        } catch (error) {
          ToastAndroid.showWithGravity(`${error}`, ToastAndroid.SHORT, ToastAndroid.CENTER);
          console.log(error);
        }
        setBusy(false);
      }

    
    const handleDownload = async () => {
        setBusy(true)
        ToastAndroid.show('creating the file', 1000)
        let fileName = myname + '_passtime.png';
        console.log(fileName)
        let fileUri = FileSystem.documentDirectory + fileName;
        try {
            if(!content){ return; }
            const res = await FileSystem.downloadAsync(content, fileUri)
            saveFile(res.uri)
        } catch (err) {
            console.log("FS Err: ", err)
        }
    }

    const saveFile = async ( fileUri : string) => {
        const permission = await MediaLibrary.requestPermissionsAsync()

        if(permission.granted === true ){
            try {
                console.log('save File')
                ToastAndroid.show('saving to Passtime', 1000)
                const asset = await MediaLibrary.createAssetAsync(fileUri);
                const album = await MediaLibrary.getAlbumAsync('Passtime');
                if (album == null) {
                    await MediaLibrary.createAlbumAsync('Passtime', asset, false);
                } else {
                    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false).then(async() => {

                        ToastAndroid.show('sharing the file', 1000)
                        await Sharing.shareAsync(
                            fileUri,
                            {
                                dialogTitle: 'Sharing Image From Passtime!',
                                mimeType: 'image/png'
                            }
                        )
                    }).catch((error : any) => {
                        ToastAndroid.show(`${error}` , 2000)
                    })
                }
            } catch (err) {
                console.log("Save err: ", err)
                ToastAndroid.show(`${err}`, 1000)
            }
        } else {            
            ToastAndroid.show('Persmissions not Recieved', 3000)
        }
        setBusy(false)
    }


    
    
    return(
        <YStack alignItems="center" gap="$8" theme="green">
        <Button icon={busy  ? () => <Spinner /> : undefined} width={300} height="$4" theme="green" animation="superBouncy" onPress={getRobot}>Find My Robot!</Button>
        {content && <Paragraph theme="alt2">Click on the Eye to reveal your Unique Robot</Paragraph> }
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
                    <H3 textAlign="justify" >Hi! {myname}</H3>
                    <Paragraph theme="alt2">Your Unique Robot is...</Paragraph>
                    <XStack  alignSelf="center" justifyContent="center" backgroundColor="rgba(13,25,18, 0.5)" padding="$1" borderRadius={24} >
                        {reveal ? (
                            <Img
                                contentFit="contain"
                                contentPosition="center"
                                source = {content}
                                style={{
                                    width:190,
                                    height:190
                                }}
                            />
                            ) : (
                            <Pressable 
                                onPress={() => {
                                    setReveal(true)
                                }}
                                onLongPress={() => {
                                    ToastAndroid.show('Share with your friends!', 1000)
                                }}
                            >
                                <Eye size={100} />
                            </Pressable>
                        )}
                    </XStack>
                </Card.Header>
                <Card.Footer padded justifyContent="space-between" alignItems="center" paddingTop="$2">
                    <Button icon={Share} onPress={() => handleDownload()} >
                        <Text>Share</Text>
                    </Button>
                </Card.Footer>
                    
                <Card.Background justifyContent="center" alignItems="center">
                    <Image
                        resizeMode="contain"
                        alignSelf="center"
                        source={{
                            width: 300,
                            height: 300,
                            uri: `data:image/png;base64,${robohashAPIBackground}`,
                        }}
                    />
                </Card.Background>
            </Card>
        )}
      </YStack>
    )
}