import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ImageBackground
} from 'react-native';
import {BaseStyle, useTheme, BaseColor} from '@config';
import {
  getFirestore,
  collectionGroup,
  onSnapshot,
  query,
  where,
  updateDoc,
  getSnapshot, limit,
  doc,
  getDoc,
  arrayRemove,
  arrayUnion
} from "firebase/firestore";
import {SafeAreaView, Text} from '@components';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

export default function Category({navigation}) {
  const {colors} = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isClicked, setIsClicked] = useState(true);
  const [isClicked1, setIsClicked1] = useState(false);
  const [activeTab, setActiveTab] = useState('전체');
  const componentMounted = useRef(true);
  const moment = require('moment');
  const db = getFirestore();
  const colGroupRef = collectionGroup(db, "policy");
  const filter1 = query(colGroupRef, where("category", "==", "정책"));
  const filter2 = query(colGroupRef, where("category", "==", "제약바이오"));
  const filter3 = query(colGroupRef, where("category", "==", "약국"))
  const filter4 = query(colGroupRef, where("category", "==", "기획"))
  const filter5 = query(colGroupRef, where("category", "==", "정책"))
  const q = query(colGroupRef);
  const [posts, setPosts] = useState([]);
  const [posts1, setPosts1] = useState([]);
  const [posts2, setPosts2] = useState([]);
  const [posts3, setPosts3] = useState([]);
  const [posts4, setPosts4] = useState([]);
  const [posts5, setPosts5] = useState([]);
  const screenHeight = Dimensions.get('window').height;


  const onRefresh = () => {
    setRefreshing(true);
  };

  const filterConfigs = [
    { filter: q, setFilterPosts: setPosts },
    { filter: filter1, setFilterPosts: setPosts5 },
    { filter: filter2, setFilterPosts: setPosts2 },
    { filter: filter3, setFilterPosts: setPosts3 },
    { filter: filter4, setFilterPosts: setPosts4 },
  ];

  // 모든 필터에 대한 useEffect를 하나로 합칩니다.
  useEffect(() => {
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


  useEffect(() => {
    // 3초 후에 isLoading 상태를 false로 업데이트하여 로딩 화면을 벗어납니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    // 컴포넌트가 언마운트 될 때 타이머를 클리어합니다.
    return () => clearTimeout(timer);
  }, []);



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
    const unsubscribe = onSnapshot(filter1, (snapshot) => {
      if (componentMounted.current) {
        setPosts1(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    });

    return () => {
      unsubscribe();
      componentMounted.current = false;
    };
  }, []);


  useEffect(() => {
    const unsubscribe = onSnapshot(filter2, (snapshot) => {
      if (componentMounted.current) {
        setPosts2(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    });

    return () => {
      unsubscribe();
      componentMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(filter3, (snapshot) => {
      if (componentMounted.current) {
        setPosts3(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    });

    return () => {
      unsubscribe();
      componentMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(filter4, (snapshot) => {
      if (componentMounted.current) {
        setPosts4(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    });

    return () => {
      unsubscribe();
      componentMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(filter5, (snapshot) => {
      if (componentMounted.current) {
        setPosts5(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    });

    return () => {
      unsubscribe();
      componentMounted.current = false;
    };
  }, []);

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

  function extract11to20WithEllipsis(title) {
    const characters11to15 = title.substring(0, 23);
    if (characters11to15.length > 0) {
      return characters11to15;
    } else {
      return ''; // 11자리부터 15자리까지 문자열이 5글자 미만인 경우, 빈 문자열 반환
    }
  }
  function extract11to20WithEllipsis1(title) {
    const characters11to15 = title.substring(23, 35);
    if (characters11to15.length > 0) {
      return characters11to15;
    } else {
      return '...'; // 11자리부터 15자리까지 문자열이 5글자 미만인 경우, 빈 문자열 반환
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



  const renderContent = () => {

    return (
      
      <View style={{flex: 1, marginTop : -20}}>
      <View style={{marginTop  : 20}}>
        
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
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
      />
      
      </View>
      <View style={{marginTop : 120}}></View>
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



  const renderContent2 = () => {
    const filteredPosts = posts.filter((item) => item.category === '정책');
    if (filteredPosts.length === 0) {
      return null; // 또는 다른 기본값 설정
    }
    const postWithMaxCommentCount = filteredPosts.reduce((maxCommentCountPost, currentPost) => {
      if (currentPost.commentcount > maxCommentCountPost.commentcount) {
        return currentPost;
      } else {
        return maxCommentCountPost;
      }
    }, filteredPosts[0]);

    const gogo = async (item,count, id) => {
      navigation.navigate("Category1",{item})
      await updateDoc(doc(db, "policy", id), {
      viewcount : count + 1
      });
    };



    return (
      
      <View style={{flex: 1, marginTop : -20}}>
      <View style={{marginTop  : 20}}>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>gogo(postWithMaxCommentCount,postWithMaxCommentCount.viewcount,postWithMaxCommentCount.id)}> 
        <View>
        <ImageBackground source={{uri : postWithMaxCommentCount.uri}} resizeMode = 'cover' style={{width : '100%', height : 220 }}>
        <ImageBackground source={require("../../../assets/back.png")} style={{width : '100%', height : 220, color: '#484848'}} >
        <View style={{marginLeft : 20,  marginTop : 120}}>
        <Text style={{marginTop : 0,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 20, color : '#FFFFFF', alignSelf: 'flex-start',}}>{extract11to20WithEllipsis(postWithMaxCommentCount.title)}</Text>
        <Text style={{marginTop : 0, fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 20, color : '#FFFFFF', alignSelf: 'flex-start', }}>{extract11to20WithEllipsis1(postWithMaxCommentCount.title)}</Text>
        <Text style={{marginTop : 0,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15, color : '#FFFFFF', alignSelf: 'flex-start',}}>{(postWithMaxCommentCount.time)}</Text>
        </View>
        </ImageBackground>
        </ImageBackground>
        </View>
     </TouchableOpacity>
      <FlatList 
        contentContainerStyle={{marginTop : 5}}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={filteredPosts}
        renderItem={renderItem4}
        keyExtractor={(item) => String(item.id)}
      />
      
      </View>
      <View style={{marginTop : 120}}></View>
      </View> 
    );
  };

  

  const renderItem2 = ({ item }) => {

  
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
        <Text style={{marginTop : -60, marginLeft : 190,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15}}>{extract11to15WithEllipsis1(item.title)}</Text>
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



  const renderContent3 = () => {

    const filteredPosts = posts.filter((item) => item.category === '제약바이오');
    if (filteredPosts.length === 0) {
      return null; // 또는 다른 기본값 설정
    }
    const postWithMaxCommentCount = filteredPosts.reduce((maxCommentCountPost, currentPost) => {
      if (currentPost.commentcount > maxCommentCountPost.commentcount) {
        return currentPost;
      } else {
        return maxCommentCountPost;
      }
    }, filteredPosts[0]);

    const gogo = async (item,count, id) => {
      navigation.navigate("Category1",{item})
      await updateDoc(doc(db, "policy", id), {
      viewcount : count + 1
      });
    };


    return (
      
      <View style={{flex: 1, marginTop : -20}}>
      <View style={{marginTop  : 20}}>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>gogo(postWithMaxCommentCount,postWithMaxCommentCount.viewcount,postWithMaxCommentCount.id)}> 
        <View>
        <ImageBackground source={{uri : postWithMaxCommentCount.uri}} resizeMode = 'cover' style={{width : '100%', height : 220 }}>
        <ImageBackground source={require("../../../assets/back.png")} style={{width : '100%', height : 220, color: '#484848'}} >
        <View style={{marginLeft : 20,  marginTop : 120}}>
        <Text style={{marginTop : 0,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 20, color : '#FFFFFF', alignSelf: 'flex-start',}}>{extract11to20WithEllipsis(postWithMaxCommentCount.title)}</Text>
        <Text style={{marginTop : 0, fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 20, color : '#FFFFFF', alignSelf: 'flex-start', }}>{extract11to20WithEllipsis1(postWithMaxCommentCount.title)}</Text>
        <Text style={{marginTop : 0,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15, color : '#FFFFFF', alignSelf: 'flex-start',}}>{(postWithMaxCommentCount.time)}</Text>
        </View>
        </ImageBackground>
        </ImageBackground>
        </View>
     </TouchableOpacity>
      <FlatList 
        contentContainerStyle={{marginTop : 5}}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={filteredPosts}
        renderItem={renderItem4}
        keyExtractor={(item) => String(item.id)}
      />
      
      </View>
      <View style={{marginTop : 120}}></View>
      </View> 
    );
  };

  

  const renderItem3 = ({ item }) => {

  
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
        <Text style={{marginTop : -60, marginLeft : 190,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15}}>{extract11to15WithEllipsis1(item.title)}</Text>
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

  const renderContent4 = () => {
    const filteredPosts = posts.filter((item) => item.category === '약국');
    if (filteredPosts.length === 0) {
      return null; // 또는 다른 기본값 설정
    }
    const postWithMaxCommentCount = filteredPosts.reduce((maxCommentCountPost, currentPost) => {
      if (currentPost.commentcount > maxCommentCountPost.commentcount) {
        return currentPost;
      } else {
        return maxCommentCountPost;
      }
    }, filteredPosts[0]);

    const gogo = async (item,count, id) => {
      navigation.navigate("Category1",{item})
      await updateDoc(doc(db, "policy", id), {
      viewcount : count + 1
      });
    };


    return (
      
      <View style={{flex: 1, marginTop : -20}}>
      <View style={{marginTop  : 20}}>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>gogo(postWithMaxCommentCount,postWithMaxCommentCount.viewcount,postWithMaxCommentCount.id)}> 
        <View>
        <ImageBackground source={{uri : postWithMaxCommentCount.uri}} resizeMode = 'cover' style={{width : '100%', height : 220 }}>
        <ImageBackground source={require("../../../assets/back.png")} style={{width : '100%', height : 220, color: '#484848'}} >
        <View style={{marginLeft : 20,  marginTop : 120}}>
        <Text style={{marginTop : 0,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 20, color : '#FFFFFF', alignSelf: 'flex-start',}}>{extract11to20WithEllipsis(postWithMaxCommentCount.title)}</Text>
        <Text style={{marginTop : 0, fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 20, color : '#FFFFFF', alignSelf: 'flex-start', }}>{extract11to20WithEllipsis1(postWithMaxCommentCount.title)}</Text>
        <Text style={{marginTop : 0,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15, color : '#FFFFFF', alignSelf: 'flex-start',}}>{(postWithMaxCommentCount.time)}</Text>
        </View>
        </ImageBackground>
        </ImageBackground>
        </View>
     </TouchableOpacity>
      <FlatList 
        contentContainerStyle={{marginTop : 5}}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={filteredPosts}
        renderItem={renderItem4}
        keyExtractor={(item) => String(item.id)}
      />
      
      </View>
      <View style={{marginTop : 120}}></View>
      </View> 
    );
  };

  

  const renderItem4 = ({ item }) => {

  
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

  const renderContent5 = () => {

    const filteredPosts = posts.filter((item) => item.category ==='기획');
    if (filteredPosts.length === 0) {
      return null; // 또는 다른 기본값 설정
    }
    const postWithMaxCommentCount = filteredPosts.reduce((maxCommentCountPost, currentPost) => {
      if (currentPost.commentcount > maxCommentCountPost.commentcount) {
        return currentPost;
      } else {
        return maxCommentCountPost;
      }
    }, filteredPosts[0]);

    const gogo = async (item,count, id) => {
      navigation.navigate("Category1",{item})
      await updateDoc(doc(db, "policy", id), {
      viewcount : count + 1
      });
    };


    return (
      
      <View style={{flex: 1, marginTop : -20}}>
      <View style={{marginTop  : 20}}>
      <TouchableOpacity activeOpacity={0.11} onPress={()=>gogo(postWithMaxCommentCount,postWithMaxCommentCount.viewcount,postWithMaxCommentCount.id)}> 
        <View>
        <ImageBackground source={{uri : postWithMaxCommentCount.uri}} resizeMode = 'cover' style={{width : '100%', height : 220 }}>
        <ImageBackground source={require("../../../assets/back.png")} style={{width : '100%', height : 220, color: '#484848'}} >
        <View style={{marginLeft : 20,  marginTop : 120}}>
        <Text style={{marginTop : 0,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 20, color : '#FFFFFF', alignSelf: 'flex-start',}}>{extract11to20WithEllipsis(postWithMaxCommentCount.title)}</Text>
        <Text style={{marginTop : 0, fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 20, color : '#FFFFFF', alignSelf: 'flex-start', }}>{extract11to20WithEllipsis1(postWithMaxCommentCount.title)}</Text>
        <Text style={{marginTop : 0,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15, color : '#FFFFFF', alignSelf: 'flex-start',}}>{(postWithMaxCommentCount.time)}</Text>
        </View>
        </ImageBackground>
        </ImageBackground>
        </View>
     </TouchableOpacity>
      <FlatList 
        contentContainerStyle={{marginTop : 5}}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={filteredPosts}
        renderItem={renderItem5}
        keyExtractor={(item) => String(item.id)}
      />
      
      </View>
      <View style={{marginTop : 120}}></View>
      </View> 
    );
  };

  

  const renderItem5 = ({ item }) => {

  
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
        <Text style={{marginTop : -60, marginLeft : 190,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15}}>{extract11to15WithEllipsis1(item.title)}</Text>
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);


  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log(activeTab)

  };





  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#a234fe" />
    </View>
    );
  }




  return (
            <View style={styles.container}>
               <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginLeft: 'auto', marginRight: 20 }}>
             <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal" , marginLeft : 40 }}>{"뉴스"}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.11} onPress={() => navigation.navigate("SearchHistory3")}>
              <Image source={require("../../../assets/search.png")} style={{width : 20, height : 20, color: '#484848'}} />
              </TouchableOpacity>
            </View>
            <View style={{ borderBottomColor: 'lightgray', borderBottomWidth: 0.7, marginTop : 15}}/>
            <View style={{marginTop : 20}}>
        
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            showsVerticalScrollIndicator={false}
          >
            {['전체', '정책', '제약바이오', '약국', '기획'].map((tabName, index) => (
              <TouchableOpacity activeOpacity={0.11}
                key={index}
                onPress={() => handleTabPress(tabName)}
                style={{
                  width: 88, // 최대 너비 선택
                  height: 40,
                  backgroundColor: activeTab === tabName ? '#484848' : '#f6f7ff',
                  width: tabName === '제약바이오' ? 88 : 70, 
                  borderRadius: 34,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 10,
                  marginBottom : 10,
                }}
              >
                <Text style={{ fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal",color: activeTab === tabName ? '#FFFFFF' : '#484848', fontSize: 14 }}>{tabName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={{marginTop : 10}}></View>
          <ScrollView>
          {activeTab === '전체' ? renderContent() : null}
          {activeTab === '정책' ? renderContent2() : null}
          {activeTab === '제약바이오' ? renderContent3() : null}
          {activeTab === '약국' ? renderContent4() : null}
          {activeTab === '기획' ? renderContent5() : null}
          
          </ScrollView>
     
          </View>
        </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop : 30,
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

