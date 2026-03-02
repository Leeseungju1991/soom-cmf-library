import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ToastAndroid,
} from 'react-native';
import {
  Text,
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
  collection,
} from "firebase/firestore";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getAuth } from 'firebase/auth';
import {homeSelect, wishlistSelect, designSelect} from '@selectors';
import {useSelector, useDispatch} from 'react-redux';
export default function FeedDetailChange2({navigation, route}) {

  const db = getFirestore();
  const auth = getAuth();
  const item2 = route.params?.item2;
  const item3 = route.params?.item3;
  const change1 = route.params?.item;
  const citiesRef = collection(db, "User");
  const q1 = query(citiesRef, where("email", "==", auth.currentUser.email));
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수

  const home = useSelector(homeSelect);

  const [change, setchange] = useState('');

  const inputRef = useRef(null); // TextInput에 ref를 생성합니다.

 
  const updatePost1 = async (postId, updatedData) => {
    
    console.log(item2.id)
    console.log(item3.id)
    console.log(change1.id)
    
    
    try {
      // Firestore에서 문서 업데이트
      await updateDoc(doc(db, 'post', item2.id, 'reply', item3.id, 'rereply', change1.id), {
        reply: updatedData, // 'reply' 필드를 업데이트
      });
  
      // posts2 배열에서도 업데이트 (선택사항)
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return { ...post, reply: updatedData }; // 'reply' 필드를 업데이트
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
  <TextInput
    placeholder={'수정글을 남겨주세요.'}
    value={content}
    style={{ width: '90%', borderRadius: 9, marginLeft: '5%', marginTop: 10 }}
    onChangeText={setContent}
    icon={
      <TouchableOpacity
        onPress={() => updatePost1(change, content)} // updatePost1 함수 호출
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
