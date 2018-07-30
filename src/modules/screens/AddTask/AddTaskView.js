import React, { Component } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
// import common styles, functions and static 
import style from '../../../themes/css/styles';
import { StaticText, colors } from '../../../themes/static/common';
//custom component
import Header from '../../../components/UserDefinedComponents/HeaderComponent';
import CustomButton from '../../../components/UserDefinedComponents/Button';
import DatePicker from 'react-native-datepicker';
const currentDate = new Date();
class AddTaskView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '',
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
      taskTitle:'',
      dueDate:'',
      selectedColor:'',
      taskTitleError:'',
      dueDate: "",
      colorError:''
    }
  }

  addTask = () => {
    console.log('this.state',this.state);
  }

  render() {
    return (
      <View style={[style.wrapperContainer]}>
        <Header headerTextLabel={StaticText.AddText} />
        <View style={[style.formStyle,{marginTop:20}]}>
          <View style={{marginBottom:20}}>
            <View style={{
              borderRadius: 3,
              borderWidth: 1,
              borderColor: colors.colorLine,
              alignItems:'flex-start',
              backgroundColor:'red'
            }}>
              <TextInput
                placeholder={StaticText.TaskTitlePlaceHolder}
                onChangeText={(taskTitle) => {
                  this.setState({ taskTitle: taskTitle });
                }}
                numberOfLines={4}
                multiline={true}
                maxLength={150}
                value={this.state.taskTitle}
                returnKeyType={'next'}
                style={[style.textField, {textAlignVertical:'top',height:'auto'}]}
                underlineColorAndroid={'transparent'}
              />
            </View>
            {this.state.taskTitleError.length > 0 ? <Text style={style.errorMessageStyle}>{this.state.taskTitleError}</Text> : <View />}
          </View>

          <View style={{ marginBottom: 20 }}>
            <View style={{
              borderRadius: 3,
              borderWidth: 1,
              borderColor: colors.colorLine
            }}>
              <DatePicker
                style={{
                  width: '100%',
                  borderWidth: 0,
                }}
                date={this.state.dueDate}
                mode="datetime"
                placeholder={StaticText.DueDatePlaceHodler}
                format="YYYY-MM-DD HH:mm:ss"
                minDate={currentDate}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"         
                showIcon={false}
                customStyles={{
                  dateInput: { alignItems: 'flex-start', paddingLeft:10, fontSize:16, borderWidth: 0 } }}
                onDateChange={(dueDate) => { this.setState({ dueDate: dueDate }) }}
              />
            </View>
            {this.state.taskTitleError.length > 0 ? <Text style={style.errorMessageStyle}>{this.state.taskTitleError}</Text> : <View />}
          </View>
          <View style={{ width: '100%' }}>
            <CustomButton btnTextLabel={StaticText.AddText} onPress={this.addTask} />
          </View>
        </View>
      </View>
    );
  }
}

export default connect()(AddTaskView);