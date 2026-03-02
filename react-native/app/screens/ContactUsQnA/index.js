import React, {useState, useEffect} from 'react';
import {View, KeyboardAvoidingView, Linking, TouchableOpacity} from 'react-native';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import {ChatCenteredText, ShareNetwork, DotsThree, CaretLeft, CaretRight, ChatText, ThumbsUp} from 'phosphor-react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function ContactUsQnA({navigation}) {
  const [showText, setShowText] = useState(true); // 추가된 상태
  const [showText1, setShowText1] = useState(false); // 추가된 상태
  const [showText2, setShowText2] = useState(false); // 추가된 상태
  const [showText3, setShowText3] = useState(false); // 추가된 상태

  const viewStyle = showText ? { backgroundColor: '#f5f5f5' } : {backgroundColor: '#f5f5f5' };
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

              <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :10 }}>{"자주 묻는 질문"}</Text>
      </View>
      </TouchableOpacity>
      <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.7, marginTop : 20}}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={viewStyle}>
      <Text style={{color : '#484848', fontSize : 17, fontFamily: "Pretendard", fontWeight: "500",fontStyle: "normal", marginTop : 20, marginLeft : 20}}>{"자주 묻는 질문"}</Text> 
      <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : -25}}/>
      <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>
      </View>

      <View style={{ width : '100%', height : 620, padding: 20}}>
        <Text style={{ marginTop: 10,fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal',  }}>{'1.회원탈퇴는 어떻게 하나요?'}</Text>
        <Text style={{ marginTop: 10, fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal',  }}>{'회원 탈퇴를 원하시면 [마이페이지 -> 설정 -> 탈퇴하기] 메뉴를 이용하여 주시기 바랍니다.'}</Text>
        <Text style={{ marginTop: 20, fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal',  }}>{'2.계정 비밀번호를 잃어버렸어요.'}</Text>
        <Text style={{ marginTop: 10, fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal',  }}>{'비밀번호를 잃어버리셨다면 [로그인 -> 비밀번호 찾기 -> 이메일 인증 -> 비밀번호 설정]을 통해 설정이 가능합니다.'}</Text>
        <Text style={{ marginTop: 20, fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal',  }}>{'3.이메일 주소 혹은 비밀번호를 정확히 입력하라고 나옵니다.'}</Text>
        <Text style={{ marginTop: 10, fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal',  }}>{'- 메일에 오탈자가 있는경우'}</Text>
        <Text style={{ marginTop: 10,fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal',  }}>{'- 비밀번호 대소문자를 구분하여 입력하지 않은 경우'}</Text>
        <Text style={{ marginTop: 10, fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal',  }}>{'- 이메일 주소 형식이 아닐경우'}</Text>
        <Text style={{ marginTop: 20, fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal',  }}>{'4.웹에서도 글을 올릴수 있나요?'}</Text>
        <Text style={{ marginTop: 10,fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal',  }}>{'제약인은 앱기반 서비스이며 필요시 앱을 다운받아주세요'}</Text>
        <Text style={{ marginTop: 20, fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal',  }}>{'5.제약인은 무료인가요?'}</Text>
        <Text style={{ marginTop: 10,fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal',  }}>{'제약인 서비스는 무료입니다.'}</Text>
        <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0, marginTop : 30}}/>
        </View>
    <View style={{ width: '100%' ,height : '100%',backgroundColor: '#f5f5f5' }}></View>
      </ScrollView>
    </View>
  );
}
