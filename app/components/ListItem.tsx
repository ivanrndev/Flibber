import * as React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';
import {useTheme} from '../theme/useTheme';
import Card from './Card';
import {ThemeContextInterface} from '../theme/useTheme';
import {ILabItem} from '../hooks/types';

interface IListItemProps {
  item: ILabItem;
  index?: number;
  onPress: () => void;
}

const ListItem = ({item, onPress}: IListItemProps): JSX.Element => {
  const {theme}: Partial<ThemeContextInterface> = useTheme();

  return (
    <Card style={styles.card}>
      <Pressable
        onPress={onPress}
        style={[styles.row]}
        accessibilityHint="Toggles task done and undone"
        accessibilityRole="radio">
        <Text
          style={[
            styles.title,
            {
              color: theme?.color,
            },
          ]}>
          {item.title}
        </Text>
      </Pressable>
    </Card>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4d505b',
  },
});
