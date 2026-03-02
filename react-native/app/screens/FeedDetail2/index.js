import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Platform,
  ToastAndroid,
  Share,
  RefreshControl,
  Modal,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
} from '@components';
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
  increment,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import {ThumbsUp, ShareNetwork, DotsThree, CaretLeft} from 'phosphor-react-native';
import { getAuth } from 'firebase/auth';
import styles from './styles';
import moment from 'moment';
export default function FeedDetail2({navigation, route}) {
  const {colors} = useTheme();
  const [change, setchange] = useState('');
  const [category, setCategory] = useState('');
  const [liked, setLiked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [rereply, setReReply] = useState();
  const db = getFirestore();
  const citiesRef = collection(db, "User");
  const item = route.params?.item;
  const item2 = route.params?.item2;
  const item3= route.params?.item;
  const auth = getAuth();
  const q = collection(db, 'post',item2.id, 'reply', item.id, 'rereply' );
  const q1 = query(citiesRef, where("email", "==", auth.currentUser.email));
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const componentMounted = useRef(true);
  const currentTime = moment()
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible5, setModalVisible5] = useState(false);
  const [edit, setedit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const updatePost1 = async () => {
    
    console.log(item2.id)
    console.log(item3.id)
    
    if (content != '') {
    try {
      // Firestore에서 문서 업데이트
      await updateDoc(doc(db, 'post', item2.id, 'reply', item3.id, 'rereply', change), {
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

  const onRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    console.log(item2)

    onSnapshot(q, (snapshot) => {
      if (componentMounted.current) {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        
      }

      return () => {
        componentMounted.current = false;
      };
    });
  }, []);
  

  const scrollViewRef = useRef();

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };


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
  
  const likeplus = async (likecount, postId, currentLikeColor) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("사용자가 인증되지 않았습니다.");
        return;
      }
  
      const postDocRef = doc(db, 'post', item2.id, 'reply', postId);
  
      // 게시물 문서에서 "likedBy" 필드를 가져와 현재 사용자 UID가 있는지 확인
      const postSnapshot = await getDoc(postDocRef);
      const likedBy = postSnapshot.data().likedBy || [];
  
      // 현재 like 필드의 상태에 따라 토글
      const newLikeColor = !currentLikeColor;
  
      const currentTime = serverTimestamp(); // 현재 시간을 Firestore Timestamp로 가져오기
  
      // 이미 좋아요를 누른 경우 좋아요 취소
      if (likedBy.includes(userName)) {
        await updateDoc(postDocRef, {
          likecount: newLikeColor ? likecount + 1 : likecount - 1,
          likecolor: newLikeColor,
          likedBy: arrayRemove(userName), // 사용자 UID를 "likedBy" 배열에서 제거
          unlikedAt: currentTime, // 좋아요 취소 시간 추가
        });
        console.log("좋아요 취소 완료");
      } else {
        // 아직 좋아요를 누르지 않은 경우 좋아요 추가
        await updateDoc(postDocRef, {
          likecount: newLikeColor ? likecount + 1 : likecount - 1,
          likecolor: newLikeColor,
          likedBy: arrayUnion(userName), // 사용자 UID를 "likedBy" 배열에 추가
          likedAt: currentTime, // 좋아요 누른 시간 추가
        });
        console.log("좋아요 추가 완료");
      }
    } catch (error) {
      console.error("좋아요 업데이트 중 오류 발생:", error);
    }
  };


  
  const likeplus2 = async (likecount, postId, currentLikeColor) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("사용자가 인증되지 않았습니다.");
        return;
      }
  
      const postDocRef = doc(db, 'post', item2.id, 'reply', item.id, 'rereply', postId);
  
      // 게시물 문서에서 "likedBy" 필드를 가져와 현재 사용자 UID가 있는지 확인
      const postSnapshot = await getDoc(postDocRef);
      const likedBy = postSnapshot.data().likedBy || [];
      const likedAt = postSnapshot.data().likedAt || [];
  
      // 현재 like 필드의 상태에 따라 토글
      const newLikeColor = !currentLikeColor;
  
      // 이미 좋아요를 누른 경우 좋아요 취소
      if (likedBy.includes(userName)) {
        await updateDoc(postDocRef, {
          likecount: newLikeColor ? likecount + 1 : likecount - 1,
          likecolor: newLikeColor,
          likedBy: arrayRemove(userName, currentTime.format('YYYY-MM-DD HH:mm')), // 사용자 UID를 "likedBy" 배열에 추가
        });
        console.log("좋아요 취소 완료");
      } else {
        // 아직 좋아요를 누르지 않은 경우 좋아요 추가
        await updateDoc(postDocRef, {
          likecount: newLikeColor ? likecount + 1 : likecount - 1,
          likecolor: newLikeColor,
          likedBy: arrayUnion(userName, currentTime.format('YYYY-MM-DD HH:mm')), // 사용자 UID를 "likedBy" 배열에 추가
  
        });
        console.log("좋아요 추가 완료");
      }
    } catch (error) {
      console.error("좋아요 업데이트 중 오류 발생:", error);
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

 
  const onSubmit = async (item ) => {
      console.log(item)
      if(content !== ''){
        try {
          const docRef = await addDoc(collection(db,'post',item2.id, 'reply', item.id, 'rereply'), {
            reply : content,
            name : userName,
            likecount : 0,
            likecolor : false,
            time : currentTime.format('YYYY-MM-DD HH:mm'),
            bancount : 0
           
          });
          await updateDoc(doc(db, 'post',item2.id, 'reply', item.id), {
            commentcount: increment(1)
          });
          setContent(null)
          ToastAndroid.show('댓글이 작성되었습니다.', ToastAndroid.SHORT);
          
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
      else{
        ToastAndroid.show('댓글을 작성해주세요.', ToastAndroid.SHORT);
      }

  }

  const deletePost = async (postId) => {
    try {
      // Firestore에서 문서 삭제
      await deleteDoc(doc(db, 'post',item2.id, 'reply', item.id, 'rereply' , change));
      // posts2 배열에서도 삭제

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== change));
      await updateDoc(doc(db, 'post', item2.id, 'reply', item.id) , {
        commentcount: increment(-1)
      });
      ToastAndroid.show('댓글이 삭제되었습니다.', ToastAndroid.SHORT);
      
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };




  const renderContent = () => {

    sortedPosts = [...posts]
    .filter(post => post.bancount !== 1) // Exclude posts with bancount equal to 1
    .sort((a, b) => {
      const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
      const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
      return timeB - timeA;
    });
   
    return (
      
      <View style={{flex: 1, marginTop : 0, backgroundColor : '#f5f5f5'}}>
       
      <View style={{marginTop : 0, backgroundColor: colors.card}}>
        
      <FlatList 
        contentContainerStyle={{marginLeft : 20}}
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
      />
      </View>

      </View> 
    );
  };



  const renderItem = ({ item }) => {

    const gogotest = () => {
         
      setchange(item.id)
      setContent(item.reply)
      setModalVisible2(!modalVisible2);
    }

    const gogotest1 = () => {
         
      setchange(item.id)
      setContent(item.reply)
      setModalVisible5(!modalVisible5);
    }

    return (
      <SafeAreaView >
       <View > 
       <StatusBar translucent={true} backgroundColor={'transparent'} />
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
               setedit(true)
               setModalVisible2(!modalVisible2);
               scrollToBottom(); // 터치 시 화면을 맨 아래로 스크롤
            }}>
              <Text style={styles.modalSectionTitle}>{"수정"}</Text>
              </TouchableOpacity>

              <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10, width : '80%' , marginLeft : '10%' }} />

              <TouchableOpacity activeOpacity={0.11} onPress={() => {
                 setContent(null)
                 deletePost()
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
        <View style={styles.modalView3}>
          <View style={{flexDirection : 'row'}}>
          <TouchableOpacity  activeOpacity={0.11} onPress={() => {setModalVisible5(!modalVisible5)}}>
         
          </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.modalSection}>
             

              <TouchableOpacity activeOpacity={0.11} onPress={() => {
                 navigation.navigate("Feedback6",{item2, item3 , change})
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



        <View style={{flexDirection: 'row', marginTop: -10, marginLeft : 20}}>
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848"}}>{userName === item.name ? "작성자" : "종사자"}</Text>
        <View style={{ width: 1.2, height: 15, marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <View style={{ width: 1, height: 0,marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848"}}>{item.name}</Text>
        <View  style={{ marginLeft : 'auto', marginRight : 30,}}>
        {userName === item.name ? (
        <TouchableOpacity activeOpacity={0.11} onPress={() => gogotest()}>
                <DotsThree  size={35} color={'#b2b2b2'} style={{ marginTop : -5, }}/>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity activeOpacity={0.11} onPress={() => gogotest1()}>
                 <DotsThree  size={35} color={'#b2b2b2'} style={{ marginTop : -5,}}/>
        </TouchableOpacity>
      )}
        </View>
            
        </View>
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848" , marginLeft : 20 , marginTop : 10}}>
        {item.reply} 
        </Text>
        <View style={{flexDirection: 'row', marginLeft : 10}}>
        <Text style={{marginTop : 10, marginLeft : 10, color : '#b2b2b2', fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", letterSpacing: 0,}}>
        {getTimeAgo(item.time)} 
        </Text>
        <TouchableOpacity  onPress={() => likeplus2(item.likecount, item.id, item.likecolor)}>
        <View style={{flexDirection : 'row'}}>
        <ThumbsUp size={20} c color={item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"}     style={{ marginTop: 12, marginLeft: 10 }}/>
   



        <Text style={{
          marginTop: 10,
          color:  item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2",
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
          color:  item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2",
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
       </SafeAreaView>
    );
  }

 
  const onShare = async (title) => {
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
      alert(error.message);
    }
  };


  return (
    <View style={{flex: 1, marginTop : 40}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' , marginTop : 0 }}>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>navigation.goBack()} >
          <View style={{flexDirection : 'row'}}>
          <CaretLeft  size={27} color={'#484848'} style={{marginLeft : 15, marginTop : 1}} />
    
          <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :5 }}>{"토크"}</Text>
          </View>
      </TouchableOpacity> 
      <TouchableOpacity activeOpacity={0.11} onPress={() => onShare()} style={{ marginLeft: 'auto', marginRight: 0 }}>
      <ShareNetwork  size={25} color={'#b2b2b2'} style={{ marginTop : -2, marginRight : 25}}/>
      </TouchableOpacity>
    </View>
      
    <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.7, marginTop : 20}}/>
    
    <SafeAreaView>
      <View>
        
        <View style={{flexDirection: 'row', marginTop: -10, marginLeft : 20}}>
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848"}}>{userName === item.name ? "작성자" : "종사자"}</Text>
        <View style={{ width: 1.2, height: 15, marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <View style={{ width: 1, height: 0,marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848"}}>{item.name}</Text>
            
        </View>
        <Text style={{fontWeight: "500",fontSize: 14, fontFamily: "Pretendard",textAlign: "left", fontStyle: "normal", color: "#484848" , marginLeft : 20 , marginTop : 10}}>
        {item.reply} 
        </Text>
        <View style={{flexDirection: 'row', marginLeft : 10}}>
        <Text style={{marginTop : 10, marginLeft : 10, color : '#b2b2b2', fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", letterSpacing: 0,}}>
        {getTimeAgo(item.time)} 
        </Text>

      
        <View style={{flexDirection : 'row'}}>
        <ThumbsUp size={20} c color={item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"}     style={{ marginTop: 12, marginLeft: 10 }}/>
        <Text style={{
          marginTop: 10,
          color:  item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2",
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
          color:  item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2",
          marginLeft: 5,
          fontFamily: "Pretendard",
          fontWeight: "normal",
          fontStyle: "normal",
          letterSpacing: 0,
        }}>
          {item.likecount} 
        </Text>
          </View>
         
        </View>
       </View>
       <View style={{ borderBottomColor: 'lightgray', borderBottomWidth: 0.3, marginTop : 20}}/>
       </SafeAreaView>
       <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
    
       {renderContent()}
    </ScrollView>

    

      <View style={{marginTop : 'auto'}}>
      <View style={{ borderColor: '#e9e9e9', borderWidth: 1, borderStyle: 'solid', borderBottomWidth: 0.5, marginBottom : 15}}/>
      <TextInput
        placeholder={edit ? '수정글을 남겨주세요' : '댓글을 남겨주세요'}
        value={content}
        style={{width : '90%', borderRadius : 9, marginLeft : '5%', marginBottom : 15}}
        onChangeText={setContent}
        icon={
          <TouchableOpacity activeOpacity={0.11}
            onPress={() => edit ? updatePost1() : onSubmit(item)}
            style={styles.btnClearSearch}>

           <Text style={{fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal",textAlign: "left",letterSpacing: 0, color: "#4a5cfc"}}>{edit ? '수정' : '등록'}</Text>
          </TouchableOpacity>
        }
      />
      </View>
    </View>
  );
}
