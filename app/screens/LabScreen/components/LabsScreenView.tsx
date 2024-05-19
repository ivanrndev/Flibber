import {Text, View} from 'react-native';
import {Formik, FormikHelpers} from 'formik';
import {Input} from '../../../components/Form';
import CheckBox from '@react-native-community/checkbox';

import FilesSection from './FilesSection';
import React from 'react';
import {FirebaseStorageTypes} from '@react-native-firebase/storage';
import * as Yup from 'yup';

interface ILabItemAddLocalData {
  title: string;
  description: string;
}

interface ILabsScreenViewProps {
  initialValues: ILabItemAddLocalData;
  validationSchema: Yup.AnyObjectSchema;
  handleFormSubmit: (
    values: ILabItemAddLocalData,
    formikHelpers: FormikHelpers<ILabItemAddLocalData>,
  ) => void;
  title: string;
  uploadedFiles: FirebaseStorageTypes.TaskSnapshot[] | [];
  setUploadedFiles: React.Dispatch<
    React.SetStateAction<FirebaseStorageTypes.TaskSnapshot[] | []>
  >;
  isEditMode: boolean;
  isPublic: boolean;
  setIsPublic: React.Dispatch<React.SetStateAction<boolean>>;
  handleLabDelete: () => void;
  allowToDelete: boolean;
}

import {StyleSheet} from 'react-native';
import {Button} from '../../../components/Button/Button';
import {useTheme} from '../../../theme/useTheme';

export const LabsScreenView = ({
  initialValues,
  validationSchema,
  handleFormSubmit,
  title,
  uploadedFiles,
  setUploadedFiles,
  isEditMode,
  isPublic,
  setIsPublic,
  handleLabDelete,
  allowToDelete,
}: ILabsScreenViewProps) => {
  const {theme} = useTheme();
  return (
    <View style={{flex: 1, backgroundColor: theme.layoutBg}}>
      <Text style={[styles.paddingText, {color: theme.primary}]}>{title}</Text>
      <View style={styles.flexContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <View style={styles.paddingContainer}>
                <Input
                  editable={!isEditMode}
                  testID="Title"
                  placeholder="Title"
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  value={values.title}
                  keyboardType="email-address"
                  error={errors.title && touched.title ? errors.title : ''}
                />
                <Input
                  editable={!isEditMode}
                  testID="Description"
                  placeholder="Description"
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                  error={
                    errors.description && touched.description
                      ? errors.description
                      : ''
                  }
                />
                <View style={[styles.flexDirectionRow]}>
                  <Text style={{color: theme.color}}>is public?: </Text>
                  <CheckBox
                    tintColors={{true: theme.primary, false: theme.primary}}
                    disabled={isEditMode}
                    value={isPublic}
                    onValueChange={setIsPublic}
                  />
                </View>
              </View>
              <FilesSection
                isCreateMode={isEditMode}
                filesArray={uploadedFiles}
                setFilesArray={setUploadedFiles}
              />
              {isEditMode && allowToDelete && (
                <Button onPress={handleLabDelete} text="Delete Lab" />
              )}
              <Button onPress={handleSubmit} text={title} />
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paddingText: {
    padding: 20,
    textAlign: 'center',
    fontWeight: '900',
  },
  flexContainer: {
    flex: 1,
  },
  paddingContainer: {
    flex: 1,
    padding: 20,
  },
  purpleBorder: {
    borderWidth: 1,
    borderColor: 'purple',
  },
  multilineInput: {
    borderWidth: 1,
    borderColor: 'purple',
    maxHeight: 300,
    minHeight: 100,
  },
  flexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
  },
  whiteCenterText: {
    color: 'white',
    textAlign: 'center',
  },
});
