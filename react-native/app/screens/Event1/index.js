import React, {useState} from 'react';
import {View, Image, TouchableOpacity, Dimensions,ImageBackground} from 'react-native';
import {Text} from '@components';
import {CaretLeft} from 'phosphor-react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function Event1({navigation}) {
  const [showText, setShowText] = useState(false); // 추가된 상태
  const screenWidth = Dimensions.get('window').width;
  const viewStyle = showText ? { backgroundColor: '#f5f5f5' } : { };


  return (
    <View style={{flex: 1, marginTop : 50}}>
      <TouchableOpacity onPress={()=>navigation.goBack()} >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' , marginTop : 0 }}>
    
      <CaretLeft  size={27} color={'#484848'}style={{ marginLeft : 20, color : '#484848', fontFamily: "Pretendard", fontWeight: "500", fontSize : 17, fontStyle: "normal",  textAlign: "left",}}/>
     
              <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :10 }}>{"이벤트"}</Text>
      </View>
      </TouchableOpacity>
      <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.7, marginTop : 20}}/>
      <ScrollView showsVerticalScrollIndicator={false}>
     
      <View style={viewStyle}>
      <Text style={{color : '#484848', fontSize : 16, fontFamily: "Pretendard", fontWeight: "500",fontStyle: "normal", marginTop : 20, marginLeft : 20}}>{"매일하는 미션 이벤트"}</Text> 
      <Text style={{color : '#b2b2b2', fontSize : 14, fontFamily: "Pretendard", fontWeight: "500",fontStyle: "normal", marginTop : 20, marginLeft : 20}}>{"2023.12.01"}</Text> 
      <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>
      </View>
      <Image source={require("../../../assets/event1-1.png")}    style={{width :'100%', height : screenWidth * 2.9}} />
      <ImageBackground source={require("../../../assets/event1-2.png")}    style={{width :'100%', height : screenWidth * 2.1, marginTop : -5}}>

        <TouchableOpacity onPress={()=>navigation.navigate("Mission")}>
      <View style={{width : '80%', height : '8%', marginTop : '185%', marginLeft : '10%'}}></View>
      </TouchableOpacity>
      </ImageBackground>

      <Image source={require("../../../assets/event1-3.png")}    style={{width :'100%', height : screenWidth * 1}} />
    <View style={{ width: '100%' ,height : '100%',backgroundColor: '#f5f5f5' }}></View>
      </ScrollView>
    </View>
  );
}
