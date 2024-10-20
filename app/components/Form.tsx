import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {useTheme} from '../theme/useTheme';
import {spacing, typeSizes} from '../theme/theme';
import {InputPropsType} from '../types/components';

const Input = ({style, error, ...rest}: InputPropsType) => {
  const {theme} = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputWrp}>
      <TextInput
        {...rest}
        placeholderTextColor={theme.textPlaceholderColor}
        style={[
          styles.input,
          {
            color: theme.textColor,
            borderColor: isFocused ? theme.secondPurple : theme.purple,
          },
          style,
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error ? (
        <Text style={[styles.error, {color: theme.error}]}>{error}</Text>
      ) : null}
    </View>
  );
};

export {Input};

const styles = StyleSheet.create({
  inputWrp: {
    marginBottom: spacing.cardMarginB,
  },
  input: {
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderRadius: spacing.borderRadius,
  },
  error: {
    fontSize: typeSizes.FONT_SIZE_SMALL,
  },
});
