import {useTheme} from '../theme/useTheme';
import Settings from '../screens/Settings';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomBarParamList} from './RootNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {ColorValue} from 'react-native';
import {BOTTOM_BAR_ROUTES} from './constants';
import {PublicLabsListScreen} from '../screens/PublicLabsListScreen';
import {LabsListScreen} from '../screens/LabsListScreen';

// Icons for Bottom Tab Navigation
const homeIcon = ({color}: {color: ColorValue | number}) => (
  <Icon name="list-sharp" size={30} color={color} />
);
const networkIcon = ({color}: {color: ColorValue | number}) => (
  <Icon name="wifi-sharp" size={24} color={color} />
);
const settingsIcon = ({color}: {color: ColorValue | number}) => (
  <Icon name="settings-sharp" size={24} color={color} />
);

export const BottomTabBar = () => {
  const {theme} = useTheme();
  const Tab = createBottomTabNavigator<BottomBarParamList>();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.cardBg,
          borderTopColor: theme?.layoutBg,
        },
        tabBarInactiveTintColor: theme.color,
        tabBarActiveTintColor: theme.primary,
        headerStyle: {backgroundColor: theme.cardBg, height: 50},
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: theme.primary,
          fontSize: 18,
          fontWeight: 'bold',
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name={BOTTOM_BAR_ROUTES.LABS_LIST}
        component={LabsListScreen}
        options={{
          tabBarIcon: homeIcon,
        }}
      />
      <Tab.Screen
        name={BOTTOM_BAR_ROUTES.PUBLIC_LABS_LIST}
        component={PublicLabsListScreen}
        options={{
          tabBarIcon: networkIcon,
        }}
      />
      <Tab.Screen
        name={BOTTOM_BAR_ROUTES.SETTINGS}
        component={Settings}
        options={{
          // headerShown: false,
          tabBarIcon: settingsIcon,
        }}
      />
    </Tab.Navigator>
  );
};
