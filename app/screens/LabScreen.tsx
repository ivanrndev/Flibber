import React, {useCallback, useMemo, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Formik} from 'formik';
import {Input} from '../components/Form';
import * as Yup from 'yup';
import CheckBox from '@react-native-community/checkbox';
import {useFirestoreServiceContext} from '../hooks/useFirestoreService';
import {RouteProp, useRoute} from '@react-navigation/native';
import {ILabItem} from '../hooks/types';

interface ValuesType {
  title: string;
  description: string;
}

export const LabScreen = () => {
  const {fetchAddLab} = useFirestoreServiceContext();
  const route: RouteProp<{item: {item: ILabItem}} | never> = useRoute();

  const labInitData: ILabItem | null = route?.params?.item || null;
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

  const handleAddLab = useCallback(
    (data: ValuesType) => {
      fetchAddLab({
        title: data.title,
        isPublic: checkboxValue,
        description: data.description,
      });
    },
    [checkboxValue, fetchAddLab],
  );
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
          onSubmit={handleAddLab}>
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
                  placeholder="title"
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  value={values.title}
                  style={{borderWidth: 1, borderColor: 'purple'}}
                  error={errors.title && touched.title ? errors.title : ''}
                />
                <Input
                  placeholder="description"
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                  style={{borderWidth: 1, borderColor: 'purple'}}
                  error={
                    errors.description && touched.description
                      ? errors.description
                      : ''
                  }
                />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text>is public?: </Text>
                  <CheckBox
                    value={checkboxValue}
                    onValueChange={setCheckboxValue}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: 'purple',
                  marginHorizontal: 20,
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
