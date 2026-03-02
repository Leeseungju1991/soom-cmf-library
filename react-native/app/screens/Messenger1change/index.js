import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Share,
  Alert,
  Modal,
  ToastAndroid,
  KeyboardAvoidingView,
  StatusBar
} from 'react-native';
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
} from "firebase/firestore";
import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getAuth } from 'firebase/auth';
export default function Messenger1change({navigation, route}) {

  const db = getFirestore();
  const auth = getAuth();
  const item2 = route.params?.text5;
  const item = route.params?.item;
  const citiesRef = collection(db, "User");
  const q1 = query(citiesRef, where("email", "==", auth.currentUser.email));
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);


  const [change, setchange] = useState('');

  const inputRef = useRef(null); // TextInput에 ref를 생성합니다.
  useEffect(() => {
    console.log(item2)
    console.log(item)
  }, []); // 빈 배열은 컴포넌트가 처음 렌더링될 때만 실행
 
  const updatePost1 = async (postId, updatedData) => {
    console.log(item2)
    console.log(item)
    
    try {
      // Firestore에서 문서 업데이트
      await updateDoc(doc(db, 'eduacation', item2, 'reply', item), {
        comment: updatedData, // 'reply' 필드를 업데이트
      });
  
      // posts2 배열에서도 업데이트 (선택사항)
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === e) {
            return { ...post, comment: updatedData }; // 'reply' 필드를 업데이트
          }
          return post;
        })
      );
      console.log("적용완료");
      setContent(null);
      ToastAndroid.show('댓글이 수정 되었습니다.', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating document: ', error);
    }
    
  };
  

  return (
  <View style={{marginTop : 30}}>
      <StatusBar translucent={true} backgroundColor={'transparent'}  />
  <TextInput
    placeholder={'수정글을 남겨주세요.'}
    value={content}
    style={{ width: '90%', borderRadius: 9, marginLeft: '5%', marginTop: 10 }}
    onChangeText={setContent}
    icon={
      <TouchableOpacity
        onPress={() => updatePost1(change, content)} // updatePost1 함수 호출
        style={styles.btnClearSearch}
      >
        <Text
          style={{
            fontFamily: 'Pretendard',
            fontWeight: '500',
            fontStyle: 'normal',
            textAlign: 'left',
            color: '#4a5cfc',
          }}
        >
          {'등록'}
        </Text>
      </TouchableOpacity>
    }
  />

</View>
  );
}
