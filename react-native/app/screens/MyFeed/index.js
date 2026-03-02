import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Alert
} from 'react-native';
import { useTheme, } from '@config';
import {SafeAreaView, Icon, Text, Image, Header} from '@components';
import {ChatCenteredText, ShareNetwork, DotsThree, CaretLeft, Heart, ChatText, ThumbsUp} from 'phosphor-react-native';
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
  arrayUnion
} from "firebase/firestore";
import * as Utils from '@utils';
import moment from 'moment';
import { getAuth } from 'firebase/auth';

const deltaY = new Animated.Value(0);
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export default function MyFeed({navigation}) {

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(220);
  const marginTopBanner = heightImageBanner - heightHeader + 10;
  

  const [refreshing, setRefreshing] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const colGroupRef = collectionGroup(db, "post");
  const q = query(colGroupRef, where("email", "==", auth.currentUser.email));
  const q1 = query(colGroupRef, orderBy("viewcount", "desc"), limit(2));
  const filter = query(colGroupRef, where("category", "==", "회사생활"));
  const filter2 = query(colGroupRef, where("category", "==", "이직커리어"));
  const [Filters, setFilters] = useState([]);
  const [Filters2, setFilters2] = useState([]);


  const [posts, setPosts] = useState([]);
  const [posts1, setPosts1] = useState([]);

  const componentMounted = useRef(true);

  const [liked, setLiked] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date()); // 현재 시간

  const user1DocRef = doc(db, "User", "lsj@dailypharm.com");
  // 쿼리 생성

  const [autostart, setAutostate] = useState();

  const [activeTab, setActiveTab] = useState('전체');

  const [refreshCount, setRefreshCount] = useState(0);



  const handleTabPress = (tabName) => {
    setActiveTab(tabName);

  };

  const handleTabPress1 = (tabName) => {
    setActiveTab(tabName);
  };


  const handleTabPress2 = (tabName) => {
    setActiveTab(tabName);
  };


  const handleTabPress3 = (tabName) => {
    setActiveTab(tabName);
  };


  const handleTabPress4 = (tabName) => {
    setActiveTab(tabName);
  };


 
  const [data1, setData1] = useState([]);


  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      if (componentMounted.current) {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        console.log(posts)
      }
      return () => {
        componentMounted.current = false;
      };
    });
  }, []);
  


  useEffect(() => {
    const unsubscribe = onSnapshot(q1, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts1(newPosts);
    });

    return () => unsubscribe();
  }, []);



  useEffect(() => {
    onSnapshot(filter, (snapshot) => {
      if (componentMounted.current) {
        setFilters(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
      return () => {
        componentMounted.current = false;
      };
    });
  
  }, []);

  useEffect(() => {
    onSnapshot(filter2, (snapshot) => {
      if (componentMounted.current) {
        setFilters2(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
        console.log(autostart)
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
    }, 1000);
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
  





  
  const onRefresh = () => {
   
  };






  const isWithin30Minutes = (timeString) => {
    const currentTime = moment();
    const time = moment(timeString, 'HH:mm:ss');
    return currentTime.diff(time, 'minutes') <= 30;
  }







  const renderContent = () => {
    return (
      
      <View style={{flex: 1, backgroundColor : '#FFFFFF' }}>
      <View style={{marginTop : 0}}>
        
      <FlatList 
        contentContainerStyle={{marginTop : -10}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
      />
      </View>
      <View style={{marginTop : 45}}></View>
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
      <TouchableOpacity onPress={()=>gogo(item.viewcount,item.id)}>
     
      <View style={{  flexDirection : 'row' , marginLeft : 10, marginTop : 0}}> 
         <ChatCenteredText  size={35} color={'#dedede'}    style={{ marginTop: -1, marginLeft: 10 }}/>
      <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontSize: 15,fontFamily: "Pretendard",}}>
      {"    '"}{truncateTitle(item.title)}{"'게시글을"}
      </Text>
      </View>
      <Text style={{ marginLeft : 67,fontWeight : '500', fontStyle: "normal", color : '#484848', fontSize: 15,fontFamily: "Pretendard", marginTop : -10}}>
      {"등록했습니다."}
      </Text>
      <Text style={{ marginTop : 5, marginLeft : 67,fontWeight : '500', fontStyle: "normal", color : '#b2b2b2', fontSize: 15,fontFamily: "Pretendard",}}>
      {item.time}
      </Text>
      <View style={{ borderBottomColor: '#e9e9e9', borderBottomWidth: 0.7, marginTop : 20}}/>
       </TouchableOpacity>
       </SafeAreaView>
       
    );
      
  };
  
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' , marginTop : 0 }}>
    
      <CaretLeft  size={27} color={'#484848'}style={{ marginLeft : 20, color : '#484848', fontFamily: "Pretendard", fontWeight: "500", fontSize : 17, fontStyle: "normal",  textAlign: "left",}}/>

              <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :10 }}>{"내가 작성한 글"}</Text>
      </View>
      </TouchableOpacity>
        <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.7, marginTop : 20}}/>
        <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: "#f5f5f5"}}>
         {renderContent()}
         
        </ScrollView>
    </View>
  );
}
