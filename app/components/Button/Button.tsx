import * as React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export type ButtonProps = {
  onPress: () => void;
  text: string;
  buttonStyles?: StyleSheet.NamedStyles<{}>;
};

export const Button = ({onPress, text, buttonStyles}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, buttonStyles]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: 'purple',
    borderRadius: 8,
  },
  text: {color: 'white', textAlign: 'center'},
});
