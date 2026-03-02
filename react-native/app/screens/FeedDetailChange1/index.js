import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Platform,
  ToastAndroid,
  TextInput,
  Image
} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {
  SafeAreaView,
  Text,
  Button,
  Icon
} from '@components';

import { updateDoc,doc, collection,getFirestore, query, where , onSnapshot, } from "firebase/firestore";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { getAuth } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import {CaretDown, ImageSquare} from 'phosphor-react-native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';





export default function FeedDetailChange1({navigation, route}) {
  
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const item2 = route.params?.item2
  const db = getFirestore();
  const [title, setTitle] = useState(item2.title);
  const [comment, setcomment] = useState(item2.comment);
  const [commentLength, setCommentLength] = useState(0); // 글자수를 저장하는 상태 변수 추가
  const [categorytext, setcategorytext] = useState("토크 주제를 선택해 주세요.");
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(item2.category);
  const [showimage, setshowimage] = useState(false);
  const [showimage1, setshowimage1] = useState(false);
  const [showimage2, setshowimage2] = useState(false);
  const [showimage3, setshowimage3] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [selectedImage3, setSelectedImage3] = useState(null);     
  const moment = require('moment');
  const currentTime = moment()
  const citiesRef = collection(db, "User");
  const auth = getAuth();
  const q = query(citiesRef, where("email", "==", auth.currentUser.email));
  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const remotePath = `images/${category}_${title}_${comment}.jpeg`; // 파일 이름 변경



    const storage = getStorage();

    const uploadImage = async () => {
      const storageRef = ref(storage, remotePath);
      const metadata = {
        contentType: 'image/jpeg', // 이미지 타입 설정
      };
  
      try {
        const snapshot = await uploadBytes(storageRef, selectedImage, metadata);
        console.log(snapshot);
  
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Download URL:', downloadURL);
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    };

    const showimagefirst = () => {
      setshowimage(true)
    }
  
  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.size > 0) {
        const userData = snapshot.docs[0].data();
        setUserName(userData.id || "");
      }
    });

    return () => {
      unsubscribe(); // 클린업 함수에서 구독 해제
    };
  }, []);

// comment 변수의 길이를 계산하는 함수
const calculateCommentLength = (text) => {
  return text ? text.length : 0;
};

// ...

// useEffect를 사용하여 comment 변수의 변경을 감지하고 commentLength 상태를 업데이트
useEffect(() => {
  const length = calculateCommentLength(comment);
  setCommentLength(length);

}, [comment]);







useEffect(() => {
const unsubscribe = onSnapshot(q, (snapshot) => {
  if (snapshot.size > 0) {
    const userData = snapshot.docs[0].data();
    setUserName(userData.id || "");
  }
});

return () => {
  unsubscribe(); // 클린업 함수에서 구독 해제
};
}, []);


// ...

// useEffect를 사용하여 comment 변수의 변경을 감지하고 commentLength 상태를 업데이트
useEffect(() => {
const length = calculateCommentLength(comment);
setCommentLength(length);

}, [comment]);


const pickImage = async () => {
let result = await ImagePicker.launchImageLibraryAsync({
mediaTypes: ImagePicker.MediaTypeOptions.All,
allowsEditing: true,
aspect: [4, 3],
quality:  1,
});
console.log(result)
setSelectedImage(result.assets[0].uri);
setshowimage1(true)
};

const pickImage1 = async () => {
let result = await ImagePicker.launchImageLibraryAsync({
mediaTypes: ImagePicker.MediaTypeOptions.All,
allowsEditing: true,
aspect: [4, 3],
quality: 1,
});
console.log(result)
setSelectedImage1(result.assets[0].uri);
setshowimage2(true)
};


const pickImage2 = async () => {
let result = await ImagePicker.launchImageLibraryAsync({
mediaTypes: ImagePicker.MediaTypeOptions.All,
allowsEditing: true,
aspect: [4, 3],
quality: 1,
});
console.log(result)
setSelectedImage2(result.assets[0].uri);
setshowimage3(true)
};

const pickImage3 = async () => {
let result = await ImagePicker.launchImageLibraryAsync({
mediaTypes: ImagePicker.MediaTypeOptions.All,
allowsEditing: true,
aspect: [4, 3],
quality: 1,
});
console.log(result)
setSelectedImage3(result.assets[0].uri);

};




const onSubmit = async () => {
    
    
  try {
    // Firestore에서 문서 업데이트
    await updateDoc(doc(db, 'post', item2.id), {
      title: title, // 'reply' 필드를 업데이트
      comment : comment,
      image1 : selectedImage,
      image2 : selectedImage1,
      image3 : selectedImage2
    });

    // posts2 배열에서도 업데이트 (선택사항)
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return { ...post, title: title, comment :comment, image1 :  selectedImage, image2 : selectedImage1,image3 :selectedImage2}; // 'reply' 필드를 업데이트
        }
        return post;
      })
    );
    console.log("적용완료");
    setcomment(null)
    setTitle(null)
    setCategory(null)
    uploadImage();
    ToastAndroid.show('댓글이 수정 되었습니다.', ToastAndroid.SHORT);
    navigation.goBack();
  } catch (error) {
    console.error('Error updating document: ', error);
  }
  
};

 
const removeImage = () => {
  setSelectedImage(null);
};

