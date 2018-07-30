import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// import common styles, functions and static 
import { StaticText, colors } from '../../../src/themes/static/common';

export default class Header extends Component {
  // define props
  static propTypes = {   
    headerStyle:PropTypes.object,
    textStyle:PropTypes.object,
    textColor:PropTypes.string,
    headerTextLabel:PropTypes.string
  }

  // initialize default props
  static defaultProps = { 
    headerStyle:{},
    textStyle:{},
    textColor:colors.colorWhite,
    headerTextLabel:'Sample'
  }

  constructor(props) {
    super(props);
  }

  render() {
    // set constants for props
    const {
      headerStyle,
      textStyle,
      textColor,
      headerTextLabel
    } = this.props;
    // return the view of custom button component as per props used
    return (
      <View style={[styles.headerContainer, headerStyle]}>
          <Text style={[styles.headerTitleStyle, textStyle, { color: textColor }]}>
            {headerTextLabel}
          </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({  
  headerContainer:{
    width:'100%',
    height:90,
    backgroundColor:colors.colorGreen
  },
  headerTitleStyle:{
    paddingTop:35,
    paddingLeft:20,
    fontSize:30,
    color:colors.colorWhite
  }
});
