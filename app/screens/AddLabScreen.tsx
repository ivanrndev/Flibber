import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Formik} from 'formik';
import {Input} from '../components/Form';
import * as Yup from 'yup';
import CheckBox from '@react-native-community/checkbox';

interface ValuesType {
  title: string;
  description: string;
}

export const AddLabScreen = () => {
  const [checkboxValue, setCheckboxValue] = useState(false);

  const initialValues: ValuesType = {title: '', description: ''};

  const AddLabSchema = Yup.object().shape({
    title: Yup.string().min(5, 'Too Short!').required('Required'),
    description: Yup.string().min(5, 'Too Short!').required('Required'),
  });

  const handleAddLab = () => {
    console.log('handleAddLabhandleAddLab');
  };

  return (
    <>
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
            <View style={{flex: 1}}>
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
                secureTextEntry
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
              <Text style={{color: 'white', textAlign: 'center'}}>Add Lab</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </>
  );
};
