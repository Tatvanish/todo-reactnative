import React, { Component } from 'react';
import { AsyncStorage, Platform } from 'react-native';
import { Map } from 'immutable';
import { get, post } from '../utils/api';
import _ from 'lodash';
import { StackActions, NavigationActions } from 'react-navigation';
import Toast from 'react-native-simple-toast';
//import { setAuthenticationToken, getAuthenticationToken } from '../utils/authentication';
const colorsArray = [
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
/*Async storage keys declaration*/
const COLORLIST_KEY = 'TodoState:ColorList';
export async function setcolorListAsyncKey(colors) {
  try {
    return await AsyncStorage.setItem(COLORLIST_KEY, JSON.stringify(colors));
  } catch (error) {
    return false;
    console.log('COLORLIST_KEY error:', error.message);
  }
}

export async function clearUserAsyncKey() {
  return AsyncStorage.removeItem(COLORLIST_KEY);
}

/* set constants for API success & failure */
const SET_LOADER = 'SET_LOADER';
const GET_COLORLIST_SUCCESS = 'GET_COLORLIST_SUCCESS';
const GET_COLORLIST_FAILURE = 'GET_COLORLIST_FAILURE';
const RESET_STATE = 'RESET_STATE';
/* set cases for loader & internet connection */
export const setLoader = (value) => ({ type: SET_LOADER, payload: value });

/* set cases for colorlist success, failure */
export const colorListSuccess = (value) => ({
  type: GET_COLORLIST_SUCCESS,
  payload: value
});
export const colorListFail = (value) => ({
  type: GET_COLORLIST_FAILURE,
  payload: value
});

/* reset auth function */
export const resetTo = (props, route) => {
  return async (dispatch) => {
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: route })],
    });
    props.navigation.dispatch(resetAction);
    dispatch(setLoader(false));
  };
};

export const getColorList = (props) => {
  return async (dispatch) => {
    dispatch(setLoader(true));  
    let allColors = [];
    try {
      allColors = await AsyncStorage.getItem(COLORLIST_KEY);
      allColors = JSON.parse(allColors);
      if (allColors && !_.isEmpty(allColors) && allColors.length > 0) {
        console.log('get colors--->', allColors);
        dispatch(colorListSuccess(allColors));
      } else {
        setcolorListAsyncKey(colorsArray);
        allColors = await AsyncStorage.getItem(COLORLIST_KEY);
        allColors = JSON.parse(allColors);
        console.log('set & get colors --->', allColors);
        dispatch(colorListSuccess(allColors));
      }
      dispatch(setLoader(false));
    } catch (error) {
      console.log('getcolorlist error:', error.message);
      Toast.show('Error to fetch colorlist');
      dispatch(setLoader(false));
    }
  };
}
/* Initial state */
const initialState = Map({
  colorList: {},
  successMsg: '',
  errorMsg: '',
  loading: false
});

/* Todo Reducer for API handling */
export default function TodoReducer(state = initialState, action) {
  switch (action.type) {
    case GET_COLORLIST_SUCCESS:
      return state.set('colorList', action.payload);

    case GET_COLORLIST_FAILURE:
      return state;

    case SET_LOADER:
      return state.set('loading', action.payload);

    case RESET_STATE:
      return state;

    default:
      return state;
  }
}