import React, {useState, useEffect} from 'react';
import {View, Modal, ToastAndroid, TouchableOpacity, StatusBar, TextInput} from 'react-native';
import {Header, SafeAreaView, Icon, Text} from '@components';
import { CaretLeft, Lock, ChatText, ThumbsUp} from 'phosphor-react-native';
import { getAuth, updatePassword } from 'firebase/auth';
import styles from './styles';
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";
export default function ResetPassword1({navigation}) {

  StatusBar.setBackgroundColor('transparent')
  const [isFocused, setIsFocused] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputText1, setInputText1] = useState('');
  const [inputText2, setInputText2] = useState('');
  const auth = getAuth();
  const [currentPasswordError, setCurrentPasswordError] = useState(false); // State to track password error
  const db = getFirestore();
  const citiesRef = collection(db, "User");
  const q8 = query(citiesRef, where("email", "==", auth.currentUser.email));
  const [notification, setnotification] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const reg2 = new RegExp("[A-Za-z0-9\d]");
  useEffect(() => {
    const unsubscribe = onSnapshot(q8, (snapshot) => {
      if (snapshot.size > 0) {
        const userData = snapshot.docs[0].data();
        setnotification(userData.password || "");
      }
    });

    return () => {
      unsubscribe(); // 클린업 함수에서 구독 해제
    };
  }, []);

  const validateCurrentPassword = (text) => {

    if( text === notification) {
      setCurrentPasswordError(false)
    }
    else{
      setCurrentPasswordError(true)
    }
   
  };

  const onSubmit = () => {
   

    const CheckPassword = reg2.test(inputText2);
    const newPassword = inputText2;
    if (inputText2 !== '' && CheckPassword && (currentPasswordError === false)) {
      console.log("진입")
  
      updatePassword(auth.currentUser, newPassword)
      .then(() => {
        console.log("진입1")
          goupdate();
      })
      .catch((error) => {
        console.log(error)
      });

    }else{
      ToastAndroid.show('비밀번호를 확인해주세요', ToastAndroid.SHORT);
    }
  
  }

  const goupdate = async () => {
   

    await updateDoc(doc(db, 'User', auth.currentUser.email), {
      password: inputText2, // 'reply' 필드를 업데이트
    });


    ToastAndroid.show('비밀번호가 변경되었습니다.', ToastAndroid.SHORT);
    navigation.goBack();
  }

  return (
    <View style={{flex: 1, marginTop : 40}}>
        <TouchableOpacity onPress={()=>navigation.goBack()} >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' , marginTop : 0 }}>
      <CaretLeft  size={27} color={'#484848'}style={{ marginLeft : 20, color : '#484848', fontFamily: "Pretendard", fontWeight: "500", fontSize : 17, fontStyle: "normal",  textAlign: "left",}}/>
      <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :10 ,fontFamily: "Pretendard", }}>{"비밀번호 변경"}</Text>
      <TouchableOpacity onPress={()=>onSubmit()}>
      <Text style={{ fontSize: 18 , marginLeft : 'auto', marginRight : 35, color : '#4a5cfc',fontFamily: "Pretendard", }}>{"저장"}</Text>
      </TouchableOpacity>
      </View>
      </TouchableOpacity>
      <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.7, marginTop : 20}}/>

      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{marginTop : 20}}></View>

  <View style={{flexDirection : 'row'}}>
  <View style={styles.container}>
      <Lock size={27} color={'#dedede'} style={styles.icon} />
      <TextInput
        placeholder={"현재 비밀번호"}
        style={[
          styles.input,
        ]}
        value={inputText}
        onChangeText={(text) => setInputText(text)}
        secureTextEntry={true}
        onSubmitEditing={() => validateCurrentPassword(inputText)} // 이 부분을 추가
      />
    </View>
  </View>     
      <Text style={{ fontSize: 16 ,marginTop : 10, marginRight : 'auto', marginLeft : '8%' ,fontFamily: "Pretendard", color : currentPasswordError ? '#e61e1e' :'#484848' }}>{currentPasswordError ? "비밀번호를 올바르게 입력해주세요" :  "현재 사용중인 비밀번호를 입력해주세요." }</Text>
      <View style={{marginTop : 20}}></View>

      <View style={{flexDirection : 'row'}}>
      <View style={styles.container}>
      <Lock size={27} color={'#dedede'} style={styles.icon} />
      <TextInput
        placeholder={"새 비밀번호(영문/숫자/특수문자 조합 8~15자)"}
        style={styles.input}
        value={inputText1}
        onChangeText={(text) => setInputText1(text)}
        secureTextEntry={true}
        
      />
    </View>
  </View>   
  <Text style={{ fontSize: 16 ,marginTop : 10, marginRight : 'auto', marginLeft : '8%',fontFamily: "Pretendard",  color : '#484848' }}>{"새로운 비밀번호를 입력해주세요."}</Text>
  
  <View style={{marginTop : 20}}></View>
  <View style={{flexDirection : 'row'}}>
      <View style={styles.container}>
      <Lock size={27} color={'#dedede'} style={styles.icon} />
      <TextInput
        placeholder={"새 비밀번호 확인"}
        style={styles.input}
        value={inputText2}
        onChangeText={(text) => setInputText2(text)}
        secureTextEntry={true}
      />
      </View>
  </View> 
<Text style={{ fontSize: 16 ,marginTop : 10, marginRight : 'auto', marginLeft : '8%', color : '#484848' }}>{"새 비밀번호를 한번 더 입력해 주세요."}</Text>
</View>
</View>
   
  );
}
