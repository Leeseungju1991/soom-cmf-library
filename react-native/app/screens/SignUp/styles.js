import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contain: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    flex: 1,

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
    borderRadius: 4,
    marginTop: 5,
    width: 17,
    height: 17,
    borderWidth: 1,
    borderColor: '#b2b2b2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#b2b2b2',
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  input: {
    marginTop : 10,
    width: 350,
    height: 40,
    backgroundColor: 'transparent',
    fontSize : 16
  },
});
