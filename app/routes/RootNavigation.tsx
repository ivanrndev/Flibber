import React from 'react';

import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/auth/Login';
import {FirestoreServiceProvider} from '../hooks/useFirestoreService';
import {BottomTabBar} from './BottomBarNavigator';
import {BOTTOM_BAR_ROUTES, ROOT_ROUTES} from './constants';

export type RootStackParamList = {
  [ROOT_ROUTES.SIGN_IN]: undefined;
  [ROOT_ROUTES.MAIN_BOTTOM_BAR]: undefined;
};

export type BottomBarParamList = {
  [BOTTOM_BAR_ROUTES.LIBS_LIST]: undefined;
  [BOTTOM_BAR_ROUTES.SETTINGS]: undefined;
  [BOTTOM_BAR_ROUTES.Network_Example]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigation() {
  return (
    <FirestoreServiceProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name={ROOT_ROUTES.SIGN_IN} component={Login} />
          <Stack.Screen
            name={ROOT_ROUTES.MAIN_BOTTOM_BAR}
            component={BottomTabBar}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FirestoreServiceProvider>
  );
}
