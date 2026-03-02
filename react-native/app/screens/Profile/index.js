import React, {useState, useEffect} from 'react';
import {View,  TouchableOpacity, Alert, Linking, Modal,  ActivityIndicator,ToastAndroid, Image, StatusBar} from 'react-native';
import {SafeAreaView, Text, Button, } from '@components';
import styles from './styles';
import { getAuth, signOut } from 'firebase/auth';
import {CaretRight, ShareNetwork, DotsThree, CaretLeft, Heart, ChatText, ThumbsUp} from 'phosphor-react-native';
import {
  getFirestore,
  onSnapshot,
  query,
  collection,
  where
} from "firebase/firestore";




export default function Profile({navigation}) {
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const citiesRef = collection(db, "User");
  const auth = getAuth();
  const q = query(citiesRef, where("email", "==", auth.currentUser.email));
  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.size > 0) {
        const userData = snapshot.docs[0].data();
        setPosts(userData.posts || []);
        setUserName(userData.id || "");
        setLoading(false); // userName이 로딩되면 로딩 상태를 해제
      }
    });

    return () => {
      unsubscribe(); // 클린업 함수에서 구독 해제
    };
  }, []);

  

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("SignIn")
      ToastAndroid.show('로그아웃 하였습니다', ToastAndroid.SHORT);
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  const handleSignOut1 = async () => {
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
  };


  const createKakaoLink = () => {
    Linking.openURL(
      'https://pf.kakao.com/_xfLxcIG'
    );
  };


  if (loading) {
    // 로딩 중일 때 ActivityIndicator 표시
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#a234fe" />
      </View>
    );
  } else {
    // 데이터 로딩이 완료된 후의 UI
    return (
      <>
  
      <View style={{flex: 1, backgroundColor : '#f6f7ff'}}>
        <View style={{marginTop : 60}}></View>
        <View style={styles.container}>
        <Text style={{fontSize : 17, fontFamily: "Pretendard",fontWeight: "bold", fontStyle: "normal" }}>{userName}{"님,"}</Text>
        <Text style={{fontSize : 17,fontFamily: "Pretendard",fontWeight: "600", fontStyle: "normal", }}>{"환영합니다!"}</Text>
        <View style={{
          backgroundColor: "#01be80",
          width: 80,
          height: 25,
          marginTop: 10,
          borderRadius: 27,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{
            fontSize: 13,
            color: '#FFFFFF',
          }}>
            {"제약종사자"}
          </Text>
        </View>
      </View>
      </View>
        <View style={{ backgroundColor : '#FFFFFF', width : '100%', height : '60%', marginTop : -10, shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2,elevation: 12,shadowRadius: 3, }}>
        <View style={{marginLeft : 20, marginTop : 0}}>


        <TouchableOpacity onPress={()=>navigation.navigate("MyFeed")}>
        <View style={{flexDirection : 'row'}}>
        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.2, marginTop : 10}}/>
        <Text style={{fontSize : 17,  marginTop : 20, fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal"}}>{"내가 작성한 글"}</Text>
        <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : 20}}/>
        </View>
        </TouchableOpacity>
        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.2, marginTop : 10, marginLeft : -50}}/>

        <TouchableOpacity onPress={()=>navigation.navigate("MyBookMark")}>
        <View style={{flexDirection : 'row'}}>
        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.2, marginTop : 10}}/>
        <Text style={{fontSize : 17,  marginTop : 20, fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal"}}>{"북마크"}</Text>
        <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : 20}}/>
        </View>
        </TouchableOpacity>
        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.2, marginTop : 10, marginLeft : -50}}/>
        <TouchableOpacity onPress={()=>navigation.navigate("MyBookMark")}>
        <View style={{flexDirection : 'row'}}>
        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.2, marginTop : 10}}/>
        <Text style={{fontSize : 17,  marginTop : 20, fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal"}}>{"공지사항"}</Text>
        <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : 20}}/>
        </View>
        </TouchableOpacity>
        
        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.2, marginTop : 10, marginLeft : -50}}/>
        <TouchableOpacity onPress={()=>navigation.navigate("Event")}>
        <View style={{flexDirection : 'row'}}>
        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.2, marginTop : 10}}/>
        <Text style={{fontSize : 17,  marginTop : 20, fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal"}}>{"이벤트"}</Text>
        <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : 20}}/>
        </View>
        </TouchableOpacity>

        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.2, marginTop : 10, marginLeft : -50}}/>
        <TouchableOpacity onPress={()=>navigation.navigate("Mission")}>
        <View style={{flexDirection : 'row'}}>
        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.2, marginTop : 10}}/>
        <Text style={{fontSize : 17,  marginTop : 20, fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal"}}>{"미션 스탬프"}</Text>
        <View style={{
          backgroundColor: "#B2B2B2",
          width: 70,
          height: 25,
          marginTop: 20,
          borderRadius: 27,
          marginLeft : 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{
            fontSize: 13,
            color: '#FFFFFF',
          }}>
            {"EVENT"}
          </Text>
        </View>
        <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : 20}}/>
        </View>
        </TouchableOpacity>

        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.2, marginTop : 10, marginLeft : -50}}/>
        <TouchableOpacity onPress={()=>navigation.navigate("ContactUs")}>
        <View style={{flexDirection : 'row'}}>
        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.2, marginTop : 10}}/>
        <Text style={{fontSize : 17,  marginTop : 20, fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal"}}>{"고객 센터"}</Text>
        <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : 20}}/>
        </View>
        </TouchableOpacity>

        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.2, marginTop : 10, marginLeft : -50}}/>
        <TouchableOpacity onPress={()=>navigation.navigate("ContactUs1")}>
        <View style={{flexDirection : 'row'}}>
        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.2, marginTop : 10}}/>
        <Text style={{fontSize : 17,  marginTop : 20, fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal"}}>{"설정"}</Text>
        <CaretRight   size={30} color ='#dedede' style={{marginLeft: 'auto', marginRight: 35, marginTop : 20}}/>
        </View>
        </TouchableOpacity>
        </View>
        </View>
           {/* Modal */}
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
                <View style={{ width : '46%', height : 50,backgroundColor: "#a234fe", borderRadius: 15,}}>
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
        </>
           );
  }



  
}
