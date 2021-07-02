import React from 'react';
import {Text, TouchableOpacity, StyleSheet,TextStyle,ViewStyle} from 'react-native';

export function PhotoGramButton({
  title,
  extraStyles,
  color,
  backgroundColor,
  LoggingInComponent,
  padding,
  fontSize,
  TextStyle,
  onPress,
  activeOpacity,
  fontWeight,
}) {
  const styles = StyleSheet.create({
    Button: {
      backgroundColor: backgroundColor || '#45A4FF',
      padding: padding,
      alignItems: 'center',
      fontFamily: 'Roboto-Regular',
      ...extraStyles,
    },
    ButtonText: {
      color: color || '#fff',
      ...TextStyle,
      fontSize,
      fontWeight: fontWeight === 'h1' ? '700' : 'normal',
    },
  });

  return (
    <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress} style={styles.Button}>
   {LoggingInComponent}
      <Text style={styles.ButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}
