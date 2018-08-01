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
/*Async storage colors keys declaration*/
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

/*Async storage task keys declaration*/
const USER_KEY = 'TodoState:User';
const TASK_KEY = 'TodoState:TodoTask';
export async function setTodoTaskAsyncKey(task) {
  await AsyncStorage.getItem(TASK_KEY)
    .then((tasks) => {
      let taskList = JSON.parse(tasks);
      if (taskList && !_.isEmpty(taskList)) {
        console.log(444);
        console.log('get todo tasks', taskList);
        let taskArray = _.orderBy(taskList, 'taskId', 'desc');
        console.log('taskArray', taskArray);
        let body = task;
        body.taskId = parseInt(taskArray[0].taskId) + 1;
        taskList.push(body);
        let taskData = JSON.stringify(taskList);
        console.log('taskData---->', taskData);
        let json = AsyncStorage.setItem(TASK_KEY, taskData);
        return json;
      } else {
        console.log(555);
        let newTask = [];
        let body = task;
        body.taskId = 1;
        console.log('body', body);
        newTask.push(body);
        let taskData = JSON.stringify(newTask);
        console.log('taskData---->', taskData);
        let json = AsyncStorage.setItem(TASK_KEY, taskData);
        return json;
      }
    })
    .catch((error) => {
      console.log('set task key error:', error.message);
    });
}

export async function clearTaskAsyncKey() {
  return AsyncStorage.removeItem(TASK_KEY);
}

export async function setTodoListAfterCompleteOrDelete(tasks){
  try {
    let updatedTaskData = JSON.stringify(tasks);
    let json = AsyncStorage.setItem(TASK_KEY, updatedTaskData);
    return json;
  }catch (error){
    console.log('setTodoListAfterCompleteOrDelete error:', error.message);
  };
}
/* set constants for API success & failure */
const SET_LOADER = 'SET_LOADER';
const GET_COLORLIST_SUCCESS = 'GET_COLORLIST_SUCCESS';
const GET_COLORLIST_FAILURE = 'GET_COLORLIST_FAILURE';

const SET_TODOLIST_SUCCESS = 'SET_TODOLIST_SUCCESS';
const SET_TODOLIST_FAILURE = 'SET_TODOLIST_FAILURE';

const GET_TODOLIST_SUCCESS = 'GET_TODOLIST_SUCCESS';
const GET_TODOLIST_FAILURE = 'GET_TODOLIST_FAILURE';

const TODO_COMPLETE_SUCCESS = 'TODO_COMPLETE_SUCCESS';
const TODO_COMPLETE_FAILURE = 'TODO_COMPLETE_FAILURE';

const TODO_DELETE_SUCCESS = 'TODO_DELETE_SUCCESS';
const TODO_DELETE_FAILURE = 'TODO_DELETE_FAILURE';

const RESET_STATE = 'RESET_STATE';
/* set cases for loader & internet connection */
export const setLoader = (value) => ({ type: SET_LOADER, payload: value });
export const setResetState = () => ({ type: RESET_STATE});

/* set cases for colorlist success, failure */
export const colorListSuccess = (value) => ({
  type: GET_COLORLIST_SUCCESS,
  payload: value
});
export const colorListFail = (value) => ({
  type: GET_COLORLIST_FAILURE,
  payload: value
});

/* get & set cases for todolist success, failure */
export const getTodoListSuccess = (value) => ({
  type: GET_TODOLIST_SUCCESS,
  payload: value
});
export const getTodoListFail = (value) => ({
  type: GET_TODOLIST_FAILURE,
  payload: value
});

export const setTodoListSuccess = (value) => ({
  type: SET_TODOLIST_SUCCESS,
  payload: value
});
export const setTodoListFail = (value) => ({
  type: SET_TODOLIST_FAILURE,
  payload: value
});

/*todo complete & delete success,failure*/
export const todoCompleteSuccess = (value) => ({
  type: TODO_COMPLETE_SUCCESS,
  payload: value
});
export const todoCompleteFail = (value) => ({
  type: TODO_COMPLETE_FAILURE,
  payload: value
});

