import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faDeleteLeft,
  faPercentage,
  faPlus,
  faMinus,
  faDivide,
  faMultiply,
  faEquals,
  faArrowsRotate,
  faCircleHalfStroke,
} from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const btns = [
    {
      btn1: (
        <FontAwesomeIcon icon={faDeleteLeft} size={24} style={styles.icon} />
      ),
      btn2: <Text style={styles.btnText}>AC</Text>,
      btn3: (
        <FontAwesomeIcon icon={faPercentage} size={24} style={styles.icon} />
      ),
      btn4: <FontAwesomeIcon icon={faDivide} size={24} style={styles.icon} />,
    },
    {
      btn1: <Text style={styles.btnText}>7</Text>,
      btn2: <Text style={styles.btnText}>8</Text>,
      btn3: <Text style={styles.btnText}>9</Text>,
      btn4: <FontAwesomeIcon icon={faMultiply} size={24} style={styles.icon} />,
    },
    {
      btn1: <Text style={styles.btnText}>4</Text>,
      btn2: <Text style={styles.btnText}>5</Text>,
      btn3: <Text style={styles.btnText}>6</Text>,
      btn4: <FontAwesomeIcon icon={faMinus} size={24} style={styles.icon} />,
    },
    {
      btn1: <Text style={styles.btnText}>1</Text>,
      btn2: <Text style={styles.btnText}>2</Text>,
      btn3: <Text style={styles.btnText}>3</Text>,
      btn4: <FontAwesomeIcon icon={faPlus} size={24} style={styles.icon} />,
    },
    {
      btn1: (
        <FontAwesomeIcon icon={faArrowsRotate} size={24} style={styles.icon} />
      ),
      btn2: <Text style={styles.btnText}>0</Text>,
      btn3: <Text style={styles.btnText}>.</Text>,
      btn4: <FontAwesomeIcon icon={faEquals} size={24} style={styles.icon} />,
    },
  ];

  const HandleCalculations = () => {
    const noSpacesStr = value.replace(/\s+/g, '');
    if (['+', '-', '*', '/', '%'].includes(noSpacesStr.at(-1) ?? '')) {
      // console.log('trim: ', noSpacesStr.slice(0, -1));
      return;
    }
    const calculate = eval(value);
    console.log('calculate: ', calculate);
    setResult(calculate);
  };

  const HandleOnPress = (btn: any) => {
    if (typeof btn.props?.children === 'string') {
      if (btn.props.children === 'AC') {
        setValue('');
        setResult('');
      } else {
        setValue(prev => prev + btn.props.children);
      }
      HandleCalculations();
    } else if (btn.type === FontAwesomeIcon) {
      if (
        ['plus', 'minus', 'xmark', 'divide', 'percent'].includes(
          btn.props.icon.iconName,
        )
      ) {
        switch (btn.props.icon.iconName) {
          case 'plus':
            setValue(prev => prev + '+');
            break;

          case 'minus':
            setValue(prev => prev + '-');
            break;

          case 'xmark':
            setValue(prev => prev + '*');
            break;

          case 'divide':
            setValue(prev => prev + '/');
            break;

          case 'percent':
            setValue(prev => prev + '%');
            break;
        }
      } else if (btn.props.icon === faArrowsRotate) {
        setValue('');
        setResult('');
      } else if (btn.props.icon === faDeleteLeft) {
        setValue(value.slice(0, -1));
        HandleCalculations();
      } else if (btn.props.icon === faEquals) {
        HandleCalculations();
      }
    }
  };

  useEffect(() => {
    if (value.length !== 0) {
      HandleCalculations();
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#212b36'} />
      <View style={styles.inputContainer}>
        <View style={styles.theme}>
          <Pressable>
            <View style={styles.themeBtn}>
              <FontAwesomeIcon
                icon={faCircleHalfStroke}
                size={30}
                color="#CCCCCC"
              />
            </View>
          </Pressable>
        </View>
        <View style={styles.inputBox}>
          <TextInput
            value={value}
            // keyboardType="numeric"
            style={styles.inputField}
            onChangeText={text => setValue(text)}
          />
          <Text style={styles.inputText}>{result}</Text>
        </View>
      </View>
      <View style={styles.btnContainer}>
        {btns.map((item, index) => (
          <View key={index} style={styles.rowBox}>
            <Pressable onPress={() => HandleOnPress(item.btn1)}>
              <View style={styles.btn}>{item.btn1}</View>
            </Pressable>
            <Pressable onPress={() => HandleOnPress(item.btn2)}>
              <View style={styles.btn}>{item.btn2}</View>
            </Pressable>
            <Pressable onPress={() => HandleOnPress(item.btn3)}>
              <View style={styles.btn}>{item.btn3}</View>
            </Pressable>
            <Pressable onPress={() => HandleOnPress(item.btn4)}>
              <View style={styles.btn}>{item.btn4}</View>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#212b36',
  },
  theme: {
    // backgroundColor: 'red',
  },
  themeBtn: {
    marginHorizontal: 'auto',
    backgroundColor: '#2a3542',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
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
  inputText: {
    fontSize: 30,
    textAlign: 'right',
    color: '#CCCCCC',
  },
  inputField: {
    fontSize: 36,
    fontWeight: '400',
    marginVertical: 10,
    textAlign: 'right',
    color: '#FFFFFF',
  },
  btnContainer: {
    // flex: 1,
    width: '100%',
    backgroundColor: '#2a3542',
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
    backgroundColor: '#2d3845',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    borderRadius: 10,
  },
  icon: {
    color: 'white',
  },
  btnText: {
    fontSize: 24,
    color: 'white',
  },
});

export default App;