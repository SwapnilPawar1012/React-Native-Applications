import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCircleHalfStroke,
} from '@fortawesome/free-solid-svg-icons';
import Buttons from './Buttons';
import {useTheme} from './ThemeContext';
import {CalculationController} from './CalculationController';

const Home = () => {
  const {theme, ToggleTheme} = useTheme();
  const {value, result, setValue, HandleOnPress, HandleCalculations} =
    CalculationController();

  useEffect(() => {
    if (value.length !== 0) {
      HandleCalculations();
    }
  }, [value]);

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar backgroundColor={'#212b36'} />
      <View style={styles.inputContainer}>
        <View>
          <Pressable onPress={ToggleTheme}>
            <View
              style={[styles.themeBtn, {backgroundColor: theme.bgThemeBox}]}>
              <FontAwesomeIcon
                icon={faCircleHalfStroke}
                size={30}
                style={[{color: theme.btnText} as TextStyle]}
              />
            </View>
          </Pressable>
        </View>
        <View style={[styles.inputBox]}>
          <TextInput
            value={value}
            // keyboardType="numeric"
            style={[styles.inputField, {color: theme.text}]}
            onChangeText={text => setValue(text)}
          />
          <Text style={[styles.resultText, {color: theme.resultText}]}>
            {result}
          </Text>
        </View>
      </View>
      <Buttons HandleOnPress={HandleOnPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  themeBtn: {
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  inputContainer: {
    flex: 1,
    width: '100%',
  },
  inputBox: {
    justifyContent: 'flex-end',
    marginHorizontal: 30,
    position: 'absolute',
    bottom: 20,
    right: 0,
  },
  resultText: {
    fontSize: 30,
    textAlign: 'right',
  },
  inputField: {
    fontSize: 36,
    fontWeight: '400',
    marginVertical: 10,
    textAlign: 'right',
  },
});

export default Home;
