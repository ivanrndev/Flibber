import React, {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import * as Yup from 'yup';
import {useFirestoreServiceContext} from '../../hooks/useFirestoreService';
import {RouteProp, useRoute} from '@react-navigation/native';
import {ILabItem} from '../../hooks/types';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {FirebaseStorageTypes} from '@react-native-firebase/storage';
import {LabsScreenView} from './components/LabsScreenView';

interface LabDetails {
  title: string;
  description: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().min(5, 'Too Short!').required('Required'),
  description: Yup.string().min(5, 'Too Short!').required('Required'),
});

const getTitle = (selectedLab: ILabItem | null): string =>
  selectedLab?.title ? 'View Lab' : 'Add Lab';

export const LabsScreen: React.FC = () => {
  const {fetchAddLab, fetchDeleteLab, user} = useFirestoreServiceContext();
  const route: RouteProp<{item: {item: ILabItem}} | never> = useRoute();
  const selectedLab: ILabItem | null = route?.params?.item || null;
  console.log('heremyuser', user, selectedLab?.userID)
  const [uploadedFiles, setUploadedFiles] = useState<
    FirebaseStorageTypes.TaskSnapshot[]
  >(selectedLab?.files || []);
  const [isPublic, setIsPublic] = useState<boolean>(!!selectedLab?.isPublic);

  const initialValues: LabDetails = {
    title: selectedLab?.title || '',
    description: selectedLab?.description || '',
  };

  const title: string = getTitle(selectedLab);

  const handleFormSubmit = useCallback(
    (formValues: LabDetails) => {
      const labData = {
        createdAt:
          firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        title: formValues.title,
        isPublic,
        description: formValues.description,
        files: uploadedFiles,
      };

      if (selectedLab?.title) {
        Alert.alert('Feature Coming Soon');
      } else {
        fetchAddLab(labData);
      }
    },
    [isPublic, fetchAddLab, selectedLab?.title, uploadedFiles],
  );

  const handleLabDelete = useCallback(() => {
    if (selectedLab?.id) {
      fetchDeleteLab(selectedLab.id);
    }
  }, [fetchDeleteLab, selectedLab?.id]);

  return (
    <LabsScreenView
      initialValues={initialValues}
      allowToDelete={user?.id === selectedLab?.userID}
      isEditMode={!!selectedLab?.title}
      validationSchema={validationSchema}
      handleFormSubmit={handleFormSubmit}
      handleLabDelete={handleLabDelete}
      title={title}
      uploadedFiles={uploadedFiles}
      setUploadedFiles={setUploadedFiles}
      isPublic={isPublic}
      setIsPublic={setIsPublic}
    />
  );
};
