import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import {
  getFirestore,
  collectionGroup,
  onSnapshot,
  query,
  getSnapshot,

} from "firebase/firestore";
import {SafeAreaView, Text} from '@components';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {BaseStyle, useTheme, BaseColor} from '@config';
import {Queue} from 'phosphor-react-native';
const PreMessenger = ({navigation}) => {
  const {colors} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const db = getFirestore();
  const colGroupRef = collectionGroup(db, "eduacation");
  const q = query(colGroupRef);
  const [posts, setPosts] = useState([]);
  const componentMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);

  const onRefresh = () => {
    setRefreshing(true);
  };


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
    console.log(posts)
    const fetchData = async () => {
      for (const { filter, setFilterPosts } of filterConfigs) {
        try {
          const snapshot = await getSnapshot(filter); // 비동기 작업을 기다립니다.
          if (componentMounted.current) {
            setFilterPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            console.log(filter); // 필터 정보를 출력하거나 로그 기록을 원하는 대로 수정할 수 있습니다.
          }
        } catch (error) {
          console.error(`Error fetching data for filter ${filter}: ${error}`);
        }
      }
    };
  
    fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
  
    return () => {
      componentMounted.current = false;
    };
  }, []);


  const renderContent1 = () => {
    // posts 배열을 item.seq 값을 기준으로 내림차순 정렬
    const sortedPosts = [...posts].sort((a, b) => a.seq - b.seq);
  
    return (
      <View style={{ flex: 1, marginTop: -5 }}>
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
          data={sortedPosts} // 정렬된 배열을 전달
          renderItem={renderItem1}
          keyExtractor={(item) => String(item.id)}
        />
      </View>
    );
  };
  
  const renderItem1 = ({ item }) => {

    return (
      <SafeAreaView style={{marginTop : -30}}>
        <TouchableOpacity activeOpacity={0.11} onPress={() => navigation.navigate("Messenger1", { text1 : item.title, text2: item.subtitle,text3: item.category ,text4 : item.commentcount, text5 : item.id, additionalValue: item.seq ,uri : item.uri  })}>
            <Image source={{ uri: item.image }} style={{width : '100%', height : 220, marginTop : 0, marginLeft : 0}} />
            <View style={{marginLeft : 20, marginTop : 20}}>
            <Text style={{ fontSize: 16, color : '#484848',fontFamily: "Pretendard",fontWeight: "normal",fontStyle: "normal", }}>{item.title}</Text>
            <Text style={{ fontSize: 16, color : '#484848',fontFamily: "Pretendard",fontWeight: "normal",fontStyle: "normal", }}>{item.subtitle}</Text>
            <Text style={{ fontSize: 15, color : '#484848',fontFamily: "Pretendard",fontWeight: "normal",fontStyle: "normal", color: '#b2b2b2' }}>{item.category}</Text>
            <View style={{marginTop : 30}}/>
            </View>
          </TouchableOpacity>
       </SafeAreaView>
    );
  };

  useEffect(() => {
    // 3초 후에 isLoading 상태를 false로 업데이트하여 로딩 화면을 벗어납니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
    <SafeAreaView
    style={BaseStyle.safeAreaView}
    edges={['right', 'top', 'left']}>
             <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginLeft: 'auto', marginRight: 20 }}>
             <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal" ,marginLeft : 20 }}>{"교육"}</Text>
            </View>

            </View>
            <View style={{ borderBottomColor: 'lightgray', borderBottomWidth: 0.7, marginTop : 20}}/>
            <ScrollView>
            <View style={{ alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={()=>navigation.navigate('Messenger')}>
              <Image source={require("../../../assets/ex2.png")} style={{ width: 360, height: 180, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 20 }} />
              <View style={{ backgroundColor : '#FFFFFF',width: 360, height: 70, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop : 0, elevation: 5, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 }}>
              <Text style={{ fontSize: 15, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", marginLeft: 20, marginTop : 10 }}>{"팜리크루트 소개"}</Text>
              <Text style={{ fontSize: 15, fontFamily: "Pretendard", color: '#b2b2b2',fontWeight: "500", fontStyle: "normal", marginLeft: 20, marginTop : 0 }}>{"강사 고흥섭"}</Text>
              <View style={{flexDirection : 'row'}}>
              <Queue  size={23} color={'#b2b2b2'} style={{marginLeft : 240,marginTop : -15}}/>
              <Text style={{ fontSize: 14, fontFamily: "Pretendard", color: '#b2b2b2',fontWeight: "500", fontStyle: "normal", marginLeft: 5,  marginTop : -15 }}>{"동영상 4개"}</Text>
              </View>
              </View>
              <View style={{marginTop : 10}}></View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>navigation.navigate('Messenger')}>
            <Image source={require("../../../assets/ex3.png")} style={{ width: 360, height: 180, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 20 }} />
              <View style={{ backgroundColor : '#FFFFFF',width: 360, height: 70, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop : 0, elevation: 5, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 }}>
              <Text style={{ fontSize: 15, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", marginLeft: 20, marginTop : 10 }}>{"팜리크루트 채용정보 등록"}</Text>
              <Text style={{ fontSize: 15, fontFamily: "Pretendard", color: '#b2b2b2',fontWeight: "500", fontStyle: "normal", marginLeft: 20, marginTop : 0 }}>{"강사 고흥섭"}</Text>
              <View style={{flexDirection : 'row'}}>
              <Queue  size={23} color={'#b2b2b2'} style={{marginLeft : 240,marginTop : -15}}/>
              <Text style={{ fontSize: 14, fontFamily: "Pretendard", color: '#b2b2b2',fontWeight: "500", fontStyle: "normal", marginLeft: 5,  marginTop : -15 }}>{"동영상 4개"}</Text>
              </View>
            </View>
            <View style={{marginTop : 10}}></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Messenger')}>
            <Image source={require("../../../assets/ex4.png")} style={{ width: 360, height: 180, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 20 }} />
              <View style={{ backgroundColor : '#FFFFFF',width: 360, height: 70, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop : 0, elevation: 5, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 }}>
              <Text style={{ fontSize: 15, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", marginLeft: 20, marginTop : 10 }}>{"팜리크루트 결제 방법"}</Text>
              <Text style={{ fontSize: 15, fontFamily: "Pretendard", color: '#b2b2b2',fontWeight: "500", fontStyle: "normal", marginLeft: 20, marginTop : 0 }}>{"강사 고흥섭"}</Text>
              <View style={{flexDirection : 'row'}}>
              <Queue  size={23} color={'#b2b2b2'} style={{marginLeft : 240,marginTop : -15}}/>
              <Text style={{ fontSize: 14, fontFamily: "Pretendard", color: '#b2b2b2',fontWeight: "500", fontStyle: "normal", marginLeft: 5,  marginTop : -15 }}>{"동영상 4개"}</Text>
              </View>
            </View>
            <View style={{marginTop : 10}}></View>
            </TouchableOpacity>
            </View>
            
            </View>
            
            <View style={{marginTop : 10}}></View>
            </ScrollView>
         

    </SafeAreaView>
  
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default PreMessenger;