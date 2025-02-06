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

const buttons = [
  [faDeleteLeft, '√/π', faPercentage, faDivide],
  ['7', '8', '9', faMultiply],
  ['4', '5', '6', faMinus],
  ['1', '2', '3', faPlus],
  [faArrowsRotate, '0', '.', faEquals],
];

export const buttonsExpand = [
  ['sin', 'cos', 'tan', 'rad', 'deg'],
  ['log', 'In', '(', ')', 'inv'],
  ['!', faDeleteLeft, '+/-', faPercentage, faDivide],
  ['^', '7', '8', '9', faMultiply],
  ['√', '4', '5', '6', faMinus],
  ['π', '1', '2', '3', faPlus],
  ['e', faArrowsRotate, '0', '.', faEquals],
];

export default buttons;
