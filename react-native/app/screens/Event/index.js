import React, {useState, useEffect} from 'react';
import {View,  TouchableOpacity , ActivityIndicator} from 'react-native';
import { Text} from '@components';
import { CaretLeft, CaretRight} from 'phosphor-react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function Event({navigation}) {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 3초 후에 isLoading 상태를 false로 업데이트하여 로딩 화면을 벗어납니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // 컴포넌트가 언마운트 될 때 타이머를 클리어합니다.
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#a234fe" />
    </View>
    );
  }
  return (
    <View style={{flex: 1, marginTop : 40, backgroundColor: '#f5f5f5'}}>
   <TouchableOpacity onPress={()=>navigation.goBack()} >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' , marginTop : 0 , backgroundColor: '#FFFFFF'}}>
   
      <CaretLeft  size={27} color={'#484848'}style={{ marginLeft : 20, color : '#484848', fontFamily: "Pretendard", fontWeight: "500", fontSize : 17, fontStyle: "normal",  textAlign: "left",}}/>
    
              <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :10 }}>{"이벤트"}</Text>
      </View>
      </TouchableOpacity>
      <View style={{ width : '100%', height : 20, backgroundColor: '#FFFFFF' }}/>
      <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.7, marginTop : 0, }}/>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{flex: 1, marginTop: 0, backgroundColor: '#FFFFFF'}}>

      <TouchableOpacity activeOpacity={0.11} onPress={()=>navigation.navigate("Event1")}>
      <View>
      <Text style={{color : '#484848', fontSize : 16, fontFamily: "Pretendard", fontWeight: "500",fontStyle: "normal", marginTop : 20, marginLeft : 20}}>{"매일하는 미션 이벤트"}</Text> 
      <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 25, marginTop : -5}}/>
      <Text style={{color : '#b2b2b2', fontSize : 14, fontFamily: "Pretendard", fontWeight: "500",fontStyle: "normal", marginTop : -10, marginLeft : 20}}>{"2023.12.01"}</Text> 
      <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>
      </View>
      </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}
