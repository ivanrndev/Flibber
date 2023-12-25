import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

// USER TYPES
export interface IUser {
  id: string;
  username: string;
  password: string;
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
}