export const todoDeleteSuccess = (value) => ({
  type: TODO_DELETE_SUCCESS,
  payload: value
});
export const todoDeleteFail = (value) => ({
  type: TODO_DELETE_FAILURE,
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

export const getTodoList = (props, userId) => {
  return async (dispatch) => {
    dispatch(setLoader(true));
    try {
      let todoList = await AsyncStorage.getItem(TASK_KEY);      
      todoList = JSON.parse(todoList);      
      if (todoList && !_.isEmpty(todoList) && todoList.length > 0) {
        let list = [];
        list = todoList.filter(x => x.userId === userId);
        if(list && !_.isEmpty(list) && list.length > 0){          
          console.log('todolist--->', list);   
          let descList = _.orderBy(list, 'taskId', 'desc');       
          dispatch(getTodoListSuccess(descList));
        }else{
          dispatch(getTodoListFail(''));
        }
      } else {
        dispatch(getTodoListFail(''));
      }
      dispatch(setLoader(false));
    } catch (error) {
      console.log('get todo list error:', error.message);
      Toast.show('Error to fetch todo list');
      dispatch(getTodoListFail(''));
    }
  };
}

export const postTodoTask = (props, addTaskData, _deviceToken) => {
  return async (dispatch) => {
    dispatch(setLoader(true));
    let body = {
      userId: addTaskData.userId,
      taskTitle: addTaskData.taskTitle,
      dueDate: addTaskData.dueDate,
      colorId: addTaskData.colorId,
      colorCode: addTaskData.colorCode,
      status: addTaskData.status,
      DeviceToken: _deviceToken,
      DeviceType: Platform.OS === 'ios' ? 1 : 2,
    }; 
    AsyncStorage.getItem(TASK_KEY).then((tasks) => {
      let taskData = JSON.parse(tasks);
      if (taskData && !_.isEmpty(taskData) && taskData !== null) {
        console.log('all task list--->', taskData);
        let taskTitle = addTaskData.taskTitle;
        let index = taskData.map(e => e.taskTitle).indexOf(taskTitle);
        if (parseInt(index) >= 0) {
          Toast.show('Task already exist.');
          dispatch(setTodoListFail(''));
        } else {
          console.log('new task created');
          setTodoTaskAsyncKey(body);
          dispatch(setTodoListSuccess(''));
          Toast.show('Task added successfully.');
          setTimeout(() => {            
            dispatch(getTodoList(props, addTaskData.userId));
            props.navigation.navigate('TodoList');
          }, 2);  
        }
      } else {
        console.log('first task created');
        setTodoTaskAsyncKey(body);
        dispatch(setTodoListSuccess('')); 
        Toast.show('Task added successfully.');
        setTimeout(() => {
          dispatch(getTodoList(props, addTaskData.userId));
          props.navigation.navigate('TodoList');
        }, 2);
      }
      dispatch(setLoader(false));
    }).catch((error) => {
      console.log('get task key error:', error.message);
      Toast.show('We are unable to add new task, please try again');
      dispatch(setLoader(false));
      dispatch(setTodoListFail(''));
    });
  }  
}

export const postTodoComplete = (props, taskId, userId) => {
  return async (dispatch) => {
    dispatch(setLoader(true));
    AsyncStorage.getItem(TASK_KEY).then((tasks) => {
      let taskData = JSON.parse(tasks);
      if (taskData && !_.isEmpty(taskData) && taskData !== null) {
        console.log('all task list--->', taskData);
        let index = taskData.map(e => e.taskId).indexOf(taskId);
        if (index > -1){
          taskData[index].status = 1;
          console.log('taskData[index]', taskData[index]);          
          setTodoListAfterCompleteOrDelete(taskData);
          Toast.show('Task Completed successfully.');
          dispatch(todoCompleteSuccess(''));
          dispatch(getTodoList(props, userId));
        }
        else {
          Toast.show('Error to complete task.');
          dispatch(todoDeleteFail(''));
        }
      } else {
        Toast.show('Error to complete task.');
        dispatch(todoDeleteFail(''));
      }
      dispatch(setLoader(false));
    }).catch((error) => {
      console.log('get task key error:', error.message);
      Toast.show('We are unable to complete task, please try again');
      dispatch(setLoader(false));
    });
  }
}

export const postTodoDelete = (props, taskId, userId) => {
  return async (dispatch) => {
    dispatch(setLoader(true));
    AsyncStorage.getItem(TASK_KEY).then((tasks) => {
      let taskData = JSON.parse(tasks);
      if (taskData && !_.isEmpty(taskData) && taskData !== null) {
        console.log('all task list--->', taskData);
        let index = taskData.map(e => e.taskId).indexOf(taskId);
        if (index > -1) {
          taskData.splice(index, 1);      
          setTodoListAfterCompleteOrDelete(taskData);
          Toast.show('Task Deleted successfully.');
          dispatch(todoCompleteSuccess(''));
          dispatch(getTodoList(props, userId));
        }
        else {
          Toast.show('Error to delete task.');
          dispatch(todoDeleteFail(''));
        }
      } else {
        Toast.show('Error to delete task.');
        dispatch(todoDeleteFail(''));
      }
      dispatch(setLoader(false));
    }).catch((error) => {
      console.log('get task key error:', error.message);
      Toast.show('We are unable to delete task, please try again');
      dispatch(setLoader(false));
    });
  }
}
/* Initial state */
const initialState = Map({
  colorList: {},
  todo : {},
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

    case GET_TODOLIST_SUCCESS:
      return state.set('todo',action.payload);

    case GET_TODOLIST_FAILURE:
      return state;

    case SET_TODOLIST_SUCCESS:
      return state;

    case SET_TODOLIST_FAILURE:
      return state;

    case TODO_COMPLETE_SUCCESS:
      return state;

    case TODO_COMPLETE_FAILURE:
      return state;

    case SET_LOADER:
      return state.set('loading', action.payload);

    case RESET_STATE:
      return state;

    default:
      return state;
  }
}