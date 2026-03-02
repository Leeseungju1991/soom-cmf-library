import React, { useEffect, lazy, startTransition, Suspense } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { useTheme } from '@config';

/* Main Stack Navigator */

const Main = lazy(() => import('app/navigation/main'));
const SearchHistory = lazy(() => import('@screens/SearchHistory'));
const SearchHistory2 = lazy(() => import('@screens/SearchHistory2'));
const SearchHistory3 = lazy(() => import('@screens/SearchHistory3'));
const Wishlist1 = lazy(() => import('@screens/Wishlist1'));
const AlertScreen = lazy(() => import('@screens/Alert'));
const SignIn = lazy(() => import('@screens/SignIn'));
const SignUp = lazy(() => import('@screens/SignUp'));
const SignUp1 = lazy(() => import('@screens/SignUp1'));
const SignUp2 = lazy(() => import('@screens/SignUp2'));
const SignUp3 = lazy(() => import('@screens/SignUp3'));
const SignUpPolicy = lazy(() => import('@screens/SignUpPolicy'));
const ResetPassword = lazy(() => import('@screens/ResetPassword'));

const RootStack = createStackNavigator();

export default function Navigator() {
  const { theme, colors } = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    startTransition(() => {
      StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
    });
  }, [colors.primary, isDarkMode]);

  return (
    <NavigationContainer theme={theme}>
       <Suspense fallback={() => <Text></Text>}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="SignIn"
      >

        <RootStack.Screen name="SignIn" component={SignIn} />
        <RootStack.Screen name="SignUp" component={SignUp} />
        <RootStack.Screen name="SignUp1" component={SignUp1} />
        <RootStack.Screen name="SignUp2" component={SignUp2} />
        <RootStack.Screen name="SignUp3" component={SignUp3} />
        <RootStack.Screen name="SignUpPolicy" component={SignUpPolicy} />
        <RootStack.Screen name="ResetPassword" component={ResetPassword} />
    
        <RootStack.Screen name="Wishlist1" component={Wishlist1} />
        <RootStack.Screen
          name="Alert"
          component={AlertScreen}
          options={{
            presentation: 'transparentModal',
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
            cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            gestureEnabled: false,
          }}
        />
        <RootStack.Screen name="Main" component={Main} />
        <RootStack.Screen name="SearchHistory2" component={SearchHistory2} />
        <RootStack.Screen name="SearchHistory3" component={SearchHistory3} />
        <RootStack.Screen name="SearchHistory" component={SearchHistory} />
      </RootStack.Navigator>
      </Suspense>
    </NavigationContainer>
  );
}