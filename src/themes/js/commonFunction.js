import { Dimensions } from 'react-native';

// getting key by value of object or array
export function getKeyByValue(array, value) {
  for (let prop in array) {
    if (array.hasOwnProperty(prop)) {
      if (array[prop] === value) { return prop; }
    }
  }
  return null;
}

// set screen height 
export function screenHeight(percentageHeight, offset) {
  return (Dimensions.get('window').height * (percentageHeight / 100)) - offset;
}

// set screen width
export function screenWidth(percentageWidth, offset) {
  return (Dimensions.get('window').width * (percentageWidth / 100)) - offset;
}

// for different color
export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// check if value or object or array is JSON or not
export function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