const removeImage1 = () => {
  setSelectedImage1(null);
};

const removeImage2 = () => {
  setSelectedImage2(null);
};

  return (
    <View style={{flex: 1 , marginTop : 40}}>
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left']}>
            <ScrollView>
            <View style={{ width : '100%', height : 60, backgroundColor : '#f6f7ff', flexDirection : 'row',}}>
              <Text style={{fontFamily: "Pretendard", fontSize : 15, fontWeight: "500", fontStyle: "normal", marginTop : 17, marginLeft : 20}}>{category}</Text>
            
            </View>
 
            <Text style={{marginTop : 20 , marginLeft : 18, color : '#4a5cfc',  fontFamily: "Pretendard", fontWeight: "500", fontSize : 14, fontStyle: "normal",}}>{"작성자  |  "}{userName}</Text>

            <TextInput
                placeholder={'제목을 입력해 주세요(30자)'}
                value={title}
                style={{
                  width: '90%',
                  borderRadius: 9,
                  marginLeft: 20,
                  marginBottom: 10,
                  marginTop :15,
                  backgroundColor: 'transparent', // 텍스트 색상을 투명하게 설정
                  fontFamily: "Pretendard",
                }}
                placeholderTextColor="#b2b2b2" // placeholder 텍스트 색상 지정
                onChangeText={(text) => {
                  if (text.length <= 30) {
                    setTitle(text); // 길이가 30자 이하일 때만 title 업데이트
                  }
                }}
              />
                <View style={{ borderColor: '#dedede', borderStyle: 'solid', borderBottomWidth: 0.5, marginTop : 5}}/>
              <TextInput
                placeholder={'내용을 입력해 주세요(3000자)\n\n주제에 맞는 이야기를 통해 다양한 정보를 공유하고 서로 소통해요.\n주제에 맞지 않거나 신고를 받는 경우, 자동으로 숨김 처리 될 수 \n있어요.'}
                value={comment}
                style={{
                  width: '90%',
                  height : 100,
                  borderRadius: 9,
                  marginLeft: 20,
                  marginTop : 15,
                  backgroundColor: 'transparent', // 텍스트 색상을 투명하게 설정
                  fontFamily: "Pretendard",
                  fontSize : 12
            
                }}
                placeholderStyle={{
                  fontSize: 13, // Adjust the font size as needed
                }}
                onChangeText={(text) => {
                  if (text.length <= 3000) {
                    setcomment(text); // 길이가 50자 이하일 때만 comment 업데이트
                  }
                }}
                multiline={true} // Enable multiline input
                textAlignVertical="top" 
              />
            <View>
              <View style={{flexDirection : 'row'}}>
              {showimage == true ? ( // showImage가 true일 때 이미지 렌더링
               <View>
               {selectedImage ? ( // selectedImage가 있을 때 이미지 표시
                 <TouchableOpacity onPress={removeImage}>
                   <Image
                     source={{ uri: selectedImage }}
                     style={{ width: 160, height: 150, borderRadius: 10, marginTop: 0, marginLeft: 30 }}
                   />
                 </TouchableOpacity>
               ) : ( // selectedImage가 없을 때 이미지를 선택할 수 있는 영역 표시
                 <TouchableOpacity onPress={pickImage}>
                   <View style={{ width: 160, height: 150, backgroundColor: '#dcdcdc', marginTop: 0, marginLeft: 30, borderRadius: 10 }}>
                     {/* 가로선 (수평선) */}
                     <View style={{ width: '30%', height: 3, backgroundColor: 'white', position: 'absolute', top: '50%', left: '35%', transform: [{ translateY: -1.5 }] }} />
             
                     {/* 세로선 (수직선) */}
                     <View style={{ width: 3, height: '30%', backgroundColor: 'white', position: 'absolute', top: '35%', left: '50%', transform: [{ translateX: -1.5 }] }} />
                   </View>
                 </TouchableOpacity>
               )}
             </View>
              ) : (
                 <View/>
              )}

            {showimage1 == true ? (
              <View>
              {(selectedImage == null || selectedImage1 != null ) ? ( // selectedImage가 있을 때 이미지 표시
                <TouchableOpacity onPress={removeImage1}>
                  <Image
                    source={{ uri: selectedImage1 }}
                    style={{ width: 160, height: 150, borderRadius: 10, marginTop: 0, marginLeft: 20 }}
                  />
                </TouchableOpacity>
              ) : ( // selectedImage가 없을 때 이미지를 선택할 수 있는 영역 표시
                <TouchableOpacity onPress={pickImage1}>
                  <View style={{ width: 160, height: 150, backgroundColor: '#dcdcdc', marginTop: 0, marginLeft: 20, borderRadius: 10 }}>
                    {/* 가로선 (수평선) */}
                    <View style={{ width: '30%', height: 3, backgroundColor: 'white', position: 'absolute', top: '50%', left: '35%', transform: [{ translateY: -1.5 }] }} />
            
                    {/* 세로선 (수직선) */}
                    <View style={{ width: 3, height: '30%', backgroundColor: 'white', position: 'absolute', top: '35%', left: '50%', transform: [{ translateX: -1.5 }] }} />
                  </View>
                </TouchableOpacity>
              )}
            </View>
       
              ) : (
                <View/>
              )}

              </View>
              <View style={{flexDirection : 'row'}}>
              {showimage2 == true ? (
                 <View>
                {(selectedImage1 == null || selectedImage2 != null ) ? ( // selectedImage가 있을 때 이미지 표시
                   <TouchableOpacity onPress={removeImage2}>
                     <Image
                       source={{ uri: selectedImage2 }}
                       style={{ width: 160, height: 150, borderRadius: 10, marginTop: 20, marginLeft: 30 }}
                     />
                   </TouchableOpacity>
                 ) : ( // selectedImage가 없을 때 이미지를 선택할 수 있는 영역 표시
                   <TouchableOpacity onPress={pickImage2}>
                     <View style={{ width: 160, height: 150, backgroundColor: '#dcdcdc', marginTop: 20, marginLeft: 30, borderRadius: 10 }}>
                       {/* 가로선 (수평선) */}
                       <View style={{ width: '30%', height: 3, backgroundColor: 'white', position: 'absolute', top: '50%', left: '35%', transform: [{ translateY: -1.5 }] }} />
               
                       {/* 세로선 (수직선) */}
                       <View style={{ width: 3, height: '30%', backgroundColor: 'white', position: 'absolute', top: '35%', left: '50%', transform: [{ translateX: -1.5 }] }} />
                     </View>
                   </TouchableOpacity>
                 )}
               </View>
              ) : (
                <View/>
              )}
              {showimage3 == true ? (
             <View>
            {(selectedImage2 == null || selectedImage3 != null )? ( // selectedImage가 있을 때 이미지 표시
               <TouchableOpacity onPress={removeImage3}>
                 <Image
                   source={{ uri: selectedImage3 }}
                   style={{ width: 160, height: 150, borderRadius: 10, marginTop: 20, marginLeft: 20 }}
                 />
               </TouchableOpacity>
             ) : ( // selectedImage가 없을 때 이미지를 선택할 수 있는 영역 표시
               <TouchableOpacity onPress={pickImage3}>
                 <View style={{ width: 160, height: 150, backgroundColor: '#dcdcdc', marginTop: 20, marginLeft: 20, borderRadius: 10 }}>
                   {/* 가로선 (수평선) */}
                   <View style={{ width: '30%', height: 3, backgroundColor: 'white', position: 'absolute', top: '50%', left: '35%', transform: [{ translateY: -1.5 }] }} />
           
                   {/* 세로선 (수직선) */}
                   <View style={{ width: 3, height: '30%', backgroundColor: 'white', position: 'absolute', top: '35%', left: '50%', transform: [{ translateX: -1.5 }] }} />
                 </View>
               </TouchableOpacity>
             )}
           </View>
   
          ) : (
            <View/>
          )}
            </View>
            </View>
            </ScrollView>
            <View style={{paddingVertical: 15, paddingHorizontal: 20, marginTop : 'auto', marginBottom : 0}}>
            <Button
              loading={loading}
              style={{
                backgroundColor: '#484848', // 버튼 배경색 설정
                borderRadius: 13,
                display: comment && category && title ? 'flex' : 'none', // Show the button only if all fields are filled
              }}
              onPress={() => {
                onSubmit();
              }}>
              {"등록"}
            </Button>
            <View style={{ borderColor: '#dedede', borderStyle: 'solid', borderBottomWidth: 0.5, width : '120%', marginLeft : -20 ,marginTop :30}}/>
            <View style={{flexDirection : 'row'}}>
            <TouchableOpacity onPress={()=>showimagefirst()}>
            <Image source={require("../../../assets/picture.png")} style={{width : 30, height : 30, marginTop : 12, marginLeft : 5}} />
            </TouchableOpacity>
            <Text style={{color :'#dedede', fontFamily: "Pretendard" , fontSize : 14, fontWeight: "normal",fontStyle: "normal", marginTop : 20, marginLeft :'auto', marginRight : 10}}> {`(${commentLength}/3000)`}</Text>
            </View>
          </View>
  
    
      </SafeAreaView>
    </View>
  );
}
