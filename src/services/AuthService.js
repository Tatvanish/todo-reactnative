/*
  # Service Name  : Auth.js
  # Description   : It handle's request & response of login, Logout, Change password,
                    Forgot password, Privacy & policy and Terms & condition.
*/
import React, { Component } from 'react';
import { AsyncStorage, Platform } from 'react-native';
import { Map } from 'immutable';
import { get, post } from '../utils/api';
import _ from 'lodash';
import { StackActions, NavigationActions } from 'react-navigation';
import Toast from 'react-native-simple-toast';
//import { setAuthenticationToken, getAuthenticationToken } from '../utils/authentication';

/*Async storage keys declaration*/
const USER_KEY = 'TodoState:User';
export async function setUserAsyncKey(user) {          
  let userArray = userList = [];
  try{
  userArray = await AsyncStorage.getItem(USER_KEY);
  userList = JSON.parse(userArray);
  console.log('userList', userList);
  if (userList && !_.isEmpty(userList)) {
    console.log(444);
    userList = _.orderBy(userList, 'userId', 'desc');
    userList = last(userList, 1);
    user.userId = parseInt(userList[0].userId) + 1;
    userList = userList.push(user);
    var json = await AsyncStorage.setItem(USER_KEY, JSON.stringify(userList));
    return json;
  } else {
    console.log(555);
    let users = [];
    user.userId = 1;
    users.push(user);    
    let userData = JSON.stringify(users);    
    console.log('userData---->', userData);
    var json = await AsyncStorage.setItem(USER_KEY, userData);
    return json;
  }    
  }
  catch(error){
    console.log('set user key error:',error.message);
  }
}

export async function getUserAsyncKey(userName) {      
    let response = [];
    await AsyncStorage.getItem(USER_KEY).then((users) => {
      console.log('users--->', users);
      let userData = JSON.parse(users);
      if (userData && !_.isEmpty(userData) && userData !== null) {        
        console.log('users1--->', userData);
        var index = userData.map(e => e.name).indexOf(userName);
        response = userData[index];
      }
      return response;
    }).catch((error)=>{
      console.log(error);
    });   
}

export async function clearUserAsyncKey() {
  return AsyncStorage.removeItem(USER_KEY);
}

/* set constants for API success & failure */
const SET_LOADER = 'SET_LOADER';
const SESSION_LOGIN_SUCCESS = 'SESSION_LOGIN_SUCCESS';
const SESSION_LOGIN_FAIL = 'SESSION_LOGIN_FAIL';
const SESSION_LOGOUT_SUCCESS = 'SESSION_LOGOUT_SUCCESS';
const RESET_STATE = 'RESET_STATE';
/* set cases for loader & internet connection */
export const setLoader = (value) => ({ type: SET_LOADER, payload: value });

/* set cases for user login success, failure, invalid login and logout */
export const loginSuccess = (value) => ({
  type: SESSION_LOGIN_SUCCESS,
  payload: value
});
export const loginFail = (value) => ({
  type: SESSION_LOGIN_FAIL,
  payload: value
});
export const logoutSuccess = (value) => ({
  type: SESSION_LOGOUT_SUCCESS,
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

/* post login function */
export const postLogin = (props, loginData, _deviceToken) => {
  return async (dispatch) => {
    dispatch(setLoader(true));
    let body = {
      name: loginData.name,
      DeviceToken: _deviceToken,
      DeviceType: Platform.OS === 'ios' ? 1 : 2,
    };
    //clearUserAsyncKey();    
    getUserAsyncKey(body.name)
    .then((user) => {     
      console.log('get user list--->', user);
      if (user && !_.isEmpty(user)) {
        if (user.name === loginData.name) {
          console.log('already exist');
          console.log('login successfully');
          dispatch(loginSuccess(user));
          dispatch(resetTo(props, 'AuthNavigator'));
        } else { 
          console.log('new user created');
          setUserAsyncKey(body);
          //dispatch(postLogin(props, loginData, _deviceToken));
          dispatch(loginFail(''));
        }
      } else {
        console.log('new user created');
        setUserAsyncKey(body);
        //dispatch(postLogin(props, loginData, _deviceToken));
        dispatch(loginFail(''));
      }
      dispatch(setLoader(false));
    }).catch((error) => {
      console.log('getuserkey error:', error.message);
      Toast.show('We are unable to login, please try again');
      dispatch(setLoader(false));
      dispatch(loginFail(''));
    });
  };
};

/* Initial state */
const initialState = Map({
  user: {},
  successMsg: '',
  errorMsg: '',
  loading: false,
  isLoggedIn: false,
});

/* Auth Reducer for API handling */
export default function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_LOGIN_SUCCESS:
      return state.set('user', action.payload).set('isLoggedIn', true);

    case SESSION_LOGIN_FAIL:
      return state;

    case SESSION_LOGOUT_SUCCESS:
      return state;
 
    case SET_LOADER:
      return state.set('loading', action.payload);

    case RESET_STATE:
      return state;

    default:
      return state;
  }
}

const last = function last(array, n) {  
  if (array == null) return void 0;
  if (n == null) return array[array.length - 1];
  return array.slice(Math.max(array.length - n, 0));
};
