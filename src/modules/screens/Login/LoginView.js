import React, { Component } from 'react';
import { View, Text, TextInput, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import OAuthManager from 'react-native-oauth';
// import common styles and static 
import style from '../../../themes/css/styles';
import { StaticText, colors} from '../../../themes/static/common';
//custom component
import CustomButton from '../../../components/UserDefinedComponents/Button';
import Spinner from '../../../components/UserDefinedComponents/Spinner';
//services
import * as Auth from '../../../services/AuthService';
import * as Todo from '../../../services/TodoService';
const webClientId = "644222433917-9t0goqdpimlrgof6b37qbm8jbmvu2v2l.apps.googleusercontent.com";
const manager = new OAuthManager('TodoApp');
const config = {
  twitter: {
    consumer_key: 'mSGKFd9gCy68KLNVVR3bKodPB',
    consumer_secret: 'vkmZrm6Fb3VjIQ6knkob1jIdWGupLC7WuwyH7m4pDp7m734Tbf'
  }
}

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nameError:"",
      behavior: Platform.OS === 'ios' ? 'padding' : null,
    }   
  }

  componentWillMount() {        
    manager.configure(config);
    if (this.props.isLoggedIn){
      if(this.props.user && !_.isEmpty(this.props.user)) {
      this.props.dispatch(Auth.resetTo(this.props, 'AuthNavigator'));
      }
    }
  }

  componentDidMount() {    
    GoogleSignin.hasPlayServices()
    .then(() => {
      GoogleSignin.configure({
        webClientId:webClientId,
        offlineAccess: false
      })
    })
    .catch(err => {
      console.log('Play services error', err.code, err.message);
    });       
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
      this.props.dispatch(Auth.postLogin(this.props, loginData));     
    }else{
      console.log('test');
    }
  }

  _signInWithGoogle = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      this.setState({name:userInfo.name});
      console.log('Google userInfo', userInfo);    
      setTimeout(() => {        
        this.login();  
      }, 100);
    } catch (error) {
      alert(error);
     console.log('Google sign in error:',error);
    }
  };

  _signInWithTwitter = () => {    
    try{

      manager.authorize('twitter')
        .then((response) => {
          console.log('twitter sign in response:',response);
        })
        .catch(error => console.log('twitter sign in error:', error));
    }catch(error){
      console.log('twitter sign in error:', error)
    } 
  }

  render() {
    if(this.props.loading){
      return (<Spinner visible={this.props.loading} />);
    }else{
    return (
      <KeyboardAvoidingView style={style.wrapperContainer} behavior={this.state.behavior} keyboardVerticalOffset={60}>
        <View style={[style.wrapperContainer]}>            
        <View style={{height:'50%',width:'100%',alignItems:'center',justifyContent:'flex-end'}}>
          <View style={[style.imageThumbnail]}>
              <Image style={style.imageThumb} source={require('../../../../images/logo.png')} />            
          </View>        
          <Text style={style.blackText}>Todo</Text>
        </View>
        <View style={[style.formStyle, { height: '50%', justifyContent: 'flex-end'}]}>
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
            {/* <GoogleSigninButton
              style={{ width: 212, height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={this._signIn}
            />    */}
              <CustomButton btnBackColor={"#1DA1F2"} btnTextLabel={StaticText.TwitterButtonTitle} onPress={this._signInWithTwitter} />   
              <CustomButton btnBackColor={colors.colorDarkRed} btnTextLabel={StaticText.GoogleButtonTitle} onPress={this._signInWithGoogle} />   
              <CustomButton btnTextLabel={StaticText.LoginButtonTitle} onPress={this.login} />    

          </View>
        </View>        
        </View>
      </KeyboardAvoidingView>
    );
    }
  }
}

export default connect()(LoginView);