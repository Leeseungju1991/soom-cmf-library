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
import {useTheme} from '@config';
import {SafeAreaView, Icon, Text, Image, Header} from '@components';
import styles from './styles';
import {homeSelect,wishlistSelect, designSelect} from '@selectors';
import {ChatCenteredText, BookmarkSimple, DotsThree, CaretLeft, Heart, ChatText, Eye} from 'phosphor-react-native';
import * as Utils from '@utils';
import moment from 'moment';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection,doc, getDoc,query, where, getDocs, updateDoc, onSnapshot , arrayUnion, arrayRemove, increment} from 'firebase/firestore';

const deltaY = new Animated.Value(0);
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export default function MyBookMark({navigation}) {
  const {colors} = useTheme();
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(220);
  const marginTopBanner = heightImageBanner - heightHeader + 10;
  const [activeTab, setActiveTab] = useState('토크');

  const [refreshing, setRefreshing] = useState(false);


  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);


  const [user, setUser] = useState(null); // 사용자 정보 상태 변수
  const componentMounted = useRef(true);

  const [liked, setLiked] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date()); // 현재 시간

  const [bookmarkArray, setBookmarkArray] = useState([]);
  const [userName, setUserName] = useState(""); // 추가: 사용자 이름을 저장할 상태 변수




const db = getFirestore();
const auth = getAuth();
const [bookmarks, setBookmarks] = useState([]);
const [bookmarks1, setBookmarks1] = useState([]);
const q1 = query(collection(db, 'User'), where('email', '==', auth.currentUser.email));
const q2 = collection(db, "post" );
const q4 = collection(db, "policy" );
const q5 = collection(db, "eduacation" );
const citiesRef = collection(db, "User");
const q8 = query(citiesRef, where("email", "==", auth.currentUser.email));



const [posts, setPosts] = useState([]);
const [posts3, setPosts3] = useState([]);
const [posts4, setPosts4] = useState([]);

