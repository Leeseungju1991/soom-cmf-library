
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';
import { Platform } from 'react-native';

export default StyleSheet.create({
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  contain: {
    padding: 40,
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
    marginBottom: 5,
  },
  modalSectionText: {
    color: '#777777',
  },
  modalText: {
    color: '#777777',
    marginTop: 10,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#a234fe',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
  },
  containercheck: {
    borderRadius: 4,
    marginTop: 3,
    width: 17,
    height: 17,
    borderWidth: 1,
    borderColor: '#b2b2b2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {

  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logoImage: {
    width: 250,
    height: 43,
    marginTop : '27%'
  },
  passwordResetButton: {
    marginLeft: 'auto', // 화면 오른쪽으로 배치,
    marginTop : 1,
    padding : 10,
    marginTop: Platform.OS === 'ios' ? - 6 : -10,
  },
  passwordResetText: {
    fontSize: 13,
    color : '#b2b2b2'
  },
  gradientButton: {
    marginTop: '8%',
    borderRadius: 63,
  },
  loginButtonText: {
    color: 'white',
    fontFamily: 'Pretendard',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 15,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
  },
});
