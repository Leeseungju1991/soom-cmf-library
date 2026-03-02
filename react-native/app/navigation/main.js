import React, { useEffect, lazy, Suspense } from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

/* Bottom Screen */
import Home from '@screens/Home';
import Wishlist from '@screens/Wishlist';
import Profile from '@screens/Profile';
import PreMessenger from '@screens/PreMessenger';
import Messenger from '@screens/Messenger';
import Messenger1 from '@screens/Messenger1';
import Messenger1change from '@screens/Messenger1change';
import Wishlist1change from '@screens/Wishlist1change';
import Setting from '@screens/Setting';
import Category from '@screens/Category';
import Category1 from '@screens/Category1';
import Feedback from '@screens/Feedback';
import Feedback1 from '@screens/Feedback1';
import Feedback2 from '@screens/Feedback2';
import Feedback3 from '@screens/Feedback3';
import Feedback4 from '@screens/Feedback4';
import Feedback5 from '@screens/Feedback5';
import Feedback6 from '@screens/Feedback6';
import FeedDetail from '@screens/FeedDetail';
import FeedDetailChange from '@screens/FeedDetailChange';
import FeedDetailChange1 from '@screens/FeedDetailChange1';
import FeedDetailChange2 from '@screens/FeedDetailChange2';
import FeedDetail2 from '@screens/FeedDetail2';
import ContactUs from '@screens/ContactUs';
import ContactUsQnA from '@screens/ContactUsQnA';
import Event from '@screens/Event';
import Event1 from '@screens/Event1';
import ContactUs1 from '@screens/ContactUs1';
import ContactUs2 from '@screens/ContactUs2';
import MyFeed from '@screens/MyFeed';
import MyBookMark from '@screens/MyBookMark';
import ResetPassword1 from '@screens/ResetPassword1';
import alarm from '@screens/alarm';
import Category1change from '@screens/Category1change';
import Mission from '@screens/Mission';

import {ChatCircleDots, ChalkboardTeacher, Article, PencilSimpleLine,User} from 'phosphor-react-native';

const MainStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function Main() {

  return (
    <Suspense fallback={() => <Text></Text>}>
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="BottomTabNavigator">
      <MainStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
      <MainStack.Screen name="Setting" component={Setting} />
      <MainStack.Screen name="Category" component={Category} />
      <MainStack.Screen name="Feedback" component={Feedback} />
      <MainStack.Screen name="Feedback1" component={Feedback1} />
      <MainStack.Screen name="Feedback2" component={Feedback2} />
      <MainStack.Screen name="Feedback3" component={Feedback3} />
      <MainStack.Screen name="Feedback4" component={Feedback4} />
      <MainStack.Screen name="Feedback5" component={Feedback5} />
      <MainStack.Screen name="Feedback6" component={Feedback6} />
      <MainStack.Screen name="FeedDetail" component={FeedDetail} />
      <MainStack.Screen name="FeedDetail2" component={FeedDetail2} />
      <MainStack.Screen name="FeedDetailChange" component={FeedDetailChange} />
      <MainStack.Screen name="FeedDetailChange1" component={FeedDetailChange1} />
      <MainStack.Screen name="FeedDetailChange2" component={FeedDetailChange2} />
      <MainStack.Screen name="Wishlist1change" component={Wishlist1change} />
      <MainStack.Screen name="ContactUs" component={ContactUs} />
      <MainStack.Screen name="ContactUsQnA" component={ContactUsQnA} />
      <MainStack.Screen name="ContactUs1" component={ContactUs1} />
      <MainStack.Screen name="ContactUs2" component={ContactUs2} />
      <MainStack.Screen name="Event" component={Event} />
      <MainStack.Screen name="Event1" component={Event1} />
      <MainStack.Screen name="MyFeed" component={MyFeed} />
      <MainStack.Screen name="MyBookMark" component={MyBookMark} />
      <MainStack.Screen name="Messenger" component={Messenger} />
      <MainStack.Screen name="Messenger1" component={Messenger1} />
      <MainStack.Screen name="Messenger1change" component={Messenger1change} />
      <MainStack.Screen name="Category1" component={Category1} />
      <MainStack.Screen name="ResetPassword1" component={ResetPassword1} />
      <MainStack.Screen name="alarm" component={alarm} />
      <MainStack.Screen name="Category1change" component={Category1change} />
      <MainStack.Screen name="Mission" component={Mission} />
    </MainStack.Navigator>
    </Suspense>
  );
}

function BottomTabNavigator() {

  const tabBarHeight = Platform.OS === 'ios' ? 90 : 60; // iOS의 경우 90, 다른 플랫폼은 60

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        swipeEnabled : true,
        tabBarInactiveTintColor: "#b2b2b2",
        tabBarActiveTintColor: "#4a5cfc",
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 13,
          fontFamily: "Pretendard",
          fontWeight: "500",
        },
        tabBarStyle: {
          backgroundColor: 'white', // Set the background color here
          height: tabBarHeight, // 플랫폼에 따라 다른 높이를 사용
          marginTop : 0
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <View style={{ alignItems: 'center' }}>
                <ChatCircleDots size={30} color={color} style={{marginTop : 5}} />
              </View>
            );
          },
          tabBarLabel: ({color}) => (
            <Text style={{ fontSize: 12, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", marginBottom: 5, color : color  }}>
              {"토크"}
            </Text>
          ),
        }}
      />
      <BottomTab.Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <View style={{ alignItems: 'center' }}>
                <ChalkboardTeacher size={30} color={color} style={{marginTop : 5}} />
              </View>
            );
          },
          tabBarLabel: ({color}) => (
            <Text style={{ fontSize: 12, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", marginBottom: 5, color : color  }}>
              {"채용"}
            </Text>
          ),
        }}
      />
      <BottomTab.Screen
        name="Category"
        component={Category}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <View style={{ alignItems: 'center' }}>
                <Article size={30} color={color} style={{marginTop : 5}} />
              </View>
            );
          },
          tabBarLabel: ({color}) => (
            <Text style={{ fontSize: 12, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", marginBottom: 5, color : color  }}>
              {"뉴스"}
            </Text>
          ),
        }}
      />
      <BottomTab.Screen
        name="PreMessenger"
        component={PreMessenger}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <View style={{ alignItems: 'center' }}>
                <PencilSimpleLine size={30} color={color} style={{marginTop : 5}} />
              </View>
            );
          },
          tabBarLabel: ({color}) => (
            <Text style={{ fontSize: 12, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", marginBottom: 5, color : color  }}>
              {"교육"}
            </Text>
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <View style={{ alignItems: 'center' }}>
                <User size={30} color={color} style={{marginTop : 5}} />
              </View>
            );
          },
          tabBarLabel: ({color}) => (
            <Text style={{ fontSize: 12, fontFamily: "Pretendard", fontWeight: "500", fontStyle: "normal", marginBottom: 5, color : color  }}>
              {"MY"}
            </Text>
          ),
        }}
      />

    </BottomTab.Navigator>
  );
}
