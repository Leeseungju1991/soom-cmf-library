import {StyleSheet, Dimensions} from 'react-native';
import * as Utils from '@utils';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',     // 수평 방향 가운데 정렬
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
  rowTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop : 15,
    backgroundColor : '#f6f7ff'
  },
});
