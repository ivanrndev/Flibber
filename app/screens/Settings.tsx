import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import {useTheme} from '../theme/useTheme';
import Layout from '../components/Layout';
import Card from '../components/Card';
import MenuItem from '../components/MenuItem';
import {useFirestoreServiceContext} from '../hooks/useFirestoreService';
import {ROOT_ROUTES, useTypedNavigation} from '../routes/constants';

const avatar = require('../assets/images/avatar.png');

const Settings = () => {
  const {theme} = useTheme();
  const {logOut, uploadFirestoreCloudPhoto, user} =
    useFirestoreServiceContext();
  console.log('here user', user);
  const nav = useTypedNavigation();

  const handleLogout = () => {
    logOut();
    nav.navigate(ROOT_ROUTES.SIGN_IN);
  };

  return (
    <Layout>
      <ScrollView
        style={[styles.contentContainer, {backgroundColor: theme.layoutBg}]}>
        <Card style={{backgroundColor: theme.cardBg}}>
          <View style={styles.avatarRow}>
            <TouchableOpacity onPress={uploadFirestoreCloudPhoto}>
              <Image
                source={
                  user?.profileImageURL ? {uri: user.profileImageURL} : avatar
                }
                style={styles.avatar}
              />
            </TouchableOpacity>
            <Text style={{color: theme.color}}>{user?.username}</Text>
          </View>
          <>
            {/* <MenuItem
              label="Dark Mode"
              onPress={() => console.log('here')}
              rightItem={
                <Switch
                  value={theme.name === 'dark'}
                  onValueChange={value => toggleTheme(value)}
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={theme.name === 'dark' ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                />
              }
            /> */}
            <MenuItem label="Logout" onPress={handleLogout} />
          </>
        </Card>
      </ScrollView>
    </Layout>
  );
};

export default Settings;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 12,
  },
  header: {
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  btnHamburger: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    marginRight: 10,
  },
});
