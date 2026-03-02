import React, {useState} from 'react';
import {View, KeyboardAvoidingView, ToastAndroid, ScrollView, TouchableOpacity, Image, StatusBar, TextInput, Linking} from 'react-native';
import {BaseStyle} from '@config';
import { SafeAreaView, Button, Text} from '@components';
import styles from './styles';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { LinearGradient } from 'expo-linear-gradient'; 
import {ArrowLeft} from 'phosphor-react-native';

const SignUp = ({navigation}) => {
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isChecked, setIsChecked] = useState(false);


  const reg1 = new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}"); // 아이디
                                                                                                                              
  const handlePress = () => {
    setIsChecked(!isChecked);
  };

  const handleInputChange = (text) => {
    setInputText(text);
  };



  const onSignUp = async () => {
    const CheckEmail = reg1.test(inputText);

    if (!inputText || !isChecked) {
      ToastAndroid.show('필수 정보를 입력해주세요.', ToastAndroid.SHORT);
    } else if (!CheckEmail) {
      ToastAndroid.show('이메일 형식을 확인해 주세요.', ToastAndroid.SHORT);
    } else {
      adduser1();
    }
  };

   
  const adduser1 = async () => {

    setLoading(true);
    await createUserWithEmailAndPassword(auth, inputText, inputText)
    .then((userCredential) => {
      navigation.navigate("SignUp2", {inputText})
      setLoading(false);
    }).catch(()=>{
      ToastAndroid.show('이미 사용하는 이메일 혹은 올바른 양식이 아닙니다.', ToastAndroid.SHORT);
    })
  }

const policy1 = () => {
  Linking.openURL(
    'https://github.com/leeseungju123/leeseungju123/blob/main/%EC%9D%B4%EC%9A%A9%EC%95%BD%EA%B4%80'
  );
};

const policy2 = () => {
  Linking.openURL(
    'https://github.com/leeseungju123/leeseungju123/blob/main/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%20%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8'
  );
};


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
          <KeyboardAvoidingView>
          <View style = {{flexDirection: 'row', marginTop : '22%'}}>
            <Text style ={{fontSize : 35, fontWeight: "normal",fontFamily: "Pretendard", fontStyle: "normal"}}>
              {"JEYAKIN"}
            </Text>
            <Text style ={{fontSize : 35, marginTop : 1, fontWeight: "normal",fontFamily: "Pretendard", fontStyle: "normal",}}>
              {"에 오신걸"}
            </Text>
          </View>
          <Text style ={{fontSize : 35, marginTop : 1, fontWeight: "normal",fontFamily: "Pretendard", fontStyle: "normal"}}>
              {"환영합니다!"}
          </Text>


          <Text style ={{fontSize : 13, marginTop : 10, fontFamily: "Pretendard",fontStyle: "normal",color: "#484848"}}>
              {"이메일 인증을 통해 회원가입이 가능합니다."}
          </Text>
          <Text style ={{fontSize : 12, marginTop : 0, fontFamily: "Pretendard",fontStyle: "normal",color: "#484848"}}>
              {"제약바이오 종사자들은 회사 이메일로 인증해 주시기 바랍니다."}
          </Text>
          <View style={{marginLeft : 0}}>
          <TextInput
            onChangeText={handleInputChange}
            placeholder="이메일 주소를 입력해 주세요"
            placeholderTextColor="#DEDEDE"
            style={styles.input}
            value={inputText}        
          />
          </View>
         <View style={styles.container}>
         <Image source={require("../../../assets/line.png")} style={{width : 350, height : 10, marginTop : -5}} />
         </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop : 0, marginLeft : -5}}>
             <TouchableOpacity activeOpacity={0.11} onPress={handlePress} style={{ padding: 10 }}>
             <View style={[styles.containercheck, isChecked && styles.checked]}>
                    {isChecked && (
                      <Image
                        source={require("../../../assets/check.png")}
                        style={{ width: 23, height: 23, }}
                      />
                    )}
                  </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.11} onPress={()=>policy1()}>
             <Text style={{fontSize : 13, marginLeft : 0, textDecorationLine: 'underline', color : '#b2b2b2', marginTop : 3}}>{'이용약관'}</Text>
             </TouchableOpacity>
             <Text style={{fontSize : 13, marginLeft : 3, color : '#b2b2b2', marginTop : 3}}>{'및'}</Text>

             <TouchableOpacity activeOpacity={0.11} onPress={()=>policy2()}>
             <Text style={{fontSize : 13, marginLeft : 3, textDecorationLine: 'underline', color : '#b2b2b2', marginTop : 3}}>{'개인정보수집'}</Text>
             </TouchableOpacity>
             <Text style={{fontSize : 13, marginLeft : 3, color : '#b2b2b2', marginTop : 3}}>{'약관에 동의합니다.'}</Text>
          </View>
          <Button
              style={{marginTop: 40, width : '82%', borderRadius: 63,  backgroundColor: inputText && isChecked? '#3d3d3d' : '#dedede'}}
              onPress={onSignUp}
              loading={loading} 
          >
              {"인증하기"}
          </Button>
          <View style={{marginTop : 20}}></View>
            </KeyboardAvoidingView>
            </ScrollView>
          </View>
      </SafeAreaView>
    </View>
  );
}

export default SignUp;