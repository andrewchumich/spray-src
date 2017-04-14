
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body, List, ListItem } from 'native-base';

import { openDrawer } from '../../../actions/drawer';
import { LocationPropTypes } from '../../reducers/location';
import styles from './styles';
import { Section } from '../../reducers/location';
import { LocationService } from '../../reducers/location';

const {
  popRoute,
} = actions;

class ManagerContainer extends Component {

  static propTypes = {
    name: React.PropTypes.string,
    index: React.PropTypes.number,
    openDrawer: React.PropTypes.func,
    popRoute: React.PropTypes.func,
    location: React.PropTypes.shape(LocationPropTypes),
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  _onPressDayButton(sections: Section[]) {
    const savePromises = sections.map((section: Section) => {
      LocationService.save({ section }).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
    });
  }

  render() {
    const { name, index, location } = this.props;
    const days_list = Object.keys(location.list).sort().reverse();

    let days_list_component = '';
    if (days_list.length > 0) {
      const days_list_items = days_list.map((day) => {
        const sections: Section[] = location.list[day];
        return (
          <ListItem key={day} onPress={ () => this._onPressDayButton(sections) }>
            <Text>{day} : { sections.length } </Text>
          </ListItem >
        );
      });
      days_list_component = (
        <List >
          { days_list_items }
        </List >
      );
    }

    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.popRoute()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>

          <Body>
            <Title>{(name) ? this.props.name : 'Manager'}</Title>
          </Body>

          <Right>
            <Button transparent onPress={this.props.openDrawer}>
              <Icon name="ios-menu" />
            </Button>
          </Right>
        </Header>

        <Content padder>
          { days_list_component }
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  name: state.user.name,
  index: state.list.selectedIndex,
  location: state.location,
});


export default connect(mapStateToProps, bindAction)(ManagerContainer);
