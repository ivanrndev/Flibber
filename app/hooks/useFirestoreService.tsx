import React, {ReactNode} from 'react';
import {useEffect, createContext, useContext} from 'react';

import {ILabItem, ILabItemAddLocalData, IUser} from './types';
import {useAuth} from './useAuth';
import {useLabs} from './useLabs';
import {FirebaseStorageTypes} from '@react-native-firebase/storage';

interface FirestoreServiceContextProps {
  user: IUser | null;
  labsList: ILabItem[];
  loginUser: (username: string, password: string) => Promise<boolean | null>;
  setUser: (user: IUser) => void;
  logOut: () => Promise<void>;
  fetchLabs: () => void;
  fetchAddLab: (newLabData: ILabItemAddLocalData) => void;
  fetchDeleteLab: (labDoc: string) => void;
  uploadFirestoreCloudFile: () => Promise<
    FirebaseStorageTypes.TaskSnapshot | undefined
  >;
  uploadFirestoreCloudPhoto: () => Promise<
    FirebaseStorageTypes.TaskSnapshot | undefined
  >;
}

const FirestoreServiceContext = createContext<
  FirestoreServiceContextProps | undefined
>(undefined);

export const FirestoreServiceProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const {user, loginUser, logOut, setUser} = useAuth();
  const {
    labsList,
    fetchLabs,
    fetchAddLab,
    fetchDeleteLab,
    uploadFirestoreCloudFile,
    uploadFirestoreCloudPhoto,
  } = useLabs(user?.id);

  useEffect(() => {
    if (user?.id) {
      fetchLabs();
    }
  }, [user?.id, fetchLabs]);

  const value = {
    user,
    loginUser,
    logOut,
    setUser,
    labsList,
    fetchLabs,
    fetchAddLab,
    fetchDeleteLab,
    uploadFirestoreCloudFile,
    uploadFirestoreCloudPhoto,
  };

  return (
    <FirestoreServiceContext.Provider value={value}>
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
