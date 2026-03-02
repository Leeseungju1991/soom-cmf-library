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
});
