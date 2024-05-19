import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';

import {useTheme} from '../../theme/useTheme';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import ListItem from '../../components/ListItem';
import {ROOT_ROUTES, useTypedNavigation} from '../../routes/constants';
import {useFirestoreServiceContext} from '../../hooks/useFirestoreService';
import {ILabItem} from '../../hooks/types';

export const LabsListScreen = () => {
  const {theme} = useTheme();

  const {labsList, fetchLabs} = useFirestoreServiceContext();
  // const loadingStatus = useSelector((state) => state.todos.status);
  const nav = useTypedNavigation();

  const navToAddTask = () => nav.navigate(ROOT_ROUTES.ADD_LAB);

  const renderItem = ({item, index}: {item: ILabItem; index: number}) => {
    const onPress = () => {
      nav.navigate(ROOT_ROUTES.EDIT_LAB, {item});
    };
    return <ListItem onPress={onPress} item={item} index={index} />;
  };

  const keyExtractor = (item: ILabItem) => `task-${item.id}`;

  const onRefresh = () => fetchLabs();

  const renderEmptyState = () => (
    <View>
      <Text style={{color: theme?.color}}>You don`t have labs for now</Text>
    </View>
  );

  return (
    <Layout>
      <FlatList
        ListEmptyComponent={renderEmptyState}
        data={labsList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        // refreshControl={refreshComponent}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.flatList}
      />
      <Card
        style={[styles.inputCard, {borderTopColor: theme?.cardBorderColor}]}>
        <View style={styles.inputBtnRow}>
          <TouchableOpacity onPress={navToAddTask} style={styles.inputBtnWrp}>
            <Text style={{color: theme?.color}}>ADD LAB</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </Layout>
  );
};

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  flatList: {
    paddingHorizontal: 12,
    paddingVertical: 30,
  },
  tickIcon: {
    width: 22,
    height: 22,
  },
  inputCard: {
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputBtnWrp: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#f0f0f0',
    flex: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    height: 45,
    backgroundColor: '#f6f6f6',
  },
  btnAdd: {
    borderRadius: 20,
    padding: 6,
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0071ff',
    color: '#fff',
    height: 38,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  btnAddText: {
    color: '#fff',
    fontSize: 14,
  },
  btnClear: {
    borderRadius: 2,
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  btnClearText: {
    color: '#c50e29',
    fontSize: 14,
  },
});
