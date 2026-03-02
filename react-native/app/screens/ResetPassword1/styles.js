import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor : '#a234fe'
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  containercheck: {
    width: 13,
    height: 13,
    borderWidth: 1,
    borderColor: '#87CEEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#87CEEB',
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    width: 300,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom : 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 24,
    color: '#000',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '88%',
    height: 50,
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 6,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    flex: 1, // Input 컴포넌트가 화면 전체 너비를 차지하도록 함
    height: '100%',
    marginLeft : 5
  },
});
