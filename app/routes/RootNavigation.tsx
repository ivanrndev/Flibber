import React from 'react';

import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/auth/Login';
import {FirestoreServiceProvider} from '../hooks/useFirestoreService';
import {BottomTabBar} from './BottomBarNavigator';
import {BOTTOM_BAR_ROUTES, ROOT_ROUTES} from './constants';
import {ILabItem} from '../hooks/types';
import {LabsScreen} from '../screens/LabScreen';

export type RootStackParamList = {
  [ROOT_ROUTES.SIGN_IN]: undefined;
  [ROOT_ROUTES.MAIN_BOTTOM_BAR]: undefined;
  [ROOT_ROUTES.ADD_LAB]: undefined;
  [ROOT_ROUTES.EDIT_LAB]: {item: ILabItem};
};

export type BottomBarParamList = {
  [BOTTOM_BAR_ROUTES.LABS_LIST]: undefined;
  [BOTTOM_BAR_ROUTES.SETTINGS]: undefined;
  [BOTTOM_BAR_ROUTES.Network_Example]: undefined;
};

export type INavigateRefResult = {
  navigate: () => void;
  goBack: () => void;
} | null;

export const navigationRef = createNavigationContainerRef();

export const navigateWithRef = (name = null): INavigateRefResult => {
  if (navigationRef.isReady()) {
    return {
      navigate: () => navigationRef.navigate(name as never),
      goBack: () => navigationRef.goBack(),
    };
  }
  console.error('nav is not ready');
  return null;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigation() {
  return (
    <FirestoreServiceProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name={ROOT_ROUTES.SIGN_IN} component={Login} />
          <Stack.Screen
            name={ROOT_ROUTES.MAIN_BOTTOM_BAR}
            component={BottomTabBar}
          />
          <Stack.Screen name={ROOT_ROUTES.ADD_LAB} component={LabsScreen} />
          <Stack.Screen name={ROOT_ROUTES.EDIT_LAB} component={LabsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FirestoreServiceProvider>
  );
}
