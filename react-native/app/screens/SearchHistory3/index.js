import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { BaseStyle, useTheme } from '@config';
import {CaretLeft} from 'phosphor-react-native';
import {
  SafeAreaView,
  Text,
} from '@components';
import moment from 'moment';
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
  collection,
  orderBy,
  addDoc,
  deleteDoc
} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

let timeout;

export default function SearchHistory2({ navigation }) {
  const { colors } = useTheme();

  const [showResult, setShowResult] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const db = getFirestore();
  const colGroupRef = collectionGroup(db, "policy");
  const q = query(colGroupRef);
 // const q1 = query(colGroupRef, where("title", 'array-contains', keyword));
  const auth = getAuth();
  const citiesRef = collection(db, "User");
  const q8 = query(citiesRef, where("email", "==", auth.currentUser.email));
  const [posts, setPosts] = useState([]);
  const [posts1, setPosts1] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const componentMounted = useRef(true);


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
        collection(db, 'policyhistory'),
        where('keyword', '==', keyword)
      );
      const querySnapshot = await getDocs(q);
      const existingHistory = [];
      querySnapshot.forEach((doc) => {
        existingHistory.push(doc.data().keyword);
      });
  
      // 중복된 단어가 없을 때만 저장
      if (!existingHistory.includes(keyword)) {
        const docRef = await addDoc(collection(db, 'policyhistory' + userName), {
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
        collection(db, 'policyhistory' + userName),
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
      collection(db, 'policyhistory' + userName),
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
    const q = query(collection(db, "policyhistory" + userName));
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

  function extract11to15WithEllipsis(title) {
    const characters11to15 = title.substring(0, 15);
    if (characters11to15.length > 0) {
      return characters11to15;
    } else {
      return '...'; // 11자리부터 15자리까지 문자열이 5글자 미만인 경우, 빈 문자열 반환
    }
  }

  function extract11to15WithEllipsis1(comment) {
    const characters11to15 = comment.substring(15, 20);
    if (characters11to15.length > 0) {
      return characters11to15 + '...';
    } else {
      return '...'; // 11자리부터 15자리까지 문자열이 5글자 미만인 경우, 빈 문자열 반환
    }
  }

  const onRefresh = () => {
    // 필요한 작업 수행
    // ...
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
        <View style={{ borderBottomColor: 'lightgray', borderBottomWidth: 0.5, marginTop: 20 }} />
        <FlatList
          data={recentSearches.reverse().filter(item => item.trim() !== '')} // Filter out empty items
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSearch(item)}>
              <View>
                <View style={{flexDirection :'row'  ,marginTop : 20, marginLeft : 10,}}>
                <Image source={require("../../../assets/search2.png")} style={{width : 20, height : 20, color: '#e9e9e9', marginLeft : 10}} />
                <Text style={{fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15, marginLeft : 10, marginTop : -2}}>{item}</Text>
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
        <View style={{ flex : 1 ,justifyContent: 'center', alignItems: 'center', marginTop : 200}}>
        <Text style={{ color: '#b2b2b2', fontSize: 17, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal" , }}>
          {"키워드 등의 검색어를 입력해주세요."}
        </Text>
      </View>
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
        
        <View style={{ flex: 1, marginTop: 29 }}>
        <View style={{ flex: 1, marginTop: 50 }}>
        <View style={styles.container}>
          <Text style={{ color: '#b2b2b2', fontSize: 17, fontFamily: "Pretendard", fontWeight: "500",  fontStyle: "normal",}}>{"검색 결과가 없습니다"}</Text>
        </View>
      </View>
        </View>
      ) : (
        <View style={{marginTop : 0}}>
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
          data={filteredPosts} // 검색 결과 또는 전체 데이터를 표시
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
        />
            <View style={{marginTop : 120}}></View>
        </View>
      )}
    </View>
    );
  };

  
  const renderItem = ({ item }) => {

  
    const gogo = async (count, id) => {
      navigation.navigate("Category1",{item})
      await updateDoc(doc(db, "policy", id), {
      viewcount : count + 1
      });
    }; 

    return (
      
      <SafeAreaView>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>gogo(item.viewcount,item.id)}> 
        <View style={{flexDirection : 'row', marginTop : 0, marginLeft : 20}}>
        <Image source={{uri : item.uri}} style={{width : 150, height : 95, borderRadius: 12,}} />
        <Text style={{marginTop : 0, marginLeft : 20,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15}}>{extract11to15WithEllipsis(item.title)}</Text>
        </View>
        <View style={{flexDirection : 'row'}}>
        <Text style={{marginTop : -73, marginLeft : 190,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15}}>{extract11to15WithEllipsis1(item.title)}</Text>
        </View>
        <View style={{flexDirection : 'row'}}>
        <Text style={{marginTop : -20, marginLeft : 195, color : '#b2b2b2', fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15}}>{(item.time)}</Text>
        <View style={{ width: 1.2, height: 15, marginTop: -16, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <View style={{ width: 1, height: 0,marginTop: -16, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <Text style={{marginTop : -20,  color : '#b2b2b2', fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15}}>{(item.category)}</Text>
        </View>
        <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.7, marginTop : 20}}/>
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
  </ScrollView>
  );
}