import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  Animated,
  Alert,
  Dimensions,
  ToastAndroid,
  Linking,
  ActivityIndicator,
  Modal,
  StatusBar
} from 'react-native';
import {BaseStyle, useTheme, BaseColor} from '@config';
import {SafeAreaView, Text, Image, Icon, TextInput} from '@components';
import styles from './styles';
import {CaretLeft, CaretDown, DotsThree, Question, BookmarkSimple, ThumbsUp} from 'phosphor-react-native';

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
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  increment
} from "firebase/firestore";

import * as Utils from '@utils';
import { getAuth, signOut } from 'firebase/auth';
const deltaY = new Animated.Value(0);
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export default function Wishlsit1({navigation, route}) {
  const width = Dimensions.get('window').width;
  const item = route.params.item;
  const item2 = route.params.item;
  const id = route.params.item.id;
  const {colors} = useTheme();
  const auth = getAuth();
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(220);
  const marginTopBanner = heightImageBanner - heightHeader + 10;
  const [modalVisible, setModalVisible] = useState(true);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [content, setContent] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const db = getFirestore();
  const colGroupRef = collectionGroup(db, item.company);
  const q = query(colGroupRef);
  const [posts, setPosts] = useState([]);
  const citiesRef = collection(db, "User");
  const [posts3, setPosts3] = useState([]);
  const [category, setCategory] = useState('최신순');
  const componentMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [autostart, setAutostate] = useState();
  const [activeTab, setActiveTab] = useState('평균연봉');
  const [iconColor, setIconColor] = useState('#b2b2b2'); 
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const q2= query(citiesRef, where("email", "==", auth.currentUser.email));
  const moment = require('moment');
  const currentTime = moment();
  const [edit, setedit] = useState(false);
  const [change, setchange] = useState('');


  useEffect(() => {
     console.log(posts.length)
  }, []); // item이 변경될 때마다 useEffect 실행

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




  useEffect(() => {
    console.log(route)
    const unsubscribe = onSnapshot(q2, (snapshot) => {
      if (snapshot.size > 0) {
        const userData = snapshot.docs[0].data();
        setPosts3(userData.post || []);
        setUserName(userData.id || "");
      }
    });

    return () => {
      unsubscribe(); // 클린업 함수에서 구독 해제
    };
  }, []);


  const toggleIconColor = async () => {
    
        onBookmarkClick(); // 북마크 추가 함수 호출
     
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

  const data = {
    labels: ['2020년', '2021년', '2022년'],
    datasets: [
      {
        data: [item.year1, item.year2, item.year3],
        color: (opacity, index) => {
          // 첫 번째와 세 번째 데이터 포인트일 때만 색상을 변경
          if (index === 0 || index === 1) {
            return '#b2b2b2'; // #b2b2b2
          }
       
        },
     
      },
    ],
  };
  
  const data1 = {
    labels: ['2020년', '2021년', '2022년'],
    datasets: [
      {
        data: [item.year1 / 12, item.year2 / 12, item.year3 / 12],
        color: (opacity, index) => {
          // 첫 번째와 세 번째 데이터 포인트일 때만 색상을 변경
          if (index === 0 || index === 1) {
            return '#b2b2b2'; // #b2b2b2
          }
        },
        strokeWidth: 2, // Line width
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff', // Background gradient start color
    backgroundGradientTo: '#ffffff', // Background gradient end color
    decimalPlaces: 0, // No decimal places for values
    color: (opacity, index) => {
      if (index === 0 || index === 2) {
        return '#ff5733'; // 첫 번째와 세 번째 "bar"의 색상을 변경
      }
      return '#b2b2b2'; // 나머지 "bar"의 색상
    },
    barRadius: 16, // 바를 둥글게 만드는 속성 추가
    

    propsForLabels: {
      fontSize: 13, // Label font size
    },
    formatYLabel: (value) => {
      if (value >= 100000000) {
        return '1억 이상';
      } else {
        return `${value / 10000}만원`;
      }
    },
    min: 20000000, // 세로 기준점을 설정 (2000만원)
  };

  const [isBookmarkLoaded, setBookmarkLoaded] = useState(false); // 북마크 로딩 상태 변수
  const data3 = [50, 80, 60, 90, 70]; // 예시 데이터
  useEffect(() => {
    // 여기에서 초기 북마크 상태를 가져오는 로직을 작성
    const fetchInitialBookmarkStatus = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('사용자가 인증되지 않았습니다.');
          return;
        }

        // 사용자의 이메일을 사용하여 해당 사용자를 찾음
        const userQuerySnapshot = await getDocs(q2);

        if (userQuerySnapshot.docs.length > 0) {
          const userDoc = userQuerySnapshot.docs[0];
          const userDocData = userDoc.data();
          const bookmarks = userDocData.bookmark || [];

          // 이미 북마크에 추가된 게시물인지 확인
          if (bookmarks.includes(item.id)) {
            // 북마크가 이미 추가된 경우 색상을 변경
            setIconColor('#4a5cfc');
          }

          // 북마크 로딩이 완료되었음을 표시
          setBookmarkLoaded(true);
        } else {
          console.error('사용자를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('북마크 로딩 중 오류 발생:', error);
      }
    };

    // 초기 북마크 상태 가져오기
    fetchInitialBookmarkStatus();
  }, []); // 빈 배열은 컴포넌트가 처음 렌더링될 때만 실행
  
  const onBookmarkClick = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('사용자가 인증되지 않았습니다.');
        return;
      }
      
      // 사용자의 이메일을 사용하여 해당 사용자를 찾음
      const userQuerySnapshot = await getDocs(q2);
  
      if (userQuerySnapshot.docs.length > 0) {
        const userDoc = userQuerySnapshot.docs[0];
        const userId = userDoc.id;
  
        // 사용자의 'bookmark' 필드 가져오기
        const userDocData = userDoc.data();
        const bookmarks = userDocData.bookmark || [];
  
        // 이미 북마크에 추가된 게시물인지 확인
        if (bookmarks.includes(item.id)) {
     
          const updatedBookmarks = bookmarks.filter(item => item !== id);

          // 사용자의 'bookmark' 필드를 업데이트하여 게시물을 제거
          await updateDoc(doc(db, 'User', userId), {
            bookmark: updatedBookmarks,
          });
        
          ToastAndroid.show('북마크에서 제거되었습니다.', ToastAndroid.SHORT);
          setIconColor('#b2b2b2');
        } else {
          // 사용자의 'bookmark' 필드에 현재 게시물 ID를 추가
          await updateDoc(doc(db, 'User', userId), {
            bookmark: arrayUnion(item.id), // item.id는 현재 게시물의 ID입니다.
          });
  
          ToastAndroid.show('북마크에 추가되었습니다.', ToastAndroid.SHORT);
          setIconColor('#4a5cfc');
        }
      } else {
        console.error('사용자를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('북마크 추가 중 오류 발생:', error);
    }
  };

  
  useEffect(() => {
    console.log(posts)
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



  
    // 스크롤뷰를 맨 아래로 스크롤하는 함수
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }

  };
  const scrollToBottom1 = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: 200, // 원하는 높이 (예: 300)
        animated: true,
      });
    }
  };

  const scrollToBottom3 = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: 500, // 원하는 높이 (예: 300)
        animated: true,
      });
    }
  };
  const scrollToBottom4 = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: 0, // 원하는 높이 (예: 300)
        animated: true,
      });
    }
  };


  const handleTabPress = (tabName) => {
    setActiveTab(tabName);

    if(tabName == '평균연봉'){
      scrollToBottom4();
    }
    if(tabName == '연도별연봉'){
      scrollToBottom1();
    }
    if(tabName == '월평균급여'){
      scrollToBottom3();
    }
    if(tabName == '정보 Talk'){
      scrollToBottom();
    }
  };


  // Firebase onSnapshot 대신에 데이터를 가져오는 함수를 사용하고 해당 함수를 async 함수로 정의합니다.
  const getSnapshot = async (filter) => {
    return new Promise((resolve, reject) => {
      onSnapshot(filter, (snapshot) => {
        resolve(snapshot);
      }, (error) => {
        reject(error);
      });
    });
  };

  const createKakaoLink = () => {
    setModalVisible1(false)
    Linking.openURL(
      'https://pf.kakao.com/_xfLxcIG'
    );
  };


  const likeplus = async (likecount, postId, currentLikeColor) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("사용자가 인증되지 않았습니다.");
        // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
        return;
      }
  
      const postDocRef = doc(db, item2.company,  postId);
  
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
      console.log(customDateTimeString);
  
      // 이미 좋아요를 누른 경우 좋아요 취소
      if (likedBy.includes(userName)) {
        await updateDoc(postDocRef, {
          likecount: increment(-1),
          likedBy: arrayRemove(userName), // 사용자 UID를 "likedBy" 배열에서 제거
        });
        console.log("좋아요 취소 완료");
        // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
      } else {
        // 아직 좋아요를 누르지 않은 경우 좋아요 추가
        await updateDoc(postDocRef, {
          likecount: increment(1),
          likedBy: arrayUnion(userName), // 사용자 UID를 "likedBy" 배열에 추가
        });
        console.log("좋아요 추가 완료");
        // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
      }
    } catch (error) {
      console.error("좋아요 업데이트 중 오류 발생:", error);
      // 오류 메시지를 사용자에게 표시 (예: 모달 또는 토스트 메시지)
    }
  };


  const scrollTodowm = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };


  
  const onRefresh = () => {
    setRefreshing(true);
  };

  const commentplus = async (count, id) => {
   
    await updateDoc(doc(db, "post", id), {
      commentcount : count + 1
    });
  }

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



