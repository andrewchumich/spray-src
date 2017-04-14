
const React = require('react-native');

const { StyleSheet, Dimensions } = React;

const { height, width } = Dimensions.get('window');

module.exports = {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FBFAFA',
  },
  shadow: {
    flex: 1,
    width: null,
    height: null,
  },
  bg: {
    flex: 1,
    marginTop: height / 1.75,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 30,
    bottom: 0,
  },
  input: {
    marginBottom: 20,
  },
  btn: {
    marginTop: 20,
    alignSelf: 'center',
  },
  mapContainer: {
    flex: 1,
    alignItems: 'stretch'
  },
  map: {
    flex: 1
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 76,
    height: 50,
    flexDirection: 'column',
    alignItems: 'center',
  },
  trackingButton: {
    height: 56,
    width: 76,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  scrollView: {
    flex: 1
  }
};
