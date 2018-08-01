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
    await AsyncStorage.getItem(USER_KEY)
    .then((users) => {
      console.log('get userList', users);
      let userList = JSON.parse(users);
      if (userList && !_.isEmpty(userList)) {
        console.log(444);
        let userArray = _.orderBy(userList, 'userId', 'desc');
        console.log('userArray', userArray);
        let body = user;
        body.userId = parseInt(userArray[0].userId)+1;
        userList.push(body);
        let userData = JSON.stringify(userList);
        console.log('userData---->', userData);
        let json = AsyncStorage.setItem(USER_KEY, userData);
        return json;
      } else {
        console.log(555);
        let users = [];
        let body = user;
        body.userId=1;
        console.log('body',body);
        users.push(body);
        let userData = JSON.stringify(users);
        console.log('userData---->', userData);
        let json = AsyncStorage.setItem(USER_KEY, userData);
        return json;
      } 
    })
    .catch((error)=>{
      console.log('set user key error:', error.message);
    });     
}

/* export async function getUserAsyncKey(userName) {      
  let user = {};
    await AsyncStorage.getItem(USER_KEY).then((users) => {
      let userData = JSON.parse(users);
      if (userData && !_.isEmpty(userData) && userData !== null) {  
        console.log(1);   
        var index = userData.map(e => e.name).indexOf(userName);
        console.log(index);
        if(index > -1){
          console.log(2);   
          let user = userData[index];
          return user;
        }else{
          console.log(3);   
          return user;
        }
      }else{
        console.log(4);   
        return user;
      }
    }).catch((error) => {
      console.log(error);
    }); 
} */

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
  payload: JSON.stringify(value)
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
    AsyncStorage.getItem(USER_KEY).then((users) => {
      let userData = JSON.parse(users);
      if (userData && !_.isEmpty(userData) && userData !== null) {
        console.log('all user list--->', userData);
        let name = loginData.name;
        let index = userData.map(e => e.name).indexOf(name);
        if (parseInt(index)>=0) {
          let user = userData[index];
          console.log('already exist');    
          dispatch(loginSuccess(user));
          dispatch(resetTo(props, 'AuthNavigator'));
        } else {
          console.log('new user created');
          setUserAsyncKey(body);        
          setTimeout(() => {            
            dispatch(postLogin(props, loginData, _deviceToken));
          }, 100);
          dispatch(loginFail(''));
        }
      } else {
        console.log('first user created');
        setUserAsyncKey(body);
        setTimeout(() => {
          dispatch(postLogin(props, loginData, _deviceToken));
        }, 100);
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

export const postLogout = (props) => {
  return async (dispatch) => {
    console.log('logout');
    dispatch(logoutSuccess(''));
    setTimeout(() => {      
      dispatch(resetTo(props, 'NonAuthNavigator'));
    }, 5);    
  }
}

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
      return initialState;
 
    case SET_LOADER:
      return state.set('loading', action.payload);

    case RESET_STATE:
      return state;

    default:
      return state;
  }
}
