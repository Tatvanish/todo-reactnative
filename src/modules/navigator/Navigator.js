import React, { Component } from 'react';
import {Platform, Image} from 'react-native';
import {createBottomTabNavigator, createStackNavigator} from 'react-navigation';
import { StaticText, colors } from '../../themes/static/common';
//import screens
import LoginViewContainer from '../../modules/screens/Login/LoginViewContainer';
import TodoViewContainer from '../../modules/screens/Todo/TodoViewContainer';
import AddTaskViewContainer from '../../modules/screens/AddTask/AddTaskViewContainer';
import ProfileViewContainer from '../../modules/screens/Profile/ProfileViewContainer';
const activeColor = colors.colorGreen;
// TabNavigator is nested inside createStackNavigator
export const TodoTabNavigator = createBottomTabNavigator({
  TodoList: {screen: TodoViewContainer},
  AddTask: {screen: AddTaskViewContainer},
  Profile: {screen: ProfileViewContainer},
},{  
  tabBarOptions: {
    activeTintColor: colors.colorGreen,
    inactiveTintColor: colors.colorGray,
    labelStyle: {
      fontSize: 12,      
    },
    style: {
      backgroundColor: colors.colorWhite,   
      alignSelf:'center',
      paddingLeft:40,
      paddingRight:40
    },    
    animationEnabled: false,
    swipeEnabled: false,    
  }
});

const AuthNavigator = createStackNavigator({
  Todo: {screen:TodoTabNavigator,navigationOptions:{header:null}},   
});

const NonAuthNavigator = createStackNavigator({
  Login: { screen: LoginViewContainer, navigationOptions: {header: null}},
});

// Root navigator is a createStackNavigator
const AppNavigator = createStackNavigator({
  NonAuthNavigator: { screen: NonAuthNavigator, navigationOptions: { header: null }},
  AuthNavigator: { screen: AuthNavigator, navigationOptions: { header: null}},
}, { initialRouteName: 'NonAuthNavigator' });

export default AppNavigator;
