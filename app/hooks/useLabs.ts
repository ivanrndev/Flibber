import 'react-native-get-random-values';
import {useState, useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage, {FirebaseStorageTypes} from '@react-native-firebase/storage';
import {ILabItem, ILabItemAddLocalData} from './types';
import {v4 as uuidv4} from 'uuid';

import {
  CloudStorageFilePath,
  CloudStorageImagePath,
  FILE_UPLOAD_TYPES,
  openFilePicker,
  SectionTypes,
} from '../utils/filePicker';
import {Alert} from 'react-native';
import {navigateWithRef} from '../routes/RootNavigation';

interface IUseLabsResponse {
  labsList: ILabItem[];
  fetchLabs: () => Promise<void>;
  fetchAddLab: (newLabData: ILabItemAddLocalData) => Promise<void>;
  fetchDeleteLab: (labDocId: string) => Promise<void>;
  uploadFirestoreCloudFile: () => Promise<
    FirebaseStorageTypes.TaskSnapshot | undefined
  >;
  uploadFirestoreCloudPhoto: () => Promise<
    FirebaseStorageTypes.TaskSnapshot | undefined
  >;
}

export const useLabs = (userId: string | undefined): IUseLabsResponse => {
  const [labsList, setLabs] = useState<ILabItem[]>([]);
  const labsCollection = firestore().collection('labs');

  const fetchLabs = useCallback(async () => {
    if (!userId) {
      console.log('No user for fetching labs');
      return;
    }

    try {
      const labsSnapshot = await labsCollection
        // .where('userID', '==', userId)
        .get();
      const fetchedLabs: ILabItem[] = labsSnapshot.docs.map(doc => ({
        ...(doc.data() as ILabItem),
        id: doc.id,
      }));
      setLabs(fetchedLabs);
    } catch (error) {
      console.error('Error fetching labs:', error);
    }
  }, [userId]);

  const fetchAddLab = useCallback(
    async (newLabData: ILabItemAddLocalData) => {
      if (!userId) {
        console.log('No user for adding a lab');
        return;
      }

      try {
        const res = await labsCollection.add({...newLabData, userID: userId});
        setLabs(prevState => [
          {id: res.id, ...newLabData, userID: userId},
          ...prevState,
        ]);
        Alert.alert('Lab added successfully');
        navigateWithRef()?.goBack();
      } catch (error) {
        console.error('Error adding lab:', error);
      }
    },
    [userId],
  );

  const fetchDeleteLab = useCallback(
    async (labDocId: string) => {
      if (!userId) {
        console.log('No user for deleting a lab');
        return;
      }

      try {
        await labsCollection.doc(labDocId).delete();
        setLabs(prevState => prevState.filter(lab => lab.id !== labDocId));
        Alert.alert('Lab deleted successfully');
        navigateWithRef()?.goBack();
      } catch (error) {
        console.error('Error deleting lab:', error);
      }
    },
    [userId],
  );

  const uploadFirestoreCloudFile = async (): Promise<
    FirebaseStorageTypes.TaskSnapshot | undefined
  > => {
    try {
      const fileData = await openFilePicker(FILE_UPLOAD_TYPES.PDF);
      if (fileData) {
        const newUUID = uuidv4();
        const storagePath: CloudStorageFilePath = `${SectionTypes.Files}/${userId}/${newUUID}/${fileData.name}`;
        const reference = storage().ref(storagePath);
        const res: FirebaseStorageTypes.TaskSnapshot = await reference.putFile(
          fileData.fileCopyUri as string,
        );
        console.warn('here res uploadFirestoreCloudFile', res);
        return res;
      }
    } catch (error) {
      console.error('Error uploading file:', error);

      return undefined;
    }
  };

  const uploadFirestoreCloudPhoto = async (): Promise<
    FirebaseStorageTypes.TaskSnapshot | undefined
  > => {
    try {
      const fileData = await openFilePicker(FILE_UPLOAD_TYPES.IMG);
      if (fileData) {
        const newUUID = uuidv4();
        const storagePath: CloudStorageImagePath = `${SectionTypes.Images}/${userId}/${newUUID}/${fileData.name}`;
        const reference = storage().ref(storagePath);
        const res = await reference.putFile(fileData.fileCopyUri as string);
        console.warn('here res uploadFirestoreCloudPhoto', res);
        return res;
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      return undefined;
    }
  };

  return {
    labsList,
    fetchLabs,
    fetchAddLab,
    fetchDeleteLab,
    uploadFirestoreCloudFile,
    uploadFirestoreCloudPhoto,
  };
};
