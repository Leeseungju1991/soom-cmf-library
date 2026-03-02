import React, {useEffect} from 'react';
import {Text, Icon} from '@components';
import {TouchableOpacity, View, BackHandler} from 'react-native';
import {useTheme,  } from '@config';
import styles from './styles';

export default function Alert({route, navigation}) {
  const {colors} = useTheme();
  const {title, message, action, option, type} = route?.params;
  const success = type === 'success';

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => !option?.cancelable,
    );

    return () => backHandler.remove();
  }, [option?.cancelable]);

  const renderButtonFirst = () => {
    const firstTitle = action?.[0]?.text ?? t('close');
    const onPress = action?.[0]?.onPress;
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          onPress?.();
          if (option?.cancelable) navigation.goBack();
        }}>
        <Text body2 semibold style={{fontFamily: "Pretendard",}}>
          {firstTitle}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderButtonSecond = () => {
    const secondTitle = action?.[1]?.text;
    const onPress = action?.[1]?.onPress;
    if (title && onPress) {
      return (
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderLeftColor: colors.border,
              borderLeftWidth: 0.5,
            },
          ]}
          onPress={() => {
            onPress?.();
            if (option?.cancelable) navigation.goBack();
          }}>
          <Text body2 semibold>
            {secondTitle}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.contain}>
      <View style={[styles.content, {backgroundColor: '#FFFFFF'}]}>
        <View style={{padding: 8, alignItems: 'center'}}>
          <Text style={{color : '#4a5cfc', fontSize : 16 , marginTop : 30, fontFamily: "Pretendard",  fontWeight: "500",fontStyle: "normal",}}>
            {title}
          </Text>
          <Text body2 medium style={styles.message}>
            {message}
          </Text>
        </View>
        <View style={[styles.contentButton, {borderTopColor: colors.border}]}>
          {renderButtonFirst()}
          {renderButtonSecond()}
        </View>
      </View>
    </View>
  );
}
