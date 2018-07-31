import React, { Component } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import _ from 'lodash';
// import common styles, functions and static 
import style from '../../../themes/css/styles';
import { StaticText, colors } from '../../../themes/static/common';
//custom component
import Header from '../../../components/UserDefinedComponents/HeaderComponent';
import CustomButton from '../../../components/UserDefinedComponents/Button';
import DatePicker from 'react-native-datepicker';
//services
import * as Todo from '../../../services/TodoService';
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
      dueDateError: '',
      colorError:'',
      userId:''
    }
    this.props.dispatch(Todo.getColorList(this.props));
  }
  
  componentDidMount(){    
    if(this.props.user && !_.isEmpty(this.props.user)){
      let user = this.props.user;
      this.setState({userId:user.userId});
    }
  }

  onClickSelectColor = (element) => {
    if (element.isSelected === false) {
      element.isSelected = true;
      this.setState({ selectedColor: element.colorId });
    } else {
      element.isSelected = false;
      this.setState({ selectedColor: element.colorId });
    }
  }

  addTask = () => {
    //requiredValidation(this.state.taskTitle,"Please enter task title", 'taskTitleError');
    if (_.isEmpty(this.state.taskTitle) || this.state.taskTitle === "") {
      let errorMessage = "Please select due date";
      this.state.taskTitleError = errorMessage;
      this.setState({ taskTitleError: errorMessage });
    } else {
      this.state.taskTitleError = "";
      this.setState({ taskTitleError: "" });
    }
    if (_.isEmpty(this.state.dueDate) || this.state.dueDate === "") {
      let dateMessage = "Please select due date";
      this.state.dueDateError = dateMessage;
      this.setState({ dueDateError: dateMessage });
    } else {
      this.state.dueDateError = "";
      this.setState({ dueDateError: "" });
    }
    if (_.isEmpty(this.state.selectedColor) || this.state.selectedColor === "") {
      let errorMessage = "Please select due date";
      this.state.colorError = errorMessage;
      this.setState({ colorError: errorMessage });
    } else {
      this.state.colorError = "";
      this.setState({ colorError: "" });
    }

    if(_.isEmpty(this.state.taskTitleError) && _.isEmpty(this.state.dueDateError) && _.isEmpty(this.state.colorError)){
      let addTaskData = {
        
      }
    }else{
      console.log('test');
    }
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
                  dateInput: { alignItems: 'flex-start', paddingLeft:10, borderWidth: 0 } }}
                onDateChange={(dueDate) => { this.setState({ dueDate: dueDate }) }}
              />
            </View>
            {this.state.taskTitleError.length > 0 ? <Text style={style.errorMessageStyle}>{this.state.taskTitleError}</Text> : <View />}
          </View>
          <View style={styles.profileSection}>
            <View style={styles.colorStyle}>
              {this.props.colorList && this.props.colorList.map((element, index) => {
                if (this.state.selectedColor == element.colorId) {
                  element.isSelected = true;
                } else {
                  element.isSelected = false;
                }
                return (
                  <TouchableOpacity key={index} onPress={() => { this.onClickSelectColor(element); }} activeOpacity={1} style={[styles.colorButton, { backgroundColor: element.colorCode }]}>
                    {(element.isSelected === true) ? (
                      <Image style={styles.checkImageStyle}
                        source={require('../../../../images/checkIcon.png')} />
                    ) : (
                        <View />
                      )}
                  </TouchableOpacity>
                )
              })}
            </View>
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

const styles = StyleSheet.create({
  profileSection: {
    width: '100%',
    padding: 10,
  },
  colorButton: {
    width: 50, height: 50, borderRadius:50/2
  },
  colorStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  checkImageStyle: {
    alignItems: 'center', resizeMode: 'contain', width: '100%', height: '100%'
  }
});