const stockData = [
  { id: 1, company: "대웅", value: 6551 , minvalue : '3450', topvalue : '8211', category : '의약품 제조업', address1 : '경기', address2 : '성남구', year1 : '6461', year2 : '6000', year3 : '6551'},
  { id: 2, company: "일동제약", value: 7846 , minvalue : '4228', topvalue : '9066', category : '의약품 제조업', address1 : '서울', address2 : '서초구', year1 : '7249', year2 : '7341', year3 : '7846'},
  { id: 3, company: "데일리팜", value: 6930 , minvalue : '3700', topvalue : '7965', category : '온라인정보 제공업', address1 : '서울', address2 : '송파구', year1 : '6331', year2 : '6777', year3 : '6930'},
  { id: 4, company: "메디카코리아", value: 4825 , minvalue : '2820', topvalue : '6902', category : '의약품 제조업', address1 : '서울', address2 : '서초구', year1 : '4286', year2 : '4648', year3 : '4825'},
  { id: 5, company: "넥스팜코리아", value: 4153 , minvalue : '2570', topvalue : '6754', category : '의약품 제조업', address1 : '충북', address2 : '청주시', year1 : '4272', year2 : '4370', year3 : '4153'},
  { id: 6, company: "녹십자웰빙", value: 6157 , minvalue : '3297', topvalue : '7873', category : '의약품 제조업', address1 : '서울', address2 : '영등포구', year1 : '5574', year2 : '6453', year3 : '6157'},
  { id: 7, company: "케어젠", value: 5526 , minvalue : '3112', topvalue : '7272', category : '의약품 제조업', address1 : '경기', address2 : '안양시', year1 : '4602', year2 : '4217', year3 : '5526'},
  { id: 8, company: "이오플로우", value: 5686 , minvalue : '3085', topvalue : '7534', category : '의료기기 제조업', address1 : '경기', address2 : '성남시', year1 : '5203', year2 : '6459', year3 : '5686'},
  { id: 9, company: "듀켐바이오", value: 4389 , minvalue : '2684', topvalue : '6478', category : '의약품 제조업', address1 : '서울', address2 : '마포구', year1 : '3234', year2 : '3969', year3 : '4389'},
  { id: 10, company: "시지바이오", value: 5484 , minvalue : '3023', topvalue : '7172', category : '의료용품 제조업', address1 : '서울', address2 : '용산구', year1 : '5076', year2 : '5262', year3 : '5284'},
  { id: 11, company: "국전약품", value: 6335 , minvalue : '3451', topvalue : '8152', category : '의약품 제조업', address1 : '경기', address2 : '안양시', year1 : '4788', year2 : '4409', year3 : '6335'},
  { id: 12, company: "옵투스제약", value: 4594 , minvalue : '2750', topvalue : '6554', category : '의약품 제조업', address1 : '충북', address2 : '청주시', year1 : '4998', year2 : '4857', year3 : '4594'},
  { id: 13, company: "한국로슈진단", value: 6326, minvalue : '3336', topvalue : '8002', category : '의약품 도매업', address1 : '서울', address2 : '강남구', year1 : '5881', year2 : '6422', year3 : '6326'},
  { id: 14, company: "엠서클", value: 4674, minvalue : '2772', topvalue : '6549', category : '의약품 도매업', address1 : '서울', address2 : '강남구', year1 : '4486', year2 : '4452', year3 : '4674'},
  { id: 15, company: "제일약품", value: 6095, minvalue : '3225', topvalue : '7598', category : '의약품 제조업', address1 : '서울', address2 : '서초구', year1 : '5690', year2 : '5687', year3 : '6095'},
  { id: 16, company: "동아제약", value: 5692 , minvalue : '3109', topvalue : '7448', category : '의약품 제조업', address1 : '서울', address2 : '동대문구', year1 : '6051', year2 : '6250', year3 : '5692'},
  { id: 17, company: "셀트리온제약", value: 6816 , minvalue : '3468', topvalue : '8397', category : '의약품 제조업', address1 : '충북', address2 : '청주시', year1 : '5472', year2 : '6354', year3 : '6816'},
  { id: 18, company: "신풍제약", value: 6439 , minvalue : '3392', topvalue : '7830', category : '의약품 제조업', address1 : '경기', address2 : '안산시', year1 : '6048', year2 : '6276', year3 : '6439'},
  { id: 19, company: "한국에보트진단", value: 6050 , minvalue : '3374', topvalue : '7040', category : '의료용품 제조업', address1 : '경기', address2 : '용인시', year1 : '4074', year2 : '4389', year3 : '6050'},
  { id: 20, company: "서흥", value: 6384 , minvalue : '3309', topvalue : '7681', category : '의약품 제조업', address1 : '충북', address2 : '청주시', year1 : '5968', year2 : '6059', year3 : '6384'},
  { id: 21, company: "유영제약", value: 5737 , minvalue : '3073', topvalue : '7349', category : '의약품 제조업', address1 : '충북', address2 : '진천군', year1 : '5764', year2 : '5582', year3 : '5737'},
  { id: 22, company: "건일제약", value: 5812 , minvalue : '3011', topvalue : '7672', category : '의약품 제조업', address1 : '충북', address2 : '천안시', year1 : '5834', year2 : '5752', year3 : '5812'},
  { id: 23, company: "아이큐어", value: 3236 , minvalue : '2274', topvalue : '5899', category : '의약품 제조업', address1 : '서울', address2 : '강남구', year1 : '3777', year2 : '5676', year3 : '3236'},
  { id: 24, company: "환풍제약", value: 4785 , minvalue : '2828', topvalue : '6795', category : '의약품 제조업', address1 : '전북', address2 : '전주시', year1 : '4397', year2 : '4590', year3 : '4785'},
  { id: 25, company: "CMG제약", value: 5560 , minvalue : '3045', topvalue : '7527', category : '의약품 제조업', address1 : '서울', address2 : '강남구', year1 : '5934', year2 : '4920', year3 : '5567'},
  { id: 26, company: "조이제약", value: 5754 , minvalue : '3108', topvalue : '7554', category : '의약품 제조업', address1 : '서울', address2 : '영등포구', year1 : '5789', year2 : '5500', year3 : '5676'},
  { id: 27, company: "풍림파마텍", value: 5217 , minvalue : '2977', topvalue : '6165', category : '의료기기 제조업', address1 : '전북', address2 : '군산시', year1 : '4015', year2 : '4111', year3 : '5241'},
  { id: 28, company: "한국유니온제약", value: 4065 , minvalue : '2543', topvalue : '6380', category : '의약품 제조업', address1 : '강원', address2 : '원주시', year1 : '3760', year2 : '3809', year3 : '4145'},
  { id: 29, company: "퍼슨", value: 4246 , minvalue : '2640', topvalue : '6355', category : '의약품 제조업', address1 : '충남', address2 : '천안시', year1 : '4278', year2 : '4678', year3 : '4246'},
  { id: 30, company: "대정화금", value: 4214 , minvalue : '2630', topvalue : '6212', category : '항생물질 제조업', address1 : '경기', address2 : '시흥시', year1 : '3987', year2 : '4461', year3 : '4256'},
  { id: 31, company: "동방에프티엘", value: 4644 , minvalue : '2927', topvalue : '6518', category : '항생물질 제조업', address1 : '경기', address2 : '화성시', year1 : '4231', year2 : '4623', year3 : '4644'},
  { id: 32, company: "디에프아이", value: 4484 , minvalue : '2767', topvalue : '6109', category : '의료용품 제조업', address1 : '경남', address2 : '김해시', year1 : '4231', year2 : '4465', year3 : '4477'},
  { id: 33, company: "큐엔큐팜", value: 3401 , minvalue : '2355', topvalue : '5765', category : '의약품 제조업', address1 : '세종', address2 : '전의면', year1 : '3015', year2 : '3156', year3 : '3467'},
  { id: 34, company: "지엘파마", value: 3936 , minvalue : '2555', topvalue : '6205', category : '의약품 제조업', address1 : '경기', address2 : '안양시', year1 : '3476', year2 : '3687', year3 : '3914'},
  { id: 35, company: "에스비바이오팜", value: 4483 , minvalue : '2767', topvalue : '6241', category : '의약품 제조업', address1 : '서울', address2 : '성동구', year1 : '3878', year2 : '4063', year3 : '4483'},
  { id: 36, company: "명문제약", value: 4483 , minvalue : '2767', topvalue : '6241', category : '의약품 제조업', address1 : '서울', address2 : '성동구', year1 : '3878', year2 : '4063', year3 : '4483'},
  { id: 37, company: "삼우메디안", value: 4278 , minvalue : '2689', topvalue : '5978', category : '의약품 제조업', address1 : '충남', address2 : '예산군', year1 : '4098', year2 : '4167', year3 : '4256'},
  { id: 38, company: "제일바이오", value: 2941 , minvalue : '2223', topvalue : '4805', category : '의약품 제조업', address1 : '경기', address2 : '안산시', year1 : '3216', year2 : '3086', year3 : '2984'},
  { id: 39, company: "다원케미칼", value: 5009 , minvalue : '2987', topvalue : '6782', category : '의약품 제조업', address1 : '경기', address2 : '시흥시', year1 : '4890', year2 : '4857', year3 : '5085'},
  { id: 40, company: "성원에드콕제약", value: 4467 , minvalue : '2768', topvalue : '6578', category : '의약품 제조업', address1 : '경기', address2 : '김포시', year1 : '4096', year2 : '4367', year3 : '4416'},
  { id: 41, company: "오스템파마", value: 5207 , minvalue : '3018', topvalue : '7129', category : '의약품 제조업', address1 : '서울', address2 : '금천구', year1 : '4928', year2 : '4213', year3 : '5287'},
  { id: 42, company: "케이에스제약", value: 4406 , minvalue : '2714', topvalue : '6525', category : '의약품 제조업', address1 : '전남', address2 : '화순군', year1 : '4264', year2 : '4674', year3 : '4456'},
  { id: 43, company: "한국글로벌제약", value: 4071 , minvalue : '2525', topvalue : '6512', category : '의약품 제조업', address1 : '서울', address2 : '영등포구', year1 : '3910', year2 : '4019', year3 : '4156'},
  { id: 44, company: "영일제약", value: 5125 , minvalue : '3012', topvalue : '6653', category : '의약품 제조업', address1 : '충북', address2 : '전남군', year1 : '4412', year2 : '5123', year3 : '5178'},
  { id: 45, company: "리독스바이오", value: 5845 , minvalue : '3155', topvalue : '7167', category : '의약품 제조업', address1 : '경기', address2 : '화성시', year1 : '5202', year2 : '5603', year3 : '5789'},
  { id: 46, company: "성이바이오", value: 4263 , minvalue : '2654', topvalue : '6467', category : '의약품 제조업', address1 : '강원', address2 : '원시', year1 : '3943', year2 : '4356', year3 : '4215'},
  { id: 47, company: "우진비앤지", value: 4763 , minvalue : '2864', topvalue : '6467', category : '의약품 제조업', address1 : '경기', address2 : '화성시', year1 : '4685', year2 : '4969', year3 : '4708'},
  { id: 48, company: "한풍제약", value: 4752 , minvalue : '2853', topvalue : '6789', category : '의약품 제조업', address1 : '전북', address2 : '전주시', year1 : '6368', year2 : '6498', year3 : '6784'},
  { id: 49, company: "서울제약", value: 5491 , minvalue : '3075', topvalue : '7309', category : '의약품 제조업', address1 : '충북', address2 : '청주시', year1 : '4985', year2 : '5268', year3 : '5426'},
  { id: 50, company: "이니스트에스티", value: 5592 , minvalue : '3167', topvalue : '7467', category : '의약품 제조업', address1 : '충북', address2 : '음성군', year1 : '5136', year2 : '5357', year3 : '5578'},
  { id: 51, company: "테라이젠텍스", value: 5178 , minvalue : '2983', topvalue : '7374', category : '의약품 제조업', address1 : '경기', address2 : '안산시', year1 : '5215', year2 : '5125', year3 : '5379'},
  { id: 52, company: "오스코리아제약", value: 4462 , minvalue : '2768', topvalue : '6635', category : '의약품 제조업', address1 : '강원', address2 : '원주시', year1 : '4123', year2 : '4368', year3 : '4478'},
  { id: 53, company: "메드파크", value: 4576 , minvalue : '2784', topvalue : '6427', category : '의약품 제조업', address1 : '부산', address2 : '북구', year1 : '4367', year2 : '4684', year3 : '4572'},
  { id: 54, company: "조아제약", value: 5721 , minvalue : '3126', topvalue : '7553', category : '의약품 제조업', address1 : '서울', address2 : '영등포구', year1 : '5721', year2 : '5506', year3 : '5763'},
  { id: 55, company: "고려은단", value: 4621 , minvalue : '2773', topvalue : '6525', category : '의약품 제조업', address1 : '경기', address2 : '성남시', year1 : '3945', year2 : '4267', year3 : '4626'},
  { id: 56, company: "한국피엠지제약", value: 6037 , minvalue : '3357', topvalue : '7542', category : '의약품 제조업', address1 : '경기', address2 : '안산시', year1 : '5526', year2 : '5724', year3 : '6012'},
  { id: 57, company: "팜젠사이언스", value: 7762 , minvalue : '3934', topvalue : '9542', category : '의약품 제조업', address1 : '경기', address2 : '화성시', year1 : '6265', year2 : '6832', year3 : '7123'},
  { id: 58, company: "티디에스팜", value: 3981 , minvalue : '2572', topvalue : '5689', category : '의약품 제조업', address1 : '경기', address2 : '성남시', year1 : '3567', year2 : '3750', year3 : '3894'},
  { id: 59, company: "메딕스제약", value: 3912 , minvalue : '2572', topvalue : '6462', category : '의약품 제조업', address1 : '광주', address2 : '동구', year1 : '3945', year2 : '4167', year3 : '3980'},
  { id: 60, company: "코롱생명과학", value: 5728 , minvalue : '3089', topvalue : '7853', category : '의약품 제조업', address1 : '서울', address2 : '강서구', year1 : '5890', year2 : '5213', year3 : '5767'},
  { id: 61, company: "디에스엠뉴트리션코리아", value: 8232 , minvalue : '4323', topvalue : '10234', category : '의약품 제조업', address1 : '서울', address2 : '영등포구', year1 : '6844', year2 : '7235', year3 : '8123'},
  { id: 62, company: "미래바이오제약", value: 4045 , minvalue : '2567', topvalue : '6245', category : '의약품 제조업', address1 : '경기', address2 : '안성시', year1 : '3678', year2 : '4028', year3 : '4019'},
  { id: 63, company: "한랩", value: 6182 , minvalue : '3246', topvalue : '7780', category : '의료기기 제조업', address1 : '충북', address2 : '청주시', year1 : '5213', year2 : '5890', year3 : '6245'},
  { id: 64, company: "아크로스", value: 5278 , minvalue : '3098', topvalue : '6723', category : '의약품 제조업', address1 : '강원', address2 : '춘천시', year1 : '4525', year2 : '4987', year3 : '5213'},
  { id: 65, company: "하나제약", value: 6123 , minvalue : '3374', topvalue : '7934', category : '의약품 제조업', address1 : '경기', address2 : '화성시', year1 : '7237', year2 : '6713', year3 : '6134'},
  { id: 66, company: "녹십자엠에스", value: 5423 , minvalue : '3087', topvalue : '6823', category : '의료용품 제조업', address1 : '경기', address2 : '용인시', year1 : '5834', year2 : '4690', year3 : '5424'},
  { id: 67, company: "제이피케어스", value: 4036 , minvalue : '2578', topvalue : '5723', category : '의료용품 제조업', address1 : '경기', address2 : '성남시', year1 : '4087', year2 : '4367', year3 : '4012'},
  { id: 68, company: "성우화학", value: 5023 , minvalue : '2987', topvalue : '6623', category : '의약품 도매업', address1 : '경기', address2 : '화성시', year1 : '5089', year2 : '5345', year3 : '5098'},
  { id: 69, company: "디알텍", value: 4823 , minvalue : '2712', topvalue : '6589', category : '의료기기 제조업', address1 : '경기', address2 : '성남시', year1 : '4578', year2 : '4567', year3 : '4823'},
  { id: 70, company: "세라젬", value: 6465 , minvalue : '3321', topvalue : '7167', category : '의료기기 제조업', address1 : '충남', address2 : '천안시', year1 : '4367', year2 : '5820', year3 : '6395'},
  { id: 71, company: "나노엔텍", value: 4921 , minvalue : '2845', topvalue : '6854', category : '의료기기 제조업', address1 : '서울', address2 : '구로구', year1 : '4382', year2 : '4718', year3 : '4810'},
  { id: 72, company: "제이에스메디칼", value: 5252 , minvalue : '2981', topvalue : '6854', category : '의료기기 제조업', address1 : '서울', address2 : '금천구', year1 : '4918', year2 : '5019', year3 : '5291'},
  { id: 73, company: "오상헬스케어", value: 4618 , minvalue : '2765', topvalue : '6422', category : '의료용품 제조업', address1 : '경기', address2 : '안양시', year1 : '4019', year2 : '4718', year3 : '4617'},
  { id: 74, company: "제노레이", value: 4918 , minvalue : '2817', topvalue : '6910', category : '의료기기 제조업', address1 : '경기', address2 : '성남시', year1 : '4622', year2 : '4619', year3 : '4933'},
  { id: 75, company: "루트로닉", value: 6234 , minvalue : '3365', topvalue : '7452', category : '의료기기 제조업', address1 : '경기', address2 : '고양시', year1 : '4421', year2 : '5287', year3 : '6245'},
  { id: 76, company: "뷰웍스", value: 6413 , minvalue : '3467', topvalue : '8365', category : '의료기기 제조업', address1 : '경기', address2 : '안양시', year1 : '6012', year2 : '6201', year3 : '6382'},
  { id: 77, company: "원바이오젠", value: 4623 , minvalue : '2878', topvalue : '6218', category : '의료기기 제조업', address1 : '경북', address2 : '구미시', year1 : '3423', year2 : '3678', year3 : '4621'},
  { id: 78, company: "코잔", value: 4678 , minvalue : '2810', topvalue : '6123', category : '의료기기 제조업', address1 : '서울', address2 : '금천구', year1 : '4765', year2 : '4621', year3 : '4623'},
  { id: 79, company: "인성메디칼", value: 3372 , minvalue : '2356', topvalue : '5123', category : '의료기기 제조업', address1 : '강원', address2 : '원주시', year1 : '3689', year2 : '3521', year3 : '3321'},
  { id: 80, company: "티앤엘", value: 5623 , minvalue : '3019', topvalue : '6823', category : '의료기기 제조업', address1 : '경기', address2 : '용인시', year1 : '4019', year2 : '5523', year3 : '5623'},
  { id: 81, company: "아크로스", value: 5234 , minvalue : '3098', topvalue : '6723', category : '의료기기 제조업', address1 : '강원', address2 : '춘천시', year1 : '4521', year2 : '4789', year3 : '5123'},
  { id: 82, company: "알에프바이오", value: 5123 , minvalue : '3087', topvalue : '6645', category : '의료기기 제조업', address1 : '경기', address2 : '군포시', year1 : '5123', year2 : '5234', year3 : '5189'},
  { id: 83, company: "덴티움", value: 5367 , minvalue : '2916', topvalue : '7765', category : '의료기기 제조업', address1 : '서울', address2 : '강남구', year1 : '4710', year2 : '5087', year3 : '5309'},
  { id: 84, company: "세운메디칼", value: 4267 , minvalue : '2689', topvalue : '5987', category : '의료기기 제조업', address1 : '충남', address2 : '천안시', year1 : '3901', year2 : '3928', year3 : '4201'},
  { id: 85, company: "오스테오닉", value: 4029 , minvalue : '2718', topvalue : '5810', category : '의료기기 제조업', address1 : '서울', address2 : '구로구', year1 : '3708', year2 : '4421', year3 : '4099'},
  { id: 86, company: "유신메디칼", value: 3213 , minvalue : '2276', topvalue : '5278', category : '의료기기 제조업', address1 : '경기', address2 : '부천시', year1 : '3145', year2 : '3001', year3 : '3123'},
  { id: 87, company: "현대메디텍", value: 3397 , minvalue : '2367', topvalue : '5354', category : '의료기기 제조업', address1 : '강원', address2 : '원주시', year1 : '3345', year2 : '3378', year3 : '3308'},
  { id: 88, company: "필텍바이오", value: 3980 , minvalue : '2578', topvalue : '5421', category : '의료기기 제조업', address1 : '충남', address2 : '천안시', year1 : '3456', year2 : '3789', year3 : '3980'},
  { id: 89, company: "바이오프로테크", value: 4321 , minvalue : '2755', topvalue : '5976', category : '의료기기 제조업', address1 : '강원', address2 : '원주시', year1 : '3412', year2 : '3789', year3 : '4321'},
  { id: 90, company: "알에프메디칼", value: 4712 , minvalue : '2682', topvalue : '6352', category : '의료기기 제조업', address1 : '서울', address2 : '금천구', year1 : '3987', year2 : '4121', year3 : '4765'},
  { id: 91, company: "대일정공", value: 4589 , minvalue : '2723', topvalue : '6087', category : '의료기기 제조업', address1 : '서울', address2 : '금천구', year1 : '4085', year2 : '4123', year3 : '4567'},
  { id: 92, company: "티디엠", value: 4731 , minvalue : '2873', topvalue : '6345', category : '의료기기 제조업', address1 : '광주', address2 : '북구', year1 : '4210', year2 : '4467', year3 : '4765'},
  { id: 93, company: "영케미칼", value: 3621 , minvalue : '2412', topvalue : '5423', category : '의료용품 제조업', address1 : '경남', address2 : '김해시', year1 : '3365', year2 : '3465', year3 : '3642'},
  { id: 94, company: "쉬앤비", value: 4723 , minvalue : '2876', topvalue : '6312', category : '의료기기 제조업', address1 : '서울', address2 : '성동구', year1 : '4409', year2 : '4120', year3 : '4768'},
  { id: 95, company: "오스템디오", value: 5910 , minvalue : '3221', topvalue : '7283', category : '의료기기 제조업', address1 : '경기', address2 : '고양시', year1 : '5029', year2 : '4820', year3 : '5920'},
  { id: 96, company: "니코메디칼", value: 4123 , minvalue : '2687', topvalue : '5821', category : '의료용품 제조업', address1 : '경기', address2 : '광주시', year1 : '3462', year2 : '3834', year3 : '4123'},
  { id: 97, company: "메디칼파크", value: 5572 , minvalue : '3256', topvalue : '6821', category : '의료기기 제조업', address1 : '경기', address2 : '용인시', year1 : '4521', year2 : '5055', year3 : '5552'},
  { id: 98, company: "유니온메디칼", value: 4082 , minvalue : '2567', topvalue : '5707', category : '의료기기 제조업', address1 : '경기', address2 : '의정부시', year1 : '3978', year2 : '4123', year3 : '4098'},
  { id: 99, company: "지온메디텍", value: 4321 , minvalue : '2666', topvalue : '5821', category : '의료기기 제조업', address1 : '경기', address2 : '안양시', year1 : '3678', year2 : '3876', year3 : '4321'},
  { id: 100, company: "비손메디칼", value: 4123 , minvalue : '2678', topvalue : '6029', category : '의료기기 제조업', address1 : '서울', address2 : '금천구', year1 : '4082', year2 : '4312', year3 : '4178'},
  { id: 101, company: "코러스트", value: 4378 , minvalue : '2799', topvalue : '5892', category : '의료기기 제조업', address1 : '경기', address2 : '안양시', year1 : '4521', year2 : '4367', year3 : '4421'},
  { id: 102, company: "바이오팩트", value: 4521 , minvalue : '2808', topvalue : '6123', category : '의료용품 제조업', address1 : '대전', address2 : '유성구', year1 : '3987', year2 : '4421', year3 : '4521'},
  { id: 103, company: "후원이디아이", value: 3723 , minvalue : '2512', topvalue : '5552', category : '의료기기 제조업', address1 : '경남', address2 : '김해시', year1 : '4423', year2 : '3634', year3 : '3745'},
];



