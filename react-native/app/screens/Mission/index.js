import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Text,
  Image
} from 'react-native';
import { WebView } from 'react-native-webview';
import {SafeAreaView, Icon, TextInput} from '@components';
import { ScrollView,  } from 'react-native-gesture-handler';
import {BaseStyle} from '@config';
import {
  getFirestore,
  collectionGroup,
  onSnapshot,
  query,
  where,
  updateDoc,
  orderBy, limit,
  doc,
  getDoc,
  arrayRemove,
  arrayUnion,
  collection,
  increment
} from "firebase/firestore";
import {CaretLeft, WarningCircle, Question, CaretDown, Triangle} from 'phosphor-react-native';
import { getAuth } from 'firebase/auth';
import { Platform, Button } from 'react-native';
let timeout;

const borderBottomWidth = Platform.OS === 'ios' ? 60 : 70;
const borderBottomHeight = Platform.OS === 'ios' ? 30 : 20;

const Mission = ({navigation}) => {
  const [showSplash, setShowSplash] = useState(true);
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const db = getFirestore();
  const screenWidth = Dimensions.get('window').width;
  const [notification, setnotification] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const auth = getAuth();
  const citiesRef = collection(db, "User");
  const q8 = query(citiesRef, where("email", "==", auth.currentUser.email));
  // 갤럭시 탭 A7의 화면 너비 (예시로 10.4 인치 화면을 기준으로)
  const tabletWidth = 10.4 * 25.4; // 인치를 밀리미터로 변환
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [selectedTab, setSelectedTab] = useState('채용정보');
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
  const [recentSearches, setRecentSearches] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [posts1, setPosts1] = useState([]);
  const [category, setCategory] = useState('연봉높은 순');

  const notificationReceived = notification; // 알림이 온 경우 true로 설정



  useEffect(() => {
    const unsubscribe = onSnapshot(q8, (snapshot) => {
      if (snapshot.size > 0) {
        const userData = snapshot.docs[0].data();
        setnotification(userData.alarmonff || "");
      }
    });

    return () => {
      unsubscribe(); // 클린업 함수에서 구독 해제
    };
  }, []);

  useEffect(() => {
    if (modalVisible1) {
      // modalVisible1가 열릴 때, 5 초 후에 modalVisible1을 닫고 modalVisible2를 열기
      const timer = setTimeout(() => {
        setModalVisible1(false);
        setModalVisible2(true);
      }, 3200);

      // 컴포넌트가 언마운트 될 때 타이머를 클리어합니다.
      return () => clearTimeout(timer);
    }
  }, [modalVisible1]);
  

  const removeRecentSearch = (searchItem) => {
    const updatedSearches = recentSearches.filter((item) => item !== searchItem);
    setRecentSearches(updatedSearches);
  };



  const item1 = {
    id: 61,
    company: "디에스엠뉴트리션코리아",
    value: 8232,
    minvalue: '4323',
    topvalue: '10234',
    category: '의약품 제조업',
    address1: '서울',
    address2: '영등포구',
    year1: '6844',
    year2: '7235',
    year3: '8123'
  };
  const item2 = {
    id: 2,
    company: "일동제약",
    value: 7846,
    minvalue: '4228',
    topvalue: '9066',
    category: '의약품 제조업',
    address1: '서울',
    address2: '서초구',
    year1: '7249',
    year2: '7341',
    year3: '7846'
  };

  const item3 = {
    id: 57,
    company: "팜젠사이언스",
    value: 7762,
    minvalue: '3934',
    topvalue: '9542',
    category: '의약품 제조업',
    address1: '경기',
    address2: '화성시',
    year1: '6265',
    year2: '6832',
    year3: '7123'
  };

  const item4 = {
    id: 3,
    company: "데일리팜",
    value: 6930,
    minvalue: '3700',
    topvalue: '7965',
    category: '온라인정보 제공업',
    address1: '서울',
    address2: '송파구',
    year1: '6331',
    year2: '6777',
    year3: '6930'
  };

  const item5 = {

    company: "셀트리온제약",
    value: 6816,
    minvalue: '3468',
    topvalue: '8397',
    category: '의약품 제조업',
    address1: '충북',
    address2: '청주시',
    year1: '5472',
    year2: '6354',
    year3: '6816'
  };









  const formatValue = (value) => {
    const valueString = value.toString(); // 숫자를 문자열로 변환
    const length = valueString.length;
  
    if (length <= 3) {
      return valueString; // 3자리 이하인 경우 그대로 반환
    }
  
    const lastThreeDigits = valueString.slice(length - 3); // 뒤에서 3자리 가져오기
    const remainingDigits = valueString.slice(0, length - 3); // 나머지 숫자 부분
  
    return `${remainingDigits},${lastThreeDigits}`;
  };

const renderItem = ({ item }) => (
<TouchableOpacity activeOpacity={0.11} onPress={()=> navigation.navigate("Wishlist1",{item})}>
  <View style={{ flexDirection: 'row' }}>
    <Text style={{ marginTop: 20, marginLeft: 20, fontWeight: "500",  fontStyle: "normal",  fontFamily: "Pretendard", fontSize : 15 }}>{item.company}</Text>
    <Text style={{ marginTop: 20, marginLeft: 'auto', marginRight: 20, fontWeight: "500",  fontStyle: "normal",  fontFamily: "Pretendard", fontSize : 15}}>{formatValue(item.value)}만원</Text>
  </View>
  <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop: 20 }} />
  </TouchableOpacity>

);






  const alarm = () => {
    Alert.alert({
      type: 'fail',
      title: "알림",
      message: "알림이 없습니다.",
    });
  }
  
  const handleTabPress = (tabName) => {
    setSelectedTab(tabName);

  };



  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);




  const handleWebViewLoad = () => {
    setWebViewLoaded(true);
    setShowSplash(false);
  };

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
  };

  useEffect(() => {
    // 컴포넌트가 unmount될 때 WebView 정리
    return () => {
      if (webViewRef) {
        webViewRef.stopLoading(); // 웹뷰 로딩 중지
        webViewRef.removeAllListeners(); // 이벤트 리스너 제거
      }
    };
  }, []);

  let webViewRef; // WebView 컴포넌트를 참조하기 위한 변수

  return (
    <SafeAreaView
    style={{marginTop : 10}}
    edges={['right', 'top', 'left']}>
    <TouchableOpacity onPress={()=>navigation.goBack()} >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' , marginTop : 0 }}>
    
      <CaretLeft  size={27} color={'#484848'}style={{ marginLeft : 20, color : '#484848', fontFamily: "Pretendard", fontWeight: "500", fontSize : 17, fontStyle: "normal",  textAlign: "left",}}/>

              <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :10 }}>{"미션 스탬프"}</Text>
      </View>
      </TouchableOpacity>








 
       <View style={{marginTop : 0}}>
        <ScrollView showsVerticalScrollIndicator={false} style={{marginTop : 10}} >


        <View style={{ backgroundColor  : '#f6f7ff', width : '100%', height : 350, marginTop : 10}}>
          <View style={{alignItems: 'flex-end', marginRight : 30, marginTop : 20, flexDirection : 'row', marginLeft : 'auto'}}>
         </View> 

            <View style={styles.container2}>
            <View style={{alignItems: 'center', marginTop : 20}}>
            <Text style={styles.titleText}>{"스탬프 미션 리스트"}</Text>
          </View>
          <View style={{flexDirection : 'row'}}>
             <WarningCircle  size={19} color={'#b2b2b2'} style={{ marginTop : 1}}/>
            <Text style={styles.averageText}>{"스탬프 적립 개수는 하루 5개로 제한됩니다. "}</Text>
          </View>
        </View>

           <View style={{ backgroundColor  : '#FFFFFF', width : '90%', height : 222, marginLeft : '5%', marginBottom : 20 ,elevation: 4}}>
           
          <View style={{marginLeft: 10, marginTop : 15}}>
        
           <View style={{flexDirection : 'row'}}>
             <Text style={{fontSize : 15, marginTop : 5, marginLeft :10,color: "#484848" ,fontWeight: "normal",fontFamily: "Pretendard",fontStyle: "normal",}}>{"회원가입 하기"}</Text>
           
             <View style={{flexDirection : 'row', marginLeft: 'auto', marginRight: 20,}}>
             <View style={{
              backgroundColor: "#4A5CFC",
              width: 80,
              height: 25,
              marginBottom : 10,
              borderRadius: 27,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                fontSize: 13,
                color: '#FFFFFF',
              }}>
               {"+1 스탬프"}
          </Text>
            </View>
             </View>

          </View>
       
          
          </View>
          <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 5}}/>


       
          <View style={{marginLeft: 10, marginTop : 15}}>
        
           <View style={{flexDirection : 'row'}}>
             <Text style={{fontSize : 15, marginTop : 5, marginLeft :10,color: "#484848" ,fontWeight: "normal",fontFamily: "Pretendard",fontStyle: "normal",}}>{"게시글 쓰기"}</Text>
             <View style={{flexDirection : 'row', marginLeft: 'auto', marginRight: 20,}}>
             <View style={{
              backgroundColor: "#4A5CFC",
              width: 80,
              height: 25,
              marginBottom : 10,
              borderRadius: 27,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                fontSize: 13,
                color: '#FFFFFF',
              }}>
                 {"+1 스탬프"}
          </Text>
            </View>
             </View>

          </View>
       
          
          </View>
          <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 5}}/>





          <View style={{marginLeft: 10, marginTop : 15}}>
       
           <View style={{flexDirection : 'row'}}>
             <Text style={{fontSize : 15, marginTop : 5, marginLeft :10,color: "#484848" ,fontWeight: "normal",fontFamily: "Pretendard",fontStyle: "normal",}}>{"댓글 달기"}</Text>
             <View style={{flexDirection : 'row', marginLeft: 'auto', marginRight: 20,}}>
             <View style={{
              backgroundColor: "#4A5CFC",
              width: 80,
              height: 25,
              marginBottom : 10,
              borderRadius: 27,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                fontSize: 13,
                color: '#FFFFFF',
              }}>
           {"+1 스탬프"}
          </Text>
            </View>
             </View>

          </View>
      

          </View>
          <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 5}}/>

         
          <View style={{marginLeft: 10, marginTop : 15}}>
        
           <View style={{flexDirection : 'row'}}>
             <Text style={{fontSize : 15, marginTop : 5, marginLeft :10,color: "#484848" ,fontWeight: "normal",fontFamily: "Pretendard",fontStyle: "normal",}}>{"제약인 공유하기"}</Text>
             <View style={{flexDirection : 'row', marginLeft: 'auto', marginRight: 20,}}>
             <View style={{
              backgroundColor: "#4A5CFC",
              width: 80,
              height: 25,
              marginBottom : 10,
              borderRadius: 27,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                fontSize: 13,
                color: '#FFFFFF',
              }}>
                {"+1 스탬프"}
          </Text>
            </View>
             </View>

          </View>
       
       



          </View>
          <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 5}}/>


           </View>
           
        </View>  
        <View style={{flexDirection : 'row'}}>
        <Text style={{ color : '#4A5CFC', fontSize : 14, marginLeft :20, marginTop :20,  fontFamily: "Pretendard",   fontWeight: "500", fontStyle: "normal",}}>{"총 1개 모았어요."}</Text>
         <View style={{ marginLeft : 'auto', marginRight : 0}}>

        </View>
        </View>
        <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.7, marginTop : 20}}/>

     
        <View style={styles.container2}>
            <View style={{alignItems: 'center', marginTop : 20}}>
            <Text style={styles.titleText}>{"스탬프 모음판"}</Text>
          </View>
          <View style={{flexDirection : 'row'}}>
             <WarningCircle  size={19} color={'#b2b2b2'} style={{ marginTop : 1}}/>
            <Text style={styles.averageText}>{"선물상자를 눌러 상품을 뽑아주세요. "}</Text>
          </View>
        </View>

        <View style={{flexDirection : 'row', marginTop : 20 ,alignItems: 'center', justifyContent: 'center' }}>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center' }}>
        <ImageBackground source={require("../../../assets/signupbox.png")} style={{ width: 87, height: 88, marginTop : 8, color: '#484848', alignItems: 'center', justifyContent: 'center' }}>
          </ImageBackground>
        </ImageBackground>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center' , marginLeft : 10 }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"2"}</Text>
        </ImageBackground>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center', marginLeft : 10  }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"3"}</Text>
        </ImageBackground>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center' , marginLeft : 10 }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"4"}</Text>
        </ImageBackground>
        </View>

        <View style={{flexDirection : 'row', marginTop : 20 , alignItems: 'center', justifyContent: 'center' }}>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={()=> setModalVisible1(!modalVisible1)}>
        <ImageBackground source={require("../../../assets/gift.png")} style={{ width: 80, height: 96, marginTop : 12, color: '#484848', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"5"}</Text>
          </ImageBackground>
        </TouchableOpacity>
        </ImageBackground>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center' , marginLeft : 10 }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"6"}</Text>
        </ImageBackground>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center', marginLeft : 10  }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"7"}</Text>
        </ImageBackground>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center' , marginLeft : 10 }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"8"}</Text>
        </ImageBackground>
        </View>

        <View style={{flexDirection : 'row', marginTop : 20 ,  alignItems: 'center', justifyContent: 'center' }}>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"8"}</Text> 
        </ImageBackground>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center' , marginLeft : 10 }}>
        <ImageBackground source={require("../../../assets/gift.png")} style={{ width: 80, height: 96, marginTop : 12,  color: '#484848', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"10"}</Text>
          </ImageBackground>
        </ImageBackground>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center', marginLeft : 10  }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"11"}</Text>
        </ImageBackground>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center' , marginLeft : 10 }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"12"}</Text>
        </ImageBackground>
        </View>

        <View style={{flexDirection : 'row', marginTop : 20 , alignItems: 'center', justifyContent: 'center' }}>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"13"}</Text>
        </ImageBackground>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center' , marginLeft : 10 }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"14"}</Text>
        </ImageBackground>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center', marginLeft : 10  }}>
        <ImageBackground source={require("../../../assets/gift.png")} style={{ width: 80,height: 96, marginTop : 12, color: '#484848', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"15"}</Text>
          </ImageBackground>
        </ImageBackground>
        <ImageBackground source={require("../../../assets/stamp.png")} style={{ width: 80, height: 80, color: '#484848', alignItems: 'center', justifyContent: 'center' , marginLeft : 10 }}>
        <Text style={{color : '#E3E3E3' ,fontSize : 28}}>{"16"}</Text>
        </ImageBackground>
        </View>
  
        <View style={{marginTop: 70}}></View>

        <View style={{backgroundColor :'#F5F5F5' , width : '100%', height : 400}}>
        <Text style={{fontSize : 20, fontWeight : 'bold', marginTop : 20, marginLeft : 20}}>{"경품 히스토리"}</Text>


        </View>
        </ScrollView>
   
     </View>
       
     <Modal
  animationType="fade"
  transparent={true}
  visible={modalVisible1}
  onRequestClose={() => {
    setModalVisible1(!modalVisible1);
  }}
>
  <View style={{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <ImageBackground
      source={require("../../../assets/ff.gif")}
      style={{
        width: 400,
        height: 320,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Your ImageBackground content */}
    </ImageBackground>
  </View>
</Modal>


    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible2}
      onRequestClose={() => {
        setModalVisible2(!modalVisible2);
      }}
    >
       <StatusBar
      translucent={true}
      backgroundColor="rgba(0, 0, 0, 0.5)" // 반투명 배경색
    />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <View style={styles.modalSection}>
             
            <Text style={{  alignItems: 'center', justifyContent: 'center',fontSize : 20, fontWeight : 'bold', marginLeft : 60, marginTop : 50}}>{"축하드려요!"}</Text>
            <View style={{
              backgroundColor: "#4A5CFC",
              width: 220,
              height: 40,
              marginBottom : 0,
              marginTop : 10,
              borderRadius: 27,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                fontSize: 20,
                color: '#FFFFFF',
              }}>
                {"스타벅스 아메리카노"}
          </Text>
            </View>
            <Text style={{  alignItems: 'center', justifyContent: 'center',fontSize : 18,  marginLeft : 50, marginTop : 10}}>{"당첨되었습니다."}</Text>
            
            </View>
            <View style={{flexDirection : 'row'}}>
            <Image source={require("../../../assets/coffe.png")} style={{width : 300, height : 300, color: '#484848', marginLeft : 0, marginTop : -125}} />
            <TouchableOpacity activeOpacity={0.11}  onPress={() => {setModalVisible2(!modalVisible2)}}>
              <Text style={styles.confirmButtonText}>{"확인"}</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
      </View>
    </Modal>



        </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashImage: {
    resizeMode: 'cover',
    width: '100%',
    height: Dimensions.get('window').height + 100,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  container1: {
    flex: 1,

    flexDirection: 'row'
  },
  defaultText: {
    color: 'black', // 기본 텍스트 색상
    textDecorationLine: 'none', // 밑줄 없음
    fontSize : 18,
    fontWeight : 'bold'
  },
  clickedText: {
    color: 'blue', // 클릭 시 텍스트 색상
    textDecorationLine: 'underline', // 밑줄 있음
    fontSize : 18,
    fontWeight : 'bold'
  },
  infoText: {
    fontSize: 22,
    marginTop: 20,
    marginLeft: '25%',
  },
  container2: {
    flex: 1,
    alignItems: 'center', // 화면 중앙으로 정렬
  },
  textContainer: {
    marginRight: 30,
    marginTop: 10,
  },
  titleText: {
    fontSize: 19,
    fontFamily: "Pretendard",
    fontWeight: "800",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#484848"
  },
  averageText: {
    fontFamily: "Pretendard",
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#b2b2b2",
    marginLeft : 1
  },
  menuIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 15,
    right: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon1: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 15,
    right: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom : 50
  },
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    height : 350,
    width : '90%',
    marginLeft : '5%',
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
    marginBottom: 10,
  },
  modalContent: {
    textAlign: 'center',
    alignItems: 'center',

  },
  modalSection: {
    marginBottom: 10,
  },
  modalSectionTitle: {
    textAlign: 'center',
    marginTop : 30,
    fontSize : 18,
    fontFamily: "Pretendard",
    fontWeight: "normal",
  },
  modalSectionTitle1: {
    textAlign: 'center',
    marginTop : 15,
    fontSize : 18,
    fontFamily: "Pretendard",
    fontWeight: "normal",
  },
  modalSectionText: {
    color: '#b2b2b2',
    marginLeft : 60,
    marginTop : 5,
    fontFamily: "Pretendard",
  },
  modalText: {
    color: '#777777',
    marginTop: 10,
    marginBottom: 10,
  },
  confirmButton: {
    marginTop : 10,
    backgroundColor: '#484848',
    borderRadius: 15,
    marginLeft : '5%',
    alignItems: 'center',
    width : '90%',
    height : 50
  },
  confirmButton1: {
    backgroundColor: '#a234fe',
    borderRadius: 10,
    marginLeft : '2%',
    alignItems: 'center',
    width : '95%',
    height : 50,
    marginTop : -10
  },
  confirmButton2: {
    backgroundColor: '#a234fe',
    borderRadius: 10,
    marginLeft : '2%',
    alignItems: 'center',
    width : '95%',
    height : 50,
    marginTop : 20
  },
  confirmButtonText: {
    color: '#4A5CFC',
    fontSize : 20, 
    marginTop : 130,
    marginLeft : -40
  },
  containercheck: {
    marginTop: 4,
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: '#a234fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#a234fe',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default Mission;