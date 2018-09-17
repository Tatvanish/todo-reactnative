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
import * as AuthService from '../../../services/AuthService';

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
  static defaultProps = {
    colorList:[]
  }
  constructor(props) {
    super(props);
    this.state = {
      userId:'',
      taskTitle:'',
      dueDate:'',
      selectedColor:{},      
      taskTitleError:'',
      dueDateError: '',
      colorError:'',
      status:0,
      colorList:[],    
    }    
  }
  componentWillMount(){
    if (this.props.colorList && this.props.colorList.length > 0 && this.props.colorList !== "" && this.props.colorList !== null && this.props.colorList !== "undefined") {
      let colors = JSON.parse(this.props.colorList);   
      this.setState({ colorList: colors });
    } else {
      this.props.dispatch(AuthService.getColorList());
    }
  }
  
  componentWillReceiveProps(nextProps){
    if (nextProps.colorList && nextProps.colorList.length > 0 && nextProps.colorList !== "" && nextProps.colorList !== null && nextProps.colorList !== "undefined") {
      let colors = JSON.parse(nextProps.colorList);
      this.setState({ colorList: colors });
    }
  }
  
  componentDidMount(){    
    if(this.props.user && !_.isEmpty(this.props.user)){
      let user = JSON.parse(this.props.user);
      this.setState({userId:user.userId});
    }
  }

  onClickSelectColor = (element) => {
    element.isSelected = !element.isSelected;
    this.setState({ selectedColor: element});    
  }

  addTask = () => {
    if (_.isEmpty(this.state.taskTitle) || this.state.taskTitle === "") {
      let errorMessage = "Please enter task title";
      this.state.taskTitleError = errorMessage;
      this.setState({ taskTitleError: errorMessage });
    } else {
      this.state.taskTitleError="";
      this.setState({taskTitleError: ""});
    }
    if (_.isEmpty(this.state.dueDate) || this.state.dueDate === "") {
      let dateMessage = "Please select due date";
      this.state.dueDateError =dateMessage;
      this.setState({ dueDateError: dateMessage });
    } else {
      this.state.dueDateError ="";
      this.setState({dueDateError:""});
    }
    if (this.state.selectedColor === "" || this.state.selectedColor === null) {
      let colorMessage = "Please select color";
      this.state.colorError = colorMessage;
      this.setState({ colorError: colorMessage });
    } else {
      this.state.colorError= "" ;
      this.setState({ colorError: "" });
    }

    if(_.isEmpty(this.state.taskTitleError) && _.isEmpty(this.state.dueDateError) 
    && (this.state.colorError === '' || this.state.colorError === null)){
      let addTaskData = {
        userId: this.state.userId,
        taskTitle: _.upperFirst(this.state.taskTitle),
        dueDate: this.state.dueDate,
        colors: this.state.selectedColor,
        status: this.state.status
      }
      this.props.dispatch(AuthService.postTodoTask(this.props, addTaskData));  
      setTimeout(() => {
        this.setState({
          taskTitle: '',
          dueDate: '',
          selectedColor: {},
          colorCode:''    
        });
      }, 2000);
    }else{
      console.log('this.state',this.state);      
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
                onChangeText= {(taskTitle) => this.setState({ taskTitle: taskTitle })}
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
                onDateChange={(dueDate) => this.setState({ dueDate: dueDate })}
              />
            </View>
            {this.state.dueDateError.length > 0 ? <Text style={style.errorMessageStyle}>{this.state.dueDateError}</Text> : <View />}
          </View>
          <View style={styles.profileSection}>
            <View style={styles.colorStyle}>
              {this.state.colorList && this.state.colorList.length>0
               && this.state.colorList.map((element, index) => {
                if (this.state.selectedColor.colorId == element.colorId) {
                  element.isSelected = true;
                } else {
                  element.isSelected = false;
                }
                return (
                  <TouchableOpacity key={index} onPress={() => { this.onClickSelectColor(element); }} style={[styles.colorButton, { backgroundColor: element.colorCode }]}>
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
            {this.state.colorError.length > 0 ? <Text style={style.errorMessageStyle}>{this.state.colorError}</Text> : <View />}
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
    width: 50, height: 50, borderRadius:50/2,
    opacity:0.3
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
