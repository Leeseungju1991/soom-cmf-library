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
  query,
  where,
  updateDoc,
  doc,
  collection,
} from "firebase/firestore";
import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getAuth } from 'firebase/auth';

import moment from 'moment';
export default function Wishlist1change({navigation, route}) {

  const db = getFirestore();
  const auth = getAuth();
  const item = route.params?.item;
  const item2 = route.params?.change;
  const citiesRef = collection(db, "User");
  const q1 = query(citiesRef, where("email", "==", auth.currentUser.email));
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  const updatePost1 = async () => {
    
    
    try {
      // Firestore에서 문서 업데이트
      await updateDoc(doc(db, item.company, item2), {
        reply: content, // 'reply' 필드를 업데이트
      });
  
      // posts2 배열에서도 업데이트 (선택사항)
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === item2.id) {
            return { ...post, reply: content }; // 'reply' 필드를 업데이트
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
        onPress={() => updatePost1()} // updatePost1 함수 호출
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
