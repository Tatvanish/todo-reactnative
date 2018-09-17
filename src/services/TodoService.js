import React, { Component } from 'react';
import { AsyncStorage, Platform } from 'react-native';
import { Map } from 'immutable';
import { get, post } from '../utils/api';
import _ from 'lodash';
import { StackActions, NavigationActions } from 'react-navigation';
import Toast from 'react-native-simple-toast';
var Realm = require('realm');
const ColorSchema = {
  name: 'Colors',
  primaryKey: 'colorId',
  properties:
  {
    colorId: { type: 'int', default: 0 },
    colorCode: 'string',
  }
}
const TodoSchema = {
  name: 'Todo',
  primaryKey: 'taskId',
  properties:
  {
    taskId: { type: 'int', default: 0 },
    taskTitle: 'string',
    dueDate: 'string',
    colors: { type: 'Colors' },
    status: 'bool'
  }
}
const UserSchema = {
  name: 'User',
  primaryKey: 'userId',
  properties:
  {
    userId: { type: 'int', default: 0 },
    name: 'string',
    todos: { type: 'list', objectType: 'Todo' }
  }
}
let realm = new Realm({ path: 'test.realm', schemaVersion: 1, schema: [ColorSchema, TodoSchema, UserSchema] });
let users = realm.objects('User');
let colors = realm.objects('Colors');
let todos = realm.objects('Todo');

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
  payload: JSON.stringify(value)
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
  payload: JSON.stringify(value)
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

export const getColorList = () => {
  return async (dispatch) => {
    dispatch(setLoader(true));
    try {    
      realm.write(() => {
        realm.create('Colors', { colorId: 1, colorCode: '#4A90E2' }); 
        realm.create('Colors', { colorId: 2, colorCode: '#80D320' });
        realm.create('Colors', { colorId: 3, colorCode: '#CF001C' });
        realm.create('Colors', { colorId: 4, colorCode: '#BB10DF' });
        realm.create('Colors', { colorId: 5, colorCode: '#F3A324' });
      });
        let colorArr = [];
        colors.map((color,i)=>{colorArr.push(color)});
        dispatch(colorListSuccess(colorArr));
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

export async function setTodoList(todoData) {
  let todoArr = []; 
  try {      
    let taskId = todos.length+1;        
    realm.write(() => {      
      realm.create('Todo', {
        taskId: taskId,
        taskTitle: todoData.taskTitle,
        dueDate: todoData.dueDate,
        status: false
      });      
      let todoObject = realm.create('Todo', {
        taskId: taskId,       
        colors: { colorId: todoData.colors.colorId, colorCode: todoData.colors.colorCode }
      }, true);
      let data = realm.create('User', {
        userId: todoData.userId
      }, true);      
      data.todos.push(todoObject);
    });
  } catch (error) {
    console.log('set todo list error', error);
  }
  console.log('todoArr---', todoArr);
  return todoArr;
}

export async function getRealmTodoList() {
  let todoArr = [], todoList = '';
  try {
    todos.map((todo, i) => { todoArr.push(todo) });
    if (todoArr.length > 0) {
      todoList = JSON.stringify(todoArr);
    }
  } catch (error) {
    console.log('get todo list error', error);
  }
  console.log('list---', todoList);
  return todoList;
}

export const postTodoTask = (props, addTaskData) => {
  return async (dispatch) => {
    dispatch(setLoader(true));    
   /*  if (todoList && !_.isEmpty(todoList) && todoList !== null && todoList !== 'undefined') {      
      let todoData = await setTodoList(addTaskData);
      console.log('todoData', JSON.parse(JSON.stringify(todoData)));
    }else{
      console.log('first todo list');            
    } */

    let currentUserList = users.filtered('userId = "' + addTaskData.userId + '"');
    currentUserList = JSON.parse(JSON.stringify(currentUserList));
    let todolist = currentUserList[0].todos;
    console.log('currentUserList', currentUserList);
    
    let todoData = await setTodoList(addTaskData);
    console.log('todoData', JSON.parse(JSON.stringify(todoData)));    
   /*  AsyncStorage.getItem(TASK_KEY).then((tasks) => {
      let taskData = JSON.parse(tasks);
      if (taskData && !_.isEmpty(taskData) && taskData !== null) {
        console.log('all task list--->', taskData);
        let taskTitle = addTaskData.taskTitle;
        let index = taskData.map(e => e.taskTitle).indexOf(taskTitle);
        console.log('index',index);
        if (parseInt(index) >= 0 && taskData[index].userId === addTaskData.userId && 
        taskData[index].dueDate === addTaskData.dueDate) {
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
    }); */
  }  
}

/* export const postTodoComplete = (props, taskId, userId) => {
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
          setTimeout(() => {
            dispatch(getTodoList(props, userId));
          }, 1);
        }
        else {
          Toast.show('Error to complete task.');
          dispatch(todoCompleteFail(''));
        }
      } else {
        Toast.show('Error to complete task.');
        dispatch(todoCompleteFail(''));
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
          dispatch(todoDeleteSuccess(''));
          setTimeout(() => {            
            dispatch(getTodoList(props, userId));
          }, 1);
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
} */

/* Initial state */
const initialState = Map({
  colorList: [],
  todo : '',
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