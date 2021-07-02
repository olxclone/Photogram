import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

export function PhotogramTextInput({
  onChangeText,
  placeholder,
  extraStyles,
  secureTextEntry,
  placeholderTextColor,
  padding,
  numOfLines,
  onFocus,
  fontSize,
  fontFamily,
  marginHorizontal,
  color,
  onChange,
}) {
  const styles = StyleSheet.create({
    textInput: {
      backgroundColor: '#F6F6F6',
      marginHorizontal: marginHorizontal || 18,
      fontSize,
      color: color || '#000',
      padding: padding || 18,
      fontFamily: fontFamily || 'Roboto-Bold',
      ...extraStyles,
    },
  });

  return (
    <View>
      <TextInput
      numberOfLines={numOfLines}
        placeholderTextColor={placeholderTextColor}
        placeholder={placeholder}
        onFocus={onFocus}
        onChange={onChange}
        onChangeText={onChangeText}
        style={styles.textInput}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}
