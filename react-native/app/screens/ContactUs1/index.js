import React, {useState, useEffect} from 'react';
import {View, Modal, Linking, TouchableOpacity, StatusBar} from 'react-native';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import { CaretLeft, CaretRight, ChatText, ThumbsUp} from 'phosphor-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getAuth, signOut } from 'firebase/auth';

export default function ContactUs1({navigation}) {

  StatusBar.setBackgroundColor('transparent')

  const [showText, setShowText] = useState(false); // 추가된 상태
  const [showText1, setShowText1] = useState(false); // 추가된 상태
  const [showText2, setShowText2] = useState(false); // 추가된 상태
  const [showText3, setShowText3] = useState(false); // 추가된 상태

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const auth = getAuth();
  const viewStyle = showText ? { backgroundColor: '#f5f5f5' } : { };
  const viewStyle1 = showText1 ? { backgroundColor: '#f5f5f5' } : { };
  const viewStyle2 = showText2 ? { backgroundColor: '#f5f5f5' } : { };
  const viewStyle3 = showText3 ? { backgroundColor: '#f5f5f5' } : { };
  const [isLoading, setIsLoading] = useState(true);
  const handleSignOut1 = async () => {
    setModalVisible(true);
  };
  

  const closeModal = () => {
    setModalVisible(!isModalVisible);
  };
  

  const handleSignOut2 = async () => {
    setModalVisible1(true);
  };
  

  const closeModal1 = () => {
    setModalVisible1(false);
  };
  

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("SignIn")
      ToastAndroid.show('로그아웃 하였습니다', ToastAndroid.SHORT);
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };


  useEffect(() => {
    // 3초 후에 isLoading 상태를 false로 업데이트하여 로딩 화면을 벗어납니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // 컴포넌트가 언마운트 될 때 타이머를 클리어합니다.
    return () => clearTimeout(timer);
  }, []);


  return (
    <View style={{flex: 1, marginTop : 40}}>
        <TouchableOpacity onPress={()=>navigation.goBack()} >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' , marginTop : 0 }}>
    
      <CaretLeft  size={27} color={'#484848'}style={{ marginLeft : 20, color : '#484848', fontFamily: "Pretendard", fontWeight: "500", fontSize : 17, fontStyle: "normal",  textAlign: "left",}}/>

              <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :10 }}>{"설정"}</Text>
      </View>
      </TouchableOpacity>
      <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.7, marginTop : 20}}/>
      <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>navigation.navigate("ResetPassword1")}>
      <Text style={{color : '#484848', fontSize : 17, fontFamily: "Pretendard", fontWeight: "500",fontStyle: "normal", marginTop : 20, marginLeft : 20}}>{"비밀번호 변경"}</Text> 
      <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : -25}}/>
      <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>navigation.navigate("Setting")}>
      <Text style={{color : '#484848', fontSize : 17, fontFamily: "Pretendard", fontWeight: "500",fontStyle: "normal", marginTop : 20, marginLeft : 20}}>{"알림 설정"}</Text> 
      <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : -25}}/>
      <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>handleSignOut1()}>
      <View style={viewStyle2}>
      <Text style={{color : '#484848', fontSize : 17, fontFamily: "Pretendard", fontWeight: "500",fontStyle: "normal", marginTop : 20, marginLeft : 20}}>{"로그아웃"}</Text> 
      <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : -25}}/>
      <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>
      </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.11} onPress={()=>handleSignOut2()}>
      <View style={{marginTop : 0}}>
      <View style={viewStyle3}>
      <Text style={{color : '#484848', fontSize : 17, fontFamily: "Pretendard", fontWeight: "500",fontStyle: "normal", marginTop : 20, marginLeft : 20}}>{"탈퇴하기"}</Text> 
      <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : -25}}/>
      <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>
      </View>
      </View>
      </TouchableOpacity>
    <View style={{ width: '100%' ,height : '100%',backgroundColor: '#f5f5f5' }}></View>
      </ScrollView>

      <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
           <StatusBar
      translucent={true}
      backgroundColor="rgba(0, 0, 0, 0.5)" // 반투명 배경색
    />
          {/* Modal content */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 30, width: '85%' , height : 170 }}>
              <View style={{justifyContent: 'center', alignItems: 'center',}}>
              <Text style={{ fontSize: 16,justifyContent: 'center', marginTop : 20, alignItems: 'center', color : '#4a5cfc', fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal",}}>
                {"로그아웃 하시겠습니까?"}
              </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop : 25}}>
                <View style={{ width : '46%', height : 50,backgroundColor: "#ebebeb", borderRadius: 15,}}>
                <TouchableOpacity onPress={()=>closeModal()}>
                <View style={{  alignItems: 'center', marginTop : 15}}>
                <Text style={{color : '#484848', fontSize : 15, fontFamily: "Pretendard", fontWeight: "500",  fontStyle: "normal"}}>{"취소"}</Text>
                </View>
                </TouchableOpacity>
                </View>
                <View style={{ width : '46%', height : 50,backgroundColor: "#4a5cfc", borderRadius: 15,}}>
                <TouchableOpacity onPress={()=>handleSignOut()}>
                <View style={{  alignItems: 'center', marginTop : 15}}>
                <Text style={{color : 'white', fontSize : 15, fontFamily: "Pretendard", fontWeight: "500",  fontStyle: "normal" }}>{"확인"}</Text>
                </View>
                </TouchableOpacity>
                </View>
  
              </View>
            </View>
          </View>
        </Modal>


        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible1}
          onRequestClose={closeModal1}
        >
           <StatusBar
      translucent={true}
      backgroundColor="rgba(0, 0, 0, 0.5)" // 반투명 배경색
    />
          {/* Modal content */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 30, width: '85%' , height : 170 }}>
              <View style={{justifyContent: 'center', alignItems: 'center',}}>
              <Text style={{ fontSize: 16,justifyContent: 'center', marginTop : 0, alignItems: 'center', color : '#484848', fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal",}}>
                {"탈퇴 시 계정은 초기화 되며,"}
              </Text>
              <Text style={{ fontSize: 16,justifyContent: 'center', marginTop : 0, alignItems: 'center', color : '#484848', fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal",}}>
                {"복구가 불가능 합니다."}
              </Text>
            
              <Text style={{ fontSize: 16,justifyContent: 'center', marginTop : 0, alignItems: 'center', color : '#4a5cfc', fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal",}}>
                {"정말 탈퇴 하시겠습니까?"}
              </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop : 13}}>
                <View style={{ width : '46%', height : 50,backgroundColor: "#ebebeb", borderRadius: 15,}}>
                <TouchableOpacity onPress={()=>closeModal1()}>
                <View style={{  alignItems: 'center', marginTop : 15}}>
                <Text style={{color : '#484848', fontSize : 15, fontFamily: "Pretendard", fontWeight: "500",  fontStyle: "normal"}}>{"취소"}</Text>
                </View>
                </TouchableOpacity>
                </View>
                <View style={{ width : '46%', height : 50,backgroundColor: "#4a5cfc", borderRadius: 15,}}>
                <TouchableOpacity onPress={()=>handleSignOut()}>
                <View style={{  alignItems: 'center', marginTop : 15}}>
                <Text style={{color : 'white', fontSize : 15, fontFamily: "Pretendard", fontWeight: "500",  fontStyle: "normal" }}>{"확인"}</Text>
                </View>
                </TouchableOpacity>
                </View>
  
              </View>
            </View>
          </View>
        </Modal>

    </View>
  );
}
