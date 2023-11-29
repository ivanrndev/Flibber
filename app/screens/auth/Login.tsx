import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Button, Image, ScrollView, Text} from 'react-native';

import {Formik} from 'formik';
import * as Yup from 'yup';

import Layout from '../../components/Layout';
import Card from '../../components/Card';
import {Input} from '../../components/Form';
const AppIcon = require('../../assets/images//appicon.png');
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFirestoreServiceContext} from '../../hooks/useFirestoreService';
import {ROOT_ROUTES, useTypedNavigation} from '../../routes/constants';

interface ValuesType {
  username: string;
  password: string;
}

const initialValues: ValuesType = {username: '', password: ''};

const LoginSchema = Yup.object().shape({
  username: Yup.string().min(5, 'Too Short!').required('Required'),
  password: Yup.string().min(5, 'Too Short!').required('Required'),
});

const Login = () => {
  const {loginUser, setUser} = useFirestoreServiceContext();
  const [loading, setLoading] = useState(true);
  const nav = useTypedNavigation();

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(res => {
        if (res) {
          const user = JSON.parse(res);
          setUser(user);
          nav.navigate(ROOT_ROUTES.MAIN_BOTTOM_BAR);
        }
      })
      .catch(e => {
        console.log('get user error', e);
      });
    setLoading(false);
  }, [nav, setUser]);

  const handleLogin = async (values: ValuesType) => {
    try {
      const {password, username} = values;
      const res = await loginUser(username, password);
      if (res) {
        nav.navigate(ROOT_ROUTES.MAIN_BOTTOM_BAR);
      }
      console.log('resssss123', res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      {loading ? (
        <Text style={{textAlign: 'center', fontSize: 25}}>Loading</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollview}>
          <View style={styles.container}>
            <Card style={styles.formWrapper}>
              <Formik
                initialValues={initialValues}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <>
                    <View style={styles.iconWrapper}>
                      <Image source={AppIcon} style={styles.appIcon} />
                    </View>
                    <Input
                      testID="Login.Username"
                      placeholder="Username/Email"
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      value={values.username}
                      keyboardType="email-address"
                      error={
                        errors.username && touched.username
                          ? errors.username
                          : ''
                      }
                    />
                    <Input
                      testID="Login.Password"
                      placeholder="Password"
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry
                      error={
                        errors.password && touched.password
                          ? errors.password
                          : ''
                      }
                    />
                    <Button
                      title="Login"
                      onPress={handleSubmit}
                      testID="Login.Button"
                    />
                  </>
                )}
              </Formik>
            </Card>
          </View>
        </ScrollView>
      )}
    </Layout>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollview: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formWrapper: {
    width: '90%',
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appIcon: {
    width: 50,
    height: 50,
  },
});