const valueArray = stockData.map(item => item.value);
const sum = valueArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

// 평균을 계산합니다.
const average = (sum / valueArray.length).toFixed(0);


let company1, company2, company3, company4, company5;
let value1, value2, value3, value4, value5;

// value 값을 기준으로 내림차순으로 정렬
const sortedData1 = stockData.slice().sort((a, b) => b.value - a.value);

// 상위 5개 항목 추출하고 변수에 저장
[company1, company2, company3, company4, company5] = sortedData1.slice(0, 5).map(item => item.company);
[value1, value2, value3, value4, value5] = sortedData1.slice(0, 5).map(item => item.value);

const percentage1 = (((value1 - average) / average) * 100).toFixed(2);
const percentage2 = (((value2 - average) / average) * 100).toFixed(2);
const percentage3 = (((value3 - average) / average) * 100).toFixed(2);
const percentage4 = (((value4 - average) / average) * 100).toFixed(2);
const percentage5 = (((value5 - average) / average) * 100).toFixed(2);

const formatValue = (value) => {
  const valueString = value.toString(); // 숫자를 문자열로 변환
  const length = valueString.length;

  if (length <= 3) {
    return valueString; // 3자리 이하인 경우 그대로 반환
  }

  const lastThreeDigits = valueString.slice(length - 3); // 뒤에서 3자리 가져오기
  const remainingDigits = valueString.slice(0, length - 3); // 나머지 숫자 부분

  return `${remainingDigits},${lastThreeDigits}`;
};

