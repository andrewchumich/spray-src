
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
};
