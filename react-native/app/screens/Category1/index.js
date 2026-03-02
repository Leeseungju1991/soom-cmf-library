import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  ToastAndroid,
  Share,
  FlatList,
  RefreshControl,
  Modal,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import {BaseStyle, useTheme, BaseColor} from '@config';
import {CaretDown, ShareNetwork, DotsThree, CaretLeft, BookmarkSimple, WarningCircle, ThumbsUp} from 'phosphor-react-native';
import { addDoc, collection, getFirestore, collectionGroup,
  onSnapshot,
  query,
  where,
  updateDoc,
  orderBy, limit,
  doc,
  getDoc,
  arrayRemove,
  increment,
  getDocs,
  deleteDoc,
  arrayUnion} from "firebase/firestore";
import {SafeAreaView, Alert, Header, Icon, TextInput} from '@components';
import { ScrollView } from 'react-native-gesture-handler';
import { getAuth } from 'firebase/auth';
export default function Category1({navigation, route}) {
  const {colors} = useTheme();
  const [modalVisible1, setModalVisible1] = useState(false);
  const moment = require('moment');
  const currentTime = moment()
  const [showSplash, setShowSplash] = useState(true);
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('최신순');
  const [activeTab, setActiveTab] = useState('전체');
  const componentMounted = useRef(true);
  const [content, setContent] = useState('');
  const [change, setchange] = useState('');
  const item = route.params?.item;
  const item2= route.params?.item;
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const db = getFirestore();
  const colGroupRef = collectionGroup(db, "policy");
  const [loading, setLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(null);
  const [iconColor, setIconColor] = useState('#f5f5f5'); 
  const q = query(colGroupRef, orderBy("viewcount", "desc"), limit(3));
  const [posts, setPosts] = useState([]);
  const id = route.params.item.id;
  const q1 = collection(db, "policy" ,item.id, 'reply' );
  const [posts1, setPosts1] = useState([]);
  const auth = getAuth();
  const citiesRef = collection(db, "User");
  const q2= query(citiesRef, where("email", "==", auth.currentUser.email));
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const scrollViewRef = useRef(null);
  const [isBookmarkLoaded, setBookmarkLoaded] = useState(false); // 북마크 로딩 상태 변수
  const [edit, setedit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
            setIconColor('#484848');
          } else {
            // 북마크가 추가되지 않은 경우 색상을 변경
            setIconColor('#f5f5f5');
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
  
    // 호출 시 item이 정의되어 있어야 함
    if (item) {
      fetchInitialBookmarkStatus();
    }
  }, [item]);

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
          console.log('이미 북마크에 추가된 게시물입니다.');
          const updatedBookmarks = bookmarks.filter(item => item !== id);

          // 사용자의 'bookmark' 필드를 업데이트하여 게시물을 제거
          await updateDoc(doc(db, 'User', userId), {
            bookmark: updatedBookmarks,
          });
        
          ToastAndroid.show('북마크에서 제거되었습니다.', ToastAndroid.SHORT);
          setIconColor('#f5f5f5');
        } else {
          // 사용자의 'bookmark' 필드에 현재 게시물 ID를 추가
          await updateDoc(doc(db, 'User', userId), {
            bookmark: arrayUnion(item.id), // item.id는 현재 게시물의 ID입니다.
          });
  
          ToastAndroid.show('북마크에 추가되었습니다.', ToastAndroid.SHORT);
          setIconColor('#484848');
        }
      } else {
        console.error('사용자를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('북마크 추가 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(q2, (snapshot) => {
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
    onSnapshot(q1, (snapshot) => {
      if (componentMounted.current) {
        setPosts1(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
      return () => {
        componentMounted.current = false;
      };
    });
  }, []);

  const toggleIconColor = async () => {

        onBookmarkClick(); // 북마크 추가 함수 호출
 
  };

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const docRef = doc(db, "policy", item.id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const commentCount = docSnapshot.data().commentcount;
          setCommentCount(commentCount); // 상태를 업데이트합니다.
        } else {
          console.log(`Document with ID ${texitem.idt5} does not exist.`);
        }
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };

    fetchCommentCount();
  }, []); // 빈 배열을 의존성으로 지정하여 한 번만 실행되도록 합니다.


  const renderContent = () => {


    let sortedPosts = [];

    if (category === '최신순') {
      sortedPosts = [...posts1]
        .filter(post => post.bancount !== 1)
        .sort((a, b) => {
          const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
          const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
          return timeB - timeA;
        });
    } else if (category === '오래된순') {
      sortedPosts = [...posts1]
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
      <View style={{ flex: 1, marginTop: -10 }}>
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
      console.log(item)
      setchange(item.id)
      setContent(item.comment)
      setModalVisible2(!modalVisible2);

    }

    const gogotest1 = () => {
      console.log(item)
      setchange(item.id)
      setModalVisible4(!modalVisible4);

    }

    return (
      <SafeAreaView>
      
      <View style={{marginTop : 0}}>
        
        <View style={{flexDirection: 'row', marginTop: 0, marginLeft : 20}}>
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848"}}>{userName === item.name ? "작성자" : "종사자"}</Text>
        <View style={{ width: 1.2, height: 15, marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <View style={{ width: 1, height: 0,marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848"}}>{item.name}</Text>
        <View style={{ marginLeft: 'auto', marginRight: 10,}}> 

        {userName === item.name ? (
        <TouchableOpacity activeOpacity={0.11}  onPress={()=>gogotest()}>
                <DotsThree  size={35} color={'#b2b2b2'} style={{ mmarginTop : 0, marginRight : 10}}/>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity activeOpacity={0.11} onPress={() =>gogotest1()}>
                 <DotsThree  size={35} color={'#b2b2b2'} style={{ marginTop : 0, marginRight : 10}}/>
        </TouchableOpacity>
      )}
      
        </View>
       
            
        </View>
        <Text style={{fontSize : 14, marginTop : 10, marginLeft : 20,  color : '#484848', fontFamily: "Pretendard", fontWeight: "500",  fontStyle: "normal",}}>
        {item.comment} 
        </Text>
        <View style={{flexDirection: 'row', marginLeft : 10}}>
        <Text style={{marginTop : 10, marginLeft : 10, color : '#b2b2b2'}}>
        {getTimeAgo(item.time)} 
        </Text>
        <TouchableOpacity  onPress={() => likeplus(item.likecount, item.id, item.likecolor)}>
          <View style={{ flexDirection : 'row'}}>
          <ThumbsUp size={20} c color={item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"}     style={{ marginTop: 12, marginLeft: 10 }}/>

        <Text style={{
          marginTop: 10,
          color: item.likedBy && item.likedBy.includes(userName) ?  "#e61e1e" : "#b2b2b2",
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
          color: item.likedBy && item.likedBy.includes(userName) ?  "#e61e1e" : "#b2b2b2",
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
        <TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
        </View>
        </TouchableOpacity>


        </View>
       </View>
       <View style={{ borderBottomColor: 'lightgray', borderBottomWidth: 0.3, marginTop : 20}}/>
       </SafeAreaView>
    );
  }



  const onRefresh = () => {
    setRefreshing(true);
  };


  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (componentMounted.current) {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    });

    return () => {
      unsubscribe();
      console.log(item.id )

      componentMounted.current = false;
    };
    
  }, []);


  function extract11to15WithEllipsis(title) {
    const characters11to15 = title.substring(0, 25);
    if (characters11to15.length > 0) {
      return characters11to15 + '...';
    } else {
      return '...'; // 11자리부터 15자리까지 문자열이 5글자 미만인 경우, 빈 문자열 반환
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
  
      const postDocRef = doc(db, 'policy', item.id, 'reply', postId);
  
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


  const onSubmit = async () => {
    setLoading(true);
    if ((content !== '') && (content.trim().length <30)) {
      try {
        const docRef = await addDoc(collection(db, 'policy' , item.id , 'reply'), {
          Feed : Math.random().toString(36),
          comment : content,
          name : userName,
          likecount : 0,
          commentcount : 0,
          viewcount : 0,
          time : currentTime.format('YYYY-MM-DD HH:mm'),
          email : auth.currentUser.email,
          bancount : 0
        });
      
        console.log(docRef.id);
        setLoading(false);

        setContent(null)
        ToastAndroid.show('리뷰가 작성되었습니다.', ToastAndroid.SHORT);

        await updateDoc(doc(db, "policy", item.id), {
          commentcount: increment(1)
        });

        
        try {
          const docRef = doc(db, "policy", item.id);
          const docSnapshot = await getDoc(docRef);
  
          if (docSnapshot.exists()) {
            const commentCount = docSnapshot.data().commentcount;
            setCommentCount(commentCount); // 상태를 업데이트합니다.
          } else {
            console.log(`Document with ID ${item.id} does not exist.`);
          }
        } catch (error) {
          console.error("Error fetching comment count:", error);
        }
      } catch (e) {
        setLoading(false);
        console.log(e)
        ToastAndroid.show('리뷰가 작성되었습니다.', ToastAndroid.SHORT);
      }
    }else{
      ToastAndroid.show('리뷰가 작성되었습니다.', ToastAndroid.SHORT);
    }
  };
  
  function normalizeSpaces(inputString) {
    // 2개부터 20개 사이의 연속된 공백을 하나의 공백으로 바꿉니다.
    return inputString.trim();
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


const handleTabPress = (tabName) => {
  setActiveTab(tabName);
  navigation.goBack();
};

  const renderContent1 = () => {

    return (
      <View style={{ flex: 1, marginTop: -35 }}>
        <View style={{ marginTop: 40 }}>
          <FlatList
            contentContainerStyle={{}}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            data={posts}
            renderItem={renderItem1}
            keyExtractor={(item) => String(item.id)}
          />
        </View>
      </View>
    );
  };

  const renderItem1 = ({ item }) => {
    const gogo = async (count, id) => {
      navigation.navigate("Category1", { item });

      // 스크롤 가능한 컴포넌트의 scrollTo 메서드 호출
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }

      await updateDoc(doc(db, "policy", id), {
        viewcount: count + 1
      });
    };



    return (
      <View style={{ flex : 1}}>
        <TouchableOpacity onPress={() => gogo(item.viewcount, item.id)}>
          <View style={{flexDirection : 'row'}}>
            <Text style={{marginTop : 5, marginLeft : 15}}> {'.'}</Text>
          <Text
            style={{
              marginTop: 8, // marginTop을 0으로 설정
              marginLeft: 10,
              fontWeight: '500',
              fontFamily: 'Pretendard',
              fontStyle: 'normal',
              fontSize: 16,
            }}
          >
            {extract11to15WithEllipsis(item.title)}
          </Text>
          </View>
      
        </TouchableOpacity>
      </View>
    );
  };
  
  const updatePost1 = async () => {
    console.log(item2.id)
    console.log(change)
  if (content != '') {
   try {
     // Firestore에서 문서 업데이트
     await updateDoc(doc(db, 'policy', item2.id, 'reply', change), {
       comment: content, // 'reply' 필드를 업데이트
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
     setContent('');
     setedit(false)
     ToastAndroid.show('댓글이 수정 되었습니다.', ToastAndroid.SHORT);
   } catch (error) {
     console.error('Error updating document: ', error);
   } 
   } else if (content == '') {
      ToastAndroid.show('수정글을 작성해주세요.', ToastAndroid.SHORT);
  }
   
 };
 

  const onShare = async (title) => {
    console.log("야호")
    try {
      console.log("야호")
      const result = await Share.share(
        {
          message: item.title + '\n\n제약인 어플 출시!\n매일 출석 이벤트에 도전하세요!\n\n제약인\n https://play.google.com/store/apps/details?id=com.huynh.jeyakin',
       } 
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('activityType!');
        } else {
          console.log('Share!');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };




  const deletePost1 = async (postId) => {
    try {
      // Firestore에서 문서 삭제
      await deleteDoc(doc(db, 'policy', postId));
      await deleteDoc(doc(db, 'policy', item.id, 'reply', postId));
      // posts2 배열에서도 삭제
  
      setPosts1((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      await updateDoc(doc(db, 'policy', item.id), {
        commentcount: increment(-1)
      });
      ToastAndroid.show('댓글이 삭제되었습니다.', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  useEffect(() => {
    // 3초 후에 isLoading 상태를 false로 업데이트하여 로딩 화면을 벗어납니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
    <>
          <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef} style={{flex: 1, marginTop : 30}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginLeft: 10 }}>
          <TouchableOpacity  activeOpacity={0.11} onPress={()=>navigation.goBack()} style={{ marginRight: 'auto', marginLeft: 10 }}>
          <CaretLeft  size={27} color={'#484848'} style={{marginLeft : 0, marginTop : 1}} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal" , marginLeft : 0 }}>{"뉴스"}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.11} onPress={() => navigation.navigate("SearchHistory3")} style={{ marginLeft: 'auto', marginRight: 20 }}>
          <Image source={require("../../../assets/search.png")} style={{width : 20, height : 20, color: '#484848'}} />
        </TouchableOpacity>
        </View>
        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.7, marginTop : 15}}/>
        <ScrollView
            showsVerticalScrollIndicator={false}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {['전체', '정책', '제약바이오', '약국', '기획'].map((tabName, index) => (
              <TouchableOpacity activeOpacity={0.11}
                key={index}
                onPress={() => handleTabPress(tabName)}
                style={{

                  width: 88, // 최대 너비 선택
                  height: 40,
                  backgroundColor: activeTab === tabName ? '#484848' : '#f6f7ff',
                  borderRadius: 34,
                  width: tabName === '제약바이오' ? 88 : 70, 
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 5,
                  marginTop : 15,
                  marginBottom : 25
                }}
              >
               
               <Text style={{ fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal",color: activeTab === tabName ? '#FFFFFF' : '#484848', fontSize: 14 }}>{tabName}</Text>
        
              </TouchableOpacity>

            ))}
          </ScrollView>
          
          <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.7, marginTop : -10}}/>
      
          <Text style={{color : '#4a5cfc', fontWeight : 'bold', marginTop : 20, marginLeft :20, fontSize : 18, fontFamily: "Pretendard",  fontStyle: "normal",}}>{item.category}</Text>
          <Text style={{ fontWeight: 'bold', marginTop: 5, marginLeft: 20, fontSize: 23, flexWrap: 'wrap',fontStyle: "normal", fontFamily: "Pretendard" }}>{item.title}</Text>
          <View style={{flexDirection : 'row', marginTop : 10, marginLeft :22, fontFamily: "Pretendard",fontWeight: "normal", fontStyle: "normal", fontSize : 13}}>
          <Text style={{ color : '#b2b2b2'}}>{"발행"}</Text>
          <Text style={{ color : '#b2b2b2'}}>{"  "}</Text>
          <Text style={{ color : '#b2b2b2'}}>{item.time}</Text>
          </View>
          <View style={{ borderBottomColor: '#484848', width: '90%', borderBottomWidth: 0.7, marginTop : 15 , marginLeft : '5%'}}/>
          <View style={{flexDirection : 'row', marginTop : 20, marginLeft :20, fontFamily: "Pretendard",  fontWeight: "bold",  fontStyle: "normal",fontSize: 15}}>
          <Text style={{ fontFamily: "Pretendard",  fontWeight: "bold",  fontStyle: "normal",fontSize: 15}}>{"데일리팜 "}</Text>
          <Text style={{ fontFamily: "Pretendard",  fontWeight: "bold",  fontStyle: "normal",fontSize: 15}}>{item.author}</Text>
          <Text style={{ fontFamily: "Pretendard",  fontWeight: "bold",  fontStyle: "normal",fontSize: 15}}>{" 기자"}</Text>
          </View>
          <Image source={{uri : item.uri}} style={{width : '100%', height : 200, marginTop : 20}} />

          <Text style={{
          marginTop: 30,
          marginLeft: 20,
          fontSize: 16,
          fontFamily: "Pretendard",
          fontWeight: "500",
          fontStyle: "normal",
          textAlign: 'left',
          paddingRight: 20,
          lineHeight: 25, // 원하는 글 간격 설정
        }} numberOfLines={null}>
          {item.comment.replace(/다\.\s+/g, '다.\n\n')}
        </Text>
          <View style={{ flexDirection: 'row', marginLeft : 20}}>

    
          <TouchableOpacity activeOpacity={0.11} onPress={()=>onShare()}>
          <View style={{ width : 175, height : 38 , backgroundColor: '#f5f5f5',borderRadius: 6,  marginTop : 30, marginLeft : 5}}>
          <View style={{flexDirection: 'row', marginTop : 8, marginLeft: 27}}>
          <Text style={{ marginTop: 0, marginLeft: 23, color : '#b2b2b2',  }}>
            {"공유하기"}
          </Text>
          <ShareNetwork  size={25} color={'#b2b2b2'} style={{ marginTop : -2, marginRight : 18}}/>
          </View>
          </View>
          </TouchableOpacity>
           <TouchableOpacity activeOpacity={0.11} onPress={toggleIconColor}>
            <View
              style={{
                width: 175,
                height: 38,
                backgroundColor: iconColor,
                borderRadius: 6,
                marginTop: 30,
                marginLeft: 5,
              }}
            >
              <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 33 }}>
                <Text
                  style={{
                    marginTop: 0,
                    marginLeft: 23,
                    color: iconColor ==="#f5f5f5" ? '#b2b2b2' : '#FFFFFF'
                  }}
                >
                  {"북마크"}
                </Text>
                  <BookmarkSimple  size={27} color={iconColor ==="#f5f5f5" ? '#b2b2b2' : '#FFFFFF'} style={{marginLeft : 1, marginTop : -3}} />
              </View>
            </View>
          </TouchableOpacity>
          </View>

          <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 7, marginTop : 20 ,}}/>
          <Text style={{ color : '#4a5cfc', fontWeight : 'bold', marginTop : 20, marginLeft :20 ,  fontFamily: "Pretendard",  fontStyle: "normal",}}>{'다른 기사'}</Text>
          
          {renderContent1()}
          
          <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 7, marginTop : 20 ,}}/>
   
       
        
      <View style={{flexDirection : 'row', }}>
      <TouchableOpacity activeOpacity={0.11} onPress={() => {setModalVisible1(!modalVisible1)}}> 
      <View style={{flexDirection : 'row', marginTop : 15, marginLeft : 20}}>
          <CaretDown  size={25} color={'#484848'} style={{ marginTop : -2, marginLeft : 0}}/>
          <Text style={{fontWeight: "500",fontSize: 15, fontFamily: "Pretendard", textAlign: "left",  fontStyle: "normal", marginLeft : 0}}>{" "}{category}</Text>
        </View>
      </TouchableOpacity>
      <View style={{ marginTop : 15, marginLeft : 'auto', marginRight : 20,}}>
      <TouchableOpacity  activeOpacity={0.11}>
      <View style={{ flexDirection : 'row'}}>
      <WarningCircle  size={19} color={'#b2b2b2'} style={{ marginTop : 1, marginRight : 3}}/>
      <Text style={{color : '#b2b2b2'}}>{"운영규칙"}</Text>
      </View> 
      </TouchableOpacity>
      </View>
      </View>

      <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.7, marginTop : 15, marginLeft : -30}}/>
      {posts1.length === 0 ? (
        
        <View style={{ height: 150, backgroundColor: 'transparent' }}>
          <Text style={{ color: '#4a5cfc', fontSize: 15, marginTop: 20, marginLeft: 20, fontFamily: 'Pretendard', fontWeight: 'bold', fontStyle: 'normal' }}>
            {"댓글 "}{posts1.length}
          </Text>
          {/* 100 높이의 공간에 표시할 내용을 넣으세요 */}
        </View>
      ) : (
        <>
          <Text style={{ color: '#4a5cfc', fontSize: 15, marginTop: 20, marginLeft: 20, fontFamily: 'Pretendard', fontWeight: 'bold', fontStyle: 'normal' }}>
          {"댓글 "}{posts1.length - posts1.filter(post => post.bancount === 1).length}
          </Text>
          {renderContent()}
        </>
    )}

      </ScrollView>
          <View style={{ borderBottomColor: 'lightgray', borderBottomWidth: 0.7, marginBottom : 10}}/>
            <TextInput
             placeholder={edit ? '수정글을 남겨주세요' : '댓글을 남겨주세요'}
              value={content}
              style={{width : '90%', borderRadius : 9, marginLeft : '5%', marginBottom : 10}}
              onChangeText={setContent}
              icon={
                <TouchableOpacity activeOpacity={0.11}
                  onPress={() => edit ? updatePost1() : onSubmit(item.commentcount,item.id)}
                  style={styles.btnClearSearch}>

                <Text style={{fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal",textAlign: "left",letterSpacing: 0, color: "#4a5cfc"}}>{edit ? '수정' : '등록'}</Text>
                </TouchableOpacity>
              }
            />
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
             
            <TouchableOpacity activeOpacity={0.11} onPress={() => {
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
        <View style={styles.modalView2}>
          <View style={{flexDirection : 'row'}}>
          <TouchableOpacity activeOpacity={0.11}  onPress={() => {setModalVisible2(!modalVisible2)}}>
         
          </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.modalSection}>
             
            <TouchableOpacity activeOpacity={0.11} onPress={() => {
               setedit(true)
             // navigation.navigate("Category1change",{item2, change})
              setModalVisible2(!modalVisible2);
              scrollToBottom();
            }}>
              <Text style={styles.modalSectionTitle}>{"수정"}</Text>
              </TouchableOpacity>

              <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10, width : '80%' , marginLeft : '10%' }} />

              <TouchableOpacity activeOpacity={0.11} onPress={() => {
                    setContent(null)
                deletePost1(change)
                setModalVisible2(!modalVisible2);
              }}>
              <Text style={styles.modalSectionTitle1}>{"삭제"}</Text>
              </TouchableOpacity>
              
            </View>
          
  
            <TouchableOpacity activeOpacity={0.11} style={styles.confirmButton} onPress={() => {    setContent(null)
              setModalVisible2(!modalVisible2)}}>
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
                 navigation.navigate("Feedback4",{item, change})
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
        </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop : 30
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
  loadingImage: {
    width: 100,
    height: 100,
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
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    marginTop : 'auto',
    marginBottom : -30,
    backgroundColor: 'white',
    borderRadius: 40,
    height : 230,
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
    alignItems: 'stretch',
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
    color: 'white',
    fontSize : 20, 
    marginTop : 10
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
  modalView2: {
    marginTop : 'auto',
    marginBottom : -30,
    backgroundColor: 'white',
    borderRadius: 40,
    height : 230,
    alignItems: 'stretch',
  },
  modalView3: {
    marginTop : 'auto',
    marginBottom : -30,
    backgroundColor: 'white',
    borderRadius: 40,
    height : 155,
    alignItems: 'stretch',
  },
});
