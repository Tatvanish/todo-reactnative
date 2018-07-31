import { AsyncStorage } from 'react-native';

const COLOR_KEY = 'TodoState:Colors';

export function getColors() {
  return AsyncStorage.getItem(COLOR_KEY);
}

export async function setColors(colors) {
  return AsyncStorage.setItem(COLOR_KEY, colors);
}

export async function clearColors() {
  return AsyncStorage.removeItem(COLOR_KEY);
}

/* export async function setUserAsyncKey(user) {
  try {
    return await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.log('setuserkey error:', error.message);
  }
} */

const colors = [
  {
    colorId: 1,
    colorCode: '#4A90E2'
  },
  {
    colorId: 2,
    colorCode: '#80D320'
  },
  {
    colorId: 3,
    colorCode: '#CF001C'
  },
  {
    colorId: 4,
    colorCode: '#BB10DF'
  },
  {
    colorId: 5,
    colorCode: '#F3A324'
  },
];