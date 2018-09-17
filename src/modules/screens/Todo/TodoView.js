import React, { Component } from 'react';
import { View, Text, Image, ListView, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import Swipeout from 'react-native-swipeout';
// import common styles, functions and static 
import style from '../../../themes/css/styles';
import { StaticText, colors } from '../../../themes/static/common';
//custom component
import Header from '../../../components/UserDefinedComponents/HeaderComponent';
import CustomButton from '../../../components/UserDefinedComponents/Button';
//services
import * as AuthService from '../../../services/AuthService';

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
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });  
    this.state = {
      userId :'',
      todoList: '',
      selectedTodo:'',
      dataSource: ds.cloneWithRows([])
    }      
  }

  componentWillMount(){
    if (this.props.user && !_.isEmpty(this.props.user)) {
      let user = JSON.parse(this.props.user);
      console.log('logged in user--->', user);
      this.state.userId = user.userId;
      this.setState({ userId: user.userId });      
      this.props.dispatch(AuthService.getTodoList(user.userId));
    }      
  }
    
  componentWillReceiveProps(nextProps) {
    if (nextProps.todo !== this.props.todo && nextProps.todo !== '' &&
    nextProps.todo !== null && nextProps.todo !== 'undefined') { 
      let todoList = JSON.parse(nextProps.todo);
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(todoList)});
    }
  }

  renderRow = (item) => {
    if (item !== '' && item !== null && item !== undefined) {
      let swipeRightBtn = [{
        text: 'Delete',
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => {
          Alert.alert(
            'Delete',
            'Are you sure want to delete task?',
            [
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              { text: 'OK', onPress: () => this.props.dispatch(AuthService.postTodoDelete(this.props, item.taskId, this.state.userId)) },
            ],
            { cancelable: false }
          )
        },
        autoClose: true
      }];
  
      let swipeLeftBtn = [{
        text: 'Complete',
        backgroundColor: colors.colorLightGray,
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => {
          Alert.alert(
            'Complete',
            'Are you sure want to complete task?',
            [
              { text: 'Cancel', onPress: () => console.log('cancel')},
              { text: 'OK', onPress: () => this.props.dispatch(AuthService.postTodoComplete(this.props, item.taskId, this.state.userId))},
            ],
            { cancelable: false }
          )
        },
        autoClose: true
      }];
      let today = moment(new Date()).format('YYYY-MM-DD');
      let tomorrow = moment(new Date()).add(1, "day").format('YYYY-MM-DD');
      let yesterday = moment(new Date()).add(-1, "day").format('YYYY-MM-DD');

      if (moment(item.dueDate).format('YYYY-MM-DD') === today){
        item.dueDate = 'today';
      } else if(moment(item.dueDate).format('YYYY-MM-DD') === tomorrow){
        item.dueDate = 'tomorrow';
      } else if (moment(item.dueDate).format('YYYY-MM-DD') === yesterday) {
        item.dueDate = 'yesterday';
      }else{
        item.dueDate = item.dueDate;
      }
      return (
        <Swipeout left={swipeLeftBtn} right={swipeRightBtn} autoClose={true} close={true} backgroundColor={'transparent'}>
          <View key={item.taskId} style={styles.row}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <View style={[styles.button, { backgroundColor: item.colors.colorCode ? item.colors.colorCode : colors.colorRed}]}/>
              <View style={{marginLeft:20}}>
                <Text style={(item.status === 1) ? styles.strikeText : styles.boldText}>{item.taskTitle}</Text>
                <Text style={(item.status === 1) ? styles.grayText : styles.text}> Due {item.dueDate}</Text>
              </View>
            </View>
          </View>
        </Swipeout>   
      );
    }
  }

  render() {
    return (
      <View style={[style.wrapperContainer]}>
        <Header headerTextLabel={StaticText.applicationTitle}/>
        {(this.state.dataSource && this.state.dataSource.getRowCount() === 0) ?
        <View style={{ width: '100%', padding:10,alignItems:'center'}}>
          <Text style={styles.text}>No todo available</Text>
        </View>  
        :
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
            style={{ width: '100%'}}/>
        }
      </View>
    );
  }
}

export default connect()(TodoView);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  boldText:{
    fontSize: 20,
    marginBottom:5,
    color:colors.colorBlack
  },
  strikeText:{
    textDecorationLine: 'line-through',
    fontSize: 20,
    marginBottom: 5,
    color:colors.colorLightGray
  },
  text: {
    fontSize: 14,
    color:'#444444'
  },
  grayText: {
    fontSize: 14,
    color: colors.colorLightGray
  },
  button: {
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.3
  }
});