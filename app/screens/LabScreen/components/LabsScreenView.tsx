import {Text, TouchableOpacity, View} from 'react-native';
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
}: ILabsScreenViewProps) => (
  <>
    <Text style={styles.paddingText}>{title}</Text>
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
                placeholder="title"
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                style={styles.purpleBorder}
                error={errors.title && touched.title ? errors.title : ''}
              />
              <Input
                multiline
                editable={!isEditMode}
                placeholder="description"
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                style={styles.multilineInput}
                error={
                  errors.description && touched.description
                    ? errors.description
                    : ''
                }
              />
              <View style={styles.flexDirectionRow}>
                <Text>is public?: </Text>
                <CheckBox
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
              <TouchableOpacity
                onPress={handleLabDelete}
                style={styles.purpleButton}>
                <Text style={styles.whiteCenterText}>Delete Lab</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.purpleButton}>
              <Text style={styles.whiteCenterText}>{title}</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  </>
);

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
  purpleButton: {
    backgroundColor: 'purple',
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  whiteCenterText: {
    color: 'white',
    textAlign: 'center',
  },
});
