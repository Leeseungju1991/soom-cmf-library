import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Alert,
  ScrollView,
  RefreshControl,
  FlatList,
  Share,
  ToastAndroid,
  Dimensions,
  TouchableOpacity,
  Modal,
  StatusBar
} from 'react-native';
import {
  Image,
  Header,
  Text,
  TextInput,
} from '@components';
import { addDoc, collection, getFirestore, collectionGroup,
  onSnapshot,
  query,
  where,
  updateDoc,
  increment, getDocs,
  doc,
  getDoc,
  arrayRemove,
  deleteDoc,
  arrayUnion} from "firebase/firestore";
import { Video } from 'expo-av';
import {BaseStyle, useTheme, BaseColor} from '@config';
import {CaretDown, ShareNetwork, DotsThree, BookmarkSimple, Play, WarningCircle, ThumbsUp,Pause} from 'phosphor-react-native';
import styles from './styles';
import { getAuth } from 'firebase/auth';
export default function  Messenger1({navigation, route}) {
  const moment = require('moment');
  const currentTime = moment()
  const {colors} = useTheme();
  const text1 = route.params.text1 
  const text2 = route.params.text2 
  const text3 = route.params.text3 
  const text4 = route.params.text4
  const text5 = route.params.text5
  const videoUri = route.params.uri
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
  };
  const [isLoading, setIsLoading] = useState(true);
 const db = getFirestore();
  const citiesRef = collection(db, "User");
  const auth = getAuth();
  const [refreshing, setRefreshing] = useState(false);
  const q = collection(db, "eduacation" ,text5, 'reply' );
  const q1 = query(citiesRef, where("email", "==", auth.currentUser.email));
  const q2 = collection(db, "eduacation");
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [posts1, setPosts1] = useState([]);
  const [posts2, setPosts2] = useState([]);
  const [change, setchange] = useState('');
  const [category, setCategory] = useState('최신순');
  const componentMounted = useRef(true);
  const [iconColor, setIconColor] = useState('#b2b2b2'); 
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const [commentCount, setCommentCount] = useState(null);
  const [isBookmarkLoaded, setBookmarkLoaded] = useState(false); // 북마크 로딩 상태 변수
  const [edit, setedit] = useState(false);

  useEffect(() => {
    onSnapshot(q2, (snapshot) => {
      if (componentMounted.current) {
        const filteredPosts = snapshot.docs
          .filter((doc) => doc.id === text5)
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        
        setPosts2(filteredPosts);
      }
      
      return () => {
        componentMounted.current = false;
      };
    });
  }, [text5]);

  const updatePost1 = async () => {
    console.log(text5)
    console.log(change)
    if (content != '') {
    try {
      // Firestore에서 문서 업데이트
      await updateDoc(doc(db, 'eduacation', text5, 'reply', change), {
        comment: content, // 'reply' 필드를 업데이트
      });
  
      // posts2 배열에서도 업데이트 (선택사항)
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === change) {
            return { ...post, comment: content }; // 'reply' 필드를 업데이트
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
        const userQuerySnapshot = await getDocs(q1);

        if (userQuerySnapshot.docs.length > 0) {
          const userDoc = userQuerySnapshot.docs[0];
          const userDocData = userDoc.data();
          const bookmarks = userDocData.bookmark || [];

          // 이미 북마크에 추가된 게시물인지 확인
          if (bookmarks.includes(text5)) {
            // 북마크가 이미 추가된 경우 색상을 변경
            setIconColor('#4a5cfc');
          } else {
            // 북마크가 추가되지 않은 경우 색상을 변경
            setIconColor('#b2b2b2');
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
      const userQuerySnapshot = await getDocs(q1);
  
      if (userQuerySnapshot.docs.length > 0) {
        const userDoc = userQuerySnapshot.docs[0];
        const userId = userDoc.id;
  
        // 사용자의 'bookmark' 필드 가져오기
        const userDocData = userDoc.data();
        const bookmarks = userDocData.bookmark || [];
  
        // 이미 북마크에 추가된 게시물인지 확인
        if (bookmarks.includes(text5)) {
          console.log('이미 북마크에 추가된 게시물입니다.');
          const updatedBookmarks = bookmarks.filter(item => item !== text5);

          // 사용자의 'bookmark' 필드를 업데이트하여 게시물을 제거
          await updateDoc(doc(db, 'User', userId), {
            bookmark: updatedBookmarks,
          });
        
          ToastAndroid.show('북마크에서 제거되었습니다.', ToastAndroid.SHORT);
          setIconColor('#b2b2b2');
        } else {
          // 사용자의 'bookmark' 필드에 현재 게시물 ID를 추가
          await updateDoc(doc(db, 'User', userId), {
            bookmark: arrayUnion(text5), // item.id는 현재 게시물의 ID입니다.
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



  const toggleIconColor = async () => {
  
        onBookmarkClick(); 
  };




  useEffect(() => {
    console.log(route)
    onSnapshot(q, (snapshot) => {
      if (componentMounted.current) {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        
      }
      setIsLoading(false);
      return () => {
        componentMounted.current = false;
      };
    });
  }, []);


  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const docRef = doc(db, "eduacation", text5);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const commentCount = docSnapshot.data().commentcount;
          setCommentCount(commentCount); // 상태를 업데이트합니다.
        } else {
          console.log(`Document with ID ${text5} does not exist.`);
        }
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };

    fetchCommentCount();
  }, []); // 빈 배열을 의존성으로 지정하여 한 번만 실행되도록 합니다.

  useEffect(() => {
    console.log(route)
    const unsubscribe = onSnapshot(q1, (snapshot) => {
      if (snapshot.size > 0) {
        const userData = snapshot.docs[0].data();
        setPosts1(userData.post || []);
        setUserName(userData.id || "");
        setLoading(false); // userName이 로딩되면 로딩 상태를 해제
      }
    });

    return () => {
      unsubscribe(); // 클린업 함수에서 구독 해제
    };
  }, []);


  const likeplus = async (likecount, postId, currentLikeColor) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("사용자가 인증되지 않았습니다.");
        // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
        return;
      }
  
      const postDocRef = doc(db, 'eduacation', text5, 'reply', postId);
  
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
        const docRef = await addDoc(collection(db,'eduacation',text5, 'reply'), {
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
        
        await updateDoc(doc(db, "eduacation", text5), {
          commentcount: increment(1)
        });

        
        try {
          const docRef = doc(db, "eduacation", text5);
          const docSnapshot = await getDoc(docRef);
  
          if (docSnapshot.exists()) {
            const commentCount = docSnapshot.data().commentcount;
            setCommentCount(commentCount); // 상태를 업데이트합니다.
          } else {
            console.log(`Document with ID ${text5} does not exist.`);
          }
        } catch (error) {
          console.error("Error fetching comment count:", error);
        }

        


        ToastAndroid.show('댓글이 작성되었습니다.', ToastAndroid.SHORT);
      } catch (e) {
        setLoading(false);
        console.log(e)
        Alert.alert({
          type: 'fail',
          title: "글쓰기 실패",
          message: e,
        });
      }
    }else{
      Alert.alert({
        type: 'fail',
        title: "글쓰기 실패",
        message: "모든 항목을 입력해주세요",
      });
    }
  };
  

  
  function formatTimeDifference(previousTime) {
    const currentTime = new Date();
    const timeDifference = currentTime - previousTime;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days >= 1) {
        return `${days}일 전`;
    } else if (hours >= 1) {
        return `${hours}시간 전`;
    } else if (minutes >= 1) {
        return `${minutes}분 전`;
    } else {
        return '방금 전';
    }
}

  const onShare = async (title1, title2, title3) => {
    console.log("야호")
    try {
      console.log("야호")
      const result = await Share.share(
       {
        message: '제약인 어플 출시!\n매일 출석 이벤트에 도전하세요!\n\n제약인\n https://play.google.com/store/apps/details?id=com.huynh.jeyakin',
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
      console.log(error.message);
    }
  };

  const renderContent1 = () => {

    let sortedPosts = [];

    if (category === '최신순') {
      sortedPosts = [...posts]
        .filter(post => post.bancount !== 1) // Exclude posts with bancount equal to 1
        .sort((a, b) => {
          const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
          const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
          return timeB - timeA;
        });
    } else if (category === '오래된순') {
      sortedPosts = [...posts]
        .filter(post => post.bancount !== 1) // Exclude posts with bancount equal to 1
        .sort((a, b) => {
          const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
          const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
          return timeA - timeB;
        });
    }
    return (
      <View style={{ flex: 1, marginTop: 10 }}>
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
const scrollViewRef = useRef();
const scrollToBottom = () => {
  if (scrollViewRef.current) {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }
};

const deletePost1 = async (postId) => {
  try {
    // Firestore에서 문서 삭제
    await deleteDoc(doc(db, 'eduacation', postId));
    await deleteDoc(doc(db, 'eduacation', text5, 'reply', postId));
    // posts2 배열에서도 삭제

    setPosts2((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    await updateDoc(doc(db, 'eduacation', text5), {
      commentcount: increment(-1)
    });
    ToastAndroid.show('댓글이 삭제되었습니다.', ToastAndroid.SHORT);
  } catch (error) {
    console.error('Error deleting document: ', error);
  }
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





  const renderItem = ({ item }) => {
   
    const gogotest = () => {
      setchange(item.id)
      setContent(item.comment)
      setModalVisible2(!modalVisible2);
    }

    const gogotest1 = () => {
      setchange(item.id)
      setModalVisible4(!modalVisible4);
    }
 
 
    return (
      <View style={{flex : 1}}>
      <View style={{flex : 1, marginTop : 15}}>
        
        <View style={{flexDirection: 'row', marginTop: 0, marginLeft : 20}}>
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848"}}>{userName === item.name ? "작성자" : "종사자"}</Text>
        <View style={{ width: 1.2, height: 15, marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <View style={{ width: 1, height: 0,marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848"}}>{item.name}</Text>
        <View style={{ marginLeft: 'auto', marginRight: 10,}}> 

        {userName === item.name ? (
        <TouchableOpacity activeOpacity={0.11}  onPress={() => gogotest()}>
                <DotsThree  size={35} color={'#b2b2b2'} style={{  marginTop : -5, marginRight : 10}}/>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity activeOpacity={0.11} onPress={() => gogotest1()}>
                 <DotsThree  size={35} color={'#b2b2b2'} style={{  marginTop : -5, marginRight : 10}}/>
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
        <TouchableOpacity activeOpacity={0.11} onPress={() => likeplus(item.likecount, item.id, item.likecolor)}>
        <View style={{flexDirection: 'row', }}>
        <ThumbsUp size={20} color={item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"}     style={{ marginTop: 12, marginLeft: 10 }}/>
        <Text style={{
          marginTop: 10,
          color: item.likedBy && item.likedBy.includes(userName)  ? "#e61e1e" : "#b2b2b2",
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
        </View>
       </View>
       <View style={{ borderBottomColor: 'lightgray', borderBottomWidth: 0.3, marginTop : 20}}/>
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
      backgroundColor="rgba(0, 0, 0, 1)" // 반투명 배경색
    />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <View style={styles.modalSection}>
             
            <TouchableOpacity activeOpacity={0.11} onPress={() => {
                    setedit(true)
                    setModalVisible2(!modalVisible2);
                    scrollToBottom(); // 터치 시 화면을 맨 아래로 스크롤
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
          
  
            <TouchableOpacity activeOpacity={0.11} style={styles.confirmButton} onPress={() => { 
              setContent(null)
               setModalVisible2(!modalVisible2)
               }}>
               
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
      backgroundColor="rgba(0, 0, 0, 1)" // 반투명 배경색
    />
      <View style={styles.centeredView}>
        <View style={styles.modalView1}>
          <View style={{flexDirection : 'row'}}>
          <TouchableOpacity  activeOpacity={0.11} onPress={() => {setModalVisible4(!modalVisible4)}}>
         
          </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.modalSection}>
             


              <TouchableOpacity activeOpacity={0.11} onPress={() => {
                 navigation.navigate("Feedback5",{item : text5, change})
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
       </View>
    );
  }

 

  return (
    <>
    <ScrollView  ref={scrollViewRef} showsVerticalScrollIndicator={false} style={{flex: 1, marginTop : 20}}>

    <StatusBar translucent={true} backgroundColor={'#000000'}  />
      
     
      <Video
        ref={videoRef}
        style={{ width: '100%', height: 250 , marginBottom : 20}}
        source={{ uri: videoUri }}
        useNativeControls // 네이티브 플레이어 컨트롤 사용
        resizeMode="cover"
      />
     
       
  
      <View style={{ marginLeft : 20 , marginTop : 20}}>

      <Text style={{fontSize : 17, fontWeight: "600",fontFamily: "Pretendard", fontStyle: "normal",}}>{text1}</Text>
      <Text style={{fontSize : 17, fontWeight: "600",fontFamily: "Pretendard", fontStyle: "normal",}}>{text2}</Text>
      <Text style={{fontSize : 16, fontWeight: "600",fontFamily: "Pretendard", fontStyle: "normal", color :'#b2b2b2'}}>{text3}</Text>
      </View>
      <View style={{flexDirection : 'row', marginLeft : 'auto', marginRight : 20, marginTop : 5}}>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>onShare()}>
      <ShareNetwork  size={25} color={'#b2b2b2'} style={{ marginTop : -2, marginRight : 18}}/>
      </TouchableOpacity >
      <TouchableOpacity  activeOpacity={0.11} onPress={toggleIconColor}>
        <BookmarkSimple  size={27} color={iconColor} style={{marginLeft : 1, marginTop : -3}} />
      </TouchableOpacity>
      </View>
      <View style={{ borderBottomColor: '#707070', borderBottomWidth: 0.7, marginTop : 15, marginLeft : -30}}/>


  
      <View style={{flexDirection : 'row', }}>
        <TouchableOpacity  activeOpacity={0.11} onPress={() => {setModalVisible1(!modalVisible1)}}>
      <View style={{flexDirection : 'row', marginTop : 15, marginLeft : 20}}>
          <CaretDown  size={25} color={'#484848'} style={{ marginTop : -2, marginLeft : 0}}/>
          <Text style={{fontWeight: "500",fontSize: 15, fontFamily: "Pretendard", textAlign: "left",  fontStyle: "normal", marginLeft : 0}}>{" "}{category}</Text>
        </View>
        </TouchableOpacity>
      <View style={{ marginTop : 15, marginLeft : 'auto', marginRight : 20,}}>
      <TouchableOpacity activeOpacity={0.11}>
      <View style={{ flexDirection : 'row'}}>
      <WarningCircle  size={19} color={'#b2b2b2'} style={{ marginTop : 1, marginRight : 3}}/>
      <Text style={{color : '#b2b2b2'}}>{"운영규칙"}</Text>
      </View> 
      </TouchableOpacity>
      </View>
      </View>

      <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.7, marginTop : 15, marginLeft : -30}}/>

      {posts.length === 0 ? (
        
        <View style={{ height: 150, backgroundColor: 'transparent' }}>
          <Text style={{ color: '#4a5cfc', fontSize: 15, marginTop: 20, marginLeft: 20, fontFamily: 'Pretendard', fontWeight: 'bold', fontStyle: 'normal' }}>
            {"댓글 "}{posts.length}
          </Text>
          {/* 100 높이의 공간에 표시할 내용을 넣으세요 */}
        </View>
      ) : (
        <>
          <Text style={{ color: '#4a5cfc', fontSize: 15, marginTop: 20, marginLeft: 20, fontFamily: 'Pretendard', fontWeight: 'bold', fontStyle: 'normal' }}>
          {"댓글 "}{posts.length - posts.filter(post => post.bancount === 1).length}
          </Text>
          {renderContent1()}
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
          onPress={() => edit ? updatePost1() : onSubmit(text4,text5)}
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
      backgroundColor="rgba(0, 0, 0, 1)" // 반투명 배경색
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


 
      </>

  );
}
