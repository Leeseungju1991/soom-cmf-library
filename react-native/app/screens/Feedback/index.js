import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  Modal,
  ToastAndroid,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import {BaseStyle} from '@config';
import {SafeAreaView, Text, Image, Button} from '@components';
import styles from './styles';
import { getStorage, ref, getDownloadURL ,  uploadBytesResumable} from 'firebase/storage';
import {CaretDown} from 'phosphor-react-native'; 
import * as ImagePicker from 'expo-image-picker'
import {
  getFirestore,
  onSnapshot,
  query,
  where,
  addDoc,
  collection,
} from "firebase/firestore";
import * as ImageManipulator from 'expo-image-manipulator'
import { getAuth } from 'firebase/auth';

export default function Feedback({navigation}) {

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const [progress, setProgress] = useState('')
  const db = getFirestore();
  const [title, setTitle] = useState('');
  const [comment, setcomment] = useState('');
  const [commentLength, setCommentLength] = useState(0); // 글자수를 저장하는 상태 변수 추가
  const [categorytext, setcategorytext] = useState("토크 주제를 선택해 주세요.");
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [selectedImage3, setSelectedImage3] = useState(null);
  const [showimage, setshowimage] = useState(false);
  const [showimage1, setshowimage1] = useState(false);
  const [showimage2, setshowimage2] = useState(false);
  const [showimage3, setshowimage3] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  const moment = require('moment');
  const currentTime = moment()

  const citiesRef = collection(db, "User");
  const auth = getAuth();
  const q = query(citiesRef, where("email", "==", auth.currentUser.email));
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수
  const remotePath = `images/${category}_${title}_${comment}.jpeg`; // 파일 이름 변경

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 3초 후에 isLoading 상태를 false로 업데이트하여 로딩 화면을 벗어납니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // 컴포넌트가 언마운트 될 때 타이머를 클리어합니다.
    return () => clearTimeout(timer);
  }, []);


  const storage = getStorage();

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


const pickImage = async () => {
  try {
    if (Platform.OS === 'ios') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert("Permission is required for use.");
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false
    });
      if (!result.canceled) {
        let actions = [];
        actions.push({ resize: { width: 300 } });
        const manipulatorResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          actions,
          {
            compress: 0.4,
          },
        );
        console.log("야호")
        const localUri = await fetch(manipulatorResult.uri);
        const localBlob = await localUri.blob();
        const filename = filename+ new Date().getTime()
        const storageRef = ref(storage, `post/${title}/` + 1)
        const uploadTask = uploadBytesResumable(storageRef, localBlob)
        uploadTask.on('state_changed',
          (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(parseInt(progress) + '%')
          },
          (error) => {
            console.log('에러');
            alert("Upload failed.");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setProgress('')
              setSelectedImage(downloadURL)
              setshowimage1(true)
            });
          }
        );
      }
  } catch (e) {
    console.log('error',e.message);
    alert("The size may be too much.");
  }

};

const pickImage1 = async () => {
  try {
    if (Platform.OS === 'ios') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert("Permission is required for use.");
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false
    });
      if (!result.canceled) {
        let actions = [];
        actions.push({ resize: { width: 300 } });
        const manipulatorResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          actions,
          {
            compress: 0.4,
          },
        );
        const localUri = await fetch(manipulatorResult.uri);
        const localBlob = await localUri.blob();
        const filename = filename + new Date().getTime()
        const storageRef = ref(storage, `post/${title}/` + 2)
        const uploadTask = uploadBytesResumable(storageRef, localBlob)
        uploadTask.on('state_changed',
          (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(parseInt(progress) + '%')
          },
          (error) => {
            console.log(error);
            alert("Upload failed.");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setProgress('')
              setSelectedImage1(downloadURL)
              setshowimage2(true)
            });
          }
        );
      }
  } catch (e) {
    console.log('error',e.message);
    alert("The size may be too much.");
  }
};


const pickImage2 = async () => {
  try {
    if (Platform.OS === 'ios') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert("Permission is required for use.");
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false
    });
      if (!result.canceled) {
        let actions = [];
        actions.push({ resize: { width: 300 } });
        const manipulatorResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          actions,
          {
            compress: 0.4,
          },
        );
        const localUri = await fetch(manipulatorResult.uri);
        const localBlob = await localUri.blob();
        const filename = filename + new Date().getTime()
        const storageRef = ref(storage, `post/${title}/` + 3)
        const uploadTask = uploadBytesResumable(storageRef, localBlob)
        uploadTask.on('state_changed',
          (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(parseInt(progress) + '%')
          },
          (error) => {
            console.log(error);
            alert("Upload failed.");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setProgress('')
              setSelectedImage2(downloadURL)
              setshowimage3(true)
            });
          }
        );
      }
  } catch (e) {
    console.log('error',e.message);
    alert("The size may be too much.");
  }
};

