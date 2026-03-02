import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

const SignUpPolicy = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16, // 여백 설정
  },
  text: {
    fontSize: 16,
    lineHeight: 24, // 줄간격 설정
  },
});

export default SignUpPolicy;