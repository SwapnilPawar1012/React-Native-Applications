import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useTheme} from './ThemeContext';
import {CalculationController} from './CalculationController';
import buttons, {buttonsExpand} from './ButtonsModel';

const Buttons = ({HandleOnPress}: {HandleOnPress: (btn: any) => void}) => {
  const {theme} = useTheme();
  // const {btnToggle} = CalculationController();
  const [btnToggle, setBtnToggle] = useState(buttons);
  console.log('btns: ', btnToggle);

  const HandleBtnToggle = (btn: {text?: string}) => {
    // if (btn.text === '√/π') {
    //   console.log('buttonsExpand');
    //   setBtnToggle(buttonsExpand);
    // }
    // if (btn.text === '+/-') {
    //   console.log('buttons');
    //   setBtnToggle(buttons);
    // }
  };

  return (
    <View style={[styles.btnContainer, {backgroundColor: theme.bgBtnBox}]}>
      {btnToggle.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.rowBox}>
          {row.map((btn, btnIndex) => (
            <Pressable
              key={btnIndex}
              onPress={() => {
                HandleBtnToggle(typeof btn === 'string' ? {text: btn} : {});
                HandleOnPress(
                  typeof btn === 'string' ? {text: btn} : {icon: btn},
                );
              }}>
              <View style={[styles.btn, {backgroundColor: theme.bgBtn}]}>
                {typeof btn === 'string' ? (
                  <Text style={[styles.btnText, {color: theme.btnText}]}>
                    {btn}
                  </Text>
                ) : (
                  <FontAwesomeIcon
                    icon={btn}
                    size={24}
                    style={{color: theme.btnText}}
                  />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    width: '100%',
    paddingVertical: 28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  rowBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btn: {
    width: 80,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    borderRadius: 10,
  },
  btnText: {
    fontSize: 24,
  },
});

export default Buttons;
