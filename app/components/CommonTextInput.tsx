import React from 'react';
import {Text, TextInput, View} from 'react-native';

interface ICommonTextInput {
  label: string;
  onChangeText: (t: string) => void;
  value: string;
}

export const CommonTextInput = ({
  label,
  onChangeText,
  value,
}: ICommonTextInput) => {
  return (
    <View style={{marginHorizontal: 20}}>
      <Text style={{fontWeight: 'bold'}}>{label}</Text>
      <TextInput
        style={{
          borderColor: 'red',
          borderWidth: 1,
          borderRadius: 20,
        }}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
};
