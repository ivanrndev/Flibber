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

/**
 * Interface representing the response of using labs.
 * @interface
 */
interface IUseLabsResponse {
  labsList: ILabItem[];
  publicLabsList: ILabItem[];
  fetchLabs: () => Promise<void>;
  fetchAddLab: (newLabData: ILabItemAddLocalData) => Promise<void>;
  fetchDeleteLab: (labDocId: string) => Promise<void>;
  uploadFirestoreCloudFile: () => Promise<
    FirebaseStorageTypes.TaskSnapshot | undefined
  >;
  uploadFirestoreCloudPhoto: () => Promise<
    FirebaseStorageTypes.TaskSnapshot | undefined
  >;
  fetchPublicLabs: () => Promise<void>;
}

/**
 * Fetches the user's labs and provides methods for adding and deleting labs.
 *
 * @param {string | undefined} userId - The ID of the user.
 * @returns {IUseLabsResponse} - An object containing the labs list and methods for fetching, adding, and deleting labs.
 */
export const useLabs = (userId: string | undefined): IUseLabsResponse => {
  const [labsList, setLabs] = useState<ILabItem[]>([]);
  const labsCollection = firestore().collection('labs');
  const [publicLabsList, setPublicLabs] = useState<ILabItem[]>([]);

  /**
   * Executes a callback function if a user exists.
   *
   * @param {Function} callback - The function to be executed if a user exists.
   * @param {Array} dependencies - The dependencies to be passed to the useCallback hook.
   * @returns {Function} - The memoized callback function.
   */
  const useCallbackIfUserExists = (
    callback: (...args: any[]) => Promise<void>,
    dependencies: any[],
  ) => {
    return useCallback(async (...args: any[]) => {
      if (!userId) {
        console.log('No user for performing the operation');
        return;
      }

      try {
        await callback(...args);
      } catch (error) {
        console.error('Error:', error);
      }
    }, dependencies);
  };

  const fetchPublicLabs = useCallback(async () => {
    try {
      const publicLabsSnapshot = await labsCollection
        .where('isPublic', '==', true)
        .where('userID', '!=', userId)
        .get();
      const fetchedPublicLabs: ILabItem[] = publicLabsSnapshot.docs.map(
        doc => ({
          ...(doc.data() as ILabItem),
          id: doc.id,
        }),
      );

      console.log('here123', fetchedPublicLabs)
      setPublicLabs(fetchedPublicLabs);
    } catch (error) {
      console.error('Error fetching public labs:', error);
    }
  }, [userId]);

  const fetchLabs = useCallbackIfUserExists(async () => {
    const labsSnapshot = await labsCollection
      .where('userID', '==', userId)
      .get();
    const fetchedLabs: ILabItem[] = labsSnapshot.docs.map(doc => ({
      ...(doc.data() as ILabItem),
      id: doc.id,
    }));
    setLabs(fetchedLabs);
  }, [userId]);

  const fetchAddLab = useCallbackIfUserExists(
    async (newLabData: ILabItemAddLocalData) => {
      const res = await labsCollection.add({...newLabData, userID: userId});
      setLabs(prevState => [
        {id: res.id, ...newLabData, userID: userId},
        ...prevState,
      ]);
      Alert.alert('Lab added successfully');
      navigateWithRef()?.goBack();
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

  /**
   * Uploads a file to Firestore Cloud Storage.
   *
   * @returns {Promise<FirebaseStorageTypes.TaskSnapshot | undefined>} - The task snapshot if successful, or undefined if there was an error.
   */
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

  /**
   * Uploads a photo to Firestore Cloud Storage.
   *
   * @returns {Promise<FirebaseStorageTypes.TaskSnapshot | undefined>} - A Promise that resolves to the uploaded photo's TaskSnapshot, or undefined if the upload fails.
   */
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
    fetchPublicLabs,
    publicLabsList,
    uploadFirestoreCloudFile,
    uploadFirestoreCloudPhoto,
  };
};