const deletePost1 = async (postId) => {
  try {
    // Firestore에서 문서 삭제
    await deleteDoc(doc(db, item2.company, postId));
    // posts2 배열에서도 삭제

    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    ToastAndroid.show('댓글이 삭제되었습니다.', ToastAndroid.SHORT);
  } catch (error) {
    console.error('Error deleting document: ', error);
  }
};





  const onSubmit = async (count, id) => {
    if (content != '') {
      try {
        const docRef = await addDoc(collection(db,item.company), {
          reply: content,
          name: userName,
          likecount: 0,
          likecolor: false,
          time: currentTime.format('YYYY-MM-DD HH:mm'),
          bancount: 0
        });
  
        // 댓글 작성 후 처리
        setContent(null);
        ToastAndroid.show('댓글이 작성되었습니다.', ToastAndroid.SHORT);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    } else if (content == '') {
      ToastAndroid.show('댓글을 작성해주세요.', ToastAndroid.SHORT);
    }
  };


  const updatePost1 = async () => {
    if (content != '') {
    
    try {
      // Firestore에서 문서 업데이트
      await updateDoc(doc(db, item.company, change), {
        reply: content, // 'reply' 필드를 업데이트
      });
  
      // posts2 배열에서도 업데이트 (선택사항)
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === change) {
            return { ...post, reply: content }; // 'reply' 필드를 업데이트
          }
          return post;
        })
      );
      console.log("적용완료");
      setContent(null);
      ToastAndroid.show('댓글이 수정 되었습니다.', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error updating document: ', error);
    }

  } else if (content == '') {
    ToastAndroid.show('수정글을 작성해주세요.', ToastAndroid.SHORT);
  }
    
  };
  

  
  const renderContent1 = () => {
    
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

    if (sortedPosts.length === 0) {
      return (
        <View style={{ width: '100%', height: 300 }} />
      );
    }

    return (
      <View style={{ flex: 1, marginTop: 0 }}>
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
          data={sortedPosts}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
        />
      </View>
    );
  
};



