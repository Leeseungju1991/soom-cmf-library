import React, { useState, useEffect } from 'react';
import { View, Text, Linking, StatusBar } from 'react-native';
import { BaseStyle } from '@config';
import { Header, SafeAreaView, Icon, TextInput, Button } from '@components';
import { LinearGradient } from 'expo-linear-gradient'; 
  export default function SignUp1({navigation}) {
  const [loading, setLoading] = useState(false);
  const createKakaoLink = () => {
    navigation.navigate("SignIn");
    Linking.openURL(
      'https://pf.kakao.com/_xfLxcIG'
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />
        <LinearGradient colors={["#A234FE","#4560F7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, }}>

          <Text style={{ color: '#FFFFFF', fontSize: 33, fontWeight: "800", marginTop: '35%', marginLeft : 25, fontFamily: "Pretendard-extrabold", fontStyle: "normal", fontWeight: '800' }}>{"회원가입이"}</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 33, fontWeight: "800", marginLeft : 25, fontFamily: "Pretendard-extrabold", fontStyle: "normal", fontWeight: '800' }}>{"완료되었습니다."}</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 17, marginTop: 10, marginLeft : 25, fontFamily: "Pretendard-extrabold", fontWeight: "normal", fontStyle: "normal" }}>{"카카오톡 채널을 추가하고 다양한 소식과"}</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 17, marginLeft : 25, fontFamily: "Pretendard-extrabold", fontWeight: "normal", fontStyle: "normal" }}>{"이벤트 정보를 받아보시겠습니까?"}</Text>

          <View style={{ backgroundColor: '#FFFFFF', marginTop: '25%', height : '100%', borderTopLeftRadius: 63 }}>
            <Button
              style={{ marginTop: 30, width: '85%', backgroundColor: '#e9e9e9', borderRadius: 63, marginLeft: '7%' }}
              onPress={() => navigation.navigate("SignIn")}
              loading={loading}
            >
              {"아니오"}
            </Button>
            <Button 
              style={{ marginTop: 20, width: '85%', backgroundColor: '#3d3d3d', borderRadius: 63, marginLeft: '7%' }}
              onPress={() => createKakaoLink()}
              loading={loading}
            >
              {"네, 받아보겠습니다."}
            </Button>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
}