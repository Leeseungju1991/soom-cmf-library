import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform, Alert, ScrollView, TouchableOpacity, StatusBar} from 'react-native';
import {BaseStyle} from '@config';
import { SafeAreaView, Icon, Button, TextInput, Text} from '@components';
import styles from './styles';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import firebase from 'firebase/app';
import {
  getFirestore,
} from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient'; 
import {ArrowLeft} from 'phosphor-react-native';
export default function ResetPassword({navigation}) {
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const db = getFirestore();

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [success, setSuccess] = useState({
    username: true,
    email: true,
    password: true,
  });

  const reg1 = new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}"); // 아이디
//  const reg2 =  new RegExp("[A-Za-z0-9\d]"); // 비밀번호

 
  const auth = getAuth();


  const handlePress = () => {
    setIsChecked(!isChecked);
  };

  const handleInputChange = (text) => {
    setInputText(text);
  };


  const onSignUp = () => {

    setLoading(true);


    const CheckEmail = reg1.test(inputText)

    if((inputText === false) || (isChecked === false)){
      console.log("야호")
    }

    if ((inputText != '') && (CheckEmail == true )) {
      sendPasswordResetEmail(auth, inputText)
      .then(() => {
         navigation.navigate("SignIn")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log
        // ..
      });
    }else if ((inputText == '') && (inputText ===  true) || (isChecked === true)){
      setLoading(false);
      Alert.alert({
        type: 'fail',
        title: "등록 오류",
        message: "이메일을 입력 해주세요",
      });
    }
    else if((CheckEmail != true)  && (inputText ===  true) || (isChecked === true)){
      setLoading(false);
      Alert.alert({
        type: 'fail',
        title: "등록 오류",
        message: "이메일 형식을 확인해주세요",
      });
    }
    setLoading(false);
  };
   
  return (
    <View style={{flex: 1, marginTop : 0}}>

      <LinearGradient colors={["#A234FE","#4560F7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}  style={{ width: '100%', height : 30}}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />
      </LinearGradient >

      <LinearGradient colors={['#A234FE', '#4560F7']}  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}  style={{ marginTop : -1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'  , height : 60, backgroundColor : '#4560f7' }}>
      <TouchableOpacity onPress={()=>navigation.goBack()}>
      <View style={{ marginLeft :20, marginTop : 30}}>
      <ArrowLeft  size={35} color={'#FFFFFF'} />
      </View>
      </TouchableOpacity>
      <Text style={{ marginLeft : -50,  color : '#FFFFFF' ,fontSize : 23, marginTop : 26, fontFamily: "Pretendard",fontWeight: "normal",fontStyle: "normal",letterSpacing: 0,}}>{"이메일 인증"}</Text>
      <View />
    </LinearGradient>
    <LinearGradient colors={['#A234FE', '#4560F7']}  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}  style={{ height: 40, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 , marginTop : -1 }}></LinearGradient>
  
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
          <View style={styles.contain}>
          <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
            <Text style ={{fontSize : 30, fontWeight: 'bold'}}>
              {"비밀번호 재설정"}
            </Text>
            <View style = {{flexDirection: 'row'}}>
            <Text style ={{fontSize : 30, marginTop : 1, fontWeight: 'bold'}}>
              {"에 오신걸"}
            </Text>
       
          <Text style ={{fontSize : 30, marginTop : 1, fontWeight: 'bold'}}>
              {"환영합니다!"}
          </Text>
          </View>


          <Text style ={{fontSize : 13, marginTop : 30}}>
              {"이메일 인증을 통해 비밀번호 재설정이 가능합니다."}
          </Text>
          <Text style ={{fontSize : 13, marginTop : 5}}>
              {"제약바이오 종사자들은 회사 이메일로 인증해 주시기 바랍니다."}
          </Text>
          <TextInput
            onChangeText={handleInputChange}
            placeholder={"이메일 주소를 입력해 주세요"}
            style={{
              marginTop: 40,
              width: 320,
              borderWidth: 0, // 테두리 두께
              borderColor: '#dedede', // 테두리 색상
              borderRadius: 5, // 테두리 둥글기
              backgroundColor: 'transparent', // 내부 영역 투명하게 만듦
            }}
            success={success.username}
            value={inputText}

          />
          <View
          style={{
            backgroundColor: '#a234fe',
            height: 1, // 선의 높이를 조절하세요
            width: '100%', // 가로로 긴 선을 만들기 위해 전체 너비를 사용합니다.
          }}
           />
           <View style={{ alignItems: 'center',}}>
          <Button
              style={{marginTop: 20, width : 320, borderRadius: 63, backgroundColor: inputText ? '#3d3d3d' : '#dedede'}}
              onPress={onSignUp}
              loading={loading}
              
          >
              {"재설정 메일보내기"}
          </Button>
          </View>
            </KeyboardAvoidingView>
            </ScrollView>
          </View>
      </SafeAreaView>
    </View>
  );
}
