import React from 'react';
import { View, Text, TextInput, iconStyle, StyleSheet, Image } from 'react-native';

export function InputWithIcon({
  source,
  title,
  titleStyle,
  contentContainerStyle,
  inputStyle,
  iconStyle,
  ...other
}) {

  return (
    <View>

      {title && <Text style={[styles.titleText, titleStyle]}>{title}</Text>}

      <View style={[styles.inputContainer, contentContainerStyle]}>

        {source && <Image style={[styles.sideIcon, iconStyle]} source={source} />}

        <TextInput style={[styles.input, inputStyle]} {...other} />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 14,
    flex: 1,
  },
  sideIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 10,
    tintColor: '#000'
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 35,
    borderColor: 'white',
    height: 65,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  titleText: {
    fontSize: 15,
    marginBottom: 10,
    marginLeft: 20,
  },
});
