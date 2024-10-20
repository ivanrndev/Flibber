import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {FirebaseStorageTypes} from '@react-native-firebase/storage';

// USER TYPES
export interface IUser {
  id: string;
  username: string;
  password: string;
  profileImageURL: string | null;
}

// LABS TYPES

// firestore item
export interface ILabItem
  extends ILabItemAddRequestData,
    ILabItemAddLocalData {}

//remote firestore lib data
export interface ILabItemAddRequestData {
  id: string;
  userID: string;
}

//local firestore lib data
export interface ILabItemAddLocalData {
  title: string;
  description: string;
  isPublic: boolean;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  files: FirebaseStorageTypes.TaskSnapshot[];
}
