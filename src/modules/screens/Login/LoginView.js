import React, { Component } from 'react';
import { View, Text, TextInput, Image, SafeAreaView } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
// import common styles and static 
import style from '../../../themes/css/styles';
import { StaticText, colors} from '../../../themes/static/common';
//custom component
import CustomButton from '../../../components/UserDefinedComponents/Button';
import Spinner from '../../../components/UserDefinedComponents/Spinner';
//services
import * as Auth from '../../../services/AuthService';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "tatva",
      nameError:""
    }
  }
  
  login = () => {
    if (this.state.name === "" || this.state.name === null) {
      this.state.nameError = "Please enter name";
      this.setState({ nameError: "Please enter name" });
    } else {
      this.state.nameError = "";
      this.setState({ nameError: "" });
    }

    if(this.state.nameError === "" || this.state.nameError === null){   
      let loginData = {
        name:this.state.name
      }
      this.props.dispatch(Auth.postLogin(this.props, loginData, '123456'));     
    }else{
      console.log('test');
    }
  }

  render() {
    if(this.props.loading){
      return (<Spinner visible={this.props.loading} />);
    }else{
    return (
      <SafeAreaView style={[style.wrapperContainer]}>            
        <View style={{height:'60%',width:'100%',alignItems:'center',justifyContent:'flex-end'}}>
          <View style={[style.imageThumbnail]}>
              <Image style={style.imageThumb} source={require('../../../../images/logo.png')} />            
          </View>        
          <Text style={style.blackText}>Todo</Text>
        </View>
        <View style={[style.formStyle, { height: '40%', justifyContent: 'flex-end'}]}>
          <View style={{ height:'25%'}}>
          <View style={{           
            borderRadius: 3,
            borderWidth:1,
            borderColor: colors.colorLine}}>
            <TextInput
              placeholder={StaticText.NamePlaceHolder}
              onChangeText={(name) => {
                this.setState({ name: name });                
              }}
              maxLength={20}
              value={this.state.name}
              returnKeyType={'done'}
              style={style.textField}
              underlineColorAndroid={'transparent'}
              />
            </View>
            {this.state.nameError.length > 0 ? <Text style={style.errorMessageStyle}>{this.state.nameError}</Text> : <View />}  
          </View>          
          <View style={{width:'100%'}}>           
            <CustomButton btnTextLabel={StaticText.LoginButtonTitle} onPress={this.login} />          
          </View>
        </View>        
      </SafeAreaView>
    );
    }
  }
}

export default connect()(LoginView);