const renderItem = ({ item }) => {

  const gogotest = () => {
    setchange(item.id)
    setContent(item.reply)
    setModalVisible3(!modalVisible3)

  }

  const gogotest1 = () => {
    setchange(item.id)
    setModalVisible4(!modalVisible4)

  }

  return (
    <>
    <View style={{flex : 1, marginTop : 15}}>
      
      <View style={{flexDirection: 'row', marginTop: 0, marginLeft : 20}}>
      <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848"}}>{userName === item.name ? "작성자" : "종사자"}</Text>
        <View style={{ width: 1.2, height: 15, marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <View style={{ width: 1, height: 0,marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848"}}>{item.name}</Text>
      <View style={{ marginLeft: 'auto', marginRight: 10,}}> 

      {userName === item.name ? (
        <TouchableOpacity activeOpacity={0.11} onPress={() => {gogotest()}} style={{ marginRight: 23, }}>
                <DotsThree  size={35} color={'#b2b2b2'} style={{ marginTop : -2, }}/>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity activeOpacity={0.11} onPress={() => {gogotest1()}} style={{marginRight: 23, }}>
                 <DotsThree  size={35} color={'#b2b2b2'} style={{ marginTop : -2,}}/>
        </TouchableOpacity>
      )}
      </View>
      </View>
      <Text style={{fontSize : 14, marginTop : 10, marginLeft : 20,  color : '#484848', fontFamily: "Pretendard", fontWeight: "500",  fontStyle: "normal",}}>
      {item.reply} 
      </Text>
      <View style={{flexDirection: 'row', marginLeft : 10}}>
      <Text style={{marginTop : 10, marginLeft : 10, color : '#b2b2b2'}}>
      {getTimeAgo(item.time)} 
      </Text>
      <TouchableOpacity  activeOpacity={0.11} onPress={() => likeplus(item.likecount, item.id, item.likecolor)}>
      <View style={{flexDirection: 'row', }}>
      <ThumbsUp size={20} color={item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"}  style={{ marginTop: 12, marginLeft: 10 }}/>
      <Text style={{
        marginTop: 10,
        color: item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2",
        marginLeft: 5,
        fontFamily: "Pretendard",
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
      }}>
        {"좋아요"} 
      </Text>
      <Text style={{
        marginTop: 10,
        color: item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2",
        marginLeft: 5,
        fontFamily: "Pretendard",
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
      }}>
        {item.likecount} 
      </Text>
      </View>
      </TouchableOpacity>
      </View>
     </View>
     <View style={{ borderBottomColor: 'lightgray', borderBottomWidth: 0.3, marginTop : 20}}/>

     </>
  );
}

 

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
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
   
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginLeft: 10 }}>
        <TouchableOpacity activeOpacity={0.11} onPress={()=>navigation.goBack()} style={{ marginRight: 'auto', marginLeft: 10 }}>
         <CaretLeft  size={27} color={'#484848'} style={{marginLeft : 1, marginTop : 1}} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal" }}>{item.company}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.11} onPress={toggleIconColor}>
        <View style={{marginRight : 20}}>
        <BookmarkSimple  size={27} color={iconColor} style={{marginLeft : 1, marginTop : 1}} />
        </View>
      </TouchableOpacity>
      </View>
        <View style={{ borderBottomColor: 'lightgray', borderBottomWidth: 0.5, marginTop: 20 }} />
        <View style={{  alignItems: 'center'}}>
        <Text style={{ fontSize: 21, marginTop : 20,  fontFamily: "Pretendard", fontWeight: "bold", fontStyle: "normal" }}>{item.company}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, marginLeft: 0, fontWeight: "500", fontFamily: "Pretendard", fontSize : 14 }}>
          <Text>{item.category}</Text>
          <View style={{ width: 1.2, height: 15, marginTop: 0, backgroundColor: '#B2B2B2' , marginLeft : 12 }} />
           <View style={{ width: 1, height: 0,marginTop: -20, backgroundColor: '#B2B2B2' , marginLeft : 12 }} />
          <Text>{item.address1}</Text>
          <Text>{', '}</Text>
          <Text>{item.address2}</Text>
        </View>
  
          <ScrollView
              showsVerticalScrollIndicator={false}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            >
              {['평균연봉', '연도별연봉', '월평균급여', '정보 Talk'].map((tabName, index) => (
                <TouchableOpacity activeOpacity={0.11}
                  key={index}
                  onPress={() => handleTabPress(tabName)}
                  style={{
                
                    width: 88, // 최대 너비 선택
                    height: 40,
                    backgroundColor: activeTab === tabName ? '#4a5cfc' : '#FFFFFF',
                    borderRadius: 34,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 8,
                    marginTop : 15,
                    marginBottom : 30,
                    borderColor: '#e9e9e9', // 테두리 색상
                    borderWidth: activeTab !== tabName ? 1 : 0, // 테두리 두께 (눌리지 않았을 때만 표시)
                  }}e9e9e9
                >
                  <Text style={{ fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal",color: activeTab === tabName ? '#FFFFFF' : '#b2b2b2', fontSize: 14 }}>{tabName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          
    

         <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 1, marginTop: 20 , elevation: 2 }} />
         <ScrollView ref={scrollViewRef}>
         <View style={{alignItems: 'flex-end', marginRight : 30, marginTop : 20, flexDirection : 'row', marginLeft : 'auto'}}>
          <Question  size={19} color={'#b2b2b2'} style={{ marginTop : 2}}/>
          <Text style={{color : '#b2b2b2', fontFamily: "Pretendard",fontStyle: "normal", fontWeight: "500",fontWeight: "500",  fontSize: 13, marginLeft : 1}}>{"2022년 02월 기준 : 전자공시시스템"}</Text>
         </View> 
         <Text style={{marginTop : 15, marginLeft :15, color : '#484848', fontWeight: "500", fontSize : 17, fontFamily: "Pretendard",}}>{"평균연봉"}</Text>
        
         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, marginLeft: 0, fontWeight: "500", fontFamily: "Pretendard", fontSize : 14 }}>
          <Text style={{color : '#4a5cfc',  fontFamily: "Pretendard", fontSize : 31,fontWeight: "bold", }}>{formatValue(item.value)}</Text>
          <Text style={{color : '#484848',  fontFamily: "Pretendard", fontSize : 20,fontWeight: "600", marginTop : 2}}>{' 만원'}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 0, marginLeft: 0, fontWeight: "500", fontFamily: "Pretendard", fontSize : 14 }}>
          <Text style={{color : '#484848',  fontFamily: "Pretendard", fontSize : 18,fontWeight: "600", }}>{"제약바이오 업계 연봉"}</Text>
          <Text style={{color : '#4a5cfc',  fontFamily: "Pretendard", fontSize : 18,fontWeight: "600", marginTop : 2}}>{' 상위 1%'}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 0, marginLeft: 0, fontWeight: "500", fontFamily: "Pretendard", fontSize : 14 }}>
        <Text style={{color : '#484848',  fontFamily: "Pretendard", fontSize : 18,fontWeight: "600", }}>{"업계 대비"}</Text>
          <Text style={{color : '#4a5cfc',  fontFamily: "Pretendard", fontSize : 18,fontWeight: "600", marginTop : 2}}>{' 117.7%높음'}</Text>
        </View>
    
        <View style={{ marginLeft : '10%'}}>
        <View style={{ flexDirection: 'row',  marginTop: 0, marginLeft: 0, fontWeight: "500", fontFamily: "Pretendard", fontSize : 14 }}>
        <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard", fontSize : 13,fontWeight: "600", }}>{"최저"}</Text>
        </View>
        </View>
        <View style={{ marginLeft : 'auto', marginRight : '10%', marginTop : -25}}>
        <View style={{ flexDirection: 'row',  marginTop: 0, marginLeft: 0, fontWeight: "500", fontFamily: "Pretendard", fontSize : 14 }}>
          <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard", fontSize : 13,fontWeight: "600", marginTop : 3 }}>{"최고"}</Text>
          </View>
        </View>

         <View style={{width : '80%',  height : 30 , backgroundColor : '#f5f5f5', marginTop : 5 ,borderRadius: 31, marginLeft : '10%'}}>
         <Image source={require("../../../assets/circle.png")} style={{width : 30, height : 30, marginTop : 1, color: '#484848'}} />
         <View style={{marginLeft : 'auto', marginTop : -30}}>
         <Image source={require("../../../assets/circle.png")} style={{width : 30, height : 30, color: '#484848'}} />
         </View>
         </View>

       
        <View style={{ marginLeft : '10%'}}>
        <View style={{ flexDirection: 'row',  marginTop: 0, marginLeft: 0, fontWeight: "500", fontFamily: "Pretendard", fontSize : 14 }}>
        <Text style={{color : '#484848',  fontFamily: "Pretendard", fontSize : 18,fontWeight: "600", }}>{formatValue(item.minvalue)}</Text>
        <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard", fontSize : 13,fontWeight: "600", marginTop : 4}}>{"만원"}</Text>
        </View>
        </View>
        <View style={{ marginLeft : 'auto', marginRight : '10%', marginTop : -25}}>
        <View style={{ flexDirection: 'row',  marginTop: 0, marginLeft: 0, fontWeight: "500", fontFamily: "Pretendard", fontSize : 14 }}>
          <Text style={{color : '#484848',  fontFamily: "Pretendard", fontSize : 18,fontWeight: "600", }}>{formatValue(item.topvalue)}</Text>
          <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard", fontSize : 13,fontWeight: "600", marginTop : 4}}>{"만원"}</Text>
          </View>
        </View>

        <View style={{width: '100%', height : 550, backgroundColor : '#f6f7ff', marginTop : 30}}>

        <Text style={{color : '#484848',  fontFamily: "Pretendard", fontSize : 17, marginTop : 20, marginLeft :20}}>{"연도별연봉"}</Text>

        <View style={{ 
          width: '85%', 
          height: '33%', 
          backgroundColor: '#FFFFFF', 
          marginTop: 10, 
          marginLeft: '7.5%', 
          borderRadius: 12,
          elevation: 3, // elevation 값을 조절하여 그림자 효과를 조절할 수 있습니다.
          shadowOffset: { width: 0, height: 2 }
        }}>
                
   
       
  
        <View style={{ flexDirection: 'row' }}>
 

        <View style= {{ marginTop : 10, marginLeft : 25, marginTop : 25,}}>
           <View style={{flexDirection : 'row'}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft :12}}>{"1억"}</Text>
           <View style={{width : 220,  height : 1 , backgroundColor : '#e9e9e9', marginTop : 10 ,borderRadius: 31, marginLeft : '10%'}}></View>
          </View>

          <View style={{flexDirection : 'row'}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",}}>{"8000"}</Text>
           <View style={{width : 220,  height : 1 , backgroundColor : '#e9e9e9', marginTop : 10 ,borderRadius: 31, marginLeft : '10%'}}></View>
           </View>
           <View style={{flexDirection : 'row'}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",}}>{"6000"}</Text>
           <View style={{width : 220,  height : 1 , backgroundColor : '#e9e9e9', marginTop : 10 ,borderRadius: 31, marginLeft : '10%'}}></View>
           </View>
           <View style={{flexDirection : 'row'}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",}}>{"4000"}</Text>
           <View style={{width : 220,  height : 1 , backgroundColor : '#e9e9e9', marginTop : 10 ,borderRadius: 31, marginLeft : '10%'}}></View>
           </View>
           <View style={{flexDirection : 'row'}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",}}>{"2000"}</Text>
           <View style={{width : 220,  height : 1 , backgroundColor : '#e9e9e9', marginTop : 10 ,borderRadius: 31, marginLeft : '10%'}}></View>
           </View>
           <View style={{flexDirection : 'row'}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard", marginLeft :8}}>{"만원"}</Text>
           <View style={{width : 220,  height : 1 , backgroundColor : '#e9e9e9', marginTop : 10 ,borderRadius: 31, marginLeft : '10%'}}></View>
           </View>
           <View style={{flexDirection : 'row', marginTop : -120}}>
           <Text style={{color : '#484848',  fontFamily: "Pretendard",marginLeft : 70, marginTop : -5}}>{formatValue(Math.floor(item.year1 * 0.95))}</Text>
           <Text style={{color : '#484848',  fontFamily: "Pretendard",marginLeft : 20,  marginTop : -7}}>{formatValue(Math.floor(item.year1))}</Text>
           <Text style={{color : '#484848',  fontFamily: "Pretendard",marginLeft : 25 , marginTop: formatValue(Math.floor(item.year2)) > formatValue(Math.floor(item.year1)) ? -9 : -3}}>{formatValue(Math.floor(item.year2))}</Text>
           <Text style={{color : '#4a5cfc',  fontFamily: "Pretendard",marginLeft : 22, marginTop: formatValue(Math.floor(item.year2)) > formatValue(Math.floor(item.year3)) ? -1: -11}}>{formatValue(Math.floor(item.year3))}</Text>
           </View>
           <View style={{flexDirection : 'row', marginTop :95}}>
           <View style={{width : 25, height : item.year1/100, marginTop : -(item.year1/90 ), backgroundColor : '#e9e9e9', borderRadius : 16, marginLeft : 75}}></View>
           <View style={{width : 25, height : item.year1/100, marginTop : -(item.year1/90 ),backgroundColor : '#e9e9e9',borderRadius : 16,marginLeft : 35}}></View>
           <View style={{width : 25, height : item.year2/100, marginTop : -(item.year2/90 ), backgroundColor : '#e9e9e9', borderRadius : 16,marginLeft : 36}}></View>
           <View style={{width : 25, height : item.year3/100, marginTop : -(item.year3/90 ), backgroundColor : '#4a5cfc', borderRadius : 16,marginLeft : 37}}></View>
           </View>
           <View style={{flexDirection : 'row', marginTop : 0}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft : 65}}>{"2019년"}</Text>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft : 12}}>{"2020년"}</Text>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft : 12}}>{"2021년"}</Text>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft : 12}}>{"2022년"}</Text>
           </View>
        </View>



        </View>
  
        </View>
          


        <Text style={{color : '#484848',  fontFamily: "Pretendard", fontSize : 17, marginTop : 20, marginLeft :20}}>{"월평균급여"}</Text>
        <View style={{ width : '85%', height : '33%', backgroundColor : '#FFFFFF', marginTop : 10, marginLeft : '7.5%', borderRadius : 12,elevation: 3,  shadowOffset: { width: 0, height: 2 }, }}>
        
   
    
  
        <View style={{ flexDirection: 'row' }}>
        <View style= {{ marginTop : 10, marginLeft : 25, marginTop : 30,}}>
           <View style={{flexDirection : 'row'}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft :0}}>{"1000"}</Text>
           <View style={{width : 220,  height : 1 , backgroundColor : '#e9e9e9', marginTop : 10 ,borderRadius: 31, marginLeft : '10%'}}></View>
          </View>

          <View style={{flexDirection : 'row'}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft : 8}}>{"800"}</Text>
           <View style={{width : 220,  height : 1 , backgroundColor : '#e9e9e9', marginTop : 10 ,borderRadius: 31, marginLeft : '10%'}}></View>
           </View>
           <View style={{flexDirection : 'row'}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft : 8}}>{"600"}</Text>
           <View style={{width : 220,  height : 1 , backgroundColor : '#e9e9e9', marginTop : 10 ,borderRadius: 31, marginLeft : '10%'}}></View>
           </View>
           <View style={{flexDirection : 'row'}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft : 8}}>{"400"}</Text>
           <View style={{width : 220,  height : 1 , backgroundColor : '#e9e9e9', marginTop : 10 ,borderRadius: 31, marginLeft : '10%'}}></View>
           </View>
           <View style={{flexDirection : 'row'}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft : 8}}>{"200"}</Text>
           <View style={{width : 220,  height : 1 , backgroundColor : '#e9e9e9', marginTop : 10 ,borderRadius: 31, marginLeft : '10%'}}></View>
           </View>
           <View style={{flexDirection : 'row'}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard", marginLeft :8}}>{"만원"}</Text>
           <View style={{width : 220,  height : 1 , backgroundColor : '#e9e9e9', marginTop : 10 ,borderRadius: 31, marginLeft : '10%'}}></View>
           </View>
           <View style={{flexDirection : 'row', marginTop : -120}}>
           <Text style={{color : '#484848',  fontFamily: "Pretendard",marginLeft : 70, marginTop : -5}}>{formatValue(Math.floor(item.year1 * 0.95/10))}</Text>
           <Text style={{color : '#484848',  fontFamily: "Pretendard",marginLeft : 40,  marginTop : -7}}>{formatValue(Math.floor(item.year1/10))}</Text>
           <Text style={{color : '#484848',  fontFamily: "Pretendard",marginLeft : 40 , marginTop: formatValue(Math.floor(item.year2)) > formatValue(Math.floor(item.year1)) ? -9 : -3}}>{formatValue(Math.floor(item.year2/10))}</Text>
           <Text style={{color : '#4a5cfc',  fontFamily: "Pretendard",marginLeft : 30, marginTop: formatValue(Math.floor(item.year2)) > formatValue(Math.floor(item.year3)) ? -1: -11}}>{formatValue(Math.floor(item.year3/10))}</Text>
           </View>
           <View style={{flexDirection : 'row', marginTop :95}}>
           <View style={{width : 25, height : item.year1/100, marginTop : -(item.year1/90 ), backgroundColor : '#e9e9e9', borderRadius : 16, marginLeft : 75}}></View>
           <View style={{width : 25, height : item.year1/100, marginTop : -(item.year1/90 ),backgroundColor : '#e9e9e9',borderRadius : 16,marginLeft : 35}}></View>
           <View style={{width : 25, height : item.year2/100, marginTop : -(item.year2/90 ), backgroundColor : '#e9e9e9', borderRadius : 16,marginLeft : 36}}></View>
           <View style={{width : 25, height : item.year3/100, marginTop : -(item.year3/90 ), backgroundColor : '#4a5cfc', borderRadius : 16,marginLeft : 37}}></View>
           </View>
           <View style={{flexDirection : 'row', marginTop : 0}}>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft : 65}}>{"2019년"}</Text>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft : 12}}>{"2020년"}</Text>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft : 12}}>{"2021년"}</Text>
           <Text style={{color : '#b2b2b2',  fontFamily: "Pretendard",marginLeft : 12}}>{"2022년"}</Text>
           </View>
        </View>
        </View>
  
        </View>
        
    
         
        </View>


      <View style={{flexDirection : 'row' }}>
      <View style={{flexDirection : 'row', marginTop : 15, marginLeft : 20}}>
      <Text style={{ color: '#484848', fontSize: 15, fontFamily: 'Pretendard', fontWeight: 'bold', fontStyle: 'normal' }}>
      {"댓글 "}{posts.length - posts.filter(post => post.bancount === 1).length}
        </Text>
     </View>
      <View style={{marginLeft : 'auto'}}>
      <TouchableOpacity activeOpacity={0.11} onPress={() => setModalVisible1(!modalVisible1)}>
      <View style={{flexDirection : 'row', marginTop : 15, marginLeft : 'auto', marginRight : 20}}>
      <CaretDown  size={25} color={'#484848'} style={{ marginTop : -2, marginLeft : 0}}/>
      <Text style={{fontWeight: "500",fontSize: 15, fontFamily: "Pretendard",  fontStyle: "normal", }}>{" "}{category}</Text>
      </View>
      </TouchableOpacity>
      </View>
    
      </View>

      <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.7, marginTop : 15, marginLeft : -30}}/>
      <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef}>
     
            {renderContent1()}
    
      </ScrollView>
  
      <View style={{ borderBottomColor: 'lightgray', borderBottomWidth: 0.7, marginBottom : 10}}/>
      <TextInput
        placeholder={edit ? '수정글을 남겨주세요' : '댓글을 남겨주세요'}
        value={content}
        style={{width : '90%', borderRadius : 9, marginLeft : '5%', marginBottom : 10}}
        onChangeText={setContent}
        icon={
          <TouchableOpacity activeOpacity={0.11}
          onPress={() => edit ? updatePost1() : onSubmit()}
            style={styles.btnClearSearch}>

           <Text style={{fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal",textAlign: "left",letterSpacing: 0, color: "#4a5cfc"}}>{edit ? '수정' : '등록'}</Text>
          </TouchableOpacity>
        }
      />
      </ScrollView>

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
             
            <TouchableOpacity onPress={() => {
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



    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible3}
      onRequestClose={() => {
        setModalVisible3(!modalVisible3);
      }}
    >
       <StatusBar
      translucent={true}
      backgroundColor="rgba(0, 0, 0, 0.5)" // 반투명 배경색
    />
      <View style={styles.centeredView}>
        <View style={styles.modalView2}>
          <View style={{flexDirection : 'row'}}>
          <TouchableOpacity  activeOpacity={0.11} onPress={() => {setModalVisible3(!modalVisible3)}}>
         
          </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.modalSection}>
             
            <TouchableOpacity onPress={() => {
            setedit(true)
            setModalVisible3(!modalVisible3);
            scrollTodowm();
            }}>
              <Text style={styles.modalSectionTitle}>{"수정"}</Text>
              </TouchableOpacity>

              <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10, width : '80%' , marginLeft : '10%' }} />

              <TouchableOpacity onPress={() => {
                    setContent(null)
               deletePost1(change)
               setModalVisible3(!modalVisible3);
              }}>
              <Text style={styles.modalSectionTitle1}>{"삭제"}</Text>
              </TouchableOpacity>
            </View> 
          
  
            <TouchableOpacity  activeOpacity={0.11} style={styles.confirmButton} onPress={() => {    setContent(null)
              setModalVisible3(!modalVisible3)}}>
              <Text style={styles.confirmButtonText}>{"취소"}</Text>
              </TouchableOpacity>
          </View>
        </View>

      </View>
    </Modal>


    <Modal
      animationType="fade" 
      transparent={true}
      visible={modalVisible4}
      onRequestClose={() => {
        setModalVisible4(!modalVisible4);
      }}
      
    >
       <StatusBar
      translucent={true}
      backgroundColor="rgba(0, 0, 0, 0.5)" // 반투명 배경색
    />
      <View style={styles.centeredView}>
        <View style={styles.modalView3}>
          <View style={{flexDirection : 'row'}}>
          <TouchableOpacity  activeOpacity={0.11} onPress={() => {setModalVisible4(!modalVisible4)}}>
         
          </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.modalSection}>
             


              <TouchableOpacity activeOpacity={0.11} onPress={() => {
                 navigation.navigate("Feedback3",{item, change})
                 setModalVisible4(!modalVisible4);
              }}>
              <Text style={styles.modalSectionTitle1}>{"신고"}</Text>
              </TouchableOpacity>
            
            </View>
          
  
            <TouchableOpacity activeOpacity={0.11} style={styles.confirmButton} onPress={() => {setModalVisible4(!modalVisible4)}}>
              <Text style={styles.confirmButtonText}>{"취소"}</Text>
              </TouchableOpacity>
          </View>
        </View>

      </View>
    </Modal>
    </SafeAreaView>
  );
};


