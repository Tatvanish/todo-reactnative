import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
// import common styles, functions and static 
import style from '../../../themes/css/styles';
import { StaticText, colors } from '../../../themes/static/common';
//custom component
import Header from '../../../components/UserDefinedComponents/HeaderComponent';
import CustomButton from '../../../components/UserDefinedComponents/Button';
import _ from 'lodash';
import * as Auth from '../../../services/AuthService';

class ProfileView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '',
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;    
      if (routeName === 'Profile' && tintColor === colors.colorGray) {
        let imageSrc = require('../../../../images/GrayedImages/profile.png');
        return <Image source={imageSrc} style={{width: 24, height: 24 }} />
      }else{
        let imageSrc = require('../../../../images/profile.png');
        return <Image source={imageSrc} style={{width: 24, height: 24 }} />
      }
    }
  });  
  constructor(props) {
    super(props);
    this.state = {      
      name: '',
    }
  }
  
  componentWillMount(){
    if(this.props.user && !_.isEmpty(this.props.user)){
      console.log('user---', this.props.user);
      let user = JSON.parse(this.props.user);
      this.setState({name: user.name});
    }
  }

  render() {
    return (
      <View style={[style.wrapperContainer]}>
        <Header headerTextLabel={this.props.name !== "" ? 'Hello, ' + this.state.name : 'My Profile'}/>
        <View style={{width:'100%',flex:1,justifyContent:'flex-end',paddingLeft:10, paddingRight:10}}>        
            <CustomButton 
            btnBorderWidth={0.5}
            btnBackColor={colors.colorWhite}
            btnTextColor={colors.colorRed}
            btnTextLabel={StaticText.LogoutText} 
            btnBorderColor={colors.colorRed}            
            onPress={() => this.props.dispatch(Auth.postLogout(this.props))}/>
          </View>
      </View>
    );
  }
}

export default connect()(ProfileView);