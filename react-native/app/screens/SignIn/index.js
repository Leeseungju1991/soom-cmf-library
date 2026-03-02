import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
  Image,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {BaseStyle} from '@config';
import { SafeAreaView, Text, TextInput} from '@components';
import styles from './styles';
import { signInWithEmailAndPassword } from '../../components/firebase/firebase';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { getAuth, signOut } from 'firebase/auth';
import {
  getFirestore,
  onSnapshot,
  query,
  collection,
  where
} from "firebase/firestore";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const marginTop1 = Platform.OS === 'ios' ? 4 : 1;


export default function Signin({navigation}) {

 
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [id, setId] = useState('test1@test.com');
  const [password, setPassword] = useState('123456!!');
  const [isVisible, setIsVisible] = useState(true);
  const auth = getAuth();
  const [registered, setRegistered] = useState(false);


  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();


  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const citiesRef = collection(db, "User");
  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const [isModalVisible, setModalVisible] = useState(false);

  const notificationReceived = notification1; // 알림이 온 경우 true로 설정
  const [notification1, setnotification] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수


  const [myemail, setmyemail] = useState(false)
  const [noti1, setnoti1] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const [noti2, setnoti2] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const [check, setcheck] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  


  const calling = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "제약인 알림 📬",
        body: '게시글에 좋아요가 추가되었습니다.',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }


  const TASK_NAME = "testing-background-task";

  BackgroundFetch.setMinimumIntervalAsync(1)

  async function isBackgroundNotificationsTaskRegistered() {
    console.log("첫번쨰 진입")
    return TaskManager.isTaskRegisteredAsync(TASK_NAME);
  }
  
  async function registerBackgroundTaskAsync() {
    return BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 1,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }

  TaskManager.defineTask(TASK_NAME, async () => {
    console.log("Background Notification Task", "go");
    calling();
    console.log("Background Notification Task", "Worked!");

    return BackgroundFetch.BackgroundFetchResult.NoData;
  });

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const reg1 = new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}");
  const reg2 = new RegExp("[A-Za-z0-9\d]");



  const [isChecked, setIsChecked] = useState(true);

  const handlePress = () => {
    setIsChecked(!isChecked);
  };

  const scrollViewRef = useRef(null);


  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, []);

  const gogotest = async () => {
    setIsLoading1(true); // 로딩 시작

    // 시간 지연 시뮬레이션 (예: 2000 밀리초, 즉 2초)
    setTimeout(async () => {
      // 이 작업이 완료되면 페이지를 이동할 수 있습니다.
      navigation.navigate('SignUp');
      setIsLoading1(false); // 로딩 종료
    }, 100);

    const gogotest2 = async () => {
      setIsLoading2(true); // 로딩 시작
  
      // 시간 지연 시뮬레이션 (예: 2000 밀리초, 즉 2초)
      setTimeout(async () => {
        // 이 작업이 완료되면 페이지를 이동할 수 있습니다.
        navigation.navigate("ResetPassword")
        setIsLoading2(false); // 로딩 종료
      }, 100);
    }

  }


  const onLogin = async () => {
    const CheckEmail = reg1.test(id);
    const CheckPassword = reg2.test(password);
  
    
    if (id !== '' && password !== '' && CheckEmail && CheckPassword) {
      setIsLoading(true); // 로딩 시작
  
      try {
        await signInWithEmailAndPassword(auth, id, password);
        // 이메일 및 비밀번호가 올바르면 로그인 성공한 후에 다음 페이지로 이동
        navigation.navigate("Main");
      } catch (error) {
        ToastAndroid.show('이메일 혹은 비밀번호를 확인해주세요', ToastAndroid.SHORT);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    } else {
      ToastAndroid.show('이메일 혹은 비밀번호를 확인해주세요', ToastAndroid.SHORT);
    }
    

  };




  return (
    <View style={{flex: 1}}>
           <StatusBar
      translucent={true}
      backgroundColor="rgba(0, 0, 0, 0)" // 반투명 배경색
    />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
 
      <View style={styles.contain}>
 
      <ScrollView showsVerticalScrollIndicator={false}
        ref={scrollViewRef} // ScrollView에 ref를 연결합니다.
      >
      <KeyboardAvoidingView>
            <View style={{ alignItems: 'center'}}>
            <Image source={require("../../../assets/jeyakin.png")} style={styles.logoImage} />
            </View>
            <Text style={{fontSize : 15,textAlign: 'center', marginTop : '1.4%',  color: "#b2b2b2", fontFamily: "Pretendard", fontSize: 16}}>{'제약바이오인들의 커뮤니티 플랫폼'}</Text>
            <View style={{marginTop : '7.4%'}}></View>
            <TextInput
              style={{
                fontFamily: "Pretendard",
                marginTop: 10,
                borderWidth: 0.7, // 테두리 두께
                borderColor: "#dedede",
                borderRadius: 5,
                backgroundColor: "#ffffff",
                borderStyle: "solid",
                height : 55
              }}
              onChangeText={setId}
              placeholder={"이메일 주소"}
              value={id}
            />
              <TextInput
                style={{
                  fontFamily: "Pretendard",
                  marginTop: '3.8%',
                  borderWidth: 0.7, // 테두리 두께
                  borderColor: "#dedede",
                  borderRadius: 5,
                  backgroundColor: "#ffffff",
                  borderStyle: "solid",
                  height :  55
                }}
                onChangeText={setPassword}
                placeholder={"비밀번호"}
                secureTextEntry={true}
                value={password}
              />
              <View style={{marginTop : 20}}></View>
            
             <View style={{flexDirection: 'row'}}>
             <TouchableOpacity activeOpacity={0.11} onPress={handlePress}>
                  <View style={{ flexDirection : 'row'}}>
                  <View style={[styles.containercheck, isChecked && styles.checked]}>
                    {isChecked && (
                      <Image
                        source={require("../../../assets/check.png")}
                        style={{ width: 23, height: 23, }}
                      />
                    )}
                  </View>
               <Text style={{fontSize : 13, marginLeft : 10 ,color : '#b2b2b2', marginTop : marginTop1}}>{'자동 로그인'}</Text>
               </View>
               </TouchableOpacity>
               <TouchableOpacity  activeOpacity={0.11} style={styles.passwordResetButton} onPress={toggleVisibility}>
                  <Text style={styles.passwordResetText}>{'비밀번호 찾기'}</Text>
                </TouchableOpacity>
             </View> 
             <View style={{marginTop : 20}}></View>
             <Text style={{fontSize : 13,  fontFamily: "Pretendard", color : '#484848'}}>{isVisible ? '' : '비밀번호는 이메일 인증을 통해 재설정 가능합니다.'}</Text>
             <Text style={{fontSize : 13,  fontFamily: "Pretendard", color : '#484848'}}>{isVisible ? '' : '하단의 이메일 재인증을 통해 비밀번호를 다시 설정해 주세요.'}</Text>
             <View style={{marginTop : 20}}></View>
             <TouchableOpacity activeOpacity={0.11} onPress={ isVisible ? ()=>  console.log("야호") : ()=>navigation.navigate("ResetPassword")} style={{padding : 10, marginTop : isVisible ? -80 : 10, marginLeft : -10}}>
             <Text style={{fontSize : 13, textDecorationLine: 'underline', color: '#4A5CFC',  fontFamily: "Pretendard", marginTop : -10}}>{isVisible ? '' :'이메일 재인증'}</Text>
             </TouchableOpacity>
             <LinearGradient
                colors={['#A234FE', '#4560F7']} // 그라데이션 색상 배열
                start={{ x: 0, y: 0 }} // 시작 위치
                end={{ x: 1, y: 0 }}   // 끝 위치
                style={styles.gradientButton}
              >
               <View>
               <TouchableOpacity activeOpacity={0.11} onPress={isLoading ? null : 
                  async () => {
                    await registerBackgroundTaskAsync();
                    await isBackgroundNotificationsTaskRegistered();
                    onLogin();
                  }}>
                  <Text style={styles.loginButtonText}>{isLoading ? '로딩 중...' : '로그인'}</Text>
                </TouchableOpacity>

              </View>
              </LinearGradient>
         
           
              <Text style={{marginTop: 15, fontSize : 16, color : '#b2b2b2', textAlign: 'center', fontFamily: "Pretendard",fontWeight: "normal",}}>
                {"JEYAKIN이 처음이신가요?"}
              </Text>
              <TouchableOpacity
                activeOpacity={0.11}
                onPress={isLoading1   ? null : gogotest}
              >
             
                  <Text style={{ marginTop: 15, fontSize: 16, color: '#7A7A7A', textAlign: 'center', fontFamily: "Pretendard", fontWeight: "normal" }}>
                    {isLoading1 ? '로딩 중...' :'이메일로 회원가입'}
                  </Text>
             
              </TouchableOpacity>
     
         
  

    
   
     
        </KeyboardAvoidingView>
        </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}


async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}