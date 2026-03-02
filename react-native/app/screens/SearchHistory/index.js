import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  TextInput,
  RefreshControl,
  Modal,
  StatusBar
} from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
} from '@components';
import moment from 'moment';
import {CaretLeft, CaretDown, Heart, ChatText, Eye} from 'phosphor-react-native';
import styles from './styles';
import {
  getFirestore,
  collectionGroup,
  onSnapshot,
  query,
  where,
  updateDoc,
  getDocs, limit,
  doc,
  getDoc,
  arrayRemove,
  arrayUnion,
  collection,
  orderBy,
  addDoc,
  deleteDoc,
  increment
  
} from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAuth, signOut } from 'firebase/auth';

let timeout;

export default function SearchHistory({ navigation }) {
  const { colors } = useTheme();

  const [category, setCategory] = useState('최신순');
  const [showResult, setShowResult] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const db = getFirestore();
  const colGroupRef = collectionGroup(db, "post");
  const q = query(colGroupRef);
 // const q1 = query(colGroupRef, where("title", 'array-contains', keyword));
  const auth = getAuth();
  const citiesRef = collection(db, "User");
  const q8 = query(citiesRef, where("email", "==", auth.currentUser.email));
  const [posts, setPosts] = useState([]);
  const [posts1, setPosts1] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const componentMounted = useRef(true);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [activeTab, setActiveTab] = useState('전체');



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


  const truncateTitle = (title) => {
    if (title.length > 30)
      return title.slice(0, 30) + '...';
    else
      return title
  }

 

  useEffect(() => {
    loadSearchHistory();
  }, [userName]);

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
 
  
  // 검색 히스토리를 Firestore에 저장하는 함수
  const saveSearchHistory = async (keyword) => {
    const currentTime = moment();
    try {
      // 검색 히스토리를 불러와서 중복 여부를 확인
      const q = query(
        collection(db, 'posthistory'),
        where('keyword', '==', keyword)
      );
      const querySnapshot = await getDocs(q);
      const existingHistory = [];
      querySnapshot.forEach((doc) => {
        existingHistory.push(doc.data().keyword);
      });
  
      // 중복된 단어가 없을 때만 저장
      if (!existingHistory.includes(keyword)) {
        const docRef = await addDoc(collection(db, 'posthistory' + userName), {
          keyword: keyword,
          timestamp: currentTime.format('YYYY-MM-DD HH:mm'),
        });
        console.log('검색 히스토리가 저장되었습니다.');
      } else {
        console.log('검색 히스토리에 이미 같은 키워드가 존재합니다.');
      }
    } catch (error) {
      console.error('검색 히스토리 저장 중 오류 발생:', error);
    }
  };



  const loadSearchHistory = async () => {
    try {
      const q = query(
        collection(db, 'posthistory' + userName),
        orderBy('timestamp', 'desc'), // 최신 항목부터 정렬
        limit(10) // 최신 10개 항목만 가져오기
      );
      const querySnapshot = await getDocs(q);
      const searchHistory = [];
      querySnapshot.forEach((doc) => {
        const keyword = doc.data().keyword;
        // 중복된 키워드가 없을 때만 배열에 추가
        if (!searchHistory.includes(keyword)) {
          searchHistory.push(keyword);
        }
      });
      setRecentSearches(searchHistory);
    } catch (error) {
      console.error('검색 히스토리 불러오기 중 오류 발생:', error);
    }
  };

const deleteSearchHistory = async (keyword) => {
  try {
    const q = query(
      collection(db, 'posthistory' + userName),
      where('keyword', '==', keyword)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    console.log('검색 히스토리가 삭제되었습니다.');
  } catch (error) {
    console.error('검색 히스토리 삭제 중 오류 발생:', error);
  }
}

const deleteAllSearchHistory = async () => {
  try {
    const q = query(collection(db, "posthistory" + userName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    console.log("전체 검색 히스토리가 삭제되었습니다.");
  } catch (error) {
    console.error("전체 검색 히스토리 삭제 중 오류 발생:", error);
  }
};

// 전체 삭제 버튼 클릭 시 호출
const removeAllSearchHistory = () => {
  // 화면에서 검색 히스토리를 모두 삭제
  setRecentSearches([]);

  // Firestore에서 전체 검색 히스토리 삭제
  deleteAllSearchHistory();
};

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

  const likeplus = async (likecount, postId, currentLikeColor) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("사용자가 인증되지 않았습니다.");
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


  const onSearch = async (keyword) => {
    setKeyword(keyword);

    // keyword와 title을 비교하여 필터링된 결과를 업데이트
    const filteredPosts = posts.filter((post) =>
      post.title.includes(keyword)
    );
    setPosts1(filteredPosts);

    if (!recentSearches.includes(keyword)) {
      setRecentSearches([...recentSearches, keyword]);
    }
  

    // 결과가 있으면 showResult를 true로, 없으면 false로 설정
    setShowResult(filteredPosts.length > 0);

    // 이후에 필요한 작업 수행
    // ...
  
    await saveSearchHistory(keyword);
  };

  const removeRecentSearch = (searchItem) => {
    // 화면에서 검색 히스토리 항목 삭제
    const updatedSearches = recentSearches.filter((item) => item !== searchItem);
    setRecentSearches(updatedSearches);
  
    // Firestore에서 검색 히스토리 삭제
    deleteSearchHistory(searchItem);
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

  /**
   * on clear
   */
  const onClear = () => {
    setHistory([]);
  };

  const onRefresh = () => {
    // 필요한 작업 수행
    // ...
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };









  const renderContent5 = () => {

    let sortedPosts = [];

    if (category === '최신순') {
      sortedPosts = [...posts].sort((a, b) => {
        const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
        const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
        return timeB - timeA;
      });
    } else if (category === '오래된순') {
      sortedPosts = [...posts].sort((a, b) => {
        const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
        const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
        return timeA - timeB;
      });
    }
   
    sortedPosts = sortedPosts.filter((post) => {
      return (
        post.title.includes(keyword)
      );
    });

    return (
      <View style={{flex: 1, marginTop: -22}}>
        <View style={{marginTop: 20, backgroundColor: colors.card}}>
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
          />
           <View style={{width : '100%', height : 50, backgroundColor : '#FFFFFF'}}/>
        </View>
      </View> 
    );
  };

  

  const renderItem5 = ({ item }) => {

  
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
      <Text style={{ marginLeft: 10, marginLeft: 50, marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
        {item.name === userName ? "작성자  |  " : "종사자  |  "}{item.name}
      </Text>

      <View style={{  marginTop : 10, marginLeft : 5, }}> 
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.title)}
      </Text>
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.comment)}
      </Text>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <TouchableOpacity onPress={() => likeplus(item.likecount, item.id, item.likecolor)}>
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
      <TouchableOpacity onPress={() => commentplus(item.commentcount, item.id)}>
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

    <View style={{width : '100%', height : 30, backgroundColor : '#FFFFFF'}}/>

      </View>
      
       <View style={{marginTop : -25 }}>
       <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10 }} />
       <View style={{marginTop : -20}}></View>
       </View>
       </TouchableOpacity>
       </SafeAreaView>
       
    );
      
  };
  
 

  const renderContent6 = () => {

    let sortedPosts = [];

    if (category === '최신순') {
      sortedPosts = [...posts].sort((a, b) => {
        const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
        const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
        return timeB - timeA;
      });
    } else if (category === '오래된순') {
      sortedPosts = [...posts].sort((a, b) => {
        const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
        const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
        return timeA - timeB;
      });
    }
  
    sortedPosts = sortedPosts.filter((post) => {
      return (
        post.category === '회사생활' &&
        post.title.includes(keyword)
      );
    });
    return (
      
      <View style={{flex: 1, marginTop : -22}}>
        
       
      <View style={{marginTop : 20, backgroundColor: colors.card}}>
        
      <FlatList 
        contentContainerStyle={{marginTop : -25}}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={sortedPosts}
        renderItem={renderItem6}
        keyExtractor={(item) => String(item.id)}
      />
          <View style={{width : '100%', height : 50, backgroundColor : '#FFFFFF'}}/>
      </View>

      </View> 
    );
  };

  
  const renderItem6 = ({ item }) => {

  
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
      <Text style={{ marginLeft: 10, marginLeft: 50, marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
        {item.name === userName ? "작성자  |  " : "종사자  |  "}{item.name}
      </Text>

      <View style={{  marginTop : 10, marginLeft : 5, }}> 
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.title)}
      </Text>
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.comment)}
      </Text>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <TouchableOpacity onPress={() => likeplus(item.likecount, item.id, item.likecolor)}>
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
      <TouchableOpacity onPress={() => commentplus(item.commentcount, item.id)}>
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

    <View style={{width : '100%', height : 30, backgroundColor : '#FFFFFF'}}/>

      </View>
      <View style={{marginTop : -25 }}>
      <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10 }} />
      <View style={{marginTop : -20}}></View>
       </View>
       </TouchableOpacity>
       </SafeAreaView>
       
    );
      
  };
  

  const renderContent7 = () => {

    let sortedPosts = [];

    if (category === '최신순') {
      sortedPosts = [...posts].sort((a, b) => {
        const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
        const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
        return timeB - timeA;
      });
    } else if (category === '오래된순') {
      sortedPosts = [...posts].sort((a, b) => {
        const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
        const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
        return timeA - timeB;
      });
    }
  
    // Filter posts where the category is '회사생활'
    sortedPosts = sortedPosts.filter((post) => {
      return (
        post.category === '이직커리어' &&
        post.title.includes(keyword)
      );
    });
  
   
    return (
      
      <View style={{flex: 1, marginTop : -22}}>
        
      
      <View style={{marginTop : 20, backgroundColor: colors.card}}>
        
      <FlatList 
        contentContainerStyle={{marginTop : -25}}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={sortedPosts}
        renderItem={renderItem7}
        keyExtractor={(item) => String(item.id)}
      />
          <View style={{width : '100%', height : 50, backgroundColor : '#FFFFFF'}}/>
      </View>

      </View> 
    );
  };

  
  const renderItem7 = ({ item }) => {

  
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
      <Text style={{ marginLeft: 10, marginLeft: 50, marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
        {item.name === userName ? "작성자  |  " : "종사자  |  "}{item.name}
      </Text>

      <View style={{  marginTop : 10, marginLeft : 5, }}> 
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.title)}
      </Text>
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.comment)}
      </Text>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <TouchableOpacity onPress={() => likeplus(item.likecount, item.id, item.likecolor)}>
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
      <TouchableOpacity onPress={() => commentplus(item.commentcount, item.id)}>
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

    <View style={{width : '100%', height : 30, backgroundColor : '#FFFFFF'}}/>

      </View>
       <View style={{marginTop : -25 }}>
       <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10 }} />
       <View style={{marginTop : -20}}></View>
       </View>
       </TouchableOpacity>
       </SafeAreaView>
    );
      
  };
  

  const renderContent8 = () => {

    let sortedPosts = [];

    if (category === '최신순') {
      sortedPosts = [...posts].sort((a, b) => {
        const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
        const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
        return timeB - timeA;
      });
    } else if (category === '오래된순') {
      sortedPosts = [...posts].sort((a, b) => {
        const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
        const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
        return timeA - timeB;
      });
    }
  
    // Filter posts where the category is '회사생활'
    sortedPosts = sortedPosts.filter((post) => {
      return (
        post.category === '취미' &&
        post.title.includes(keyword)
      );
    });
  


    return (
      
      <View style={{flex: 1, marginTop : -22}}>
        
      <View style={{marginTop : 20, backgroundColor: colors.card}}>
        
      <FlatList 
        contentContainerStyle={{marginTop : -25}}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={sortedPosts}
        renderItem={renderItem8}
        keyExtractor={(item) => String(item.id)}
      />
          <View style={{width : '100%', height : 50, backgroundColor : '#FFFFFF'}}/>
      </View>

      </View> 
    );
  };

  
  const renderItem8 = ({ item }) => {

  
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
      <Text style={{ marginLeft: 10, marginLeft: 50, marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
        {item.name === userName ? "작성자  |  " : "종사자  |  "}{item.name}
      </Text>

      <View style={{  marginTop : 10, marginLeft : 5, }}> 
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.title)}
      </Text>
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.comment)}
      </Text>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <TouchableOpacity onPress={() => likeplus(item.likecount, item.id, item.likecolor)}>
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
      <TouchableOpacity onPress={() => commentplus(item.commentcount, item.id)}>
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

    <View style={{width : '100%', height : 30, backgroundColor : '#FFFFFF'}}/>

      </View>
       <View style={{marginTop : -25 }}>
       <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10 }} />
       <View style={{marginTop : -20}}></View>
       </View>
       </TouchableOpacity>
       </SafeAreaView>
       
    );
      
  };
  



  const renderContent9 = () => {

    let sortedPosts = [];

    if (category === '최신순') {
      sortedPosts = [...posts].sort((a, b) => {
        const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
        const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
        return timeB - timeA;
      });
    } else if (category === '오래된순') {
      sortedPosts = [...posts].sort((a, b) => {
        const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
        const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
        return timeA - timeB;
      });
    }
  
    // Filter posts where the category is '회사생활'
    sortedPosts = sortedPosts.filter((post) => {
      return (
        post.category === '자유' &&
        post.title.includes(keyword)
      );
    });
  

    return (
      
      <View style={{flex: 1, marginTop : -22}}>
        
       
      <View style={{marginTop : 20, backgroundColor: colors.card}}>
        
      <FlatList 
        contentContainerStyle={{marginTop : -25}}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={sortedPosts}
        renderItem={renderItem9}
        keyExtractor={(item) => String(item.id)}
      />
          <View style={{width : '100%', height : 50, backgroundColor : '#FFFFFF'}}/>
      </View>

      </View> 
    );
  };

  
  const renderItem9 = ({ item }) => {

  
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
      <Text style={{ marginLeft: 10, marginLeft: 50, marginTop: -20, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
      {item.name === userName ? "작성자  |  " : "종사자  |  "}{item.name}
    </Text>

      <View style={{  marginTop : 10, marginLeft : 5, }}> 
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.title)}
      </Text>
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.comment)}
      </Text>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <TouchableOpacity onPress={() => likeplus(item.likecount, item.id, item.likecolor)}>
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
      <TouchableOpacity onPress={() => commentplus(item.commentcount, item.id)}>
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

    <View style={{width : '100%', height : 30, backgroundColor : '#FFFFFF'}}/>

      </View>
       <View style={{marginTop : -25 }}>
       <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10 }} />
       <View style={{marginTop : -20}}></View>
       </View>
       </TouchableOpacity>
       </SafeAreaView>
       
    );
      
  };


  const renderContent1 = () => {
    return (
      <View style={{ flex: 1, marginTop: 0 }}>

      {recentSearches.length > 0 ? (
        <View>
        <Image source={require("../../../assets/line.png")} style={{width : '120%', height : 7, marginTop : -20, marginLeft : -10}} />
        <View style={{flexDirection : 'row', marginTop :20 ,}}>
        <Text style={{fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", fontSize : 18 , marginLeft : 20}}>{"최근 검색"}</Text>
        <View style={{ marginLeft : 'auto', marginRight : 20}}>
        <TouchableOpacity onPress={removeAllSearchHistory}>
    
        <Text style={{fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15, marginTop : 2 }}>{"전체 삭제"}</Text>
        </TouchableOpacity>
        </View>
        </View>
        <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.5, marginTop: 20 }} />
        <FlatList
          data={recentSearches.reverse().filter(item => item.trim() !== '')} // Filter out empty items
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSearch(item)}>
              <View>
                <View style={{flexDirection :'row'  ,marginTop : 20, marginLeft : 10,}}>
                <Image source={require("../../../assets/searchicon.png")} style={{width : 30, height : 30, marginLeft : 10, marginTop : -5}} />
                <Text style={{fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15, marginLeft : 8, marginTop : -2}}>{item}</Text>
                <View style={{marginLeft: 'auto', marginRight: 20}}>
                <TouchableOpacity onPress={() => removeRecentSearch(item)}>
                  <Image source={require("../../../assets/close.png")} style={{ width: 17, height: 17 }} />
                </TouchableOpacity>
                </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        </View>
      ) : (
        <>
        <Image source={require("../../../assets/line.png")} style={{width : '120%', height : 7, marginTop : -20, marginLeft : -10}} />
        <View style={{ flex : 1 ,justifyContent: 'center', alignItems: 'center', marginTop : 200}}>
          
          <Text style={{ color: '#b2b2b2', fontSize: 17, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal" , }}>
            {"키워드 등의 검색어를 입력해주세요."}
          </Text>
        </View>
        </>
      )}
    </View>
    );
  };

  const renderContent = () => {

    const dataToRender = keyword ? posts1 : posts; 

    const filteredPosts = posts.filter((item) => item.title.includes(keyword));

    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <Image source={require("../../../assets/line.png")} style={{width : '120%', height : 7, marginTop : -40, marginLeft : -10}} />
      {dataToRender.length === 0 ? (
        <View style={{ flex: 1, marginTop: 100 }}>
        <View style={{ flex: 1, marginTop: 0 }}>
        <View style={styles.container}>
          <Text style={{ color: '#b2b2b2', fontSize: 17, fontFamily: "Pretendard", fontWeight: "650",  fontStyle: "normal",}}>{"검색 결과가 없습니다"}</Text>
          <Text style={{ color: '#b2b2b2', fontSize: 17, marginTop: 20, fontFamily: "Pretendard", fontWeight: "650",  fontStyle: "normal", }}>{"궁금한 내용에 대해 자유롭게 토크해"}</Text>
          <Text style={{ color: '#b2b2b2', fontSize: 17, fontFamily: "Pretendard", fontWeight: "650",  fontStyle: "normal",}}>{"보시겠어요?"}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Feedback")} style={{marginTop : 20}}>
             <Image source={require("../../../assets/writeicon.png")} style={{ width : 55, height : 55}} />
          </TouchableOpacity>
        </View>
      </View>
        </View>
      ) : (
        <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      
      <ScrollView showsVerticalScrollIndicator={false} style={{marginTop : -44}}>
       <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop : 10}} />
       <View style={{ backgroundColor: "#f6f7ff", width: '100%', height: '100%', marginTop: 0, marginBottom : 0 }}>
         <Text style={{ fontFamily: "Pretendard",fontWeight: '500', fontStyle: "normal", color: '#484848', fontSize: 20, marginTop: 0, marginLeft: 20 }}></Text>
         <ScrollView
           showsVerticalScrollIndicator={false}
           horizontal
           showsHorizontalScrollIndicator={false}
           contentContainerStyle={{ paddingHorizontal: 10 }}
           style={{marginTop : -15}}
         >
           {['전체', '회사생활', '이직커리어', '취미', '자유'].map((tabName, index) => (
             <TouchableOpacity
               key={index}
               onPress={() => handleTabPress(tabName)}
               style={{
                 shadowColor: '#000',
               shadowOffset: {
                 width: 0,
                 height: 2,
               },
               shadowOpacity: 0.5, // 그림자 투명도
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
         <TouchableOpacity onPress={() => {setModalVisible1(!modalVisible1)}}>
         <View style={{flexDirection : 'row',marginLeft : 'auto' ,marginTop : 0}}>
         <CaretDown  size={25} color={'#484848'} style={{ marginTop : -2}}/>
     
         <Text style={{ fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal", marginRight : 17 , marginTop : 0}}>{" "}{category}</Text>
         </View>
         </TouchableOpacity>
         <View
            style={{
              width: '100%',
              height: 30,
              backgroundColor: '#FFFFFF',
              marginTop: 22,
              shadowColor: 'rgba(0, 0, 0, 1)', // 진한 그림자 색상
              shadowOffset: { width: 0, height: 4 }, // 그림자 오프셋 (수평, 수직)
              shadowOpacity: 1, // 그림자 불투명도 (1로 설정하여 진하게)
              shadowRadius: 2, // 그림자 반경 (더 큰 값으로 설정하여 넓힘)
              elevation: 5, // Android의 경우 그림자
            }}
          ></View>
          <View style={{marginTop : 0}}>
         {activeTab === '전체' ? renderContent5() : null}
         {activeTab === '회사생활' ? renderContent6() : null}
         {activeTab === '이직커리어' ? renderContent7() : null}
         {activeTab === '취미' ? renderContent8() : null}
         {activeTab === '자유' ? renderContent9() : null}
         </View>
       </View>
 
     </ScrollView>
  
   </SafeAreaView>
      )}
    </View>
    );
  };

  
  const renderItem = ({ item }) => {

  
    const gogo = async (count, id) => {
      navigation.navigate("FeedDetail",{item})
      await updateDoc(doc(db, "post", id), {
      viewcount : count + 1
      });
    };

    return (
      
      <SafeAreaView>
      <TouchableOpacity  activeOpacity={0.11} onPress={()=>gogo(item.viewcount,item.id)}> 
     
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
      <Text style={{marginLeft : 10, marginLeft : 50, marginTop : -20, fontWeight : '500', fontStyle: "normal", color : '#484848'}}>
          {"종사자 | "}{item.name}
      </Text>

      <View style={{  marginTop : 10, marginLeft : 5, }}> 
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.title)}
      </Text>
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
      {truncateTitle(item.comment)}
      </Text>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
      <TouchableOpacity onPress={() => likeplus(item.likecount, item.id, item.likecolor)}>
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
      <Text style={{ marginTop: 10, marginLeft: 10, color : '#b2b2b2' }}>
        {item.likecount}
      </Text>
      <TouchableOpacity onPress={() => commentplus(item.commentcount, item.id)}>
        <MaterialCommunityIcons
          name={"tooltip-text-outline"}
          size={20}
          color={"#b2b2b2"}
          style={{ marginTop: 10, marginLeft: 10 }}
        />
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.commentcount}
      </Text>
      <TouchableOpacity
        onPress={() => handleInputChange(item.time)}
      >
        <MaterialCommunityIcons
          name={"eye-outline"}
          size={20}
          color={"#b2b2b2"}
          style={{ marginTop: 10, marginLeft: 10 }}
        />
      </TouchableOpacity>
      <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
        {item.viewcount}
      </Text>
    </View>

    <View style={{width : '100%', height : 30, backgroundColor : '#FFFFFF'}}/>

      </View>
       <View style={{marginTop : -25 }}>

       </View>
       </TouchableOpacity>
       </SafeAreaView>
       
    );
      
  };
  
  

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 20 }}>
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
        <View style={{ flex: 1 }}>
          
          <View style={{ paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row' }}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
            <CaretLeft  size={27} color={'#484848'} style={{marginLeft : 0, marginTop : 12}} />
          </TouchableOpacity>
            <View style ={{flexDirection : 'row'}}>
            <TextInput
              placeholder={'검색어를 입력하세요'}
              placeholderTextColor="#DEDEDE" 
              style={styles.input} // Change the fontSize here
              value={keyword}
              onChangeText={(text) => setKeyword(text)}
              onSubmitEditing={() => {
                clearTimeout(timeout);
                timeout = setTimeout(() => onSearch(keyword), 500);
              }}
            />
            <View style={{ marginLeft : 'auto',}}>
            <TouchableOpacity
              onPress={() => {
                clearTimeout(timeout);
                timeout = setTimeout(() => onSearch(keyword), 500);
              }} >
                  <Image source={require("../../../assets/search2.png")} style={{width : 23, height : 23, color: '#e9e9e9', marginTop : 14}} />
            </TouchableOpacity>
            </View>
            </View>
          </View>
          <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.5, marginTop: 0 }} />
          <View style={styles.rowTitle}>
          </View>

          {keyword ? renderContent() : renderContent1()}
        </View>
      </SafeAreaView>
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
              <Text style={styles.confirmButtonText}>{"확인"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    
    </ScrollView>
  );
}