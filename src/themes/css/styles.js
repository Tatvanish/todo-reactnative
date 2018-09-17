import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { StaticText, colors } from '../static/common';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingLeft: 15,
    paddingRight: 15,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    //marginBottom: 10
  },
  wrapperContainer: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.colorWhite,
    width: '100%',
    height: '100%'
  },
  imageThumbnail: {
    width: '100%',
    height:100,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageThumb: { resizeMode: "contain", width: '100%', height: '100%', },
  /* mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  headerTitle: { alignItems: 'center', width: '100%' },
  headerSubTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#4A4A4A',
    paddingTop: 12,
    paddingBottom: 8,
    fontWeight:"bold"
  },
  columnSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 80,
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#9E9E9E',
    elevation: 1
  },
  columnBox1: {
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  columnBox2: {
    width: 30,
    height: 30,
  },
  columnSectionTitle: { textAlign: 'left', color: '#4A4A4A', fontSize: 24, fontWeight: 'bold' },
  buttonDefault: { backgroundColor: "#9B9B9B", padding: 15, borderRadius: 6, alignItems: 'center' },
  buttonPrimary: { marginTop: 10, marginBottom: 10, backgroundColor: "#416AAC", padding: 15, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  pageFooter: { width: '100%', marginTop: 10 },
  //profile section
  profileSection: {
    backgroundColor: '#ffffff',
    width: '100%',
    padding: 20,
    flexDirection: 'column',
    borderColor: '#CBCBCB',
    borderWidth: 1,
  },
  
  imageCircle: { width: 120, height: 120, borderRadius: 120 / 2 }, */
  //label
  rowStyle: { flexDirection: 'row' },
  buttonSection: { height: '10%', width: '100%' }, 
  textField: {
    width: '100%',
    height: 50,
    fontSize: 16,
    padding: 10,
    color: colors.colorBlack,
    backgroundColor: colors.colorWhite,    
  },
  blackText: {
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 26,
    color: colors.colorBlack,
    marginTop: 10,
  },
  formStyle: { width: '100%', paddingLeft:10, paddingRight:10},
  errorStyle: { borderColor: 'red', borderWidth: 1 },
  errorMessageStyle: { width: '100%', color: 'red', marginBottom: 5 },
});