useEffect(() => {
  const data1 = bookmarks.filter(item => Number.isInteger(item));

  onSnapshot(q2, (snapshot) => {
    if (componentMounted.current) {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      
    }
    return () => {
      componentMounted.current = false;
    };
  });
}, []);


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
  onSnapshot(q4, (snapshot) => {
    if (componentMounted.current) {
      setPosts3(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      
    }
    return () => {
      componentMounted.current = false;
    };
  });
}, []);


useEffect(() => {
  onSnapshot(q5, (snapshot) => {
    if (componentMounted.current) {
      setPosts4(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      
    }
    return () => {
      componentMounted.current = false;
    };
  });
}, []);


useEffect(() => {
  const getBookmarks = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('사용자가 인증되지 않았습니다.');
        return;
      }

      // 사용자의 이메일을 사용하여 해당 사용자를 찾음
      const userQuerySnapshot = await getDocs(q1);

      if (userQuerySnapshot.docs.length > 0) {
        const userDoc = userQuerySnapshot.docs[0];
        const userId = userDoc.id;

        // 사용자의 정보에서 북마크된 항목 가져오기
        const userData = (await getDoc(doc(db, 'User', userId))).data();
        if (userData && userData.bookmark) {
          setBookmarks(userData.bookmark);
          const integerBookmarks = bookmarks.filter(item => typeof item === 'number');
          console.log('asdasdaa', integerBookmarks)
        } else {
          console.log('북마크된 항목이 없습니다.');
        }
      } else {
        console.error('사용자를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('북마크 가져오기 중 오류 발생:', error);
    }
  };

  // useEffect 내에서 getBookmarks 함수를 호출하여 북마크를 가져옵니다.
  getBookmarks();

}, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

useEffect(() => {
  const getBookmarks = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('사용자가 인증되지 않았습니다.');
        return;
      }

      // 사용자의 이메일을 사용하여 해당 사용자를 찾음
      const userQuerySnapshot = await getDocs(q1);

      if (userQuerySnapshot.docs.length > 0) {
        const userDoc = userQuerySnapshot.docs[0];
        const userId = userDoc.id;

        // 사용자의 정보에서 북마크된 항목 가져오기
        const userData = (await getDoc(doc(db, 'User', userId))).data();
        if (userData && userData.bookmark1) {
          setBookmarks1(userData.bookmark1);
          const integerBookmarks = bookmarks1.filter(item => typeof item === 'number');
          console.log('asdasdaa', integerBookmarks)
        } else {
          console.log('북마크된 항목이 없습니다.');
        }
      } else {
        console.error('사용자를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('북마크 가져오기 중 오류 발생:', error);
    }
  };

  // useEffect 내에서 getBookmarks 함수를 호출하여 북마크를 가져옵니다.
  getBookmarks();

}, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행
 
  const [data1, setData1] = useState([]);
 

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
  
    if (oneLineTitle.length > 30) {
      return oneLineTitle.slice(0, 30) + '...';
    } else {
      return oneLineTitle;
    }
  }


  const likeplus = async (likecount, postId, currentLikeColor) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("사용자가 인증되지 않았습니다.");
        // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
        return;
      }
  
      const postDocRef = doc(db, 'post', postId);
  
      // 게시물 문서에서 "likedBy" 필드를 가져와 현재 사용자 UID가 있는지 확인
      const postSnapshot = await getDoc(postDocRef);
      const likedBy = postSnapshot.data().likedBy || [];
      // 현재 like 필드의 상태에 따라 토글
      const newLikeColor = !currentLikeColor;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 해주고 두 자리로 표시
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  
      const customDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}`;
      console.log(customDateTimeString);
  
      // 이미 좋아요를 누른 경우 좋아요 취소
      if (likedBy.includes(userName)) {
        await updateDoc(postDocRef, {
          likecount: increment(-1),
          likedBy: arrayRemove(userName), // 사용자 UID를 "likedBy" 배열에서 제거
        });
        console.log("좋아요 취소 완료");
        // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
      } else {
        // 아직 좋아요를 누르지 않은 경우 좋아요 추가
        await updateDoc(postDocRef, {
          likecount: increment(1),
          likedBy: arrayUnion(userName), // 사용자 UID를 "likedBy" 배열에 추가
        });
        console.log("좋아요 추가 완료");
        // 사용자에게 알림 메시지 표시 (예: 모달 또는 토스트 메시지)
      }
    } catch (error) {
      console.error("좋아요 업데이트 중 오류 발생:", error);
      // 오류 메시지를 사용자에게 표시 (예: 모달 또는 토스트 메시지)
    }
  };

  
  const onRefresh = () => {
  };


  const commentplus = async (count, id) => {
    console.log(count)
    await updateDoc(doc(db, "post", id), {
      commentcount : count + 1
    });
  }


  const isWithin30Minutes = (timeString) => {
    const currentTime = moment();
    const time = moment(timeString, 'HH:mm:ss');
    return currentTime.diff(time, 'minutes') <= 30;
  }
  
  const handleInputChange = (timeString) => {
    if (isWithin30Minutes(timeString)) {
      return (
      
        <View>
        <Text caption2 grayColor numberOfLines={1}>{'방금 전'}</Text>
      </View>
      );
  
    } else {
      return (
      
        <View>
        <Text caption2 grayColor numberOfLines={1}>{timeString}</Text>
      </View>
      );
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



  function getCategoryColor(category) {
    switch (category) {
      case '회사생활':
        return '#01be80';
      case '취미':
        return '#a234fe';
      case '자유':
        return '#4a5cfc';
      case '이직커리어':
        return '#a71a1a';
      default:
        // 기본 색상 또는 처리할 다른 카테고리 색상을 여기에 추가할 수 있습니다.
        return '#000'; // 기본 색상 (예: 검은색)
    }
  }

  /**
   * render content screen
   * @returns
   */

  const renderContent = () => {

    const bookmarkedPosts = posts.filter(post => bookmarks.includes(post.id));


    const sortedPosts = [...bookmarkedPosts].sort((a, b) => {
      // "time"을 시간 형식인 'YYYY-MM-DD HH:mm'에서 파싱
      const timeA = moment(a.time, 'YYYY-MM-DD HH:mm').toDate();
      const timeB = moment(b.time, 'YYYY-MM-DD HH:mm').toDate();
      
      // 내림차순으로 정렬 (최신순)
      return timeB - timeA;
    });

    if (sortedPosts.length === 0) {
      // 저장된 게시물이 없는 경우 메시지를 표시
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop : '20%' }}>

            <BookmarkSimple size={35} color={'#dedede'} style={{}} />
            <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#b2b2b2', fontFamily: "Pretendard", marginTop : 10}} >{"저장된 게시글이 없습니다."}</Text>
        </View>
      );
    }

    
    return (
      <View style={{ flex : 1}}>
      <View style={{flex: 1, marginTop: -20}}>
        <View style={{marginTop: 20, backgroundColor: '#FFFFFF'}}>
          <FlatList 
            contentContainerStyle={{marginTop: -25}}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            data={sortedPosts}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
          />
        
        </View>
        <View style={{marginTop : 130}}></View>
      </View> 
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
        <TouchableOpacity  activeOpacity={0.11} onPress={()=>gogo(item.viewcount,item.id)}> 
       
        <View style={[styles.contain]}>
    
  
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ marginLeft: 10, color: getCategoryColor(item.category) , marginTop : 0}}>
            {item.category}
          </Text>
        </View>
 
   
        <View style={{flexDirection : 'row'}}> 
        <Text style={{  marginLeft: 10, marginTop: 0, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
          {item.name === userName ? "작성자" : "종사자"}
        </Text>
        <View style={{ width: 1.2, height: 15, marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <View style={{ width: 1, height: 0,marginTop: 0, backgroundColor: '#b2b2b2' , marginLeft : 8 }} />
        <Text style={{ marginTop: 0, fontWeight: '500', fontStyle: 'normal', color: '#484848' }}>
           {item.name}
        </Text>
        </View>
  
        <View style={{  marginTop : 10, marginLeft : 10, }}> 
        <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
        {truncateTitle(item.title)}
        </Text>
        <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#484848', fontFamily: "Pretendard",letterSpacing: 0,}}>
        {truncateTitle(item.comment)}
        </Text>
        </View>
  
  
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
        <TouchableOpacity activeOpacity={0.11} onPress={() => likeplus(item.likecount, item.id, item.likecolor)}>
        <View style={{ flexDirection: 'row' }}>
          <Heart
            size={20}
            color={item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"}
            style={{ marginTop: 10, marginLeft: 10 }}
          />
          <Text
            style={{
              marginTop: 10,
              marginLeft: 10,
              color: item.likedBy && item.likedBy.includes(userName) ? "#e61e1e" : "#b2b2b2"
            }}
          >
            {item.likecount}
          </Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.11} onPress={()=>gogo(item.viewcount,item.id)}> 
        <ChatText size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
        </TouchableOpacity>
        <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
          {item.commentcount}
        </Text>
        <TouchableOpacity
          onPress={() => handleInputChange(item.time)}
        >
        <Eye size={20} color={"#b2b2b2"}  style={{ marginTop: 10, marginLeft: 10 }}/>
        </TouchableOpacity>
        <Text style={{ marginTop: 10, marginLeft: 10 , color : '#b2b2b2'}}>
          {item.viewcount}
        </Text>
      </View>
  
      <View style={{width : '100%', height : 30, backgroundColor : '#FFFFFF'}}/>
  
        </View>
        
         <View style={{marginTop : -24 }}>
         <View style={{ borderBottomColor: '#DEDEDE', borderBottomWidth: 0.7, marginTop: 10 }} />
         <View style={{marginTop : -20}}></View>
         </View>
         </TouchableOpacity>
         </SafeAreaView>
         
      );
      
  };

  const renderContent4 = () => {

    const bookmarkedPosts = posts4.filter(post => bookmarks.includes(post.id));

    if (bookmarkedPosts.length === 0) {
      // 저장된 게시물이 없는 경우 메시지를 표시
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop : '20%' }}>

            <BookmarkSimple size={35} color={'#dedede'} style={{}} />
            <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#b2b2b2', fontFamily: "Pretendard", marginTop : 10}} >{"저장된 교육강의가 없습니다."}</Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, marginTop: 0 }}>
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
          data={bookmarkedPosts}
          renderItem={renderItem1}
          keyExtractor={(item) => String(item.id)}
        />
           <View style={{marginTop : 125}}></View>
      </View>
    );
  
};

const renderItem1 = ({ item }) => {

  return (
    <SafeAreaView style={{marginTop : -30}}>
    <TouchableOpacity activeOpacity={0.11} onPress={() => navigation.navigate("Messenger1", { text1 : item.title, text2: item.subtitle,text3: item.category ,text4 : item.commentcount, text5 : item.id, additionalValue: item.seq ,uri : item.uri  })}>
        <Image source={{ uri: item.image }} style={{width : '100%', height : 220, marginTop : 0, marginLeft : 0}} />
        <View style={{marginLeft : 20, marginTop : 20}}>
        <Text style={{ fontSize: 15, fontFamily: "Pretendard",fontWeight: "normal",fontStyle: "normal", }}>{item.title}</Text>
        <Text style={{ fontSize: 15, fontFamily: "Pretendard",fontWeight: "normal",fontStyle: "normal", }}>{item.subtitle}</Text>
        <Text style={{ fontSize: 15, fontFamily: "Pretendard",fontWeight: "normal",fontStyle: "normal", color: '#b2b2b2' }}>{item.category}</Text>
        <View style={{marginTop : 30}}/>
        </View>
      </TouchableOpacity>
   </SafeAreaView>
  );
};


function extract11to15WithEllipsis(title) {
  const characters11to15 = title.substring(0, 15);
  if (characters11to15.length > 0) {
    return characters11to15 + '...';
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


const renderContent2 = () => {
 const filteredData = stockData.filter(item => bookmarks.includes(parseInt(item.id)));

 if (filteredData.length === 0) {
  // 저장된 게시물이 없는 경우 메시지를 표시
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop : '20%' }}>
        <BookmarkSimple size={35} color={'#dedede'} style={{}} />
        <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#b2b2b2', fontFamily: "Pretendard", marginTop : 10}} >{"저장된 연봉정보가 없습니다."}</Text>
    </View>
  );
}

 console.log(filteredData)
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
      data={filteredData}
      renderItem={renderItem2}
      keyExtractor={(item) => String(item.id)}
    />
    
    </View>
    <View style={{marginTop : 125}}></View>
    </View> 


  );
};

const renderItem2 = ({ item }) => (

  <SafeAreaView>
<TouchableOpacity activeOpacity={0.11} onPress={()=> navigation.navigate("Wishlist1",{item})}>
    <View style={{flexDirection : 'row', marginTop : 0, marginLeft : 20}}>
    <Image source={require("../../../assets/ex.png")} style={{width : 150, height : 95, borderRadius: 12,}} />
    <Text style={{marginTop : 20, marginLeft : 20,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15}}>{(item.company)}</Text>
    </View>
    <View style={{flexDirection : 'row'}}>
    <Text style={{marginTop : -50, marginLeft : 190,  color : '#b2b2b2', fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15}}>{(item.category)}</Text>
    <View style={{ width: 1.2, height: 15, marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 , marginTop : -45}} />
        <View style={{ width: 1, height: 0,marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8, marginTop : -45 }} />
    <Text style={{marginTop : -50, marginLeft : 0, color : '#b2b2b2', fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15}}>{(item.address1)}{", "}{item.address2}</Text>
   </View>
    
    <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.7, marginTop : 20}}/>
</TouchableOpacity>
   </SafeAreaView>

  );

  
const renderContent3 = () => {

  const bookmarkedPosts = posts3.filter(post => bookmarks.includes(post.id));


  if (bookmarkedPosts.length === 0) {
    // 저장된 게시물이 없는 경우 메시지를 표시
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop : '20%' }}>

          <BookmarkSimple size={35} color={'#dedede'} style={{}} />
          <Text style={{ fontWeight : '500', fontStyle: "normal", color : '#b2b2b2', fontFamily: "Pretendard", marginTop : 10}} >{"저장된 뉴스가 없습니다."}</Text>
      </View>
    );
  }

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
      data={bookmarkedPosts}
      renderItem={renderItem3}
      keyExtractor={(item) => String(item.id)}
    />
    
    </View>
    <View style={{marginTop : 125}}></View>
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
      <Text style={{marginTop : -73, marginLeft : 190,  fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15}}>{extract11to15WithEllipsis1(item.title)}</Text>
      </View>
      <View style={{flexDirection : 'row' }}>
      <Text style={{marginTop : -20, marginLeft : 195, color : '#b2b2b2', fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15}}>{(item.time)}</Text>
      <View style={{ width: 1.2, height: 15, marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8 , marginTop : -15}} />
        <View style={{ width: 1, height: 0,marginTop: 4, backgroundColor: '#b2b2b2' , marginLeft : 8, marginTop : -15 }} />
        <Text style={{marginTop : -20, marginLeft : 0, color : '#b2b2b2', fontFamily: "Pretendard", fontWeight: "normal", fontStyle: "normal", fontSize : 15}}>{item.category}</Text>
        </View>
      <View style={{ borderBottomColor: '#dedede', borderBottomWidth: 0.7, marginTop : 20}}/>
  </TouchableOpacity>
     </SafeAreaView>
  );
    
};


  const scrollToTop = (scrollViewRef) => {
    scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  const scrollViewRef = useRef();


  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
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
 
              <Text style={{ fontSize: 18 , marginRight : 'auto', marginLeft :10 }}>{"북마크"}</Text>
      </View>
      </TouchableOpacity>
        <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.7, marginTop : 20}}/>
        <View style={{marginTop : 20}}></View>
        
        <ScrollView
            showsVerticalScrollIndicator={false}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {['토크', '연봉', '뉴스', '교육'].map((tabName, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTabPress(tabName)}
                style={{
                  width: 88, // 최대 너비 선택
                  height: 40,
                  backgroundColor: activeTab === tabName ? '#4a5cfc' : '#FFFFFF',
                  borderRadius: 34,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 10,
                  marginBottom : 10,
                  borderColor: '#e9e9e9', // 테두리 색상
                  borderWidth: activeTab !== tabName ? 1 : 0, // 테두리 두께 (눌리지 않았을 때만 표시)
                }}
              >
                <Text style={{ fontFamily: "Pretendard",fontWeight: "500",fontStyle: "normal",color: activeTab === tabName ? '#FFFFFF' : '#484848', fontSize: 14 }}>{tabName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
     
          <View style={{marginTop : 10}}></View>
          <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: "#FFFFFF"}}>
          {activeTab === '토크' ? renderContent() : null}
          {activeTab === '연봉' ? renderContent2() : null}
          {activeTab === '뉴스' ? renderContent3() : null}
          {activeTab === '교육' ? renderContent4() : null}
          </ScrollView>
         
         
    </View>
  );a
}
