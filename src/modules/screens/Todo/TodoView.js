import React, { Component } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { connect } from 'react-redux';
// import common styles, functions and static 
import style from '../../../themes/css/styles';
import { StaticText, colors } from '../../../themes/static/common';
//custom component
import Header from '../../../components/UserDefinedComponents/HeaderComponent';
import CustomButton from '../../../components/UserDefinedComponents/Button';

class TodoView extends Component { 
  static navigationOptions = ({ navigation }) => ({
    title: '',
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      if (routeName === 'TodoList' && tintColor === colors.colorGray) {
        let imageSrc = require('../../../../images/GrayedImages/feed.png');
        return <Image source={imageSrc} style={{width: 24, height: 24 }} />
      }else{
        let imageSrc = require('../../../../images/feed.png');
        return <Image source={imageSrc} style={{width: 24, height: 24 }} />
      }
    }
  });
  constructor(props) {
    super(props);
    this.state = {
      todoList: '',
      selectedTodo:''
    }
  }

  render() {
    return (
      <View style={[style.wrapperContainer]}>
        <Header headerTextLabel={StaticText.applicationTitle}/>
        <Text>Todo</Text>
      </View>
    );
  }
}

export default connect()(TodoView);