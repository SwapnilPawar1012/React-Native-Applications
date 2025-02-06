import {useState} from 'react';
import {
  faDeleteLeft,
  faPercentage,
  faPlus,
  faMinus,
  faDivide,
  faMultiply,
  faEquals,
  faArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';

export const CalculationController = () => {
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const HandleCalculations = () => {
    const noSpacesStr = value.replace(/\s+/g, '');
    if (['+', '-', '*', '/', '%'].includes(noSpacesStr.at(-1) ?? '')) {
      // console.log('trim: ', noSpacesStr.slice(0, -1));
      return;
    }
    const calculate = eval(value);
    setResult(calculate);
  };

  const HandleOnPress = (btn: {text?: string; icon?: any}) => {
    let newValue = value;
    if (btn.text) {
      // Handling Number
      if (btn.text === '√/π' || btn.text === '+/-') {
        return;
      } 
      newValue += btn.text;
    } else if (btn.icon) {
      // Handling Icon Buttons (Operators & Special Functions)
      switch (btn.icon) {
        case faPlus:
          newValue += '+';
          break;
        case faMinus:
          newValue += '-';
          break;
        case faMultiply:
          newValue += '*';
          break;
        case faDivide:
          newValue += '/';
          break;
        case faPercentage:
          newValue += '%';
          break;
        case faArrowsRotate:
          setValue('');
          setResult('');
          return;
        case faDeleteLeft:
          newValue = newValue.slice(0, -1);
          break;
        case faEquals:
          HandleCalculations();
          return;
        default:
          console.warn('Unhandled icon:', btn.icon);
          return;
      }
    } else {
      console.warn('Unhandled button type:', btn);
      return;
    }
    setValue(newValue);
  };

  return {
    value,
    result,
    setValue,
    HandleOnPress,
    HandleCalculations,
  };
};
