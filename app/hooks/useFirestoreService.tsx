import React, {ReactNode} from 'react';
import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import {Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigateWithRef} from '../routes/RootNavigation';
import {ILabItem, ILabItemAddLocalData, IUser} from './types';

const useFirestoreService = (): FirestoreServiceContextProps => {
  const [user, setUser] = useState<IUser | null>(null);
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
      const newUser = {id: doc.id, ...querySnapshot.docs[0].data()} as IUser;
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

  // ---- fetch labs list
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

  // ---- fetch delete lab
  const fetchDeleteLab = useCallback(
    async (labDocId: string) => {
      if (user?.id) {
        firestore()
          .collection('labs')
          .doc(labDocId)
          .delete()
          .then(() => {
            setLabs(prevState =>
              prevState.filter((item: ILabItem) => labDocId !== item.id),
            );
            Alert.alert('success fetchDeleteLab', '', [
              {
                text: 'OK',
                onPress: () => {
                  console.log(navigateWithRef()?.goBack());
                },
              },
            ]);
          })
          .catch(e => {
            console.log('fetchDeleteLab: firestore catch', e);
          });
      } else {
        console.log('fetchDeleteLab: no user for now');
      }
    },
    [user?.id],
  );

  // ---- fetch add lab
  const fetchAddLab = useCallback(
    (newLabData: ILabItemAddLocalData) => {
      if (user?.id) {
        firestore()
          .collection('labs')
          .add({
            ...newLabData,
            userID: user.id,
          } as Omit<ILabItem, 'id'>)
          .then(res => {
            setLabs(prevState =>
              [
                {
                  ...newLabData,
                  userID: user.id,
                  // @ts-ignore
                  id: res._documentPath._parts[1] as string,
                } as ILabItem,
              ].concat(prevState),
            );
            Alert.alert('success fetchAddLab', '', [
              {
                text: 'OK',
                onPress: () => {
                  console.log(navigateWithRef()?.goBack());
                },
              },
            ]);
          })
          .catch(e => console.error('fetchAddLab catch', e));
      } else {
        console.log('no user for now');
      }
    },
    [user?.id],
  );

  // ---- init fetch
  useEffect(() => {
    if (user?.id) {
      fetchLabs();
    }
  }, [user?.id, fetchLabs]);

  return {
    user,
    labsList,
    loginUser,
    setUser,
    logOut,
    fetchLabs,
    fetchAddLab,
    fetchDeleteLab,
  };
};
interface FirestoreServiceContextProps {
  user: IUser | null;
  labsList: ILabItem[];
  loginUser: (username: string, password: string) => Promise<boolean | Error>;
  setUser: (user: IUser) => void;
  logOut: () => Promise<void>;
  fetchLabs: () => void;
  fetchAddLab: (newLabData: ILabItemAddLocalData) => void;
  fetchDeleteLab: (labDoc: string) => void;
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
