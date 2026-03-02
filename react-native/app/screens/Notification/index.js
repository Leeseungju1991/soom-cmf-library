import React, { useState } from 'react';
import { StatusBar, View, TouchableOpacity } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text } from '@components';
import {ChatCenteredText, ShareNetwork, DotsThree, CaretLeft, CaretRight, ChatText, ThumbsUp} from 'phosphor-react-native';

export default function Notification({ navigation }) {

  const [showText, setShowText] = useState(false); // 추가된 상태
  const viewStyle = showText ? { backgroundColor: '#f5f5f5' } : { };
  // 터치 이벤트 핸들러
  const handleTouch = () => {
    setShowText(!showText); // 상태를 토글
  };

  return (
    <View style={{ flex: 1, marginTop: 40 }}>
        <StatusBar translucent={true} backgroundColor={'transparent'}  />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' , marginTop : 0 }}>
      <TouchableOpacity onPress={()=>navigation.goBack()} >
      <CaretLeft  size={27} color={'#484848'}style={{ marginLeft : 20, color : '#484848', fontFamily: "Pretendard", fontWeight: "500", fontSize : 17, fontStyle: "normal",  textAlign: "left",}}/>
      </TouchableOpacity>
              <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :10 }}>{"북마크"}</Text>
      </View>
      <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.7, marginTop: 20 }} />
  

      <TouchableOpacity activeOpacity={0.11} onPress={handleTouch}>
        <View style={viewStyle}>
          {showText ? (
            <Text style={{ marginTop: 20, marginLeft: 20,fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'bold', fontStyle: 'normal',  }}>
              {'댓글 작성 시 정책을 준수하지 않을 경우'}
            </Text>
          ) : (
            <Text style={{ marginTop: 20, marginLeft: 20,fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal' }}>
              {'댓글 작성 시 정책을 준수하지 않을 경우'}
            </Text>
          )}
             <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : -6}}/>
          {showText ? (
            <Text style={{ marginLeft: 20,fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'bold', fontStyle: 'normal', marginTop : -20 }}>
              {'이용이 제한됩니다.'}
            </Text>
          ) : (
            <Text style={{ marginLeft: 20,fontSize: 16, fontFamily: 'Pretendard', fontWeight: 'normal', fontStyle: 'normal', marginTop : -20  }}>
              {'이용이 제한됩니다.'}
            </Text>
          )}
            {showText ? (
            <Text style={{ marginLeft: 20,marginTop: 10, fontFamily: 'Pretendard', fontWeight: 'bold', fontStyle: 'normal', fontSize: 13, color: '#b2b2b2',  }}>
              {'2023.09.26'}
            </Text>
          ) : (
            <Text style={{marginLeft: 20,marginTop: 10, fontFamily: 'Pretendard',fontStyle: 'normal', fontSize: 13, color: '#b2b2b2',  }}>
            {'2023.09.26'}
          </Text>
          )}
          <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop: 20, marginLeft: -20 }} />
          </View>

          {showText && (
            <View style={{padding : 20}}>
              <Text style={{ fontSize: 16, fontFamily: 'Pretendard', fontWeight: '500', fontStyle: 'normal', marginTop: 20 }}>{'안녕하세요. 제약인입니다.'}</Text>
              <Text style={{fontSize: 16, fontFamily: 'Pretendard', fontWeight: '500', fontStyle: 'normal', marginTop: 10 }}>{'1.다음의 경우 사전 통보 없이 댓글을 삭제하고, 아이디 이용정지 또는 가입이 제한될 수 있습니다.'}</Text>
              <Text style={{ fontSize: 16, fontFamily: 'Pretendard', fontWeight: '500', fontStyle: 'normal', marginTop: 20 }}>{'2.저자권,인격권 등 타인의 권리를 침해하는 경우'}</Text>
              <Text style={{ fontSize: 16, fontFamily: 'Pretendard', fontWeight: '500', fontStyle: 'normal', marginTop: 20 }}>{'3.상용프로그램의 등록과 게재, 배포를 안내하는 게시물'}</Text>
              <Text style={{fontSize: 16, fontFamily: 'Pretendard', fontWeight: '500', fontStyle: 'normal', marginTop: 20 }}>{'4.타인 또는 제3자의 저자권 및 기타 관리를 침해한 내용을 담은 게시물'}</Text>
              <Text style={{ fontSize: 16, fontFamily: 'Pretendard', fontWeight: '500', fontStyle: 'normal', marginTop: 20 }}>{'5.욕설 및 비방, 음란성 댓글'}</Text>
              <Text style={{ fontSize: 16, fontFamily: 'Pretendard', fontWeight: '500', fontStyle: 'normal', marginTop: 20 }}>{'감사합니다.'}</Text>
            </View>
          )}
         {showText ? (
          <View style={{ with: '100%', height : '100%', backgroundColor : '#FFFFFF'}}></View>
          ) : (
            <View style={{ with: '100%', height : '100%', backgroundColor : '#f5f5f5'}}></View>
            )}
      </TouchableOpacity>

      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}></SafeAreaView>
    </View>
  );
}