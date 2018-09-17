import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// import common styles, functions and static 
import { StaticText, colors} from '../../../src/themes/static/common';

export default class Button extends Component {
  // define props
  static propTypes = {
    fullWidthButtonStyle: PropTypes.object,
    onPress: PropTypes.func,
    btnBackColor: PropTypes.string,
    buttonRadius: PropTypes.number,
    buttonTextStyle:PropTypes.object,
    textStyle:PropTypes.object,
    btnTextColor:PropTypes.string,
    btnTextLabel:PropTypes.string,
    btnBorderColor:PropTypes.string,
    btnBorderWidth:PropTypes.number
  }

  // initialize default props
  static defaultProps = {
    fullWidthButtonStyle: {},
    onPress: () => {},
    btnBackColor:colors.colorGreen,
    buttonRadius:5,
    btnBorderWidth:0,
    buttonTextStyle:{},
    textStyle:{},
    btnTextColor:colors.colorWhite,
    btnTextLabel:'Sample',
    btnBorderColor:colors.colorLightGray
  }

  constructor(props) {
    super(props);
  }

  render() {
    // set constants for props
    const { 
      fullWidthButtonStyle,
      onPress,
      btnBorderWidth,
      btnBackColor,
      buttonRadius,
      buttonTextStyle,
      textStyle,
      btnTextColor,
      btnTextLabel,
      btnBorderColor} = this.props;
    // return the view of custom button component as per props used
    return (
        <View style={[styles.fullWidthButtonWrapper, fullWidthButtonStyle]}>
          <TouchableOpacity onPress={onPress} style={[styles.fullWidthButton,
          { borderWidth: btnBorderWidth, backgroundColor: btnBackColor, borderRadius: buttonRadius, borderColor:btnBorderColor}]}>
            <Text style={[styles.buttonTextStyle, textStyle, { color: btnTextColor}]}>
              {btnTextLabel}
            </Text>
          </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  fullWidthButtonWrapper: {
    width: '100%',
    marginTop: 5,
    marginBottom: 5,
  },
  fullWidthButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:0.5,
  },
  buttonTextStyle: {
    fontSize: 18,
    padding: 15,
  }
});
