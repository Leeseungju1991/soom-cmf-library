import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  contain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.2)'
  },
  content: {
    width: '90%',
    borderRadius: 25,
  },
  contentButton: {
    borderTopWidth: 0.5,
    marginTop : 20,
    flexDirection: 'row',
  },
  contentIcon: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  message: {marginTop: 4, textAlign: 'center',  fontFamily: "Pretendard", fontSize : 14 ,fontWeight: "500", fontStyle: "normal", },
});
