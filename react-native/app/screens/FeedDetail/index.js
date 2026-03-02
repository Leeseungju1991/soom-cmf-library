import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  ToastAndroid,
  StatusBar,
  Share,
  ActivityIndicator
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {SafeAreaView, Text, Image, TextInput} from '@components';
import styles from './styles';
import { getAuth } from 'firebase/auth';
import {homeSelect } from '@selectors';
import {useSelector} from 'react-redux';
import {CaretDown, ShareNetwork, DotsThree, CaretLeft, Heart, ChatText, ThumbsUp} from 'phosphor-react-native';
import {
  getFirestore,
  onSnapshot,
  query,
  where,
  updateDoc,
  addDoc,
  doc,
  getDoc,
  arrayRemove,
  arrayUnion,
  collection,
  getDocs,
  increment,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";

export default function FeedDetail({navigation, route}) {

  const [isLoading, setIsLoading] = useState(true);
  const db = getFirestore();
  const auth = getAuth();
  const item = route.params?.item;
  const item2 = route.params?.item;
  const q2 = collection(db, "post" );
  const [change1, setchange1] = useState();
  const q = collection(db, "post" ,item.id, 'reply' );
  const citiesRef = collection(db, "User");
  const q1 = query(citiesRef, where("email", "==", auth.currentUser.email));
  const [category, setCategory] = useState('최신순');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [posts2, setPosts2] = useState([]);
  const [posts3, setPosts3] = useState([]);
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const moment = require('moment');
  const currentTime = moment()
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const [modalVisible5, setModalVisible5] = useState(false);
  const [edit, setedit] = useState(false);
  const [change, setchange] = useState();

  const {colors} = useTheme();




  const sortPostsByTimeDesc = (posts) => {
    return [...posts].sort((a, b) => {
      const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
      const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
  
      return timeB - timeA;
    });
  };
  
  const isMounted = useRef(true);


  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isMounted.current) {
        const sortedPosts = sortPostsByTimeDesc(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setPosts(sortedPosts);
      }
    });

    return () => unsubscribe();
    
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(q2, (snapshot) => {
      if (isMounted.current) {
        const filteredPosts = snapshot.docs
          .filter((doc) => doc.id === route.params?.item.id)
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts2(filteredPosts);
      }
    });

    return () => unsubscribe();
  }, [route.params?.item.id]);

  useEffect(() => {
    // 3초 후에 isLoading 상태를 false로 업데이트하여 로딩 화면을 벗어납니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // 컴포넌트가 언마운트 될 때 타이머를 클리어합니다.
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const unsubscribe = onSnapshot(q1, (snapshot) => {
      if (snapshot.size > 0) {
        const userData = snapshot.docs[0].data();
        setUserName(userData.id || "");
      }
    });

    return () => {
      unsubscribe(); // 클린업 함수에서 구독 해제
    };
  }, []);


  const onSubmit = async () => {
    if (content != '') {
      try {
        const docRef = await addDoc(collection(db, 'post', item.id, 'reply'), {
          reply: content,
          name: userName,
          likecount: 0,
          Feed: Math.random().toString(36),
          likecolor: false,
          time: currentTime.format('YYYY-MM-DD HH:mm'),
          bancount: 0,
          commentcount: 0
        });
  
        // 댓글 추가 후 commentcount를 업데이트
        await updateDoc(doc(db, 'post', item.id), {
          commentcount: increment(1)
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
      await updateDoc(doc(db, 'post', item2.id, 'reply', change), {
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


  const deletePost1 = async () => {
    console.log(change)
    try {
      console.log("야호")
      // Firestore에서 문서 삭제
      await deleteDoc(doc(db, 'post', item2.id, 'reply', change));
      // posts2 배열에서도 삭제

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== change));
      await updateDoc(doc(db, 'post', item2.id), {
        commentcount: increment(-1)
      });
      ToastAndroid.show('댓글이 삭제되었습니다.', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };
  
  const deletePost = async (postId) => {
    try {
      // Firestore에서 문서 삭제
      await deleteDoc(doc(db, 'post', postId));
      // posts2 배열에서도 삭제
      setPosts2((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      ToastAndroid.show('토크가 삭제되었습니다.', ToastAndroid.SHORT);
      navigation.goBack();
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


const likeplus = async (likecount,postId, currentLikeColor, ) => {
  console.log(item2.id)
  console.log(postId)
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("사용자가 인증되지 않았습니다.");
      // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
      return;
    }

    const postDocRef = doc(db, 'post', item2.id, 'reply', postId);
  
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
        likedBy: arrayRemove(userName, customDateTimeString), // 사용자 UID를 "likedBy" 배열에서 제거
      });
  
      // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
    } else {
      // 아직 좋아요를 누르지 않은 경우 좋아요 추가
      await updateDoc(postDocRef, {
        likecount: increment(1),
        likedBy: arrayUnion(userName, customDateTimeString), // 사용자 UID를 "likedBy" 배열에 추가
      });
      // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
    }
  } catch (error) {
    console.error("좋아요 업데이트 중 오류 발생:", error);
    // 오류 메시지를 사용자에게 표시 (예: 모달 또는 토스트 메시지)
  }
};

const scrollViewRef = useRef();

const scrollToBottom = () => {
  if (scrollViewRef.current) {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }
};
const onRefresh = () => {
  setRefreshing(true);
};

const likeplus2 = async (email, postId, currentLikeColor) => {
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
      const emailDocRef = doc(db, 'User', email); // Assuming 'posts' is the collection containing email documents
      await updateDoc(emailDocRef, {
        alarmonff: true,
      });
      console.log("좋아요 추가 완료");
      // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
    }
  } catch (error) {
    console.error("좋아요 업데이트 중 오류 발생:", error);
    // 오류 메시지를 사용자에게 표시 (예: 모달 또는 토스트 메시지)
  }
};



  const onShare = async (title) => {
    console.log("야호")
    try {
      console.log("야호")
      const result = await Share.share(
        {
          message: title + '\n\n제약인 어플 출시!\n매일 출석 이벤트에 도전하세요!\n\n제약인\n https://play.google.com/store/apps/details?id=com.huynh.jeyakin',
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
        if (bookmarks.includes(item.id)) {
          console.log('이미 북마크에 추가된 게시물입니다.');
          ToastAndroid.show('이미 북마크에 추가된 게시물입니다.', ToastAndroid.SHORT);
        } else {
          // 사용자의 'bookmark' 필드에 현재 게시물 ID를 추가
          await updateDoc(doc(db, 'User', userId), {
            bookmark: arrayUnion(item.id), // item.id는 현재 게시물의 ID입니다.
          });
  
          ToastAndroid.show('북마크에 추가되었습니다.', ToastAndroid.SHORT);
        }
      } else {
        console.error('사용자를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('북마크 추가 중 오류 발생:', error);
    }
  };


  const renderContent = () => {

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
      
      <FlatList
      data={sortedPosts}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
    />
    );
  };


 

  const renderItem = ({ item }) => {

       const gogo = async (id) => {
        navigation.navigate("FeedDetail2",{item2, item})
      // await updateDoc(doc(db, "post", id), {
      // viewcount : count + 1
      //  });
      };

 
      const gogotest = () => {
      
        setchange(item.id)
        setContent(item.reply)
        console.log(change)
        setModalVisible3(!modalVisible3)
      }


 


    return (
      <SafeAreaView>
      
      <View>
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
             
            <TouchableOpacity activeOpacity={0.11} onPress={() => {
                setedit(true)
                setModalVisible3(!modalVisible3);
                scrollToBottom();
            }}>
              <Text style={styles.modalSectionTitle}>{"수정"}</Text>
              </TouchableOpacity>

              <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10, width : '80%' , marginLeft : '10%' }} />

              <TouchableOpacity activeOpacity={0.11} onPress={() => {
                  setContent(null)
                 deletePost1()
                 setModalVisible3(!modalVisible3);
              }}>
              <Text style={styles.modalSectionTitle1}>{"삭제"}</Text>
              </TouchableOpacity>
            
            </View>
          
  
            <TouchableOpacity activeOpacity={0.11} style={styles.confirmButton} onPress={() => {    setContent(null)
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
                 navigation.navigate("Feedback2",{item2, item})
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


        <View style={{flexDirection: 'row', marginTop: -10, marginLeft : 20}}>
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848"}}>{userName === item.name ? "작성자" : "종사자"}</Text>
        <View style={{ width: 1.2, height: 15, marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <View style={{ width: 1, height: 0,marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848"}}>{item.name}</Text>
        <View  style={{ marginLeft : 'auto', marginRight : 35,}}>
        {userName === item.name ? (
        <TouchableOpacity activeOpacity={0.11}  onPress={()=>gogotest()} style={{ padding: 10, marginTop: -10, marginRight: -10 }}>
                <DotsThree  size={35} color={'#b2b2b2'} style={{ marginTop : -2, }}/>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity activeOpacity={0.11}  onPress={() => {setModalVisible4(!modalVisible4)}} style={{ padding: 10, marginTop: -10, marginRight: -10 }}>
                 <DotsThree  size={35} color={'#b2b2b2'} style={{ marginTop : -2,}}/>
        </TouchableOpacity>
      )}
        </View>
            
        </View>
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848" , marginLeft : 20 , marginTop : -5}}>
        {item.reply} 
        </Text>
        <View style={{flexDirection: 'row', marginLeft : 10}}>
        <Text style={{marginTop : 10, marginLeft : 10, color : '#b2b2b2', fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", letterSpacing: 0,}}>
        {getTimeAgo(item.time)} 
        </Text>
 

        <TouchableOpacity  activeOpacity={0.11} onPress={() => likeplus(item.likecount, item.id, item.likecolor)}>
        <View style={{flexDirection : 'row'}}>
        <ThumbsUp size={20} c color={item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"}     style={{ marginTop: 12, marginLeft: 10 }}/>
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
        <TouchableOpacity activeOpacity={0.11} onPress={()=>gogo(item.id)}> 
        <View style={{flexDirection: 'row'}}>
        <ChatText size={20} color={"#b2b2b2"}  style={{ marginTop: 11, marginLeft: 10 }}/>

        <Text style={{marginTop : 10, color : '#b2b2b2',marginLeft : 5, fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", }}>
        {"대 댓글 "}{item.commentcount}
        </Text>
     
 
        </View>
        </TouchableOpacity>
        </View>
       </View>
       
       <View style={{ borderBottomColor: 'lightgray', borderBottomWidth: 0.3, marginTop : 20}}/>
 
       </SafeAreaView>
    );
  }






  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#a234fe" />
    </View>
    );
  }



  return (
    <>
    <ScrollView  ref={scrollViewRef} showsVerticalScrollIndicator={false} style={{flex: 1, marginTop : 30}}>

      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' , marginTop : 0 }}>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>navigation.goBack()} >
          <View style={{flexDirection : 'row'}}>
          <CaretLeft  size={27} color={'#484848'} style={{marginLeft : 15, marginTop : 1}} />
    
          <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :5 }}>{"토크"}</Text>
          </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>onShare(item.title)}  style={{padding : 10, marginTop : 5, marginRight : -5}}>
      <ShareNetwork  size={25} color={'#b2b2b2'} style={{ marginTop : -2, marginRight : 18}}/>
      </TouchableOpacity>
      </View>
      <View style={{ borderBottomWidth: 0.7, marginTop : 5}}/>
 

      <View style={[styles.contain]}>
  {posts2[0] ? (
    // 로딩이 완료되었을 때
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>



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
          <TouchableOpacity  onPress={() => {setModalVisible2(!modalVisible2)}}>
         
          </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.modalSection}>
             
            <TouchableOpacity activeOpacity={0.11}  onPress={() => {
              navigation.navigate("FeedDetailChange1",{item2})
              setModalVisible2(!modalVisible2);
            }}>
              <Text style={styles.modalSectionTitle}>{"수정"}</Text>
              </TouchableOpacity>

              <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10, width : '80%' , marginLeft : '10%' }} />

              <TouchableOpacity activeOpacity={0.11} onPress={() => {
                 deletePost(item.id)
                 setModalVisible2(!modalVisible2);
              }}>
              <Text style={styles.modalSectionTitle1}>{"삭제"}</Text>
              </TouchableOpacity>         
            </View>
          
            <TouchableOpacity activeOpacity={0.11} style={styles.confirmButton} onPress={() => {setModalVisible2(!modalVisible2)}}>
              <Text style={styles.confirmButtonText}>{"취소"}</Text>
              </TouchableOpacity>
          </View>
        </View>

      </View>
    </Modal>


    <Modal
      animationType="fade" 
      transparent={true}
      visible={modalVisible5}
      onRequestClose={() => {
        setModalVisible5(!modalVisible5);
      }}
      
    >
       <StatusBar
      translucent={true}
      backgroundColor="rgba(0, 0, 0, 0.5)" // 반투명 배경색
    />
      <View style={styles.centeredView}>
        <View style={styles.modalView2}>
          <View style={{flexDirection : 'row'}}>
          <TouchableOpacity  activeOpacity={0.11} onPress={() => {setModalVisible5(!modalVisible5)}}>
         
          </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.modalSection}>
             
            <TouchableOpacity activeOpacity={0.11} onPress={() => {
                onBookmarkClick();
                setModalVisible5(!modalVisible5);
            }}>
              <Text style={styles.modalSectionTitle}>{"북마크"}</Text>
              </TouchableOpacity>

              <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10, width : '80%' , marginLeft : '10%' }} />

              <TouchableOpacity activeOpacity={0.11} onPress={() => {
                 navigation.navigate("Feedback1",{item})
                 setModalVisible5(!modalVisible5);
              }}>
              <Text style={styles.modalSectionTitle1}>{"신고"}</Text>
              </TouchableOpacity>
            
            </View>
          
  
            <TouchableOpacity activeOpacity={0.11} style={styles.confirmButton} onPress={() => {setModalVisible5(!modalVisible5)}}>
              <Text style={styles.confirmButtonText}>{"취소"}</Text>
              </TouchableOpacity>
          </View>
        </View>

      </View>
    </Modal>


        <Image
          source={
            posts2[0].category === "회사생활"
              ? require("../../../assets/feed1.png")
              : posts2[0].category === "이직커리어"
              ? require("../../../assets/feed2.png")
              : posts2[0].category === "취미"
              ? require("../../../assets/feed3.png")
              : posts2[0].category === "자유"
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
        <Text
          style={{
            marginLeft: 10,
            color: getCategoryColor(posts2[0].category),
            fontFamily: "Pretendard",
            fontWeight: "500",
            fontStyle: "normal",
            textAlign: "left",
          }}
        >
          {posts2[0].category}
        </Text>
        <View style={{ marginLeft: 'auto', marginRight: -18 }}>
        <TouchableOpacity activeOpacity={0.11}
          onPress={() => {
            if (userName === item.name) {
              setModalVisible2(!modalVisible2)
            } else {
              setModalVisible5(!modalVisible5)
            }
          }}
          style={{ padding: 10, marginTop: 5, marginRight: -5 }}
        >
        <DotsThree  size={35} color={'#b2b2b2'} style={{ marginTop : -2, marginRight : 18}}/>
   
        </TouchableOpacity>
        </View>
      </View>
      
      <View style={{ flexDirection : 'row'}}>
      <Text style={{ marginLeft: 10, marginLeft: 50, marginTop: -20,fontWeight: '500',fontStyle: "normal",color: '#484848',fontFamily: "Pretendard"}}>
      {userName === posts2[0].name ? "작성자" : "종사자"}
      </Text>
      <View style={{ width: 1.2, height: 15, marginTop: -16, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
      <View style={{ width: 1, height: 0,marginTop: -20, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
      <Text style={{  marginTop: -20,fontWeight: '500',fontStyle: "normal",color: '#484848',fontFamily: "Pretendard",paddingRight: 30,}}>
      {posts2[0].name}
      </Text>

      <Text
            style={{
              marginLeft: -20,
              marginTop: -20,
              fontFamily: "Pretendard",
              fontWeight: "500",
              fontStyle: "normal",
              textAlign: "left",
              color: "#b2b2b2",
            }}
          >
            {getTimeAgo(posts2[0].time)}
          </Text>
      </View>
      <View style={{ marginTop: 20, marginLeft: 5 }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontFamily: "Pretendard",
            fontStyle: "normal",
            textAlign: "left",
            color: "#000000",
            fontSize: 19,
          }}
        >
          {(posts2[0].title)}
        </Text>
        <Text
          style={{
            marginTop: 20,
            fontFamily: "Pretendard",
            fontSize: 15,
            fontStyle: "normal",
            fontWeight: "normal",
            color: "#484848",
            textAlign: "left",
            letterSpacing: 0,
            paddingRight: 30,
          }}
        >
          {(posts2[0].comment)}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} horizontal>
  <View style={{ flexDirection: 'row', marginLeft: -12, marginTop: 20 }}>
    {(posts2[0].image1 == null)? (
      <View />
    ) : (
      <Image
      source={{ uri: posts2[0].image1 }}
      style={{ width: 160, height: 150, borderRadius: 10, marginTop: 0, marginLeft: 20 }}
      onError={() => {
        console.log("에러")
        return (
          <View />
        );
      }}
    />
    )}
    {(posts2[0].image2 == null)? (
      <View />
    ) : (
      <Image
      source={{ uri: posts2[0].image2 }}
      style={{ width: 160, height: 150, borderRadius: 10, marginTop: 0, marginLeft: 20 }}
      onError={() => {
        console.log("에러")
        return (
          <View />
        );
      }}
    />
    )}
  {(posts2[0].image3 == null) ? (
      <View />
    ) : (
      <Image
      source={{ uri: posts2[0].image3 }}
      style={{ width: 160, height: 150, borderRadius: 10, marginTop: 0, marginLeft: 20 }}
      onError={() => {
        console.log("에러")
        return (
          <View />
        );
      }}
    />
    )}
     {(posts2[0].image4 == null) ? (
      <View />
    ) : (
      <Image
      source={{ uri: posts2[0].image4 }}
      style={{ width: 160, height: 150, borderRadius: 10, marginTop: 0, marginLeft: 20 }}
      onError={() => {
        console.log("에러")
        return (
          <View />
        );
      }}
    />
    )}
  </View>
</ScrollView>
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            width: 175,
            height: 38,
            backgroundColor: posts2[0].likedBy && posts2[0].likedBy.includes(userName) ? "#4A5CFC" : "#f5f5f5" ,
            borderRadius: 6,
            marginTop: 30,
            marginLeft: 5,
          }}
        >
          <TouchableOpacity activeOpacity={0.11}
            onPress={() =>
              likeplus2(posts2[0].email, posts2[0].id, posts2[0].likecolor)
            }
          >

            <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 35 }}>
              <Heart size={20}   color={posts2[0].likedBy && posts2[0].likedBy.includes(userName) ? "#FFFFFF" : "#b2b2b2"} style={{ marginTop: 2, marginLeft: 10 }}/>
              <Text style={{ marginTop: 0, marginLeft: 8,  color: posts2[0].likedBy && posts2[0].likedBy.includes(userName) ? "#FFFFFF" : "#b2b2b2" }}>
              {"좋아요"} {posts2[0].likecount}
              </Text>

            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: 175,
            height: 38,
            backgroundColor: '#f5f5f5',
            borderRadius: 6,
            marginTop: 30,
            marginLeft: 5,
          }}
        >
          <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 40 }}>
          <ChatText size={20} color={"#b2b2b2"}  style={{ marginTop: 2, marginLeft: 5 }}/>
            <Text
              style={{
                marginTop: 0,
                marginLeft: 10,
                color: "#b2b2b2",
              }}
            >
            {"댓글 "}{posts.length - posts.filter(post => post.bancount === 1).length}
            </Text>
          </View>
        </View>
      </View>
    </View>
  ) : (
    // 로딩 중 또는 에러 상태 처리
  <>
  </>
    // 또는 에러 처리를 원하는 방식으로 작성
  )}
