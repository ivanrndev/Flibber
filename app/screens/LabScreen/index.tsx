import React, {memo, useCallback, useMemo, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {Formik} from 'formik';
import {Input} from '../../components/Form';
import * as Yup from 'yup';
import CheckBox from '@react-native-community/checkbox';
import {useFirestoreServiceContext} from '../../hooks/useFirestoreService';
import {RouteProp, useRoute} from '@react-navigation/native';
import {ILabItem} from '../../hooks/types';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import FilesSection from './components/FilesSection';
import {FirebaseStorageTypes} from '@react-native-firebase/storage';

interface ValuesType {
  title: string;
  description: string;
}

export const LabsScreen = () => {
  const {fetchAddLab, fetchDeleteLab} = useFirestoreServiceContext();
  const route: RouteProp<{item: {item: ILabItem}} | never> = useRoute();

  const labInitData: ILabItem | null = route?.params?.item || null;
  const [filesArray, setFilesArray] = useState<
    FirebaseStorageTypes.TaskSnapshot[] | []
  >(labInitData?.files || []);
  const initialValues: ValuesType = {
    title: labInitData?.title,
    description: labInitData?.description,
  };
  const pageTitle = useMemo(
    () => (labInitData?.title ? 'Edit Lab' : 'Add Lab'),
    [labInitData?.title],
  );

  const [checkboxValue, setCheckboxValue] = useState(!!labInitData?.isPublic);

  const AddLabSchema = Yup.object().shape({
    title: Yup.string().min(5, 'Too Short!').required('Required'),
    description: Yup.string().min(5, 'Too Short!').required('Required'),
  });

  const handleOnSubmit = useCallback(
    (data: ValuesType) => {
      if (labInitData?.title) {
        Alert.alert('will be soon');
      } else {
        // const currentFilesArray = cbGetFilesList()
        fetchAddLab({
          createdAt:
            firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
          title: data.title,
          isPublic: checkboxValue,
          description: data.description,
          files: filesArray,
        });
      }
    },
    [checkboxValue, fetchAddLab, labInitData?.title, filesArray],
  );

  const handleDeleteAddLab = () => {
    fetchDeleteLab(labInitData?.id);
    // uploadFirestoreCloudFile();
  };
  console.log('files123123 arrrraaay');

  return (
    <>
      <Text
        style={{
          padding: 20,
          textAlign: 'center',
          fontWeight: '900',
        }}>
        {pageTitle}
      </Text>
      <View style={{flex: 1}}>
        <Formik
          initialValues={initialValues}
          validationSchema={AddLabSchema}
          onSubmit={handleOnSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <View style={{flex: 1, padding: 20}}>
                <Input
                  editable={!labInitData?.title}
                  placeholder="title"
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  value={values.title}
                  style={{borderWidth: 1, borderColor: 'purple'}}
                  error={errors.title && touched.title ? errors.title : ''}
                />
                {initialValues.description ? (
                  <Text
                    style={{
                      borderWidth: 1,
                      borderColor: 'purple',
                      borderRadius: 20,
                      padding: 5,
                    }}>
                    {values.description}
                  </Text>
                ) : (
                  <Input
                    multiline
                    editable={!labInitData?.title}
                    placeholder="description"
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                    style={{
                      borderWidth: 1,
                      borderColor: 'purple',
                      maxHeight: 300,
                      minHeight: 100,
                    }}
                    error={
                      errors.description && touched.description
                        ? errors.description
                        : ''
                    }
                  />
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 50,
                  }}>
                  <Text>is public?: </Text>
                  <CheckBox
                    disabled={!!labInitData?.title}
                    value={checkboxValue}
                    onValueChange={setCheckboxValue}
                  />
                </View>
              </View>
              <FilesSection
                isCreateMode={!!labInitData?.title}
                filesArray={filesArray}
                setFilesArray={setFilesArray}
              />
              {labInitData?.title ? (
                <TouchableOpacity
                  onPress={handleDeleteAddLab}
                  style={{
                    backgroundColor: 'purple',
                    marginHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 20,
                  }}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    Delete Lab
                  </Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: 'purple',
                  marginHorizontal: 20,
                  marginVertical: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                }}>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  {pageTitle}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </>
  );
};
