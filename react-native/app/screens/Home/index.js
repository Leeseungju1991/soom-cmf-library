import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  StatusBar,
  Modal,
  ToastAndroid,
  Linking,
  ActivityIndicator
} from 'react-native';
import {useTheme} from '@config';
import {SafeAreaView, Text, Image} from '@components';
import styles from './styles';
import {Bell, CaretDown, Heart, ChatText, Eye} from 'phosphor-react-native';
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
import * as Utils from '@utils';
import { getAuth } from 'firebase/auth';
import { Platform } from 'react-native';

const marginTop1 = Platform.OS === 'ios' ? -48 : -2;

export default React.memo(function Home({ navigation}) {


  const {colors} = useTheme();
  const auth = getAuth();
  const [heightHeader, ] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(220);
  const marginTopBanner = heightImageBanner - heightHeader + 10;
  const [modalVisible, setModalVisible] = useState(true);
  const [modalVisible1, setModalVisible1] = useState(false);
  const moment = require('moment');
  const currentTime = moment()
  const [refreshing, setRefreshing] = useState(false);
  const db = getFirestore();
  const colGroupRef = collectionGroup(db, "post");
  const q = query(colGroupRef);
  const q1 = query(colGroupRef, orderBy("viewcount", "desc"),limit(2));
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('최신순');
  const componentMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [autostart, setAutostate] = useState();
  const [activeTab, setActiveTab] = useState('전체');
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const [notification, setnotification] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const [noti1, setnoti1] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const user = auth.currentUser;
  const emailVerified = user?.emailVerified;
  const citiesRef = collection(db, "User");
  const q8 = query(citiesRef, where("email", "==", auth.currentUser.email));
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

  const goalarm = () => {

    const userRef = doc(citiesRef, auth.currentUser.email);

    updateDoc(userRef, {
      alarmonff: false
    })
      .then(() => {
        console.log("Firestore 데이터 업데이트 성공");
        navigation.navigate("alarm")
      })
      .catch((error) => {
        console.error("Firestore 데이터 업데이트 오류:", error);
      });
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(q8, (snapshot) => {
      if (snapshot.size > 0) {
        const userData = snapshot.docs[0].data();
        setUserName(userData.id || "");
      }
    });

    return () => {
      unsubscribe(); // 클린업 함수에서 구독 해제
    };
  }, []);

  useEffect(() => {
    if(emailVerified == true){
      setModalVisible(false)
    }else{
      setModalVisible(false)
    }
  }, []);

  useEffect(() => {
    ToastAndroid.show('제약인 토크 이벤트에 참여해보세요', ToastAndroid.SHORT);
  }, []);

  const filterConfigs = [
    { filter: q, setFilterPosts: setPosts },
  ];
  
  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (componentMounted.current) {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    });

    return () => {
      unsubscribe();
      componentMounted.current = false;
    };
  }, []);
  



  // 모든 필터에 대한 useEffect를 하나로 합칩니다.
  useEffect(() => {
    const fetchData = async () => {
      for (const { filter, setFilterPosts } of filterConfigs) {
        try {
          const snapshot = await getSnapshot(filter); // 비동기 작업을 기다립니다.
          if (componentMounted.current) {
            setFilterPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        
          }
        } catch (error) {
   
        }
      }
    };
  
    fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
  
    return () => {
      componentMounted.current = false;
    };
  }, []);
  
  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  // Firebase onSnapshot 대신에 데이터를 가져오는 함수를 사용하고 해당 함수를 async 함수로 정의합니다.
  const getSnapshot = async (filter) => {
    return new Promise((resolve, reject) => {
      onSnapshot(filter, (snapshot) => {
        resolve(snapshot);
      }, (error) => {
       
      });
    });
  };

  const createKakaoLink = () => {
    setModalVisible1(false)
    Linking.openURL(
      'https://pf.kakao.com/_xfLxcIG'
    );
  };

  const likeplus = async (email, postId, currentLikeColor) => {
    try {
      const user = auth.currentUser;
      if (!user) {
    
        // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
        return;
      }
  
      const postDocRef = doc(db, 'post', postId);
  
      // 게시물 문서에서 "likedBy" 필드를 가져와 현재 사용자 UID가 있는지 확인
      const postSnapshot = await getDoc(postDocRef);
      const likedBy = postSnapshot.data().likedBy || [];
      // 현재 like 필드의 상태에 따라 토글
      const newLikeColor = !currentLikeColor;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 해주고 두 자리로 표시
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  
      const customDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}`;
  
      // 이미 좋아요를 누른 경우 좋아요 취소
      if (likedBy.includes(userName)) {
        await updateDoc(postDocRef, {
          likecount: increment(-1),
          likedBy: arrayRemove(userName), // 사용자 UID를 "likedBy" 배열에서 제거
        });
  
        // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
      } else {
        // 아직 좋아요를 누르지 않은 경우 좋아요 추가
        await updateDoc(postDocRef, {
          likecount: increment(1),
          likedBy: arrayUnion(userName), // 사용자 UID를 "likedBy" 배열에 추가
        });
        const emailDocRef = doc(db, 'User', email);
        await updateDoc(emailDocRef, {
          alarmonff: true,
          alarmcheck : false
        });
        // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
      }
    } catch (error) {
  
      // 오류 메시지를 사용자에게 표시 (예: 모달 또는 토스트 메시지)
    }
  };



  const truncateTitle = (title) => {
    
    // 공백과 줄 바꿈 문자를 모두 제거하여 1줄로 만듭니다.
    const oneLineTitle = title.replace(/\s+/g, ' ');
  
    if (oneLineTitle.length > 30) {
      return oneLineTitle.slice(0, 30) + '...';
    } else {
      return oneLineTitle;
    }
    
  }
  

  const onRefresh = () => {
    setRefreshing(true);
  };



  function getTimeAgo(timestamp) {
    const currentTime = moment();
    const targetTime = moment(timestamp);
    const diffMinutes = currentTime.diff(targetTime, 'minutes');
  
    if (diffMinutes < 5) {
      return '방금 전';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    } else if (diffMinutes < 1440) {
      const hoursAgo = Math.floor(diffMinutes / 60);
      return `${hoursAgo}시간 전`;
    } else {
      const daysAgo = Math.floor(diffMinutes / 1440);
      return `${daysAgo}일 전`;
    }
  }


 
  function getCategoryColor(category) {
    switch (category) {
      case '회사생활':
        return '#01be80';
      case '취미':
        return '#a234fe';
      case '자유':
        return '#4a5cfc';
      case '이직커리어':
        return '#a71a1a';
      default:
        // 기본 색상 또는 처리할 다른 카테고리 색상을 여기에 추가할 수 있습니다.
        return '#000'; // 기본 색상 (예: 검은색)
    }
  }


 
  const renderContent = () => {
    let sortedPosts = [];

    if (category === '최신순') {
      sortedPosts = [...posts]
        .filter(post => post.bancount !== 1)
        .sort((a, b) => {
          const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
          const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
          return timeB - timeA;
        });
    } else if (category === '오래된순') {
      sortedPosts = [...posts]
        .filter(post => post.bancount !== 1)
        .sort((a, b) => {
          const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
          const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
          return timeA - timeB;
        });
    }
    

    return (
      <View style={{flex: 1, marginTop: -40}}>
        <View style={{marginTop: 20, backgroundColor: '#FFFFFF'}}>
        <TouchableOpacity activeOpacity={0.11} onPress={() => {setModalVisible1(!modalVisible1)}}>
        <View style={{flexDirection : 'row' , marginLeft : 'auto', marginTop : 20}}>
          <CaretDown size={25} color={'#484848'} style={{ marginTop: -2 }} />
          <Text style={{ fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", marginRight: 17 }}>{category}</Text>
        </View>
      </TouchableOpacity>
          <FlatList 
            contentContainerStyle={{marginTop: -25}}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            data={sortedPosts}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false} // 스크롤 비활성화
          />
        </View>
        <View style={{marginTop : 40}}></View>
        
      </View> 
    );
  };

  

  const renderItem = ({ item , index}) => {

  
    const gogo = async (count, id) => {
      navigation.navigate("FeedDetail",{item})
      await updateDoc(doc(db, "post", id), {
      viewcount : count + 1
      });
    };


    return (
      
      <SafeAreaView>
      <TouchableOpacity  activeOpacity={0.88} onPress={()=>gogo(item.viewcount,item.id)}> 
     
      <View style={[styles.contain]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>


      <Image
        source={
          item.category === "회사생활"
            ? require("../../../assets/feed1.png")
            : item.category === "이직커리어"
            ? require("../../../assets/feed2.png")
            : item.category === "취미"
            ? require("../../../assets/feed3.png")
            : item.category === "자유"
            ? require("../../../assets/feed4.png")
            : null // 다른 경우에 대한 처리
        }
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#e9e9e9",
          borderRadius: 20,
          marginTop: 20,
          fontWeight: "bold",
        }}
      />
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginLeft: 10, color: getCategoryColor(item.category) }}>
          {item.category}
        </Text>
        <View style={{ flex: 1, alignItems: 'flex-end'}}> 
        <Text style={{marginLeft : 'auto', marginRight : 40, color : '#b2b2b2' }}>{getTimeAgo(item.time)}</Text>
        </View>
        
      </View>
      </View>

      <View style={{flexDirection : 'row'}}> 
      <Text style={{ marginLeft: 10, marginLeft: 50, marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
        {item.name === userName ? "작성자" : "종사자"}
      </Text>
      <View style={{ width: 1.2, height: 15, marginTop: -16, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
      <View style={{ width: 1, height: 0,marginTop: -20, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
      <Text style={{ marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
         {item.name}
      </Text>
      </View>

      <View style={{  marginTop : 10, marginLeft : 5, }}> 
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.title)}
      </Text>
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.comment)}
      </Text>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <TouchableOpacity activeOpacity={0.11} onPress={() => likeplus(item.email, item.id, item.likecolor)}>
      <View style={{ flexDirection: 'row' }}>
        <Heart
          size={20}
          color={item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"}
          style={{ marginTop: 10, marginLeft: 10 }}
        />
        <Text
          style={{
            marginTop: 10,
            marginLeft: 10,
            color: item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"
          }}
        >
          {item.likecount}
        </Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>gogo(item.viewcount,item.id)}> 
      <ChatText size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.commentcount}
      </Text>
      <TouchableOpacity
        onPress={() => handleInputChange(item.time)}
      >
      <Eye size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.viewcount}
      </Text>
    </View>

    <View style={{width : '100%', height : 50, backgroundColor : '#FFFFFF'}}/>

      </View>
      <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop:  -30 }} />
       </TouchableOpacity>

       </SafeAreaView>
       
    );
      
  };
  
 

  const renderContent2 = () => {
    let sortedPosts = [];

    if (category === '최신순') {
      sortedPosts = [...posts]
        .filter(post => post.bancount !== 1)
        .sort((a, b) => {
          const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
          const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
          return timeB - timeA;
        });
    } else if (category === '오래된순') {
      sortedPosts = [...posts]
        .filter(post => post.bancount !== 1)
        .sort((a, b) => {
          const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
          const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
          return timeA - timeB;
        });
    }
    // Filter posts where the category is '회사생활'
    sortedPosts = sortedPosts.filter((post) => post.category === '회사생활');
  

    return (
      
      <View style={{flex: 1, marginTop: -40}}>
        <View style={{marginTop: 20, backgroundColor: '#FFFFFF'}}>
        <TouchableOpacity activeOpacity={0.11} onPress={() => {setModalVisible1(!modalVisible1)}}>
        <View style={{flexDirection : 'row' , marginLeft : 'auto', marginTop : 20}}>
          <CaretDown size={25} color={'#484848'} style={{ marginTop: -2 }} />
          <Text style={{ fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", marginRight: 17 }}>{category}</Text>
        </View>
      </TouchableOpacity>
          <FlatList 
            contentContainerStyle={{marginTop: -25}}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            data={sortedPosts}
            renderItem={renderItem2}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false} // 스크롤 비활성화
          />
        </View>
        <View style={{marginTop : 40}}></View>
        
      </View> 
    );
  };

  
  const renderItem2 = ({ item , index}) => {

  
    const gogo = async (count, id) => {
      navigation.navigate("FeedDetail",{item})
      await updateDoc(doc(db, "post", id), {
      viewcount : count + 1
      });
    };

    return (
      
      <SafeAreaView>
      <TouchableOpacity  activeOpacity={0.88} onPress={()=>gogo(item.viewcount,item.id)}> 
     
      <View style={[styles.contain]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>


      <Image
        source={
          item.category === "회사생활"
            ? require("../../../assets/feed1.png")
            : item.category === "이직커리어"
            ? require("../../../assets/feed2.png")
            : item.category === "취미"
            ? require("../../../assets/feed3.png")
            : item.category === "자유"
            ? require("../../../assets/feed4.png")
            : null // 다른 경우에 대한 처리
        }
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#e9e9e9",
          borderRadius: 20,
          marginTop: 20,
          fontWeight: "bold",
        }}
      />
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginLeft: 10, color: getCategoryColor(item.category) }}>
          {item.category}
        </Text>
        <View style={{ flex: 1, alignItems: 'flex-end'}}> 
        <Text style={{marginLeft : 'auto', marginRight : 40, color : '#b2b2b2' }}>{getTimeAgo(item.time)}</Text>
        </View>
      </View>
      </View>
      <View style={{flexDirection : 'row'}}> 
      <Text style={{ marginLeft: 10, marginLeft: 50, marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
        {item.name === userName ? "작성자" : "종사자"}
      </Text>
      <View style={{ width: 1.2, height: 15, marginTop: -16, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
      <View style={{ width: 1, height: 0,marginTop: -20, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
      <Text style={{ marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
         {item.name}
      </Text>
      </View>

      <View style={{  marginTop : 10, marginLeft : 5, }}> 
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.title)}
      </Text>
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.comment)}
      </Text>
      </View>

    


      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <TouchableOpacity activeOpacity={0.11} onPress={() => likeplus(item.email, item.id, item.likecolor)}>
      <View style={{ flexDirection: 'row' }}>
        <Heart
          size={20}
          color={item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"}
          style={{ marginTop: 10, marginLeft: 10 }}
        />
        <Text
          style={{
            marginTop: 10,
            marginLeft: 10,
            color: item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"
          }}
        >
          {item.likecount}
        </Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>gogo(item.viewcount,item.id)}> 
      <ChatText size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.commentcount}
      </Text>
      <TouchableOpacity
        onPress={() => handleInputChange(item.time)}
      >
      <Eye size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.viewcount}
      </Text>
      </View>

<View style={{width : '100%', height : 50, backgroundColor : '#FFFFFF'}}/>

  </View>
  <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop:  -30 }} />
   </TouchableOpacity>

   </SafeAreaView>
       
    );
      
  };
  

  const renderContent3 = () => {

    let sortedPosts = [];

    if (category === '최신순') {
      sortedPosts = [...posts]
        .filter(post => post.bancount !== 1)
        .sort((a, b) => {
          const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
          const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
          return timeB - timeA;
        });
    } else if (category === '오래된순') {
      sortedPosts = [...posts]
        .filter(post => post.bancount !== 1)
        .sort((a, b) => {
          const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
          const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
          return timeA - timeB;
        });
    }
    // Filter posts where the category is '회사생활'
    sortedPosts = sortedPosts.filter((post) => post.category === '이직커리어');
  
   
    return (
      
      <View style={{flex: 1, marginTop: -40}}>
        <View style={{marginTop: 20, backgroundColor: '#FFFFFF'}}>
        <TouchableOpacity activeOpacity={0.11} onPress={() => {setModalVisible1(!modalVisible1)}}>
        <View style={{flexDirection : 'row' , marginLeft : 'auto', marginTop : 20}}>
          <CaretDown size={25} color={'#484848'} style={{ marginTop: -2 }} />
          <Text style={{ fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", marginRight: 17 }}>{category}</Text>
        </View>
      </TouchableOpacity>
          <FlatList 
            contentContainerStyle={{marginTop: -25}}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            data={sortedPosts}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false} // 스크롤 비활성화
          />
        </View>
        <View style={{marginTop : 40}}></View>
        
      </View> 
    );
  };

  
  const renderItem3 = ({ item, index }) => {

  
    const gogo = async (count, id) => {
      navigation.navigate("FeedDetail",{item})
      await updateDoc(doc(db, "post", id), {
      viewcount : count + 1
      });
    };

    return (
      
      <SafeAreaView>
      <TouchableOpacity  activeOpacity={0.88} onPress={()=>gogo(item.viewcount,item.id)}> 
     
      <View style={[styles.contain]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>


      <Image
        source={
          item.category === "회사생활"
            ? require("../../../assets/feed1.png")
            : item.category === "이직커리어"
            ? require("../../../assets/feed2.png")
            : item.category === "취미"
            ? require("../../../assets/feed3.png")
            : item.category === "자유"
            ? require("../../../assets/feed4.png")
            : null // 다른 경우에 대한 처리
        }
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#e9e9e9",
          borderRadius: 20,
          marginTop: 20,
          fontWeight: "bold",
        }}
      />
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginLeft: 10, color: getCategoryColor(item.category) }}>
          {item.category}
        </Text>
        <View style={{ flex: 1, alignItems: 'flex-end'}}> 
        <Text style={{marginLeft : 'auto', marginRight : 40, color : '#b2b2b2' }}>{getTimeAgo(item.time)}</Text>
        </View>
      </View>
      </View>
      <View style={{flexDirection : 'row'}}> 
      <Text style={{ marginLeft: 10, marginLeft: 50, marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
        {item.name === userName ? "작성자" : "종사자"}
      </Text>
      <View style={{ width: 1.2, height: 15, marginTop: -16, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
      <View style={{ width: 1, height: 0,marginTop: -20, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
      <Text style={{ marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
         {item.name}
      </Text>
      </View>

      <View style={{  marginTop : 10, marginLeft : 5, }}> 
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.title)}
      </Text>
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.comment)}
      </Text>
      </View>

 


      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <TouchableOpacity activeOpacity={0.11} onPress={() => likeplus(item.email, item.id, item.likecolor)}>
      <View style={{ flexDirection: 'row' }}>
        <Heart
          size={20}
          color={item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"}
          style={{ marginTop: 10, marginLeft: 10 }}
        />
        <Text
          style={{
            marginTop: 10,
            marginLeft: 10,
            color: item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"
          }}
        >
          {item.likecount}
        </Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>gogo(item.viewcount,item.id)}> 
      <ChatText size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.commentcount}
      </Text>
      <TouchableOpacity
        onPress={() => handleInputChange(item.time)}
      >
      <Eye size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.viewcount}
      </Text>
      </View>

<View style={{width : '100%', height : 50, backgroundColor : '#FFFFFF'}}/>

  </View>
  <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop:  -30 }} />
   </TouchableOpacity>

   </SafeAreaView>
    );
      
  };
  

  const renderContent4 = () => {

    let sortedPosts = [];

    if (category === '최신순') {
      sortedPosts = [...posts]
        .filter(post => post.bancount !== 1)
        .sort((a, b) => {
          const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
          const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
          return timeB - timeA;
        });
    } else if (category === '오래된순') {
      sortedPosts = [...posts]
        .filter(post => post.bancount !== 1)
        .sort((a, b) => {
          const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
          const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
          return timeA - timeB;
        });
    }
    // Filter posts where the category is '회사생활'
    sortedPosts = sortedPosts.filter((post) => post.category === '취미');
  


    return (
      
      <View style={{flex: 1, marginTop: -40}}>
        <View style={{marginTop: 20, backgroundColor: '#FFFFFF'}}>
        <TouchableOpacity activeOpacity={0.11} onPress={() => {setModalVisible1(!modalVisible1)}}>
        <View style={{flexDirection : 'row' , marginLeft : 'auto', marginTop : 20}}>
          <CaretDown size={25} color={'#484848'} style={{ marginTop: -2 }} />
          <Text style={{ fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", marginRight: 17 }}>{category}</Text>
        </View>
      </TouchableOpacity>
          <FlatList 
            contentContainerStyle={{marginTop: -25}}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            data={sortedPosts}
            renderItem={renderItem4}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false} // 스크롤 비활성화
          />
        </View>
        <View style={{marginTop : 40}}></View>
        
      </View> 
    );
  };

  
  const renderItem4 = ({ item , index}) => {

  
    const gogo = async (count, id) => {
      navigation.navigate("FeedDetail",{item})
      await updateDoc(doc(db, "post", id), {
      viewcount : count + 1
      });
    };

    return (
      
      <SafeAreaView>
      <TouchableOpacity  activeOpacity={0.88} onPress={()=>gogo(item.viewcount,item.id)}> 
     
      <View style={[styles.contain]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>


      <Image
        source={
          item.category === "회사생활"
            ? require("../../../assets/feed1.png")
            : item.category === "이직커리어"
            ? require("../../../assets/feed2.png")
            : item.category === "취미"
            ? require("../../../assets/feed3.png")
            : item.category === "자유"
            ? require("../../../assets/feed4.png")
            : null // 다른 경우에 대한 처리
        }
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#e9e9e9",
          borderRadius: 20,
          marginTop: 20,
          fontWeight: "bold",
        }}
      />
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginLeft: 10, color: getCategoryColor(item.category) }}>
          {item.category}
        </Text>
        <View style={{ flex: 1, alignItems: 'flex-end'}}> 
        <Text style={{marginLeft : 'auto', marginRight : 40, color : '#b2b2b2' }}>{getTimeAgo(item.time)}</Text>
        </View>
      </View>
      </View>
      <View style={{flexDirection : 'row'}}> 
      <Text style={{ marginLeft: 10, marginLeft: 50, marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
        {item.name === userName ? "작성자" : "종사자"}
      </Text>
      <View style={{ width: 1.2, height: 15, marginTop: -16, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
      <View style={{ width: 1, height: 0,marginTop: -20, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
      <Text style={{ marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
         {item.name}
      </Text>
      </View>

      <View style={{  marginTop : 10, marginLeft : 5, }}> 
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.title)}
      </Text>
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.comment)}
      </Text>
      </View>

     


      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <TouchableOpacity activeOpacity={0.11} onPress={() => likeplus(item.email, item.id, item.likecolor)}>
      <View style={{ flexDirection: 'row' }}>
        <Heart
          size={20}
          color={item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"}
          style={{ marginTop: 10, marginLeft: 10 }}
        />
        <Text
          style={{
            marginTop: 10,
            marginLeft: 10,
            color: item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"
          }}
        >
          {item.likecount}
        </Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>gogo(item.viewcount,item.id)}> 
      <ChatText size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.commentcount}
      </Text>
      <TouchableOpacity
        onPress={() => handleInputChange(item.time)}
      >
     <Eye size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.viewcount}
      </Text>
      </View>

<View style={{width : '100%', height : 50, backgroundColor : '#FFFFFF'}}/>

  </View>
  <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop:  -30 }} />
   </TouchableOpacity>

   </SafeAreaView>
    );
      
  };
  



  const renderContent5 = () => {

    let sortedPosts = [];

    if (category === '최신순') {
      sortedPosts = [...posts]
        .filter(post => post.bancount !== 1)
        .sort((a, b) => {
          const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
          const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
          return timeB - timeA;
        });
    } else if (category === '오래된순') {
      sortedPosts = [...posts]
        .filter(post => post.bancount !== 1)
        .sort((a, b) => {
          const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
          const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
          return timeA - timeB;
        });
    }
    // Filter posts where the category is '회사생활'
    sortedPosts = sortedPosts.filter((post) => post.category === '자유');
  

    return (
      
      <View style={{flex: 1, marginTop: -40}}>
        <View style={{marginTop: 20, backgroundColor: '#FFFFFF'}}>
        <TouchableOpacity activeOpacity={0.11} onPress={() => {setModalVisible1(!modalVisible1)}}>
        <View style={{flexDirection : 'row' , marginLeft : 'auto', marginTop : 20}}>
          <CaretDown size={25} color={'#484848'} style={{ marginTop: -2 }} />
          <Text style={{ fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", marginRight: 17 }}>{category}</Text>
        </View>
      </TouchableOpacity>
          <FlatList 
            contentContainerStyle={{marginTop: -25}}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            data={sortedPosts}
            renderItem={renderItem5}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false} // 스크롤 비활성화
          />
        </View>
        <View style={{marginTop : 40}}></View>
        
      </View> 
    );
  };

  
  const renderItem5 = ({ item, index }) => {

  
    const gogo = async (count, id) => {
      navigation.navigate("FeedDetail",{item})
      await updateDoc(doc(db, "post", id), {
      viewcount : count + 1
      });
    };

    return (
      
      <SafeAreaView>
      <TouchableOpacity  activeOpacity={0.88} onPress={()=>gogo(item.viewcount,item.id)}> 
     
      <View style={[styles.contain]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>


      <Image
        source={
          item.category === "회사생활"
            ? require("../../../assets/feed1.png")
            : item.category === "이직커리어"
            ? require("../../../assets/feed2.png")
            : item.category === "취미"
            ? require("../../../assets/feed3.png")
            : item.category === "자유"
            ? require("../../../assets/feed4.png")
            : null // 다른 경우에 대한 처리
        }
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#e9e9e9",
          borderRadius: 20,
          marginTop: 20,
          fontWeight: "bold",
        }}
      />
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginLeft: 10, color: getCategoryColor(item.category) }}>
          {item.category}
        </Text>
        <View style={{ flex: 1, alignItems: 'flex-end'}}> 
        <Text style={{marginLeft : 'auto', marginRight : 40, color : '#b2b2b2' }}>{getTimeAgo(item.time)}</Text>
        </View>
      </View>
      </View>
      <View style={{flexDirection : 'row'}}> 
      <Text style={{ marginLeft: 10, marginLeft: 50, marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
        {item.name === userName ? "작성자" : "종사자"}
      </Text>
      <View style={{ width: 1.2, height: 15, marginTop: -16, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
      <View style={{ width: 1, height: 0,marginTop: -20, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
      <Text style={{ marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
         {item.name}
      </Text>
      </View>

      <View style={{  marginTop : 10, marginLeft : 5, }}> 
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.title)}
      </Text>
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.comment)}
      </Text>
      </View>



      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <TouchableOpacity activeOpacity={0.11} onPress={() => likeplus(item.email, item.id, item.likecolor)}>
      <View style={{ flexDirection: 'row' }}>
        <Heart
          size={20}
          color={item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"}
          style={{ marginTop: 10, marginLeft: 10 }}
        />
        <Text
          style={{
            marginTop: 10,
            marginLeft: 10,
            color: item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"
          }}
        >
          {item.likecount}
        </Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>gogo(item.viewcount,item.id)}> 
      <ChatText size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.commentcount}
      </Text>
      <TouchableOpacity activeOpacity={0.11}
        onPress={() => handleInputChange(item.time)}
      >
     <Eye size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.viewcount}
      </Text>
      </View>

<View style={{width : '100%', height : 50, backgroundColor : '#FFFFFF'}}/>

  </View>
  <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop:  -30 }} />
   </TouchableOpacity>

   </SafeAreaView>
       
    );
      
  };
  
  const getTop2PostsByViewcount = () => {
    // Sort the posts array in descending order based on viewcount
    const sortedPosts = [...posts]
    .filter(post => post.bancount !== 1) // Exclude posts with bancount equal to 1
    .sort((a, b) => b.viewcount - a.viewcount);
  
  // Take the top 2 posts
      const top2Posts = sortedPosts.slice(0, 2);
      
      return top2Posts;
  };
  
 

  const renderContent1 = () => {

    const top2Posts = getTop2PostsByViewcount();
    if (autostart) {
      return null; // 아무것도 반환하지 않음
    } else {
      return (
        <View style={{ flex: 1, marginTop: 0 , backgroundColor : '#FFFFFF'}}>
           <View style={{flexDirection : 'row'}}>
           <Text style={{ fontFamily: "Pretendard",fontWeight: '500', fontStyle: "normal", color: '#484848', fontSize: 20, marginTop: 25, marginLeft: 20 }}>{"실시간 인기글"}</Text>
           <Image source={require("../../../assets/rank2.png")} style={{width : 12, height : 20, marginTop: 30, marginLeft : 3}} />
           </View>
          <FlatList
            refreshControl={
              <RefreshControl
                contentContainerStyle={{ marginTop: 0 }}
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            data={top2Posts}
            renderItem={renderItem1}
            keyExtractor={(item) => String(item.id)}
          />
              <View style={{marginTop : marginTop1}}></View>
              
        </View>
      );
    }
  };
  
  const renderItem1 = ({ item }) => {

    const gogo = async (count, id) => {
      navigation.navigate("FeedDetail",{item})
      await updateDoc(doc(db, "post", id), {
      viewcount : count + 1
      });
    };

    return (
      <SafeAreaView>
       <TouchableOpacity activeOpacity={0.88} onPress={()=>gogo(item.viewcount,item.id)}> 
     
      <View style={[styles.contain]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row' }}>
      

      </View>
      </View>
      <View style={{  marginTop : 10, marginLeft : 5, }}> 
      <Text style={{ fontWeight : 'normal', fontStyle: "normal", color : '#484848',  fontFamily: "Pretendard"}}>
      {truncateTitle(item.title)}
      </Text>
      <Text style={{ fontWeight : 'normal', fontStyle: "normal", color : '#484848',  fontFamily: "Pretendard"}}>
      {truncateTitle(item.comment)}
      </Text>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <Text style={{ marginRight : 'auto', fontFamily: "Pretendard", fontWeight: "normal",  fontStyle: "normal", marginLeft: 5, marginTop  : 3, color: getCategoryColor(item.category) }}>
          {item.category}
        </Text>
        <TouchableOpacity activeOpacity={0.11} onPress={() => likeplus(item.email, item.id, item.likecolor)}>
      <View style={{ flexDirection: 'row' }}>
        <Heart
          size={20}
          color={item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"}
          style={{ marginTop: 10, marginLeft: 10 }}
        />
        <Text
          style={{
            marginTop: 10,
            marginLeft: 10,
            color: item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"
          }}
        >
          {item.likecount}
        </Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>gogo(item.viewcount,item.id)}> 
        <ChatText size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.commentcount}
      </Text>
      <TouchableOpacity
        onPress={() => handleInputChange(item.time)}
      >
      <Eye size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.viewcount}
      </Text>
    </View>

    <View
  style={{
    width: '130%',
    marginLeft: '-20%',
    height: 10,
    backgroundColor: '#FFFFFF',
  }}
>
<View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 15 }} />
</View>
      
      </View>

       </TouchableOpacity>
       
       </SafeAreaView>
    );
  };

  const scrollViewRef = useRef(null);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  useEffect(() => {
    // 3초 후에 isLoading 상태를 false로 업데이트하여 로딩 화면을 벗어납니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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
    <SafeAreaView>
    <StatusBar translucent={true} backgroundColor={'transparent'} />

 <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 21, marginLeft: 10 }}>
   <TouchableOpacity activeOpacity={0.11} onPress={() => goalarm()}  style={{ marginRight: 'auto', marginLeft: 10 }}>
     {notificationReceived ? (
       <View style={{marginTop :-10}}>
       <Bell size={25} color={'#484848'} style={{ marginTop: 0 }} />
       <View style={{width : 10, height : 10, backgroundColor : '#e61e1e' , borderRadius : 20, marginLeft : 15, marginTop : -27}}></View>
       </View>
     ) : (
       <Bell size={25} color={'#484848'} style={{ marginTop: 0 }} />
     )}
   </TouchableOpacity>
   <Text style={{ fontSize: 20, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal" }}>{"토크"}</Text>
   <TouchableOpacity activeOpacity={0.11} onPress={() => navigation.navigate("SearchHistory")} style={{ marginLeft: 'auto', marginRight: 20 }}>
   <Image source={require("../../../assets/search.png")} style={{width : 20, height : 20, color: '#484848'}} />
   </TouchableOpacity>
 </View>
   <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10 }} />

   <View style={{ backgroundColor: "#F5F5F5", width: '100%', height: '100%', marginTop: 0 }}>
    
     {renderContent1()}
 
     <ScrollView
       horizontal 
       showsHorizontalScrollIndicator={false}
       style={{marginTop : 10}}
     >
       {['전체', '회사생활', '이직커리어', '취미', '자유'].map((tabName, index) => (
         <TouchableOpacity activeOpacity={0.11}
           key={index}
           onPress={() => handleTabPress(tabName)}
           style={{
             shadowColor: '#000',
           shadowOffset: {
             width: 0,
             height: 6,
           },
           shadowOpacity: 0.2, // 그림자 투명도
           shadowRadius: 4, // 그림자의 둥글기 정도
           elevation: 5, // 안드로이드에서 그림자를 주기 위한 속성
             width: tabName === '전체' || tabName === '취미' || tabName === '자유' ? 70 : 88, 
             height: 40,
             backgroundColor: activeTab === tabName ? '#484848' : '#FFFFFF',
             borderRadius: 34,
             alignItems: 'center',
             justifyContent: 'center',
             marginLeft: 10,
           }}
         >
           <Text style={{ fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal",color: activeTab === tabName ? '#FFFFFF' : '#484848', fontSize: 14 }}>{tabName}</Text>
         </TouchableOpacity>
       ))}
     </ScrollView>
 
   <View
     style={{
       width: '100%',
       height: 30,
       backgroundColor: '#FFFFFF',
       marginTop: -8,
       shadowColor: 'rgba(0, 0, 0, 1)', // 진한 그림자 색상
       shadowOffset: { width: 0, height: 4 }, // 그림자 오프셋 (수평, 수직)
       shadowOpacity: 1, // 그림자 불투명도 (1로 설정하여 진하게)
       shadowRadius: 2, // 그림자 반경 (더 큰 값으로 설정하여 넓힘)
     }}
   >
   </View>
     
     {activeTab === '전체' && renderContent()}
     {activeTab === '회사생활' && renderContent2()}
     {activeTab === '이직커리어' && renderContent3()}
     {activeTab === '취미' && renderContent4()}
     {activeTab === '자유' && renderContent5()}
   </View>
   
 
   <Modal
   animationType="slide"
   transparent={true}
   visible={modalVisible}
   onRequestClose={() => setModalVisible(false)}
 >
  <StatusBar
 translucent={true}
 backgroundColor="rgba(0, 0, 0, 0.0)" // 반투명 배경색
/>
 <View style={styles.modalContainer}>
 <TouchableOpacity activeOpacity={0.11} onPress={()=>navigation.navigate("SignIn")}>
     <Image
       source={require("../../../assets/warning1.gif")}
       style={styles.modalImage}
     />
     <Text style={{fontSize : 20, fontFamily: "Pretendard",}}>{"이메일을 인증해주세요."}</Text>
     </TouchableOpacity>
 </View>

 </Modal>


 </ScrollView>

 <TouchableOpacity activeOpacity={0.11} onPress={() => navigation.navigate("Feedback")} style={[styles.menuIcon1]}>
 <Image source={require("../../../assets/writeicon.png")} style={{ width : 48, height : 48}} />
 </TouchableOpacity>
 <TouchableOpacity activeOpacity={0.11} onPress={() => scrollToTop()} style={[styles.menuIcon]}>
 <Image source={require("../../../assets/upicon.png")} style={{ width : 48, height : 48}} />
 </TouchableOpacity>


<Modal
 animationType="fade"
 transparent={true}
 visible={modalVisible1}
 onRequestClose={() => {
   setModalVisible1(!modalVisible1);
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
        
       <TouchableOpacity activeOpacity={0.11}  onPress={() => {
         setCategory("최신순");
         setModalVisible1(!modalVisible1);
       }}>
         <Text style={styles.modalSectionTitle}>{"최신순"}</Text>
         </TouchableOpacity>
         <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10, width : '80%' , marginLeft : '10%' }} />
         <TouchableOpacity activeOpacity={0.11} onPress={() => {
           setCategory("오래된순");
           setModalVisible1(!modalVisible1);
         }}>
         <Text style={styles.modalSectionTitle1}>{"오래된순"}</Text>
         </TouchableOpacity>
      
       </View>
     

       <TouchableOpacity activeOpacity={0.11} style={styles.confirmButton} onPress={() => {setModalVisible1(!modalVisible1)}}>
         <Text style={styles.confirmButtonText}>{"취소"}</Text>
       </TouchableOpacity>
     </View>
   </View>
 </View>
</Modal>


</SafeAreaView>
  );
})