</View>




  
       <View style={{ borderStyle: 'solid',  borderColor: '#dedede',  borderWidth: 0.5, marginTop : 20}}/>
       <TouchableOpacity activeOpacity={0.11} onPress={() => {setModalVisible(!isModalVisible)}}> 
        <View style={{flexDirection : 'row', marginTop : 10, marginLeft : 20}}>
        <CaretDown  size={25} color={'#484848'} style={{ marginTop : -2, marginLeft : 0}}/>
          <Text style={{fontWeight: "500",fontSize: 15, fontFamily: "Pretendard", textAlign: "left",  fontStyle: "normal", marginLeft : 0}}>{" "}{category}</Text>
        </View>
       </TouchableOpacity>
       <View style={{ borderStyle: 'solid',  borderColor: '#dedede',  borderWidth: 0.5, marginTop : 10}}/>
    

       {renderContent()}
  
       <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        setModalVisible(!isModalVisible);
      }}
    >
       <StatusBar
      translucent={true}
      backgroundColor="rgba(0, 0, 0, 0.5)" // 반투명 배경색
    />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{flexDirection : 'row'}}>
          <TouchableOpacity activeOpacity={0.11} onPress={() => {setModalVisible(!isModalVisible)}}>
         
          </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.modalSection}>
             
            <TouchableOpacity activeOpacity={0.11}  onPress={() => {
              setCategory("최신순");
              setModalVisible(!isModalVisible);
            }}>
              <Text style={styles.modalSectionTitle}>{"최신순"}</Text>
              </TouchableOpacity>
              <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10, width : '80%' , marginLeft : '10%' }} />
              <TouchableOpacity activeOpacity={0.11} onPress={() => {
                setCategory("오래된순");
                setModalVisible(!isModalVisible);
              }}>
              <Text style={styles.modalSectionTitle1}>{"오래된순"}</Text>
              </TouchableOpacity>
           
            </View>
          
  
            <TouchableOpacity activeOpacity={0.11} style={styles.confirmButton} onPress={() => {setModalVisible(!isModalVisible)}}>
              <Text style={styles.confirmButtonText}>{"취소"}</Text>
              </TouchableOpacity>
          </View>
        </View>

      </View>
    </Modal>

    

      </SafeAreaView>
 

    </ScrollView>

<View style={{ borderColor: '#e9e9e9', borderWidth: 1, borderStyle: 'solid', borderBottomWidth: 0.5, marginTop : 0}}/>

<TextInput
  placeholder={edit ? '수정글을 남겨주세요' : '댓글을 남겨주세요'}
  value={content}
  style={{ width: '90%', borderRadius: 9, marginLeft: '5%', marginTop: 15 }}
  onChangeText={setContent}
  icon={
    <TouchableOpacity activeOpacity={0.11} onPress={() => (edit ? updatePost1() : onSubmit())}>
      <Text
        style={{
          fontFamily: 'Pretendard',
          fontWeight: '500',
          fontStyle: 'normal',
          textAlign: 'left',
          letterSpacing: 0,
          color: '#4a5cfc',
        }}
      >
        {edit ? '수정' : '등록'}
      </Text>
    </TouchableOpacity>
  }
/>
<View style={{ marginTop : 15}}></View>
</>
  );
}
