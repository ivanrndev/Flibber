import React, {ReactNode} from 'react';
import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  username: string;
  password: string;
}

export interface ILabItem {
  id: string;
  title: string;
}

const useFirestoreService = (): FirestoreServiceContextProps => {
  const [user, setUser] = useState<User | null>(null);
  const [labsList, setLabs] = useState<ILabItem[]>([]);

  const loginUser = async (
    username: string,
    password: string,
  ): Promise<boolean | Error> => {
    const querySnapshot = await firestore()
      .collection('users')
      .where('username', '==', username)
      .where('password', '==', password)
      .get();
    const doc = querySnapshot.docs[0];
    if (doc) {
      const newUser = {id: doc.id, ...querySnapshot.docs[0].data()} as User;
      AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } else {
      return Error('no user');
    }
  };

  const logOut = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    setLabs([]);
  };

  const fetchLabs = useCallback(async () => {
    if (user?.id) {
      const labsSnapshot = await firestore()
        .collection('labs')
        .where('userID', '==', user.id)
        .get();

      const fetchedLabs = labsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ILabItem[];
      console.log('do fetch labsList');

      setLabs(fetchedLabs);
    } else {
      console.log('no user for now');
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchLabs();
    }
  }, [user?.id, fetchLabs]);

  return {user, labsList, loginUser, setUser, logOut, fetchLabs};
};
interface FirestoreServiceContextProps {
  user: User | null;
  labsList: ILabItem[];
  loginUser: (username: string, password: string) => Promise<boolean | Error>;
  setUser: (user: User) => void;
  logOut: () => Promise<void>;
  fetchLabs: () => void;
}

const FirestoreServiceContext = createContext<
  FirestoreServiceContextProps | undefined
>(undefined);

export const FirestoreServiceProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const service = useFirestoreService();

  return (
    <FirestoreServiceContext.Provider value={service}>
      {children}
    </FirestoreServiceContext.Provider>
  );
};

export const useFirestoreServiceContext = () => {
  const context = useContext(FirestoreServiceContext);
  if (!context) {
    throw new Error(
      'useFirestoreServiceContext must be used within a FirestoreServiceProvider',
    );
  }
  return context;
};
