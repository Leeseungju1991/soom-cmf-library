import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {Header, SafeAreaView, Icon, Text} from '@components';
import {ChatCenteredText, ShareNetwork, DotsThree, CaretLeft, CaretRight, ChatText, ThumbsUp} from 'phosphor-react-native';
import { Switch } from 'react-native-switch';
export default function Setting({navigation}) {


  const [isEnabled, setIsEnabled] = useState(true);
  const [isEnabled1, setIsEnabled1] = useState(true);
  const [isEnabled2, setIsEnabled2] = useState(true);
  const [isEnabled3, setIsEnabled3] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState); // 스위치의 상태를 반전시킵니다.
  };

  const toggleSwitch1 = () => {
    setIsEnabled1((previousState) => !previousState); // 스위치의 상태를 반전시킵니다.
  };


  const toggleSwitch2 = () => {
    setIsEnabled2((previousState) => !previousState); // 스위치의 상태를 반전시킵니다.
  };


  const toggleSwitch3 = () => {
    setIsEnabled3((previousState) => !previousState); // 스위치의 상태를 반전시킵니다.
  };



  return (
    <View style={{flex: 1, marginTop : 40}}>
        <TouchableOpacity onPress={()=>navigation.goBack()} >
     <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' , marginTop : 0 }}>
  
      <CaretLeft  size={27} color={'#484848'}style={{ marginLeft : 20, color : '#484848', fontFamily: "Pretendard", fontWeight: "500", fontSize : 17, fontStyle: "normal",  textAlign: "left",}}/>
   
              <Text style={{ fontSize: 18 , marginRight : 'auto', fontFamily: "Pretendard",  marginLeft :10 }}>{"알림 설정"}</Text>
      </View>
      </TouchableOpacity>
      <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.7, marginTop : 20}}/>

      <View style={{flexDirection : 'row'}}>
      <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :30 ,fontFamily: "Pretendard",  marginTop : 27}}>{"푸시알림 받기"}</Text>
      <View style={{marginTop : 30, marginRight : 20}}>
      <Switch
        value={isEnabled}
        onValueChange={toggleSwitch}
        disabled={false}
        circleSize={25}
        barHeight={25}
        circleBorderWidth={0.5}
        backgroundActive={'#B2B2B2'}
        backgroundInactive={'#E0E0E0'}
        circleActiveColor={'#FFFFFF'}
        circleInActiveColor={'#FFFFFF'}
        changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
        innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
        outerCircleStyle={{}} // style for outer animated circle
        renderActiveText={false}
        renderInActiveText={false}
        switchLeftPx={1.3} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
        switchRightPx={1.3} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
        switchWidthMultiplier={2.5} // multiplied by the `circleSize` prop to calculate total width of the Switch
        switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
      />
      </View>
    </View>
    <View style={{ marginTop: 10}}></View>
    {isEnabled && (
      <>
           <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 10}}/>
        <View style={{flexDirection : 'row'}}>
        <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :30 ,fontFamily: "Pretendard",  marginTop : 20}}>{"제약인 새로운 소식"}</Text>
        <View style={{marginTop : 30, marginRight : 20}}>
        <Switch
        value={isEnabled1}
        onValueChange={toggleSwitch1}
        disabled={false}
        circleSize={25}
        barHeight={25}
        circleBorderWidth={0.5}
        backgroundActive={'#B2B2B2'}
        backgroundInactive={'#E0E0E0'}
        circleActiveColor={'#FFFFFF'}
        circleInActiveColor={'#FFFFFF'}
        changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
        innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
        outerCircleStyle={{}} // style for outer animated circle
        renderActiveText={false}
        renderInActiveText={false}
        switchLeftPx={1.3} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
        switchRightPx={1.3} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
        switchWidthMultiplier={2.5} // multiplied by the `circleSize` prop to calculate total width of the Switch
        switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
      />
        </View>
      </View>
      <Text style={{ fontSize: 15 , marginRight : 'auto', marginLeft :30 ,fontFamily: "Pretendard",  marginTop : -2, color : '#b2b2b2'}}>{"공지사항 및 이벤트"}</Text>
      <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>
           <View style={{flexDirection : 'row'}}>
           <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :30 ,fontFamily: "Pretendard",  marginTop : 20}}>{"내 게시글 알림"}</Text>
           <View style={{marginTop : 30, marginRight : 20}}>
        <Switch
        value={isEnabled2}
        onValueChange={toggleSwitch2}
        disabled={false}
        circleSize={25}
        barHeight={25}
        circleBorderWidth={0.5}
        backgroundActive={'#B2B2B2'}
        backgroundInactive={'#E0E0E0'}
        circleActiveColor={'#FFFFFF'}
        circleInActiveColor={'#FFFFFF'}
        changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
        innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
        outerCircleStyle={{}} // style for outer animated circle
        renderActiveText={false}
        renderInActiveText={false}
        switchLeftPx={1.3} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
        switchRightPx={1.3} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
        switchWidthMultiplier={2.5} // multiplied by the `circleSize` prop to calculate total width of the Switch
        switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
      />
        </View>
         </View>
         <Text style={{ fontSize: 15 , marginRight : 'auto', marginLeft :30 ,fontFamily: "Pretendard",  marginTop : -2, color : '#b2b2b2'}}>{"새로운 게시글 및 좋아요/싫어요"}</Text>
         <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>                                                                                                                                                                                                                        
              <View style={{flexDirection : 'row'}}>
              <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :30 ,fontFamily: "Pretendard",  marginTop : 20}}>{"내 댓글 알림"}</Text>
              <View style={{marginTop : 30, marginRight : 20}}>
        <Switch
        value={isEnabled3}
        onValueChange={toggleSwitch3}
        disabled={false}
        circleSize={25}
        barHeight={25}
        circleBorderWidth={0.5}
        backgroundActive={'#B2B2B2'}
        backgroundInactive={'#E0E0E0'}
        circleActiveColor={'#FFFFFF'}
        circleInActiveColor={'#FFFFFF'}
        changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
        innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
        outerCircleStyle={{}} // style for outer animated circle
        renderActiveText={false}
        renderInActiveText={false}
        switchLeftPx={1.3} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
        switchRightPx={1.3} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
        switchWidthMultiplier={2.5} // multiplied by the `circleSize` prop to calculate total width of the Switch
        switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
      />
        </View>
            </View>
            <Text style={{ fontSize: 15 , marginRight : 'auto', marginLeft :30 , marginTop : -2,fontFamily: "Pretendard",  color : '#b2b2b2'}}>{"새로운 대댓글 및 좋아요/싫어요"}</Text>
            </>
      )}
    <View style={{ backgroundColor : '#f5f5f5' , width : '100%', height : '100%', marginTop : 15}}></View>
    </View>
  );
}
