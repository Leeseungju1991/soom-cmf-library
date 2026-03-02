import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ToastAndroid,
  Animated,
} from 'react-native';
import { Text } from '@components';
import {
  getFirestore,
  collectionGroup,
  increment,
  query,
  where,
  updateDoc,
  orderBy, limit,
  doc,
  getDoc,
} from "firebase/firestore";


export default function Feedback2({navigation ,route}) {
  const item2 = route.params?.item2;
  const item = route.params?.item;

  const db = getFirestore();
  const [selectedOption, setSelectedOption] = useState(null);
 
  const options = [
    { label: '주제와 무관', value: 1 },
  ];

  const options1 = [
    { label: '회사 기밀', value: 2 },
  ];

  const options2 = [
    { label: '욕설, 특정인 비방, 부적절한 언어 사용', value: 3 },
  ];

  const options3= [
    { label: '선정적 또는 부적절한 컨텐츠', value: 4 },
  ];

  const options4 = [
    { label: '광고, 스팸, 홍보성 컨텐츠', value: 5 },
  ];

  const options5 = [
    { label: '중복, 도배', value: 6 },
  ];


  const handleSelectOption = (value) => {
    setSelectedOption(value);
   
    
  };

  useEffect(() => {
   console.log(item)
  }, []);

  const gogo = async () => {
    
    // Firestore 문서를 가져옵니다.
    const docRef = doc(db, "post", item2.id, 'reply', item.id);
  
    // 문서를 가져옵니다.
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      // 현재 bancount 값을 가져옵니다.
      const currentBancount = docSnap.data().bancount;
  
      // 현재 값에 1을 더한 새로운 값을 계산합니다.
      const newBancount = currentBancount + 1;
  
      // 계산한 값을 문서에 업데이트합니다.
      await updateDoc(docRef, {
        bancount: newBancount
        
      });
      await updateDoc(doc(db, 'post', item2.id), {
        commentcount: increment(-1)
      });
    } 
    else {
      console.log("문서가 존재하지 않습니다.");
    }
    ToastAndroid.show('신고 완료 되었습니다.', ToastAndroid.SHORT);
    navigation.goBack();
  };

  return (
    <View style={{marginTop : 40,}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 21, marginLeft: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}  style={{ marginRight: 'auto', marginLeft: 10 }}>
          <Text style={{ fontSize: 17, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal" ,   color: "#b2b2b2"}}>{"취소"}</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal" }}>{"신고하기"}</Text>
        <TouchableOpacity onPress={()=>gogo()} style={{ marginLeft: 'auto', marginRight: 20 }}>
          <Text style={{ fontSize: 17, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal" ,   color: "#4a5cfc"}}>{"신고"}</Text>
        </TouchableOpacity>
      </View>
        <View style={{ borderBottomColor: '#b2b2b2', borderBottomWidth: 0.7, marginTop : 20}}/>
        <Text style={{ marginTop : 20, marginLeft : 20, fontSize: 17, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal" ,   color: "#484848"}}>{"신고사유"}</Text>
        <View>
          
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleSelectOption(option.value)}
          style=
          {{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ marginTop : 20, flexDirection: 'row', marginLeft : 20}}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: selectedOption === option.value ? '#dedede' : '#dedede',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            {selectedOption === option.value && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 10,
                  backgroundColor: '#4a5cfc',
                }}
              />
            )}
          </View>
          <Text style={{ fontSize: 17, fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal" , marginTop : -5}}>{option.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ borderBottomColor: '#b2b2b2', borderBottomWidth: 0.7, marginTop : 20, width : '88%', marginLeft : '5%'}}/>




      {options1.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleSelectOption(option.value)}
          style=
          {{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ marginTop : 20, flexDirection: 'row', marginLeft : 20}}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: selectedOption === option.value ? '#dedede' : '#dedede',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            {selectedOption === option.value && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 10,
                  backgroundColor: '#4a5cfc',
                }}
              />
            )}
          </View>
          <Text style={{ fontSize: 17, fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal" , marginTop : -5}}>{option.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ borderBottomColor: '#b2b2b2', borderBottomWidth: 0.7, marginTop : 20, width : '88%', marginLeft : '5%'}}/>



      {options2.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleSelectOption(option.value)}
          style=
          {{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ marginTop : 20, flexDirection: 'row', marginLeft : 20}}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: selectedOption === option.value ? '#dedede' : '#dedede',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            {selectedOption === option.value && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 10,
                  backgroundColor: '#4a5cfc',
                }}
              />
            )}
          </View>
          <Text style={{ fontSize: 17, fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal" , marginTop : -5}}>{option.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ borderBottomColor: '#b2b2b2', borderBottomWidth: 0.7, marginTop : 20, width : '88%', marginLeft : '5%'}}/>



      {options3.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleSelectOption(option.value)}
          style=
          {{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ marginTop : 20, flexDirection: 'row', marginLeft : 20}}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: selectedOption === option.value ? '#dedede' : '#dedede',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            {selectedOption === option.value && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 10,
                  backgroundColor: '#4a5cfc',
                }}
              />
            )}
          </View>
          <Text style={{ fontSize: 17, fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal" , marginTop : -5}}>{option.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ borderBottomColor: '#b2b2b2', borderBottomWidth: 0.7, marginTop : 20, width : '88%', marginLeft : '5%'}}/>



      {options4.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleSelectOption(option.value)}
          style=
          {{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ marginTop : 20, flexDirection: 'row', marginLeft : 20}}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: selectedOption === option.value ? '#dedede' : '#dedede',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            {selectedOption === option.value && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 10,
                  backgroundColor: '#4a5cfc',
                }}
              />
            )}
          </View>
          <Text style={{ fontSize: 17, fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal" , marginTop : -5}}>{option.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ borderBottomColor: '#b2b2b2', borderBottomWidth: 0.7, marginTop : 20, width : '88%', marginLeft : '5%'}}/>



      {options5.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleSelectOption(option.value)}
          style=
          {{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ marginTop : 20, flexDirection: 'row', marginLeft : 20}}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: selectedOption === option.value ? '#dedede' : '#dedede',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            {selectedOption === option.value && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 10,
                  backgroundColor: '#4a5cfc',
                }}
              />
            )}
          </View>
          <Text style={{ fontSize: 17, fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal" , marginTop : -5}}>{option.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
   
    </View>
    </View>
  );
}
