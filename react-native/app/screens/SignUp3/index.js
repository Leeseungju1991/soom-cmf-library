import React, {useState, useEffect, useRef} from 'react';
import {View, KeyboardAvoidingView, Platform, Alert, ScrollView, StatusBar, Linking, TouchableOpacity} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Button, TextInput, Text} from '@components';
import styles from './styles';
import {
  setDoc,
  doc,
  getFirestore,
  query,
  collection,
  where
} from "firebase/firestore";
import { getAuth, updatePassword, sendEmailVerification } from "firebase/auth";
import { LinearGradient } from 'expo-linear-gradient'; 
import {WarningOctagon,ArrowLeft} from 'phosphor-react-native';
export default function SignUp3({navigation, route}) {
  const {colors} = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [invitemember, setInvitemember] = useState('');
  const [loading, setLoading] = useState(false);
  const CheckId = 0;
  const [inputText, setInputText] = useState('');
  const [inputText2, setInputText2] = useState('');
  const [posts, setPosts] = useState([]);
  const componentMounted = useRef(true);
  const db = getFirestore();
  const citiesRef = collection(db, "User");
  //const q = query(citiesRef);
  const q = query(citiesRef, where("Name", "==", username));
  const [username1, setusername] = useState('');
  const [domain, setdomain] = useState('');

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  useEffect(() => {
    
    const mail = route.params.data
    const parts = mail.split('@');
    setusername(parts[0])
    setdomain(parts[1])

    sendEmailVerification(auth.currentUser)
    .then(() => {
      // Email verification sent!
      // ...
    });

   }, []);

  const [modalVisible, setModalVisible] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;


  const onSignUp = () => {
   navigation.navigate("SignUp1")
  };
   
  const adduser1 =  () => {

    updatePassword(user,inputText2)
      .then(() => {
        setLoading(false);
        navigation.navigate("SignUp1",{data})
      })
      .catch((error) => {
    });
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
      await setDoc(doc(db, "User", route.params.inputText), {
        name : username,
        email : email,
        password : inputText2,
        id : result,
        //Photourl : null,
        pointnumber : null,
        // 회사 인증 (게시글 권한)
        companyverify : false,
        // 회사 정보
        companyname : null,
        companyrole : "",
        companyyear : "",
        companynumber : "",
        // 게시글 정보
        writenumber : null,
        blockcount : null,
        // 설정
        alarmonff : false,
        inviteid : invitemember,
        bottomalarmcount : null,
        autologin : false,
        banneronoff : false,
        currenttime : null
      });
    
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
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
   
            <Text style={{ fontSize: 22, fontFamily: "Pretendard",fontStyle: "normal", fontStyle: "normal",lineHeight: 27,  color: "#000000" , marginTop : '28.9%' }}>{username1}{"@"}</Text>
            <Text style={{ fontSize: 22, fontFamily: "Pretendard",fontStyle: "normal", fontStyle: "normal",lineHeight: 27,  color: "#000000"  }}>{domain}{"으로 인증메일이"}</Text>
            <Text style={{ fontSize: 22, fontFamily: "Pretendard",fontStyle: "normal", fontStyle: "normal",lineHeight: 27,  color: "#000000" }}>{"발송되었습니다."}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' , marginTop : 10 }}>
              <Text style={{ fontSize: 15, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", }}>{"메일에 있는"}</Text>
              <Text style={{ fontSize: 15, color: '#4a5cfc', fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", }}>{" '인증하기' "}</Text>
              <Text style={{ fontSize: 15, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", }}>{"버튼을 클릭해 주세요."}</Text>
            </View>
          
          <View style={{flexDirection : 'row', marginTop : 40}}>
          <WarningOctagon  size={20} color={'#000000'} style={{ marginTop : 19}}/>
          <Text style={{ fontSize: 13, color: '#b2b2b2', marginTop: 18, fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", }}>
            {" 메일을 받지 못하신 경우, 스팸 메일함을 확인해 주세요"}
          </Text>
          </View>
          <View style={{flexDirection : 'row'}}>
          <WarningOctagon  size={20} color={'#000000'} style={{ marginTop : 10}}/>
          <View style={{ flexDirection: 'row', alignItems: 'center', fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", marginTop : 10 }}>
            <Text style={{ fontSize: 13, color: '#b2b2b2' }}>{" 도움이 필요한 경우,"}</Text>
            <Text style={{ fontSize: 13, color: '#4a5cfc' }}>{"info@jeyakin.com"}</Text>
            <Text style={{ fontSize: 13, color: '#b2b2b2' }}>{"으로 문의 주세요."}</Text>
          </View>
          </View>
          <View style={{marginTop : 30}}> 
          <LinearGradient
                colors={['#A234FE', '#4560F7']} // 그라데이션 색상 배열
                start={{ x: 0, y: 0 }} // 시작 위치
                end={{ x: 1, y: 0 }}   // 끝 위치
                style={styles.gradientButton}
              >
                <TouchableOpacity activeOpacity={0.11} onPress={onSignUp}>
                  <Text style={styles.loginButtonText}>{"시작하기"}</Text>
                </TouchableOpacity>
              </LinearGradient>
              </View>
          </KeyboardAvoidingView>
          </ScrollView>
    
     
        </View>

      </SafeAreaView>
    </View>
  );
}
