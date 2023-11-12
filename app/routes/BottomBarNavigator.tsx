import {useTheme} from '../theme/useTheme';
import Tasks from '../screens/Tasks';
import NetworkExample from '../screens/NetworkExample';
import Settings from '../screens/Settings';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomBarParamList} from './RootNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {ColorValue} from 'react-native';
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
        name="LIBS_LIST"
        component={Tasks}
        options={{
          tabBarIcon: homeIcon,
        }}
      />
      <Tab.Screen
        name="Network_Example"
        component={NetworkExample}
        options={{
          tabBarIcon: networkIcon,
        }}
      />
      <Tab.Screen
        name="SETTINGS"
        component={Settings}
        options={{
          // headerShown: false,
          tabBarIcon: settingsIcon,
        }}
      />
    </Tab.Navigator>
  );
};
