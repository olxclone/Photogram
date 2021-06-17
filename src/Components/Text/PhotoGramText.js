import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export function PhotogramText({
  text,
  fontSize,
  fontWeight,
  color,
  extraStyles,
  onPress,
  numberOfLines,
  fontFamily,
  fontStyle,
  alignSelf
}) {
  const styles = StyleSheet.create({
    Text: {
      fontSize: fontSize,
      alignSelf,
      fontWeight: fontWeight === 'h1' ? '700' : 'normal',
      color: color || '#000',
      ...extraStyles,
      fontStyle: fontStyle || 'normal',
      fontFamily: fontFamily || 'Roboto-Regular',
    },
  });

  return (
    <View>
      <Text onPress={onPress} numberOfLines={numberOfLines} style={styles.Text}>
        {text}
      </Text>
    </View>
  );
}