const pickImage3 = async () => {
  try {
    if (Platform.OS === 'ios') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert("Permission is required for use.");
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false
    });
      if (!result.canceled) {
        let actions = [];
        actions.push({ resize: { width: 300 } });
        const manipulatorResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          actions,
          {
            compress: 0.4,
          },
        );
        const localUri = await fetch(manipulatorResult.uri);
        setSelectedImage3(manipulatorResult.uri)
        const localBlob = await localUri.blob();
        const filename = filename + new Date().getTime()
        const storageRef = ref(storage, `post/${title}/` + 4)
        const uploadTask = uploadBytesResumable(storageRef, localBlob)
        uploadTask.on('state_changed',
          (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(parseInt(progress) + '%')
          },
          (error) => {
            console.log(error);
            alert("Upload failed.");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setProgress('')
              setSelectedImage3(downloadURL)
            });
          }
        );
      }
  } catch (e) {
    console.log('error',e.message);
    alert("The size may be too much.");
  }
};




  const onSubmit = async () => {
    
    if((comment != '') && (category != '') && (title != '')){
      try {
        const docRef = await addDoc(collection(db,'post'), {
          title : title,
          category :  category,
          comment : comment ,
          name : userName,
          email : auth.currentUser.email,
          likecount : 0,
          commentcount : 0,
          viewcount : 0,
          Feed : Math.random().toString(36),
          likecolor : false,
          time : currentTime.format('YYYY-MM-DD HH:mm'),
          bancount : 0,
          image1 : selectedImage,
          image2 : selectedImage1,
          image3 : selectedImage2,
          image4 : selectedImage3
        });
        setcomment(null)
        setTitle(null)
        setCategory(null)
        ToastAndroid.show('게시글이 작성되었습니다.', ToastAndroid.SHORT);
        console.log(selectedImage)
        console.log(selectedImage1)
        console.log(selectedImage2)
        navigation.goBack();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
  }
  else{
    ToastAndroid.show('모든 내용을 채워주세요.', ToastAndroid.SHORT);
  }
}

const removeImage = () => {
  setSelectedImage(null);
};

const removeImage1 = () => {
  setSelectedImage1(null);
};

const removeImage2 = () => {
  setSelectedImage2(null);
};

const removeImage3 = () => {
  setSelectedImage3(null);
};


const showimagefirst = () => {
  setshowimage(true)
}

if (isLoading) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#a234fe" />
  </View>
  );
}

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
        <ScrollView showsVerticalScrollIndicator={false} style={{marginTop : 20}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' , marginLeft : 20 }}>
            <TouchableOpacity onPress={()=>navigation.goBack()} >
                 <Text style={{ fontSize: 17 ,  fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal",}}>{"취소"}</Text>
            </TouchableOpacity>
            </View>
            <View style={{ borderColor: '#B2B2B2', borderStyle: 'solid', borderBottomWidth: 0.8, marginTop : 20}}/>

            <TouchableOpacity onPress={() => {setModalVisible1(!modalVisible1)}}>
            <View style={{ width : '100%', height : 60, backgroundColor : '#f6f7ff', flexDirection : 'row',}}>
              <Text style={{fontFamily: "Pretendard", fontSize : 15, fontWeight: "500", fontStyle: "normal", marginTop : 17, marginLeft : 20}}>{categorytext}{}{category}</Text>
              <CaretDown  size={25} color={'#484848'} style={{ marginTop : 15, marginLeft : 'auto', marginRight : 20}}/>
            </View>
            </TouchableOpacity>
            <Text style={{marginTop : 20 , marginLeft : 18, color : '#4a5cfc',  fontFamily: "Pretendard", fontWeight: "500", fontSize : 14, fontStyle: "normal",}}>{"작성자  |  "}{userName}</Text>

            <TextInput
                placeholder={'제목을 입력해 주세요(3000자)'}
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

      <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible1}
      onRequestClose={() => {
        setModalVisible1(!modalVisible1);
      }}
    >
       <StatusBar
      translucent={true}
      backgroundColor="rgba(0, 0, 0, 0.5)" // 반투명 배경색
    />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{flexDirection : 'row'}}>
          <TouchableOpacity  onPress={() => {setModalVisible1(!modalVisible1)}}>
         
          </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.modalSection}>
             
            <TouchableOpacity onPress={() => {
              setCategory("회사생활");
              setModalVisible1(!modalVisible1);
              setcategorytext(null)
            }}>
              <Text style={styles.modalSectionTitle}>{"회사생활"}</Text>
              </TouchableOpacity>

              <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10, width : '80%' , marginLeft : '10%' }} />

              <TouchableOpacity onPress={() => {
                setCategory("이직커리어");
                setModalVisible1(!modalVisible1);
                setcategorytext(null)
              }}>
              <Text style={styles.modalSectionTitle1}>{"이직커리어"}</Text>
              </TouchableOpacity>
             <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10, width : '80%' , marginLeft : '10%' }} />

             <TouchableOpacity onPress={() => {
                setCategory("취미");
                setModalVisible1(!modalVisible1);
                setcategorytext(null)
              }}>
              <Text style={styles.modalSectionTitle1}>{"취미"}</Text>
              </TouchableOpacity>

             <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10, width : '80%' , marginLeft : '10%' }} />

             <TouchableOpacity onPress={() => {
                setCategory("자유");
                setModalVisible1(!modalVisible1);
                setcategorytext(null)
              }}>
              <Text style={styles.modalSectionTitle1}>{"자유"}</Text>
              </TouchableOpacity>
        
              
            </View>
          
  
            <TouchableOpacity style={styles.confirmButton} onPress={() => {setModalVisible1(!modalVisible1)}}>
              <Text style={styles.confirmButtonText}>{"취소"}</Text>
              </TouchableOpacity>
          </View>
        </View>

      </View>
    </Modal>
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
  );
};


