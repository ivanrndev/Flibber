import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {IUser} from './types';

interface IUseAuthResponse {
  user: IUser | null;
  loginUser: (username: string, password: string) => Promise<boolean | null>;
  setUser: (user: IUser) => void;
  logOut: () => Promise<void>;
}

export const useAuth = (): IUseAuthResponse => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (user?.id) {
      const subscriber = firestore()
        .collection('users')
        .doc(user?.id)
        .onSnapshot(documentSnapshot => {
          setUser({id: user.id, ...documentSnapshot.data()} as IUser);
        });
      return () => subscriber();
    }
  }, [user?.id]);

  const loginUser = async (
    username: string,
    password: string,
  ): Promise<boolean | null> => {
    const querySnapshot = await firestore()
      .collection('users')
      .where('username', '==', username)
      .where('password', '==', password)
      .get();
    const doc = querySnapshot.docs[0];

    if (doc) {
      const newUser = {id: doc.id, ...querySnapshot.docs[0].data()} as IUser;
      AsyncStorage.setItem('user', JSON.stringify(newUser))
        .then(() => setUser(newUser))
        .catch(() => {});
      return true;
    } else {
      return null;
    }
  };

  const logOut = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    //TODO:fix
    // setLabs([]);
  };

  return {user, loginUser, logOut, setUser};
};
