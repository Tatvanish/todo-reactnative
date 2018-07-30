import React, { Component } from 'react';
import { View, Text, TextInput, Image, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
// import common styles and static 
import style from '../../../themes/css/styles';
import { StaticText, colors} from '../../../themes/static/common';
//custom component
import CustomButton from '../../../components/UserDefinedComponents/Button';
import { StackActions, NavigationActions } from 'react-navigation';
class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    }
  }

  render() {
    return (
      <SafeAreaView style={[style.wrapperContainer]}>      
        <View style={{height:'60%',width:'100%',alignItems:'center',justifyContent:'flex-end'}}>
          <View style={[style.imageThumbnail]}>
              <Image style={style.imageThumb} source={require('../../../../images/logo.png')} />            
          </View>        
          <Text style={style.blackText}>Todo</Text>
        </View>
        <View style={[style.formStyle, { height: '40%', justifyContent: 'flex-end'}]}>
          <View style={{
            borderRadius: 3,
            borderWidth:1,
            borderColor: colors.colorLine}}>
          <TextInput
            placeholder={StaticText.NamePlaceHolder}
            onChangeText={(name) => this.setState({ name: name })}
            value={this.state.name}
            returnKeyType={'done'}
            style={style.textField}
            underlineColorAndroid={'transparent'}
            />  
            </View>
          <View style={{width:'100%'}}>        
            <CustomButton btnTextLabel={StaticText.LoginButtonTitle} onPress={() => {
              const resetAction = StackActions.reset({
                index: 0,
                key: null,
                actions: [NavigationActions.navigate({ routeName: 'AuthNavigator' })],
              });
              this.props.navigation.dispatch(resetAction);
             }} />
          </View>
        </View>        
      </SafeAreaView>
    );
  }
}

export default connect()(LoginView);