import React, {useState, useRef} from 'react';
import {View, KeyboardAvoidingView, Alert, ScrollView, StatusBar, Linking, TouchableOpacity, ToastAndroid} from 'react-native';
import {BaseStyle} from '@config';
import {SafeAreaView, Button, TextInput, Text} from '@components';
import styles from './styles';
import {
  setDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  collection,
  where
} from "firebase/firestore";
import { getAuth, updatePassword } from "firebase/auth";
import { LinearGradient } from 'expo-linear-gradient'; 
import {WarningOctagon,ArrowLeft} from 'phosphor-react-native';
import { Platform } from 'react-native';

const width1 = Platform.OS === 'ios' ? '100%' : 320;
const width2 = Platform.OS === 'ios' ? '100%' : 320;

  export default function SignUp2({navigation, route}) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputText2, setInputText2] = useState('');
  const [posts, setPosts] = useState([]);
  const componentMounted = useRef(true);
  const db = getFirestore();
  const citiesRef = collection(db, "User");
  const q = query(citiesRef, where("Name", "==", username));
  const data = route.params.inputText;

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [success, setSuccess] = useState({
    username: true,
    email: true,
    password: true,
  });

  const reg2 =  new RegExp("[A-Za-z0-9\d]"); // 비밀번호

  const handleInputChange = (text) => {
    setInputText(text);
  };

  const handleInputChange2 = (text) => {
    setInputText2(text);
  };

  const auth = getAuth();
  const user = auth.currentUser;

  const onSignUp = () => {

    const CheckPassword = reg2.test(inputText2)

    console.log(CheckPassword)
    onSnapshot(q, (snapshot) => {
      if (componentMounted.current) {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
      return () => {
        componentMounted.current = false;
      };
    });

    if ((inputText != '') && (inputText2 != '') && (inputText == inputText2) && (CheckPassword  == true)) {
      setLoading(true);
      adduser1();  
      adduser2();
    }
    else if (inputText == ''){
      setLoading(false);
      ToastAndroid.show('비밀번호를 입력해주세요', ToastAndroid.SHORT);
    }
    else if (inputText2 == ''){
      setLoading(false);
      ToastAndroid.show('비밀번호를 한번더 입력해주세요', ToastAndroid.SHORT);
    }
    else if (inputText != inputText2){
      setLoading(false);
      ToastAndroid.show('비밀번호가 일치하지 않습니다', ToastAndroid.SHORT);
    }
  };
   
  const adduser1 =  () => {
   
    if(inputText2.length >= 8){
      updatePassword(user,inputText2)
      .then(() => {
        setLoading(false);
        navigation.navigate("SignUp3",{data})
      })
      .catch((error) => {
        console.log(error)
    });
    }
    else{
      ToastAndroid.show('비밀번호가 8자리 이상이어야 합니다', ToastAndroid.SHORT);
    }
  }
 
  const adduser2 = async () => {
    console.log(user)

    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * 7) + 6; // 8~12 사이의 랜덤한 길이 생성
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    try {
      await setDoc(doc(db, "User", data), {
        email : data,
        password : inputText2,
        id : result,
        pointnumber : 0,
        signupbox : true,
        signupboxtime : currentTime.format('YYYY-MM-DD HH:mm'),
        postebox : false,
        replybox : false,
        sharebox : false,
        postcountbox : 0,
        boxopen1: false,
        boxopen2 : false,
        boxopen3 : false,
        todaybox : 0,
        alarmonff : false,
        notificationall : false,
        notification1 : true,
        notification2 : true,
        notification3 : false,
        autologin : false,
      });
       
       adduser1();
    } catch (e) {

    }

  }


  return (
    <View style={{flex: 1, marginTop : 0}}>

    <LinearGradient colors={["#A234FE","#4560F7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}  style={{ width: '100%', height : 30}}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
    </LinearGradient >

    <LinearGradient colors={['#A234FE', '#4560F7']}  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'  , height : 60, backgroundColor : '#4560f7' }}>
    <TouchableOpacity activeOpacity={0.11} onPress={()=>navigation.goBack()}>
    <View style={{ marginLeft :20, marginTop : 30}}>
    <ArrowLeft  size={35} color={'#FFFFFF'} />
    </View>
    </TouchableOpacity>
    <Text style={{ marginLeft : -50,  color : '#FFFFFF' ,fontSize : 23, marginTop : 26, fontFamily: "Pretendard",fontWeight: "normal",fontStyle: "normal",letterSpacing: 0,}}>{"회원가입"}</Text>
    <View />
  </LinearGradient>
  <LinearGradient colors={['#A234FE', '#4560F7']}  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}  style={{ height: 40, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 , marginTop : -1 }}></LinearGradient>
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
          <View style={styles.contain}>

          <ScrollView  showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>

          <View style = {{flexDirection: 'row'}}>
            <Text style ={{fontSize : 20, fontWeight: "normal", fontStyle: "normal", color: "#414141", marginLeft : 40, fontFamily: "Pretendard", marginTop : '32%'}}>
              {"비밀번호를 입력해 주세요."}
            </Text>
          </View>
          <TextInput
            onChangeText={handleInputChange}
            placeholder={"비밀번호(영문/숫자/특수문자 조합 8~15자)"}
            style={{
              marginTop: 40,
              width : width1,
              height : 55,
              borderWidth: 0.3, // 테두리 두께
              borderColor: '#b2b2b2', // 테두리 색상
              borderRadius: 5, // 테두리 둥글기
              fontFamily: "Pretendard",
              fontWeight: "normal",
              fontStyle: "normal",
              backgroundColor: 'transparent', // 내부 영역 투명하게 만듦
            }}
            success={success.username}
            value={inputText}
            secureTextEntry={true}
          />
          <TextInput
            onChangeText={handleInputChange2}
            placeholder={"비밀번호 확인"}
            style={{
              marginTop: 15,
              width : width1,
              height : 55,
              borderWidth: 0.3, // 테두리 두께
              borderColor: '#b2b2b2', // 테두리 색상
              borderRadius: 5, // 테두리 둥글기
              fontFamily: "Pretendard",
              fontWeight: "normal",
              fontStyle: "normal",
              backgroundColor: 'transparent', // 내부 영역 투명하게 만듦
            }}
            success={success.username}
            secureTextEntry={true}
            value={inputText2}
          />
          <View style={{flexDirection : 'row', marginTop : -5}}>
          <WarningOctagon  size={20} color={'#e61e1e'} style={{ marginTop : 19}}/>
          <Text style={{ marginTop : 10, color: "#e61e1e",  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", lineHeight: 34, fontSize : 13}}>{" 영문/숫자/특수문자 조합 8~15자로 입력해 주세요."}</Text>
          </View>
          <Button
              style={{marginTop: 30, width : width2,  borderRadius: 63, fontFamily: "Pretendard",  fontWeight: "normal", fontStyle: "normal",backgroundColor: inputText && inputText2 ? '#3d3d3d' : '#dedede'}}
              onPress={onSignUp}
              loading={loading}
              >
              {"인증하기"}
          </Button>
            </KeyboardAvoidingView>
            </ScrollView>
          </View>
      </SafeAreaView>
    </View>
  );
}
