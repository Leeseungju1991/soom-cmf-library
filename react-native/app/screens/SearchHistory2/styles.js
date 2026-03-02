import {StyleSheet, Dimensions} from 'react-native';
import * as Utils from '@utils';

export default StyleSheet.create({
  btnClearSearch: {
    justifyContent: 'center',
    width: 30,
    height: '100%',
    marginLeft : 20,
    marginTop : 0
    
  },
  loadMoreContent: {
    flexDirection: 'row',
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop : 15,
    backgroundColor : '#f6f7ff'
  },
  itemHistory: {
    marginTop: 5,
    padding: 5,
    marginRight: 10,
  },
  loadingContent: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  transparentInput: {
    backgroundColor: 'transparent', // 입력란의 배경색을 투명하게 설정
    borderWidth: 0, // 테두리를 없애거나 필요에 따라 조정
    color: 'white', // 텍스트 색상을 원하는 색상으로 설정
    marginTop : 2
  },
  container: {
    flex: 1,
    alignItems: 'center',     // 수평 방향 가운데 정렬
  },
  menuIcon1: {
    marginTop : 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom : 50
  },
  contain: {
    paddingHorizontal: 20,
    backgroundColor:"#FFFFFF",
  },
  input: {
    marginTop : 4,
    width: '85%',
    height: 40,
    fontSize : 15,
    backgroundColor: 'transparent',
    placeholderTextColor: '#D11111',
    fontFamily: "Pretendard",
  },
  contentHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  contentSearch: {
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  lineForm: {
    width: 1,
    height: '100%',
    margin: 10,
  },
  categoryContent: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContent: {
    width: 36,
    height: 36,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  doc: {
    width: 10,
    height: 10,
    borderRadius: 8,
    borderWidth: 1,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  menuIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 15,
    right: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentLeft: {
    flex: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  contentRight: {
    flex: 2,
    alignItems: 'flex-end',
  },
  contentRate: {
    flex: 1,
    marginTop: 5,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal:{
    backgroundColor:"#00000099",
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  modalContainer:{
    width:"37%",
    height : '70%'
  },
  modalHeader:{
    
  },
  title:{
    fontWeight:"bold",
    fontSize:20,
    padding:15,
    color:"#000"
  },
  divider:{
    width:"100%",
    backgroundColor:"lightgray"
  },
  modalBody:{
    paddingVertical:0,
    paddingHorizontal:0
  },
  modalFooter1:{
    backgroundColor:"#00000029",

  },
  actions:{
    borderRadius:5,
    marginHorizontal:10,
    paddingVertical:10,
    paddingHorizontal:20
  },
  actionText:{
    color: '#87CEEB'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:22,
    
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 100,
    alignItems: 'center',
    shadowColor: '#000',
    //그림자의 영역 지정
    shadowOffset: {
      width: 0,
      height:2
    },
    //불투명도 지정
    shadowOpacity: 0.1,
    //반경 지정
    shadowRadius: 3.84,
  },
  openButton: {
    backgroundColor: '#f194ff',
    borderRadius: 20,
    padding: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
  },
  titleStyle: {
    padding: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paragraphStyle: {
    padding: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  introImageStyle: {
    width: 200,
    height: 200,
  },
  introTextStyle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 30,
  },
  introTitleStyle: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  imageBackground: {
    height: 110,
    width: '100%',
    position: 'absolute',
    marginBottom: 16,
  },
  container: {
    marginTop : 50,
  },
  imageBackground: {
    height: 140,
    width: '100%',
    position: 'absolute',
  },
  contentPage: {
    bottom: 50,
  },
  searchForm: {
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    shadowOffset: {width: 1.5, height: 1.5},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
  },
  lineForm: {
    width: 1,
    height: '100%',
    margin: 10,
  },
  serviceContent: {
    
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 30,
  },
  serviceItem: {
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceCircleIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    marginBottom: 5,
  },
  contentPopular: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  promotionBanner: {
    height: Utils.scaleWithPixel(100),
    width: '100%',
    marginTop: 10,
  },
  popularItem: {
    width: Utils.scaleWithPixel(135),
    height: Utils.scaleWithPixel(160),
    borderRadius: 8,
  },
  menuIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 15,
    right: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  contentSearch: {
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  lineForm: {
    width: 1,
    height: '100%',
    margin: 10,
  },
  categoryContent: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContent: {
    width: 36,
    height: 36,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  doc: {
    width: 10,
    height: 10,
    borderRadius: 8,
    borderWidth: 1,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  menuIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 15,
    right: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon1: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 15,
    right: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom : 50
  },
  centerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contain: {
    paddingHorizontal: 20,
    backgroundColor:"#FFFFFF",
    marginTop : -10,
  },
  contentLeft: {
    flex: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  contentRate: {
    flex: 1,
    marginTop: 5,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal:{
    backgroundColor:"#00000099",
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader:{
    
  },
  title:{
    fontWeight:"bold",
    fontSize:20,
    padding:15,
    color:"#000"
  },
  divider:{
    width:"100%",
    backgroundColor:"lightgray"
  },
  modalBody:{
    paddingVertical:0,
    paddingHorizontal:0
  },
  modalFooter:{
    backgroundColor:"#FFF",
  },
  actions:{
    borderRadius:5,
    marginHorizontal:10,
    paddingVertical:10,
    paddingHorizontal:20
  },
  actionText:{
    color:"#fff"
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:22,
    
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 100,
    alignItems: 'center',
    shadowColor: '#000',
    //그림자의 영역 지정
    shadowOffset: {
      width: 0,
      height:2
    },
    //불투명도 지정
    shadowOpacity: 0.1,
    //반경 지정
    shadowRadius: 3.84,
  },
  openButton: {
    backgroundColor: '#f194ff',
    borderRadius: 20,
    padding: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
  },
  titleStyle: {
    padding: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paragraphStyle: {
    padding: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  introImageStyle: {
    width: 200,
    height: 200,
  },
  introTextStyle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 30,
  },
  introTitleStyle: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  imageBackground: {
    height: 110,
    width: '100%',
    position: 'absolute',
    marginBottom: 16,
  },
  buttonStyle: {
    width: '100%',
    height: 40,
    padding: 10,
    backgroundColor: '#f5821f',
    marginTop: 30,
  },
  buttonTextStyle: {
    color: 'white',
    textAlign: 'center',
  },
  titleStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    paddingTop: 30,
    backgroundColor: '#307ecc',
    padding: 16,
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  container12: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderRadius: 20, // 테두리를 둥글게 만듦
  },
  container: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  contentContainer: {
    alignItems: 'center',
  },
  activeContainer: {
    borderWidth: 2,
    borderColor: '#000',
  },
  text: {
    color: 'lightblue',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    
  },
  indexText: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width, // 슬라이더 너비에 맞게 이미지 크기 조정
    flex: 1,
  },
  shadowBox: {
    backgroundColor: 'white',
    borderRadius: 10, // 테두리 둥글게 만들기 위한 속성
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5, // 그림자 투명도
    shadowRadius: 4, // 그림자의 둥글기 정도
    elevation: 5, // 안드로이드에서 그림자를 주기 위한 속성
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop : -30,
    marginLeft :10
  },
  modalImage: {
    marginTop : 10,
    width: 170,
    height: 160,
    marginLeft : 10
  },
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    marginTop : 'auto',
    marginBottom : -15,
    backgroundColor: 'white',
    borderRadius: 20,
    height : 240,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
    marginBottom: 10,
  },
  modalContent: {
    alignItems: 'stretch',
  },
  modalSection: {
    marginBottom: 10,
  },
  modalSectionTitle: {
    fontWeight: 'bold',
    marginTop : 30,
    marginLeft : 30,
    fontSize : 20,
    fontFamily: "Pretendard",
  },
  modalSectionText: {
    color: '#b2b2b2',
    marginLeft : 60,
    marginTop : 5,
    fontFamily: "Pretendard",
  },
  modalText: {
    color: '#777777',
    marginTop: 10,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#a234fe',
    borderRadius: 10,
    marginLeft : '5%',
    alignItems: 'center',
    width : '90%',
    height : 50
  },
  confirmButton1: {
    backgroundColor: '#a234fe',
    borderRadius: 10,
    marginLeft : '2%',
    alignItems: 'center',
    width : '95%',
    height : 50,
    marginTop : -10
  },
  confirmButton2: {
    backgroundColor: '#a234fe',
    borderRadius: 10,
    marginLeft : '2%',
    alignItems: 'center',
    width : '95%',
    height : 50,
    marginTop : 10
  },
  confirmButtonText: {
    color: 'white',
    fontSize : 20, 
    marginTop : 10
  },
  containercheck: {
    marginTop: 4,
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: '#a234fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#a234fe',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logoImage: {
    width: 200,
    height: 45,
  },
  passwordResetButton: {
    marginLeft: 'auto', // 화면 오른쪽으로 배치,
    marginTop : 1
  },
  passwordResetText: {
    fontSize: 13,
    color : '#a234fe'
  },
});
