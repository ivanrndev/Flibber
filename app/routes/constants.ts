import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from './RootNavigation';

export enum ROOT_ROUTES {
  SIGN_IN = 'SIGN_IN',
  MAIN_BOTTOM_BAR = 'MAIN_BOTTOM_BAR',
  ADD_LAB = 'ADD_LAB',
  EDIT_LAB = 'EDIT_LAB',
}

export enum BOTTOM_BAR_ROUTES {
  LABS_LIST = 'LABS_LIST',
  SETTINGS = 'SETTINGS',
  PUBLIC_LABS_LIST = 'PUBLIC_LABS_LIST',
}

export const useTypedNavigation = () =>
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();
