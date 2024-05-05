import { useEffect, useRef, useState } from "react";
import { Button, Card, H2, H3, Image, Input, Spinner, Text, XStack, YStack } from "tamagui";
import { genderizeAPIType } from "../../constants/Types";
import { Paragraph } from "tamagui";
import { Eye, GaugeCircle, Users } from "@tamagui/lucide-icons";
import { Pressable, ToastAndroid } from "react-native";
import LottieView from 'lottie-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
                        uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATsAAAE6CAYAAABpgPViAAAgAElEQVR4nO29zW7b6Jrv+39eSk66XKfDDBagtlw7CjbQ2LvPIMoggKykEfkKwpTlAs4ozuzM4lxBnCuIcwVxph2loszOGVnB7pYN1CDKZKFnYVBWVg7WoFi7y4VEEt/nDEjZikNSJEVKlPz+gIVV8QdFS+Sfz/cDKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQRoVmfgGJ+0I2afhGfdQBALlcSTLpkWwcAIVACAGLoAF0a/g4L1olJHz0OE5fingMxWQCsb77BMEf+8TuT8zNSOl8XpFmS2Pm9wcD8jIuW1Wx9exzFwqLE7pwzFDCh5cuSbT2n8SWWdBWgSyCUhsJEjNgClXEsJljEZDKxRZIsJv4giH+TMvdBElsYDMxPzUMzxLEUGUaJ3YIzKmZCDK6wpKsscAVA2bHCoIc4jMLBAqjjiCI+kOD3A9be2SStv79od2Z9copglNgtCLpR0y/mBuUc2dfOCNqiWmQZhDoALDC/Gwrh50Guo9zlbKDEbg4pGJUShKhphLIStbnAAqgD5ncMrdUXtqkswemjxC7jjFpsElQjRk25ngvBVwIo7X5HxQXTRYldxhiKm8bSANE1gGuzPqcYWDzMfJ5kUNkjg0rRbm6fLC7TqVXrZn7n82FAMBnoEFGzx/xOWX/JosQuAxTqt2oC8jaBalkRNyY2T0TKEaXfmWAJ4t/Ypt8FscXEVm5wWvJhZswy0Y2aruOz3s/bOrGmAwBLUQIAPi2VuTIUUSaUMiWWBBMSLWjUsnv2G2X5TYYSuxlwar3xPRAb0765HCGDCSaTCR9IwhTElhQDM9/XrKyJ1iwoGZXSIOeIHwtcYUlXSfAVduoIy7MRROqA+Y1Novmp8e+t6b/+fKPEbkroRk2/KHqGJugewKnfLExsCqDDkj6Q4Pck8UGzuaOELDmKmzfKxJoOomss6SqIr01NCF2rzybxXAlfOJTYpUyhfquWsgVnAdwB0zswOtD6neP+sqnKHWaHbtT073Ofy8SkS1AtdRFUwhcKJXYpUNyslplxh4DthC/wr4QtL2VLWWrzQ8GolPIalW2iMoFvpyKAQ+Gz5WMV4/saJXYJUqjfqmngRwkmGSwibgFoMQZvui9+Udm5BaO4eaMMO18Gcc3JvqOc3NGpBYG97r/9x/Pkjjm/KLGbEN2o6d/leg8SsuIsgDtEaCpxO58MrT8JGCxwm5gmLxZX1h6gxC4+CYqcBcZzItn8Y3BRtRYpvqJgVEqaEDXS+A4zGRMfkLF3XmN7SuwikoTIMbEpmJ4DsnXUODx3F50iPj9srBnJWH3UskGPz5PoKbELSQIid2LBKYFTJMFqvVJjpq3JhO/8iJ4SuxCsbq49YKadeCLHLQI/VgKnSJMfNtYMFrgX39Wllj2w7y9yTE+JXQBOdlU+iZEhswh4+sdgaVfF4BTTZBjjY40fxbL2GHuLmshQYueBbtT0Ze3LLojuRftNbkEIlepXZILVeqUGogdxrD0Gdj422o/TObPZoMTuDCsbawYRPYvmsipXVZFdCkalpGm0E/nhTTBBtLMoD28ldi66UdO/z395Fu0pqEROMT8MRS9yQmNBXFsldsPYHNnPEPoCUCKnmF8KRqWUy4ktBh6F/qUFsPLOvdit1KuPCNgJ+eMWwI+7jYPdlE9LoUideO4t7x4PLjyex8TbuRU73ajpy7n+q9B9rIynx/bSzjx+yApFEJFFj2Dafbk+b27tuRS7glEpaXnaD+m2dgjyoXJZFYtO8cfqVoSSFUuCH/9tjryccyd2bu3cqzDZVgIeHzXaYV1chWIhWK1Xd8LG8+apROVciV3xp5v3IHlv3M8xwST076qpI4rzSsGolESe9sNYeUxo/tlfup/1EM+5EbvQiQjm58f2he2sf3AKxTQIbeXNQRzvXIhd+IwrP1yETGvBqJw8jT/joqWEe/bM82fyw8aaYQs8GWvlZVzwFl7sQgqdRZB3s5iEKBiVktDyZcm2LgRKxHSFBevEVGJiHc46wEg9kEzO+kMa7m1lmAD/zgQLrHU+vvxfzXT+msVguDxp+HkAAJzdtfokn4mzutLZuUuSLCb+ICVMCGF+HuRmOuuwYFRKWk68GtsnnmHBW2ixCyN0TDBlRj6cglEpQYiaRiiD6DbApZms7MvwBTtr4rUTJoblrlN8x9Ba0u53pv0ZrW5Ud5nwYMyPWaD+etZi3gsrdiGTER17IO/O8qZ2to9JgwXuRLUG0oVb3cbB+qzPImsUN9feh++0mQbUYfBrOZB707qOQ8bxMid4Cyl2xc0bZXB+f8zTt3M8WFqfhWuQ8N6K1Og22gt5fcTFLVvan/V5+DO9BTs/bKwZcpyFmzEPQcz6BJLGCQTnxtXRzUzoVjfXHizneu9d9zqzQue4TIqvGAwycdP6wzVI3ituVt8Xf7oZcTxZNH59edAE9dcDrxNGScuL/dHkzCxZqCe3btT05fyXt2PcjJkIXegAb1ZgPO2+bG/P+jSyRrG+tg9QUqsy04Wxd2wvPUzzWg9Vj0cwj/tL12edgV4osSvWbz4B2PcGZYL55wze9JBudVicbB3DJILFkiw4f9uHML9MjCsAQIJ1ZugA6UxOdnd4fDCeK6HzxquPlIndTCpbGGa4Y3wmIC65v1dKZIUipuNKhitAnn0MeGHEzt0T4VsjN6usq2vRvY0qdExskqQWCe6wTb9D63eO+8tmmkKtGzUdAGb9BJ4HpvFe6UZN/z73uUxMuk1UJvBtgMqRH5pTsKzCXee8220cPEzrHMaxEGIX4o227IG8PotAaYTsnQVGE4w3x3KpqQRH4Udx80YZdr4MwffCutRMaH580b6b+nmN82AEbc1qJt5CiN1YQZnRGxyuoJlbRGj+0b/wXAmcIipRFuwQ5HrahfPFHytbEOJZwI/MzPCYe7EbJyiznFwyRoTVIFBFooyvf5tO3KxYX9sG6EnAj8wkSahN88WSpmBUSkJQUGtTp9to/19TPKUTCvVbNeHU0X0DE0w5kGt/+/nw/5n+mSkWlf/9119b//g/ih9AfntUqKT9839/+vk/zc9pnsd//fXo8NL//OEyCBWfHyksicHF//rr0f+b5nmcZa7r7NxSDk+YYNoDmWqMIggNtm+JCRHtZKXQUrFYdH8+3GPAd75cPn88lZq3nL20AyCge4K2V+uVqZbwzK3YFX+sbgXVrM1aUBjkG6Sd56UliuyjMfuKzAXWplLIbjZblmts+LqqTOLZMKs9DeZS7HSjpkNj/9gET6dlJggC+33IKgmhSJW+7S920+RT89AUzPd9f4BR+i7Xm1o951yK3Xe53oOgwL9ty5mPic4PLux5ChtDWXWKVHE8Gv4m68oEc9pjzH59edAkxlO/7xPwqLh5YypdRXMndgWjUiKfwL8DZ2KZr9lsWaD+OhOfnotqwVJMCXvA94kwkrzjluzLmXQw5Oylna/ug7NwLihzmxhzV3pS3Fjb81v5xgTz44v21emfVTAlo1Ky5mw6rWIxyEpXzGq9UmMI34kx06gBnCuxczsl3vv+wAyrsxUKRTCrm2uvmH3KYghmN2VDZa7cWE2jgOJgbimhUyiyy6DPD30TdIzSSr2aavH/3IhdwaiUQHTH7/sEnnlSQqFQ+POpeWgyApMVD9IsRZkbsdOEqPk3GHMri8tyFArF1ywNlnYDkhV6mqUocyN2QXV1yqpTKOYDs9myyCbf+zVN624uxK74Y3XLr66OgY6y6hSK+aH7c3svyLr7h9yXrTRedy7EDsK71AQASPgP7FQoFNkkyLoT8L/fJ3rNNA6aJEHlJlmtq1MoFONZ2Vx77zeDL426u1ySB0sDLec3rgYgCeW+xkA3ano+3yvlpVaSbOtCOPtqT7bb42TD/dcwXNeDf2eCJSVMQZolia1Zb6xXzB9uG5ln9wSDHgHJ3t+Zt+yCBmDaA3k1C61hWeUvm9WyZqOsEcoAXQKhDHApxRWOFkAdJrYEuDVg7Z0SQYUfJaOm93O9937X4/Fg6XKS106mxa64WS2D8db7u7PfVpQlCkalBCFqGqEMotspi1pEqAPmDkN7/aettZT4KYas1Ks75DNdmYHHHxOcMp5tN1Ziy1eOhdib8tlkir9sVssXwLclqEaMMzWIPMtT84DLIJQJ9tZyzsZy/WaLSDYHfX6tLPPzzdJgabef63mKHQEPMHaHS3gybtn5u7BJm7hZRzdq+kXRMzSi2yA2smO1TQq1ILBn9+w3SvjOJ0GLx5NMVGTWsisYlVJAbd3r8yB0BaNSyuXpDrMwgJ57MWTNapsUrkGipuUEihvVPZvE80+Nf1eJp3MEgR+zj9g5134yiYrMil1gFlaQ7+6JeadgVEoiJ+4RqAZwjRnTFDiL6XTC8smWe5DOxLr7NT01q5KwpUFuFes3WxCznzY9T+hGTb+IzzpyuZJg0iXbek7jS5LpMs5m2j1g4g8AICVMCGHaJK2/v2hPZeJxbnCx08/1LM/rinBPN2o7SRg3mXVji/Wb+wB7qv2iZWF1o6Z/n/9yz3mKef/NCWABMMHoMOEDSZiC2NLcEd5mxPdTN2r6cv64RKzpLEWJBUqC+Bo71ngyk2cJJoh2zrvoFYxKyc4LXbNRzml8iSVdZYErxFRiYp3Yo0woMagD5je2LXfTvOeKG9VdEB54nkFCrmyGxa7qY84sTha2UL9V08CPAC6nGYMTzHd/fXkQtHIycVbrlRqIrgGoSaA8boFzIASzh/7dv7/4JRO7FdKgYFRKQsuXhRhcGYoZgDIx0rOkI0OtHvUepvE5BA73TGjCdybFzhEB6fmHS/DDv83xYmndqOnf5XoP3NHyU7uIZ/2+FTdvlAm528ww/ILRY2Hs2bbMxNj9uOhGTb+YG5RzZF9jKcpTqH1MAd49Hlx4nHTcvFiv/ubzPljdRvvypMfPpNhNw6SdBYX6rZpG9rOAZUGpwsx3P07ZwvOiYFRKmhA1CDyI7PLOkWs7KmzSEfhyui7nFCGYdl+uJ/ngSfu+z6bY+cfrElH4WbBSrz6iiWqGuBXbIjrFOh4sXc1SJru4eaMMmdv22yviSwatvNPyIJRZ4M7CCJsfCQtekCubRIFxRqeeeAfpGXgz/XOZnPhCxy0i3j4eLF2GpCQsmVSHI8ah++KXTvflwZY9kFcJeBy4hWoUwpaWF/srG2u+WftpUKjfqhU3qrvF+s23y7neb5rAMxAeZFHomNj0+l/sXcaMkpajZ0mdX25wseN3LgS+PenxM2fZLVq8rvhjdQsCES4IbhGh+Uf/wvNRCywoOx2RzFl3oxSMSimXE1uS+F7YpAYDOx8b7akNcC3Ub9U0lgYI92YVa2Nik5gsMDoAfmeCRdIZ1EBCmrmB899RttqNZtiHySXfBTmj55JgW1dQgfGkjQSZE7tifW0bIM9JCPMWrysYlZKWp/0QMTqLgKeA9Bwv7zZM/5bUec3D+1gwKiVNo52w7i0Tmn/2l+6nJeKn5UG0lVhpTQBMbAqgw5IsEtxhm36H1u/k+5oVtUxoEoYPH/bpX3VJ7AEadP8zYHxstF/HPXbmioqJ6Db7FJ1k/QY9i6bRTpDQMcEkop3jXj6wI+RzblDWEjwvCVFLenxO0rhxoK2CUdkRedofZ+URw1jO98oXjUqiQfPT7Hlvm52C6mnQ+bN/YT0L1rf7Xu4UN280wfl9H0tW/4fcly0LmNzrImr51dATYx1AbLGbecxON2r6ysa/Giv16k5x4+YzdpraPeBM35yeCPjHGZif/9lfut79t/94Pu6i1qRMNP7j1m7NBZ+ah+bHFwdXCRjvpjJKWl7sF4xKIu9XoX6rtpz/8taNt07zPSt/l+8lFgtLgu6LXzoI2PVCkyfP3Ndp+8btQHxtkmPPxLIbxjycjFXv9MKkgLYopnfTObtkKNRv1cDeIsUE82PjIJU5+2Fg8r6YTlqOACCX++rcbZKW1pfW5wgxoCQ5arR3CkZlb6yVdxo0n6jwfHVz7QGz3AXPJtJDDGO1XqllyZvpNg52i/XqIy/hJ8JEQnTmWC2nHvOb79R0o6bHvf6mJnZfF9NKHRSsbWeRYbN0GUGDXfYLiQqW9yMerJNkeywxrqxurj1gKcosWD+t1O/pp8a+/PoUGEBOYBk9LNerjgvOZIL5HQl+P2DtXdoN/J+ah2bJqF3va192g2N5VPun+tp23GTWSr36iDly9twi4pYbHggV2B9HGtN6J4XBr8lrR0SC3gIzvwG837/l3JdHFvAwznFTf2wV6rdqOZIPvJU6PPMQVB8laChht9GO/L4HVJdnCQugzjRm1a3WqztpBM1XNtYMotCDJiwwmkTy+R+DiycTmZP8rLLWB766WX3lcy8nVgMb2Do2gRakFrMrGJVScWNtT4Pcn1ToAOAPpwZnIYi1F5OR+Y4B5wbnGjPtajnxvli/+bb40817ScXQRjlqtHcgAy3kWCv5SHjvRPiak/rHq92X7ftHjcOT6cuF+q2AZe7R0fIircEQsWCnj9vj60hMkIPq7QCASTyLcw+lInarm2sPtJx4G7kq3gcG5m6PwbDmyYtYNyHJmbd5RYfLkLyn5cT74kb1WdKi1/35cA9gX5cmatA8aD8xhtlzyPVu42D96MXBU69rMs92otY3Z6g4eaVefeT3/pBT75cIZrNlQUp/V5VRWs59CbLqPUlU7ApGpVSs39xnpt2YTzcLQAeMPTD2GHjMwOO53A2r+X/4guhB1Bv/qHHYcrcxzSeErTREr+vE5Tzf68hBc42DbqDOn/2l6+PcJzm98pSpsrq59iCoC4gJiT6Muz8f7gVf77Rd3LwRqd4xsQSF2/nwCuAoH7YFRhOMN3kpW9Mslkyb7ot2p1iveg8kPC2RCF0Tphs1HeLLezB5H3NecETPWKlXd5PqemDwOwJ9e+FHsIrc5U6+2fM/+0uh6t4EsSUTDIUzeKYejfO+0BNm/+4dd39z7Po3P3L20k4v/+WOb/adc0+iZN0TETun91NGyF5xi8CPR4O6iwgDT/2SFE6JhHhf3KgGNrSfzrzr1TiFMojRSn0mfBDEv7FNv8O9cZnYIiZ9aLGwQIkYulPzRHrMbgKdgJ3iZnUriUZyQXTJrxA99DEklyR5v79EFHpSbt/mjpZL7nPSwKHcw9FJxXDrMsXwswJdAnx2ATvXgEUSH0jw+4H72btb6q6BuTZuUjYRJbYUZxSz2bJW65X7DPJJVlAtSnnOxJ9KpCZ3xh5E/2l3gYcwjlIyanov/+VtqB5Pggkm82QRNaGU8FBPi4hbLOmDALc0mztJWNK6UdO/z30uS4ia06wdvbh00p5nv8VMDHQ+NtrXwxwjKHsetSczaFFURE4ynAWjUhoKmSNidAWEEhOXZjngk4ibRy8O7qb5GsWNtT3/+H/4Yb4TWXbhhc6x5I5ezk/pSBKYzZZV3LxxF/BtszmFUQK4lKAHNJUQgdVsWZZTC9ZCzFl1AvRkpV69FMetdYLm3hZLUkFzt9A6tNgx03Nfiz4iK5vV96diJk+j7G6RapRa1aRhgmn3/RNESZG3L2z3c7073vdQeOsu9q0VUugsgB9352xSSdIUf6xsQYgptP84E1MYgzdZsJ5X65UaM21FaeaXffkwrFtbrN98ArDvyKoojeNB02miNqBHsujnl449kHenVQMYZHmHte5iiV0YoWOCKROeZJomk7ShhOGHjTXDFniS/A3gPRIqSxSMitvCFcLFdScR++2R1Y2a/p32pUZEj4IsRzdofjXsOboJird+53TcX7oezZW9UQbnvY837yS0EyIK7uSf934eUphC48hiFzRv7uSgxM0/+hdSG7eTJM6NqD07mRWX4gTcqGOL/Mm+wHlR/LG6xRo/Ci/41GFikyQ5f2OUfQ2CtqKObg/qfIgzQmqc5Tl3zHg6dJB1x4TmxxftwNhhJLELNZ+N+Xn35eya3KPiHUxOd4OZu3nrQcT+ycCZd/OC83ARr1KdCRfT8gh2lcLtv5jVQqUgRqc/E39b7M6EktcDaJipB9DKwoN1jHU3tj0wktgFZ0XmT+iCrNQe9a+nvbqvYFRKeY3KElQD8TU+UxoggI4z7WW+Bc6LEL2tcel0Q2ZgzxI61kYwIdEiwZ0Ba+8gZcnZ5yrKIDamJHIWE1ujZUPDXcBSDMx8X7OiTCkGgNJIsXdWa16DlvKMy+qHFrvx48Xnb59rkNjN2+CBeSRxwUvgYTuuCX3KnCw2H51WfNxfNmdtZc2K4M8nWINCid0493XekhFDgkZAT8OyU7jLoUNMIh6DBUHbSa1XXN2o7rKP9ZASX4kamN8tesH9JATtqQiaEhOqzk7kxL2g1pt5FDoAAOGBX3G4Errp4F43Vx3Pge9FLEq2CHj6x2BpN0lhOHrZ3i7Wq7fTiiu6SZcWCe5kpUxozngNeE80FzmxBZ9KkbFiVzAqpaAyEwIytbszLEGThOdyBPyc0/25vQdgb1iUTBrfYYY+GsccbtMaWj9phhnsgbyr5cTbhOJvJwXex3KpqSy2ycgPLuz1cz2fpVz+KxfHurFBSYmotUxZInA1YYyyBcXikUAxeAeCdsctVFJEJ87KxfFurMBt3z5gmX6rSBoUf6xuBexgteyePZfLuBXJ0v35cG+1Xi1FSaK4LuprItlUCa5U8XVll/M9wwL2zn49UOycYYZ+sTpufXx5MHcDJQtGpQSNH/kuUmE059EtV6TDUaO9s1qvIoTgWaD++kcVf5sK9oCbWs47uQhJt+EhdsHDO4V/TR0FrFXLMrk8PQkqirZtOZd/lyI9jhrtnRCrHHVwfr/4081EpnMrgvnUPDTht4RLeHttvruXC0alJHwmBDPB7DYO5s6FXalXHwH0fwf9jBC0/Y//8t+M7//P1Yvf//Pq//fHfx6pWIsC//uvv7Yu/csP5Oc6uVwEw/g//uUH/Ndff1WhkJT5x//5366CUPH4lq79839/+vk/zc+jX/S17DThv+gjrWF9aTJurPTXcFkw7Wp5oZ7UihNCWnggYKdYr75NY9GQYoSAEV7f5XrfZGV9xY403PH73rwF8Is/3bzn7sWIBqMEyXvqwlUMOWq0d4KW/IxQ1vJif2VjbeLNegpvbCl9E0DE345r9xU7Zm9znYHOPAXwiz/dvAfJ3wQrI1JOa0OWYv7oNg52Qf3rPG5xO6NERK+c8IkiaVwd8gwzne0zh5/YFTervuPAiTE3Vt3q5tqDBITuFMKWcm0VANB98UtH9nl9rOAN3drN6nv1oEwD7x0dXpvlPMVOSA7anZmVJulAivWbT2K5ruMYurab1fcr9aqvq69YfD41D82l/oXroVZcuhvllFubMEzvvL+O0tlF2p5iZ5PHWjqXPvU/TH6G6THcXZv60ERGiYCmcm3PN2azZR29bG+7cbzgzL1ya5MnIEmRzx+fHZn2Le6CD0+y2iCvGzV9pV595PQz+u+4TJzh8uf62hMleueXbuNg1x7I8XG8k2zt2r66XhIgYBn9EvJfGW3eYidwxfO36dspp7OmuHmjXNyo7i7neu/d0pLAxm12Bi/eT/5MaFvF8843kdxaUM1dlK4EbwLsvvS1ppm/GYbr9UPkLRg8/qk1TVY21gxw/q07uTTMdIrOn/2l63m5lE6b20g8T4ne+SSqW6vlxNvi5o30RtQvOEGVIcT0ldEW3C6WcUjAuzfOC8bTbqN93Wq2LLPZsnxbTZJgRPQK9VvTc6kVmSGCW6uD82/Vw3ECfN5jJr48+u+5FbuCUSmF3LpuAfzw7AIWAvn6+mHiLqFglDTIfZXEOJ9Ecmsl7ynBiwkLv/t1MSy7i7hojd/Szi17IK97LelmZt96QSKxE2UD/FiGSQwleueOM25tMJL3VusV5QlEhCE9K0SIML70xP+gPrG8GWA2WxZ8J69wiyDXu40D33Hx5FOMCABSyssEGbiDcvg6kaxAJXrnlrBdFwzxSl0bCcEhxC6sUs4ax2LjhwA6TGyCsTcUuXGDE3ODi75iJ1hcc35/3NOYasx4Con7cURvpV59pC7s80PIrgtdy9Ek05HPHcTk54WNFzvfX/aoSp413cbBbrfRvv7xxcHV7sv2/bDTYQOTFO48rG7jYHfclAsBeoIc8ccXB1cJeBxF9AjY0fJiX4ne+eFT89AcL3hU+6f6WrpF8QsEU7iQk7cbG/BBnK1Knmskvfb8+oioHzXaO2MDzG6s5ajR3pF9Xgdz+P0VTifGiehF/RMU80cYwROgR1kzLLwoGJVS4cfq1kq9urO6ufYga9UHo0aEt2UXEM86W5U81wS0mizneyc9jEcv29vjBIwhXhU3b5Q/NQ/N7suDLXsgr8YRPVWjdz4YCl5AIkwfvQazRqF+q1as39zXcuK9JvCMgEfMtKtB7k/7GiZwfMsuKJ7lzndfCILmYUF+vTM0b1/YBvzF8WQst1sgOonojRYmK/d2cXGSZ/7rDZiRSbFb3Vx7oEH6b+dzr+GpeSrSN2b3FZ5iFxjPIs7kBxCH4Dn2Xw8vNZstKz9YGhtcBue/agEaih5BrkfaR+teMCqmt9i4ZVGeN6vXmKJZU6jfqoWdJkTATpZij/6lJ37xLEBfpFog9pvPxyidFRiz2bJCZdM8eh6PGoetbuNgXTDfjZS5PRPTU6K3gDC8LX/fzX6zQyM7UqZ4KrFHwaGO7z+WnaRv/yizWBjrjiT5j3bO0Td/Z6hsmju7zEuYfn150Pz44uBq5HKVoeipOj3FjHBWq4bqWhpF/z73OdU4f9j6X1+xc+N23r4w4d48ZIrCEDQUQLDwdCMmFTwA6P7c3oslelDFyQuHYL8hsJnZbHeybzkGNvznY6bNaFOBr9iZzZbFYF9X9rtcLzO++CTEjVReTcQAACAASURBVE8mIXhIUvQylvJXhKNQv1Xzt5b8qyKmjabRjt95MsHMD+RVv9/1MxqmTWC7mID//gZaIOsubnzyU/PQJAzuBj6BQwgekhA9yP1i/aaapzdnBMbAhEhuf8oEFIxKCUS+1xUR7ZiOBeUpzkycsmXnu0biq/syUOzcbgTvpwujtCjW3STxye6LXzqgflC91InghZlbNpHogWtqnt78sFKvPgqIgVlZWVmq5cl37wwTzO6//cdzAGCw5z4IQrqJFkF0yfMbFEHsAADSv3uAgAeLEDMKjE8K//25Q8IK3mgd3thjuqInmO9GKlnBmVo9FdfLJCsba0bg0nZGMwsrS8cIMgj9kYEZ5He+eprXYNhhw2PFrvtzey/AwtBFXoQfoJlRzGbLIoK3oDBKfwljkYURPLcOL0rpzq8vD5rdxsE6Qa4TcbQJy4ySiutlj+LmjTKRf7M/E0zbloE92dMghCDvdUd20pD0X9sgcmnG7SYsPRmFbPJ944lhZKlwMC5swy9uhzznQ5XahBU8RvRdFUeNw9bRi4O7kTsyhpzG9dRU3Bmyurn2AJx/G7RGgIh2Zm3VFYxKKWgSuKcgByy/YbBvAiMBvK3GM0M9Q4ld9+f2XpArJUCP5n2OflAJCoFDt8gNBW9svC1mO03sNrQTuKxc3OmjGzV9dXPt1djuA8beMAY2K3Sjpmt52g90Xz0EOd9f8rfsotfnhaLkJEk9HxxM/NWouvDDO2kQNNtNB/JzPXTQHQbqI+hUi+J6ht0WT8BO3P7BUdGLOloK+NrFXdmsvlrZ+NeFKRTPEsMVn8u53nvmb4vUR8mK+/p9/suzwOJhxlMvQQ4q42JKJ0nRz/cCBBnRLTsMLZagYZYhSywyjq8rKyEixbvCzS2bTPCGr3PUaO/Ez+A6oQgi+1Vxs6oGinqwurn2YGWz+r5Yr3KY8h7dqOmFH6tbxfrN/SgrPmVf+k7WnhYr9eqjIFFmgnlsLwXE8byb8tPq8xXSt+wExPKr95KiHrxYX9sHyP/GJ5h2Bj60OJSMmt7P9d77XJhWt9G+7PH1QApGpSTytE/jzHjC3nF/6aHVbE1cNb9ar9QYwrdcIAxMaEJqzz++/F/prJ2cE4o/Vrcg4JNMoBYTW+RO3WCnR7NMEXtasyR0gQkJwLIH8nrQea7U1/YInjV5se6fcazUqzsEeBoLPepf//tIAiXywh17wMHWQ4SasqzhurJ+QdZYAxDCWnhgbC3neolYxkxiYsEctfbOdWxP4IH/N7lGDAPEWyDeIoYRVegAbs2J0AHgx+PP07/8JI0mBBFgMY4KHeKIXdiuAXD+7TxmaUXAVOK4AxCGK/XGzMMDgHIioQD2mTMW61gj5SuuC3euhI/ClTXEOjTwOGgp1LQII3TuuY4d7RRUfpLGlHP2ebiwx70Wa5Vi98UvnTDbtwToybxZBZp9oZXGAIThPLyxGdRELGPhXwgtcT9yvd7pydUgeW9Yt3cukhrsf/NOcNAWqH/9qNEeY0mli27U9JWN6rOxFh3jadhzFeQ/NTjP+St+35sAv/vkm6VhsffGHjUOW5Dy/tgfdKyCt/OyX8Fstizf+WKA/g+5L1uTHNsZ5Bm8xGdyy9jPsuNW9+f23mi9XuyF4IStr9zcBS1YHhu2icTpis/uGRdr2hSMSmk519snQvD1zPz87IL5IPq2//ACIiQaswu65tijsmKiJdndnw/3nAm8Y0fR6KP7FbJu6QX1ygqMbx8bx1GjvTNW8FzLOOpDIugCkCPZ5mHpyjCLG7klbcjQzR3uHtio7v5lszp38Vo/hjHXWOU9Tq2XCcbTsCs+p0Ghfqvm9ruO+5w63ZcHkR7u7vJ6T/xczrhosH3PX/OIvUfOxnoROuM4CmPPJvH8U+PfZ/7hexGUdSbIRC7aYn1tG6AQ7Xbcsgd8P0xsp7hR3QV5B9XHnXfBqJQ0jXZY4Hakz9L7xUxIvO4J7P39RTszo4omZbVeqUmImiC+xkwlPhPTE0CHJX0Ao5OXsmVmrCqhWL/5BOCxlhoRN//oX7gfpzqgWK/+5lnRwLTXffkf473BkKxuVl/57ek4HixdPnvuiYgdhjdKjp4FlqV4YzGhJcCtAWvvMBiYsw7YYqwQcavbOFhP5HU2b5QZuVchSlNClfQU69W3Pk/sSKn/HzbWDBa4N64QNhSu8Nkkmll9uC06zv2pPfMPcYzA/DyqRTdKcXPtvVdRMgOvPzbaicV5A16n87HRvn7264mJ3ZDVenWHfepeokGdHvXun00fT4sxNXeeT464RLCMLQl+/DefrJhzQYv3Xt+Le6EVjEpJE6LGGj+a2NrDifC1smzVLxK6UdO/y/UejC8rcSDg8aSJk2L9pufmMT8RivUam9UyGG89v8l46hVnnChm58VRo71jD+RVIkxYjMrlWe6oHZOoQJKz/EZ2iI4Tdj0ojpfX/Mdfk6BXcc/tZMYe9a9PlNTAmRhfvfrbymb11TzEceeR4o/VreX8l7dhhQ7gh0lkiMknI0sU3EUSCds/3sgEz4L6xMUOwxamF+27cduXhkhOr8YpDLYtfeuKCHiQZJHkp+ah2W20r1NAnd/Ia+8U69W3ZwVCwn/PaBKDILsvfukMkxoEOSyjmcS61YlhnJSz1G++LW5Udxc1szsthgusIRDc4+rCBBPUvx6mji4Mkvl37xdKUOyE/+TkPwdLntd64m6sF27LzYMQ2Z+vSTigGYegRAUDjz+mUCsVOhRAMFnyw48vD5oIimEQzI8v2qmN2Cn+WN0ije8kEt/7CmoRyeYX0JtFSnKkhXOf0b1QcbkTuHU8uHA3qZAMxiTJuo32xJrjhph+8/6ufzx9KmI3pLh5owyZ2w6b7Us6oBmHMX2m1vFg6WqSF8qQ0IkL533aIcLrgBjGXvdlO/WHhm7U9GXRM9IRvq8TWSre5zASk9seN2zgDBbAoboiohLUr5pErPuHjTVDkndYJsgAmarYjbJar9SYhQHiawEZ3FSah6MyC+sO0Ut6LN+5XoDxsdH2neiSBmeErxbxRgyDBVCHwW8kROvzINdJ46GTRXSjpn+f/3LPaV+M0xoYvpQpDkHDE+yBvDrp6xY31vb8FgCdbf4fZWZiN0qQ2Ztk1jMus7LuTl5/o7rLPu9PGLLwHv6wsWZIwEikhs8X6rhFvO/AWkcSW4siggWjUsrl6U58gXNjcyNhj7RIU+yCXNhx4Zpc3BdNFEbHT3a/y/VuWwFz5qbBUeOwVayvtXysO/27XG/bCp3xivH6L9vbxfqaCdCjqBYSA5m42X91brAmRqx6FnwnWeHjMjHKAAyQDQ3Acq5nLW+uWZDUYmiv+8I2+/0lMwvvSRAFo1KCEDWN6DYLrhGjxAznE42ORcDT4/7S7qz/bjtvT2Th90XPNzxC0mePjEsmxM6WsqUJ78QwMdaDhmpOCwI/Zt+OCjzQjVqqF1K3cbBbMCrNqJ0qxMjEOr5R3C6O1g8bay1JiFUSEwEdTDoIWwR7a4mBpVwP321WTWIywfyOCdbQEpx2UXvBqJSEli8LMbjCkq6C6BrA5dOHGoNi6RswFLk/BtMVOUFsSR/r5QJrk4UznASM57d6oh9YyZAJsfvUPDSL9ap3zIk4E9vEx1l3y1rviQWkmgT41Dw0S0bt+kDr7YR2awUu6UZNn/UT3QsZ2G3Dfu91Ijhz57gEQo0ADC1B5ASK9SqY4IghhpNP+HcmWIL4t4FNvwOAIM2SPjVlgkmX7FgxOY0vSabLxNABugRCiYlLp7PvbDCTG1SKr2xnSTu84kefNEuDTPy4TqmVtwvPBHNcA0ImxM6BO94XN9WycrMGWXcgbK3WK8/TbvR2Boxiu/hjtQNn+1Pwk5KxtZzv1b6vV+5noQn9Kxwrxus7VrdxsK4bNf373OdyiERW8qc2FEOcRrbJ2VEK7cQJcQXS8wCA5v4eMzmHGBGzCay10Hyf+1y2EOzazROaRr6hIiL/7w1Jpag4Jr6u6ve5z5mYouGIhf90EHZialOh+3N7zx7I66GKthklhtjP3mxB9vlcnYkVVrNlHTUOW92X7e1u42D9eLB0mSDXGXjsfg4zfwDOmqDPP+relCxTMmo6iHwnDoUpms+M2JH/OPTYE4LTgMABo5moNs2drJ+ah6YmEbT17WsIW1o++s7aNCg6Y6B8SmXI88Idit/HRnun2zhY7zbal0H965C473ZznJPCY24R8Jgg190J2N7tWRFWgGYdNzHh7cUw9sLEWTPjxjoxMb+4He7BKZqcOUeNw1ZxY+25X50PJO/qRu31tNzuoBYxTxglMO8VN6o125Yhdgqkg5BckuRb+eRdHO2BOwSzA2Bv+LXi5o0y7HwZhLLr/voK6zzAxCZJaoHx5lguNc9eW8X6WuZDQBMTkJggkqH27GZG7AAAjOc+9Xb6ar1Sy0rMKW9f2O7nend8biB9OfflkYUIFtckEMVL4DgTpI2VenX3Y6M99V2lQckJOZDvJjn2iACeMIz/geiak/XkawDpkVsYU4aJzeFMPAFu/Zd9oRVCrF4D8Hw/FyFuNy4x0X0RThcyJXZEsskQnllG15XNxIdmNlvWSr361K8lBqDt1Xrlddri7MbfJrlZhxOkt5ixPdUui4DkRBrWptVsWe5N/81nUjIqpUEOJWLSWeAKS7pKgq+wkz3VmVhPqB7QYmKLmCwiNlnSBxL8nm36HVq/c9xfjlf/R9TyS+Jm6b6Jiyb8Y49hEhNDMiV2ucHFTj/X83VldaO2kxWT/GOjvVOsV+/4iQ2TeKYbtetpnm/wRcDbkHQ1VIkKo0RAs7hR3ZueaxucnJgm7jTh8VOgfQYtAOgQ5DeWfG5wesw0JxZ3X7Q7viEggTvTDgHl2dYDQhTRCXBho0zzyZTYmc2WVdyo+rqy/5D7smUBiTcux4UgH/q2kTFKabuzpOEO+zzRB31+/al5YBY3q3sMDjVQwHVtt1bq1R05kM9T6510Bi9GSk5kG7ZmHWJh8GvP5dSM0rTjdtIp4vbkC9mRzqNk1PQ+er4LpKJco5nJxg5Je9lNkhw1DlvB8+doO85i7bCwj3XEQGd4EXRftDvO/LnxC36GELCTZtZWSA4S3tDJianDlAmvwguS5Cu2y3n/Fqtpo/W1SO+hrX0JtUAqDJkTO/cJ6ePKUC1N8YhDzl7aCap1YhKp1LY51pG3tebVIhZ5gjSjBMl7w41wCZzyCWkmJ9Ilu2JnS+lvWUqaagkKC/8tYp8Dto95EVRtMKBBJGs6c2Ln4L9IepqFu2Ewmy1LMPu3iTHcRUQJw/6TL/zGUseaIJ2G6PlnkFNJTpwHPjUPTfh9psSZsewiu9MCnkIdpj3s20NlkPzgwp5/dXz2rLsQ7mwt+SXhwtel9xtLPaT7c3tvqX/hehTXNlnRy05yYqGQ5OfW6X/ZvDHFEhvfMEUkoSsYlZKv9zJmwokXmRQ7s9myGP7ikTXrDiHcWQJ2khVpP8uOw9RlwWy2rKFr63YfhHzZyUQvTueEIhwioJUxx7np9RVDXPH6OofIeI8StEAKmn+M0o9Mih0ALA2WArKu2bPuzGbLIgzuBv0MQ7xKIn4XtJAmqmB8ah6a3ZcHW4L5bqTlSDFFb26TE3OAZl/wFYBpJfeKP1a3QNLbGoP3hBg/gmK7cRZIZVbsnFWG8xO7w0nlPgeVmuhaXuxPupVMY+kbgxEICFQH8OvLg+bHFwdXI2+EOyN648R8fpMT2ceZiONn3QVYSROiGzV9pV59VKxXfwvaaMYg761jfiQc282s2AGAbXNAdXT2rDu4QzYD3UJG6bt8b7KEBXkHbQFMXO91siM2puhp+THTVVRyIlUCLHs96fuluFktFzequ8u53nt3N+24h3jEmKxvaVWscEemxe5T89CcN+sObu9sYPyOYRTra0/iHDuoRSzuReBF9+f2nuzzOgGPI4ueU5z8fmWz+upbl1slJ9IkyLJPauTTyV5axlu3ASCUp0IUPmYXFNuNO90m02KHU+vONzP7T/W1TExDGcVstizZ5/Xg7BNtx8nQBgVtSXivl4vLp+ahedRo78QSPVfUNcj9oYu7srHmO6ZHJSeSITe42Elj5FPBqJSGrqoGuR9n6Q+xDH392CyCBDRWbDfzYvepeWgGZWYF6NGkMbA0+NQ8NAPr79wMbVSxDiqy7HEvlZjXpKI3dHHJZ9eny/wmJyitbWnRceN2vkX5Ue4V3ajpq5trD4r1m/taToR1VX35wxHiUGiwfR/qfep/iPP6mRc7nGZm/awkfVnrxXIJ0+bXlwfNcbVsAvQkUglHgkWWURmKXqyY3hhUciJRfNuovsv1xlp3hfqtWnHj5rPlXO89M+3GXd14BitKQTEHTPOJe53Phdi5Tyt/0XD2P2QuWQG3TSu44BiA5L0wghfYIhajyHISYicyfNA0sf0XJ06jmBTyr0Fzt/V9gyNw1d0TN5V4K9mBp9FisgG1erEf6HMhdhhmOYP2PzgjlTLnzsLd+zq2cDeM4Nn+TzsO2/OaMEPRI8j1SMXJZyE8WGK8LW5W3xc3qrtBtYSzgnw2iWWN7ou2b9zOHfnklIts/KtR3Lj57FTgwicbzsKEJmTAdj2maJZ7QrV6o8yN2GHc/gd3pNJUTygCefvC9tgs0hjBI82/MHTWbqCzGOdga9iREdvac7K5D04SGxvVZysb/2pk4UEmmaPVic0QBnu7soxSsX5zfznXe09kv5rQgrMIeHw8WLr88UX7rgh4GPj1a/viN5IsqmiOMFdiF2akUhaWyXhhNltWfrC0PlYEJO/5ZWmZvUdvj450mjXDjoyhixtkjY/FLWMhsl8t53q/Fes391fq1Z0sWn1ZI2jkkxuDm+DhwS2CXO822pePGu2TgbpBBeNRkgpBhelM8TfKZWp4Zxhy9tJOL//lju8wSsm7BaPyJis3/yhms2UVjMq6yGM/aJgmATsr9SpGd0M4N7j0vEC9Rjplge7P7T0AewWjUtJy4tXk+x64RkBNg3xUrFcBUIvBbyRE6/Mg18nKFOtZUTAqJQhR0whlFriT8G7aDgGv/xgs7fq+zz7F7pGTZ7lcCf5LtmNn7edO7Mxmy1qtV+4zyM8s1t0b6/qUTy0Un5qHZljBK9bX9G7j4CGcYtGAEez+A0+zwKfmoVms37SS3HbvcCp+y7kelus3O2DukODOgLV3nxr/Pte7F4IoGJWS0PJlkH0NhDI5Vv/JwzAhobPAeE4km+M6cwL3oTASC7EIyNihhLkTO7ju7OpG9WnAfoVysb72ZCgUWSOs4AG0XayvlY8HF+4S+rf9xGLWI8HD4dc5Ae/dCXFfg1BmJmiQcK2/DhObYLwDa52+sM2/OwH8uaBgVErI5UqQsqQRyu6iIre7wHZ+KNlnSGiBGyVwH0rEYndNypJfgC3qWPdR5lLs4GY4i/XqbX/XiLaLP93sdP/tP+JnCFMkguDVlvO9t2C/6a8TxMSmRNDOCTCeH9tLO8uiZ5DGd5hpwnjSNy9QJkYZgAGyscRAsV4FE0xiMsEwmfiDlDAhhGmTtPr9pXhbviKiGzX9Ij7rdl7omo1yTuNLLOkqQJdAKLtz4XRAjkTXk7aOgbgCN0rQPpSoE0pYoOS3rqffX44dnppbsQMAeyDvajnx1vfmkLxb3LzxrptysW1cPjUPzZJRu97P9fYD41m+Qhd9Dv8sCFqIzYR9d83h3nDR9Wq9UmOmLRa4ndAKw28gRgngEgggAJoAAAmNgaVcD8ungmidlHGQLHlqDUNfqVe/GVpBzirGSwDAgnVi0gG4qxmhAz0dENDYSRUyuyeTjqCdxSLgKSBbk3oGBaNSYvbu7Ek6eTbJQ2iuxe5T89As/lh5CCH8pojoQP5VwaisZzFhATcGWTJq633tyy7IYzvUGKLO4Z8FUbN07s3XAoDi5o0yIXfbuZkoqDk8cVxBPP0C+64H1D13CI8IlxNDG/3v2ROYbIhAoAsbK3nGJXivJ5voXOeq9MSL7s+He4HlKIySlhOvslCn5YfZbFndlwdbkcakT6lFLBECxjqNO//ui186Ry8OnnYbB+vdRvsyQa4z8Nh138919jUIN065F1DorX+f+5xMx4rwf0j3RH8vkdcAgAnKTjDvlt2Q8fE7lJfzvScWAiq8M8BRo72zWq+CvawED4iT601Nl+TGOo1afRix/ADU2HF5z2PLmdP8z/QOjM6xXGoOLbbVeqXGXvtkT0c+TezC+vXOxn0YO61i35q/zErsADd+J/LkH+xnbK3Uq+Zo7VoWOWq0d37YWOvYAk/Gx6uoVqyvPTkeXHic1Rqz4ORE/Gr4IW48tgN3Mo5u1ByLxbEma+zEzabq/qYJE5sC6LCkD2B08lK2zIAQzVHjsFWsVz0z3pOMfBqiaeQ7YJfI/3txmKRVDPBxjOeV4uaNMji/H3RhM7CTdcHDsI4qSLxHIZjE8n4WS1B+2FgzpM9oJwaMj432VBIsxc0bZWJNB9E1lnQVxNcA0rNoCTKxkxhhdJjwgSRMaP3OcX85Vpa4WF/bh0/c9HiwdDnug9ItFn/v9317IK/GiZUX6zd95uVxq9s48BxkEIaFsezgPuXHJCyGM+R+/1vjIGChz+wZZmoHWm8noJ7QgVFiiP3iRnXPtuXjLCVjbKKybxlBzLlkcRjJyH/zQNCNmr6cPy4RazpLUWKBkpMtxSXQcEEQ6QBKMSxEi92eUSezyxaYTDhu3gdB/Bvb9DsJaeYGMIOstAl4DXi3Gn6X6922Ymb0g6w6MPZiX4ckSwHJoNgslNjBTVis1quloLiXO0Put6zW4A1xRlthu1hfMwEaP7OPsKXlRa34082drPxtBPIrhh6bnJgWbunL2HNZqVd3PLOuALqNdna9JKKWXzWLO/IpstgVjEopqHqgJ/rBY83iwGKiB8HcZ2O9SHKGXBboNg527YG8GmqSyHDbV736Nom1jZOjdk7MmjAjn6ISaNWBW1l5kI2ykGKH4Qy5cd0FcyR4n5qHpjM3LnR5SlnLifeBm75Sxn3d1JITivAEjXyKen2Ms+oCR7HNkIUVOwDIDy7cnXSGXNY4arR3CHL8qKghjmu7H2e5z6QELQeKPN9MMRFBI5+0fLStY1redwgHAJ64IyMtFlrsosyQmy/BO2wt9S9cH+uqD2GUCNgZbvlK/QRdbPIXu2kmJxRAXi75T8aRFLoEZaVefeQ7WBOAPQheMjVLFlrsMLLWcNEEz2y2rKOX7e3QsTyMxPOmJHpOcsKTzCQnzgtms2XB7zoh9t1YN0rBqJTcDWPeTJKBnQILL3Zw411hBW8W7t4knInlhauXmproqeREppDkl3XV/7J5I7DeUDdqepD7ygTTtmUmY3VDzoXYIYLguVOC50rw4Mby7IG8Hmnpzajo1W8+STKRoZIT2UMEJOxynAuM232f//IsyH0lop0sW3U4T2KHcyB4w/0P9kBeHZuYGcWZ7rE9zN4msdJQJSeyh2Zf8BU7Af8SlJV69REzBbi63MpKXWcQ50rsEFHwiptV306MLPOpeWh2G+3rsXa6EraWGG+L9Zv7k7i45y05keWpOkPc/cs+gkdlr79hpV59FBSnY4KZ5aTEKOdO7BAlhsfYyk5xbnQmW2TNtRMXN4a1d96SExfxOfNiBwAM8psv983Ip3FCBwCQ/DDr7uuQcyl2cAVvqX/hegh3r6zlxf68Ch4mFT13neHJAuufbt4L916o5EQWEZC+rqw78gkIKXQEPP748iDTy55GObdih5E6PCIO/sAYJS0v9lfrlbneVzqZpXea0NBy4v3QzfUSPpWcyC5uwa9n1n448qlYv/lkrEXHeHrUaCc6wiltzrXYYViv9uLg7tgCXXeyyDwmLs4yKnrxF/Y4bq6X8C1qcoIk5sJdG4+fdU21Yr36FuDtMb/f6r5sj/mZFCA5kXd17sVuyNHL9naYvlN3n+v4CSRzQPfn9l63cbBuD+TVSCUr3/CV8L2VRL4PhEVMTswhQVNOxsVmO8dOG2Z6OEuOEkeJ3QiOWc4hds3SdnGz+n6e43ijfFWyEtfFPYHLATfMQiYn5g17MCZs40/neLC0nv5UbCV2U6HbONgF9a+HyNQuRBxvlE/NQ3Po4hLk+mTWnjfFjeqz4k837yVRy6eIh5s9jSYozM+nI3TpocTOg+6LXzohS1MWJo53lqPGYav78mDreLB0ebLY3lfoIGxB8t4wu7uyWX21urn2oFC/tTAPjaxT/LG6BQq/z4GAx92XB1uzFjp2pkXHJrvTVTOAM2OfnvnN7x+FCU3Zl3NTcxSHglEpaULUIPAgvd0N1AFzhwR3Bqy9+zzIdWZ9kw0p/ljdgoBnoXncfQvTQjdq+ne53gMCtiOMlrcE4eGvL9rJrUMMwepm9ZXn0m2C2X3Rvhr3uErsQrBar+6EWm+Y4cU3SXMqfHwvzMNgMqjj7kF9B9Y6fWGbf3em706VeRS7Qv1WTWNpgHAv4v6Mjj2Qd2fxN63U1/bIa/2jErvpUKyvbQP0KMwFMy8bzJJiKHyk8R1mqk1vbaEjgiTxgQS/H7D2DoOBmdYNOi9iN4HAAa7bOssaOiV2GSDqekO7L9ezcgNMk9V6pcYsDBCCFpenDDl7FxgmE3+QEiaEMG2SVr+/FG8lYQbFTjdq+sXcoJwj+5oE1YgxwcOGW6DBw+6MM+a+YgdY3Ub7ctzjKrGLSMmo6X3ty27QDP4RLAjanoeJEGlRMCqlvEZlCRju4urMZGGZYJK71nAoigAgJUxBmiWJLZukpfWl9RkXrWXRM2YldrpR0y/isy60fFmIwRWWogxC2b8tLzxMMIkoMxvpihvVXfisD51ki5sSu5iEjuPBmeCatX2us+JU/KjmLqpelCxsB0xnLCL+nSlaiQcxXQEAFqwTk87Ewx22aYQGLAKe/jFY2s1KEggprqxUYjcBUd1aZOjpmSVW65Waa/XV2HkvM2P9LSbcjZ1tyAAACGtJREFUghB7Wb0WldhllIJRKWka7YR0a5WVFwLdqDnjhoiusaSrrgVYnl7iYyGxwHhOJJtZrxYIErvjwdLluFaoEruEiJKtVVZePIqbN8rEmq5EMDQWGE0Gv/7TvtDKkqsahHsvefafTxIbVWKXIJHcWigrLyl0o6Yv549LQuZKLHBlRAh1AP7jphYSboHpHZFs/jG4mJmC7CiklfVWYpcCkZIXyspLnaEYEms6S1FigRIxdBJ8hRn6vIqiU2NILRLcAfO7eRW3syixmzMiW3kzrFhXnKIbNV3HZ32QQwkAWArn/4XzbzczeokE645QDiGdiU/+TUyxM6jDnmxisojYZEkWEz6QhCmILc3mjrnA10mQ2PWofz3u5BwldikTyco7h90XCsVZgsSOINfjJljU1JOUcfe5Xg07I87dapby8mqFIrvYQqRitSqxmwKfmoemMyNu/CRkYGR59Ub12aIMCFUoZo0SuykS1coDYUvLifcr9eojJXoKxWQosZsyQyvPHf8eKnNGwI6WFxMtrVYozjtK7GZEt3Gwaw/k9dCjz4eu7Wb1vZrqqzivMInYHo4SuxkyXHQTackNo6RB7qt4nkIRDSV2GeB0yU3IBAZO43lK9BSKcCixyxDDBEakrV6O6L1VSQyFIhgldhlj6NoK5rsR9rfqKomhUASjxC6j/PryoPnxxUG0pdUjSQwleopFhBm/xf1dJXYZp/tze0/2eZ0YT0P/khI9xYIiIH+P/7uKzPOpeWgevWxvR47nKdFTzCF5tlOZPqPEbo4YxvPsgbwKcPhmaCV6ijlCOhNjPBkMELtvVondHPKpeWh2GwfrkeJ5UKKnmA+G47S8+IyLsef1qRFPC0Dxx+oWa/wowuw8BzU4VJFB1N5YxVgmET1m7MmBfK6GhypmTbF+cx/gb1oiGeh8bLSvxz2ucmMXiGEnRhz3loAd1ZGhyAa+i78/THJUJXYLSGzRw5k2NDVwQDFlipvVoG1xscaxD1Fit8BMLHqQ+8X6TdWVoZgaQnKQV/F2kmOrmN05InZMD6fJDLtnv1FxPUVaFDfW9vwWzk+yWQxK7M4nE4ke1L5bRXoUN9few+O6ZIL58UX76iTHVmJ3jnG2OPE9gGLG5qgFgT1VuqJIguJmtQz2cVUZe92X7fuTHF+JnQKr9UqNmbb83IexEExItJS1p5iEIBeWAeNjo/16kuMrsVOcUDAqJU2jndiiByhrTxEbPxcWAI4HS5etZit29wSU2Cm8KBiVkiZEbaK4nrL2FBEIWozNwOuPjbYx6WsosVMEMnlcDyfW3nEv/3rSp7NiMfHrmgAACNpKwlNQYqcIRXHzRhkytz2Zi+tmckk8/9T49/BTWxQLTaF+q6ZB7nt9L4ks7BAldopIJOLi4tTN7Qk8/fuL9kSV8Yr5JihWR8Djo0Z7J4nXUWKniM0PG2sGC9xjpgnjKdSBwK4qWD5/BMXqkEAh8ShK7BQTUzAqpVxObEniexNZe8BJfE8J3+JTMColLU/7flYdGE+7L9vbSb2eEjtFoiRn7UEJ34ITlJRggin7cj3Jz12JnSIVEovtnaCEb5FYqVcfEeAfi0soAzuKEjtF6gwzuSxwOynhI5LNQZ9fK+GbP1Y31x4w067f95PMwI6ixE4xVZJ1c0+yuq9tEk1VzpJ9VjbWDCJ6FfQzSSYlRlFip5gJQzd38oLlEdxyFmjUUu5u9ij+dPMeJO8GDOdMtNTE49gKxWw5FT48AOA3kjsG1GLwGwnRUlbfbBnnugLJZ1/PosROkSkKRqWUy9MdZtpKVvhgMaFFRE1l9U2XYv3mE4ADRYwJ5p/9petpthMqsVNkllPhg5GYqzvEdXkZ2mtp9ztK/JKnYFRKWk68GvfQSqPMxAsldoq5IJUY31dQB8wdJX6Toxs1/btc7wEB20HxOUxR6KDETjGPDIWPNL7DTLVxN1QsCCYDHQFufQG9Uf274SjUb9U0sp/5dkWMME2hgxI7xSIwnLScXB2fJ5Zr/b1jaC1l/X2NM7mEH/mOafqWzvFgaX2aI7+U2CkWiuLmjTIhdzuVON+3WAB1GPwGrHX6wjbPkwUYxV39ipSzrn4osVMsNI7VJwwQbiec3fXjxAIkwe8HrL37PMh1FmVoqW7U9O/zX+4xCyOCFTfEEoSHv75o76V0eoEosVOcG06SHMS1lF1eL74SQSlzH/rCNvv9JTPLQqgbNf1iblDWWBoguhZD4Fy4ZQ/4/ixdfyV2inPLjMVvFMcdJrZI4sNQDCWxhcHAnIZA6EZNv4jPutDyZSEGV1iKMguuEWOi94QJJiQ//PjyoJnc2cZDiZ1C4VIwKqW8RmUJuFbMVNzesFhMsIjJBABHGMli4g/DHxDEvw1s+t3vAEI4wkUMHaBLLFgnphIT65OKmtf5EvD0j8HSblYsVyV2CoUPulHTv899LkuIGoFvA1ROpcxlscicyA1RYqdQRKC4eaMsZK4kQTUQX1MCOIRbzHiaBXfVDyV2CsWEDAXQJioL4mvsxP6y5AKnBLcI9CY3kHvmHNQcKrFTKFJg6AITky5BNRJ8ZQFE0AK4Q4Rmrs+v50HgRlFip1BMmeLmjTKxpoPoGku66ggh9Iy5xBYAE4wOCe4wBm+6L36Z64JpJXYKRcYoGZXSIIcSMekscEUyXSbGFRKsu6KoOxlU0uOKIxObcDKzJpwM7+8k+D1JfNBs7syb1RYGJXYKxQKgGzVdx+exwreIIqZQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFIrZ8P8D4MyG7K6BbUYAAAAASUVORK5CYII=',
                    }}
                />
                </Card.Background>
            </Card>
        )}
      </YStack>
    )
}

