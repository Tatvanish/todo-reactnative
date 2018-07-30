import React, { Component } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { connect } from 'react-redux';
// import common styles, functions and static 
import style from '../../../themes/css/styles';
import { StaticText, colors } from '../../../themes/static/common';
//custom component
import Header from '../../../components/UserDefinedComponents/HeaderComponent';
import CustomButton from '../../../components/UserDefinedComponents/Button';

class AddTaskView extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
    title: '',
    headerTitle: '',
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      if (routeName === 'AddTask' && tintColor === colors.colorGray) {
        let imageSrc = require('../../../../images/GrayedImages/add.png');
        return <Image source={imageSrc} style={{width: 24, height: 24 }} />
      } else {
        let imageSrc = require('../../../../images/add.png');
        return <Image source={imageSrc} style={{ width: 24, height: 24 }} />
      }
    }
  });
  constructor(props) {
    super(props);
    this.state = {
      task:'',
      dueDate:'',
      selectedColor:'',
    }
  }

  render() {
    return (
      <View style={[style.wrapperContainer]}>
        <Header headerTextLabel={StaticText.AddText} />
       <Text>Add Task</Text>
      </View>
    );
  }
}

export default connect()(AddTaskView);