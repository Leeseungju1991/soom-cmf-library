import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {useTheme} from '@config';
import { Text, Image, Header} from '@components';
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
  increment
} from "firebase/firestore";
import {CaretLeft} from 'phosphor-react-native';
import { getAuth } from 'firebase/auth';
import { Dimensions } from 'react-native';


export default function alarm({navigation}) {

const screenWidth = Dimensions.get('window').width;
const maxTextWidth = 0.8 * screenWidth; // 80% of the screen width


  const auth = getAuth();
  const db = getFirestore();
  const colGroupRef = collectionGroup(db, "post");
  const q = query(colGroupRef, where("email", "==", auth.currentUser.email));

  const [posts, setPosts] = useState([]);


  const componentMounted = useRef(true);


  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date()); // 현재 시간

  const user1DocRef = doc(db, "User", "lsj@dailypharm.com");
  // 쿼리 생성

  const [autostart, setAutostate] = useState();

  const [likedBy, setLikedBy] = useState([]);

  useEffect(() => {
    // 화면 진입 시에 alarmonff를 false로 설정
    updateAlarmOn();
  }, []);

  
  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const colGroupRef = collectionGroup(db, "post");
    const q = query(colGroupRef, where("email", "==", auth.currentUser.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedLikedBy = [];
      snapshot.forEach((doc) => {
        const postData = doc.data();
        if (postData.likedBy) {
          // 만약 likedBy 필드가 배열 형태로 존재한다면 업데이트합니다.
          updatedLikedBy.push({ id: doc.id, likedBy: postData.likedBy });
        }
      });
      setLikedBy(updatedLikedBy);
      console.log(likedBy)
    });

    return () => {
      unsubscribe();
    };
  }, []);

 
  const [data1, setData1] = useState([]);


  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      if (componentMounted.current) {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      //  console.log(posts)
      }
      return () => {
        componentMounted.current = false;
      };
    });
  }, []);
  






  useEffect(() => {
    getDoc(user1DocRef)
    .then((docSnapshot) => {
      // 문서가 존재하면 필드 값을 출력
      if (docSnapshot.exists()) {
        setAutostate(docSnapshot.data().banneronoff)
      //  console.log(autostart)
      }
        else {
        console.log("user1 문서가 존재하지 않습니다.");
      }
    })
    .catch((error) => {
      console.log("user1 문서 가져오기 실패:", error);
    });
  }, []);

 

  useEffect(() => {
    // 3초 후에 isLoading 상태를 false로 업데이트하여 로딩 화면을 벗어납니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    // 컴포넌트가 언마운트 될 때 타이머를 클리어합니다.
    return () => clearTimeout(timer);
  }, []);




  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date()); // 1초마다 현재 시간 업데이트
    }, 1000);
    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  const truncateTitle = (title) => {
    // 공백과 줄 바꿈 문자를 모두 제거하여 1줄로 만듭니다.
    const oneLineTitle = title.replace(/\s+/g, ' ');
  
    if (oneLineTitle.length > 20) {
      return oneLineTitle.slice(0, 20) + '...';
    } else {
      return oneLineTitle;
    }
  }
  

  const updateAlarmOn = async () => {
    try {
      // 사용자의 Firestore 문서 참조
      const userRef = doc(db, "User", auth.currentUser.email);
  
      // Firestore 문서 업데이트
      await updateDoc(userRef, {
        alarmonff: false,
        alarmcheck : true
      });
  
      console.log("Firestore 데이터 업데이트 성공: alarmonff를 true로 설정했습니다.");
    } catch (error) {
      console.error("Firestore 데이터 업데이트 오류:", error);
    }
  };

  
  const onItemAdded = () => {
    // 아이템이 추가되면 알림을 활성화시키고 Firestore 데이터베이스를 업데이트
    updateAlarmOn();
  };





  const renderContent = () => {
    return (
      <View>
        <FlatList
          data={likedBy.filter(item => item.likedBy.length > 0)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderContentItem(item)}
        />
        <View style={{marginTop : 80}}></View>
      </View>
    );
  };





    const renderContentItem = (item) => {
      const gogo = async (count, id) => {
        navigation.navigate("FeedDetail",{item})
        await updateDoc(doc(db, "post", id), {
        viewcount : increment(1)
        });
      };

      return (
        <View style={{ marginTop: 20, marginLeft: 20 }}>
          <TouchableOpacity  onPress={() => gogo(item.id)}>
            <View style={{ flexDirection: 'row' }}>
              {(item.likedBy.some(like => /[a-zA-Z]/.test(like))) ? (
                <Text
                  style={{
                    color: '#484848',
                    fontFamily: "Pretendard-Regular",
                    fontSize: 17,
                    fontStyle: "normal",
                    flexWrap: 'wrap',
                    maxWidth: maxTextWidth, // Set the maximum width for the text
                  }}
                >
                  {item.likedBy
                    .filter(like => /[a-zA-Z]/.test(like)) // 영어 필드만 필터링
                    .join(', ')}
                  {"님이 회원님의 게시글을 좋아합니다."}
                </Text>
              ) : null}
            </View>
            <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.7, marginTop: 20, marginLeft: -20 }} />
          </TouchableOpacity>
        </View>
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
    <View style={{marginTop : 40}}>
         <TouchableOpacity onPress={()=>navigation.goBack()} >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' , marginTop : 0, marginLeft : 10 }}>
          <CaretLeft  size={27} color={'#484848'} style={{marginLeft : 1, marginTop : 1}} />
          <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :5 }}>{"알림"}</Text>
   
      </View>
      </TouchableOpacity>
        <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop : 20}}/>
        <ScrollView showsVerticalScrollIndicator={false} style={{ width : '100%', height : '100%',backgroundColor: "#f5f5f5"}}>
        {renderContent()}
        </ScrollView>
       
    </View>
  );
}
