import React, {useState, useEffect} from 'react';
import {View, KeyboardAvoidingView, Linking, TouchableOpacity} from 'react-native';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import {ChatCenteredText, ShareNetwork, DotsThree, CaretLeft, CaretRight, ChatText, ThumbsUp} from 'phosphor-react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function ContactUs({navigation}) {
  const [showText, setShowText] = useState(false); // 추가된 상태
  const [showText1, setShowText1] = useState(false); // 추가된 상태
  const [showText2, setShowText2] = useState(false); // 추가된 상태
  const [showText3, setShowText3] = useState(false); // 추가된 상태

  const viewStyle = showText ? { backgroundColor: '#f5f5f5' } : { };
  const viewStyle1 = showText1 ? { backgroundColor: '#f5f5f5' } : { };
  const viewStyle2 = showText2 ? { backgroundColor: '#f5f5f5' } : { };
  const viewStyle3 = showText3 ? { backgroundColor: '#f5f5f5' } : { };

  const [isLoading, setIsLoading] = useState(true);
  const handleTouch = () => {
    setShowText(!showText); // 상태를 토글
  };

  const handleTouch1 = () => {
    setShowText1(!showText1); // 상태를 토글
  };

  const handleTouch2 = () => {
    setShowText2(!showText2); // 상태를 토글
  };

  const handleTouch3 = () => {
    setShowText3(!showText3); // 상태를 토글
  };

  const createKakaoLink = () => {
    Linking.openURL(
      'https://pf.kakao.com/_xfLxcIG'
    );
  };

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

              <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :10 }}>{"고객 센터"}</Text>
      </View>
      </TouchableOpacity>
      <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.7, marginTop : 20}}/>
      <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>navigation.navigate("ContactUsQnA")}>
        <View style={viewStyle}>
      <Text style={{color : '#484848', fontSize : 17, fontFamily: "Pretendard", fontWeight: "500",fontStyle: "normal", marginTop : 20, marginLeft : 20}}>{"자주 묻는 질문"}</Text> 
      <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : -25}}/>
      <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>
      </View>
      </TouchableOpacity>
      <Text style={{ marginTop: 0, marginLeft: 20,fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal' }}>

      </Text>

      <TouchableOpacity activeOpacity={0.11} onPress={()=>Linking.openURL('mailto:info@jeyakin.com')}>
      <View style={viewStyle1}>
      <Text style={{color : '#484848', fontSize : 17, fontFamily: "Pretendard", fontWeight: "500",fontStyle: "normal", marginTop : -7, marginLeft : 20}}>{"1:1 문의"}</Text> 
      <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : -25}}/>
      <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>
      </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>policy1()}>
      <View style={viewStyle2}>
      <Text style={{color : '#484848', fontSize : 17, fontFamily: "Pretendard", fontWeight: "500",fontStyle: "normal", marginTop : 20, marginLeft : 20}}>{"이용 약관"}</Text> 
      <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : -25}}/>
      <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>
      </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.11} onPress={()=>policy2()}>
      <View style={{marginTop : 0}}>
      <View style={viewStyle3}>
      <Text style={{color : '#484848', fontSize : 17, fontFamily: "Pretendard", fontWeight: "500",fontStyle: "normal", marginTop : 20, marginLeft : 20}}>{"개인정보 취급 방침"}</Text> 
      <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : -25}}/>
      <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>
      </View>
      </View>
      </TouchableOpacity>
    <View style={{ width: '100%' ,height : '100%',backgroundColor: '#f5f5f5' }}></View>
      </ScrollView>
    </View>
  );
}
