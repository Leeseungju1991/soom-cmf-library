import React from 'react';
import {Image, View} from "react-native";

export default class Splash extends React.Component{
    render(){
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../assets/splash.gif')} style={{width : '100%', height : '100%', marginTop : 0}}/>
          </View>
        );
    }
}