/* @flow */
import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { Grid, Row } from 'react-native-easy-grid';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import { MAPBOX_TOKEN } from '../../config';
Mapbox.setAccessToken(MAPBOX_TOKEN);

import { openDrawer } from '../../../actions/drawer';
import { setIndex } from '../../../actions/list';
import { setLocation, startSpraying, stopSpraying } from '../../actions/location';
import { setSpray } from '../../actions/spray';

// should probably put this in a utils module
import { getToday, LocationPropTypes, getTodaysList, Section, LocationState } from '../../reducers/location';
import { SprayPropTypes } from '../../reducers/spray';
import type { SprayState } from '../../reducers/spray';
import styles from './styles';
import { Position } from '../../utils';

class MapContainer extends Component {
  static propTypes = {
    name: React.PropTypes.string,
    location: React.PropTypes.shape(LocationPropTypes),
    spray: React.PropTypes.shape(SprayPropTypes),
    openDrawer: React.PropTypes.func,
    setLocation: React.PropTypes.func,
    setSpray: React.PropTypes.func,
    startSpraying: React.PropTypes.func,
    stopSpraying: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  state: {
    zoom: number,
    defaultZoom: number,
    userTrackingMode: any,
    locations: any[],
    annotations: any[],
    currentAnnotationsPath: ?any,
    currentAnnotationsSwath: ?any,
  } = {
    zoom: 11,
    defaultZoom: 15,
    userTrackingMode: Mapbox.userTrackingMode.follow,
    locations: [],
    annotations: [],
    currentAnnotationsPath: null,
    currentAnnotationsSwath: null,
  };

  _watchId: number;
  _map: any;

  constructor() {
    super();
    this._watchId = -1;
  }

  componentDidMount() {
    const { setSpray, location } = this.props;

    // TODO - make this stop watching when not tracking to be more efficient
    this._watchId = navigator.geolocation.watchPosition((location) => {
      if (this._isTracking()) {
        const p: Position = [location.coords.longitude, location.coords.latitude, location.coords.altitude];
        this._setLocation(p);
      }
    }, (error) => {
      //console.error('ERROR GETTING POSITION', error);
    }, {
      enableHighAccuracy: true,
      distanceFilter: 5,
    });

    setSpray({
      chemical_id: 0,
      chemical_flow: 2,
      county_id: 5,
      weed_ids: [1, 3],
      boom: 'BOTH',
      boom_size: 15,
    });
  }

  _getMapboxCoordinatesFromPosition(p: Position) {
      const longitude = p[0];
      const latitude = p[1];
      return [latitude, longitude];
  }

  /**
   *
   * When props change, check the current section for new coordinates.
   * If there are new ones, add them to the current annotations
   */
  componentWillReceiveProps(nextProps) {
    const { location, spray }: { location: LocationState, spray: SprayState } = nextProps;

    // once state has been rehydrated, set the initial annotations
    if (location.rehydrated === true && this.props.location.rehydrated === false) {
      const annotations = this._getInitialAnnotations(location);
      this.setState({
        annotations,
      });
    } else if (spray.spray === true && location.current !== null) {
      let currentAnnotationsPath;
      // if the current path annotation are null, initialize them
      if (this.state.currentAnnotationsPath === null) {
        currentAnnotationsPath = this._getLineAnnotation(spray, location.current);
      } else {
         currentAnnotationsPath = {...this.state.currentAnnotationsPath}
      }
      // if the length of the current annotations coords is less than the current coords,
      // push the new coords onto the current annotation
      const current_length = location.current.line.coordinates.length;
      const path_length = currentAnnotationsPath.coordinates.length;
      for (let i = path_length; i < current_length; i++) {
        const coords = this._getMapboxCoordinatesFromPosition(location.current.line.coordinates[i]);
        currentAnnotationsPath.coordinates = [...currentAnnotationsPath.coordinates, coords];
      }

      this.setState({
        currentAnnotationsPath,
      });
    }
  }

  _isTracking() {
    let { spray } = this.props;
    return spray.spray;
  }

  _getTrackingMode() {
    if (this._isTracking()) {
      return Mapbox.userTrackingMode.follow;
    } else {
      return Mapbox.userTrackingMode.follow;
    }
  }

  _stopSpraying() {
    const {stopSpraying} = this.props;
    let { annotations, currentAnnotationsPath, currentAnnotationsSwath } = this.state;
    let newAnnotations = [...annotations];
    if (currentAnnotationsPath !== null) {
      newAnnotations.push({...currentAnnotationsPath});
    }
    if (currentAnnotationsSwath !== null) {
      newAnnotations.push({...currentAnnotationsSwath});
    }

    // set currentAnnotationsPath and currentAnnotationsSwath to null to reset
    this.setState({
      currentAnnotationsPath: null,
      currentAnnotationsSwath: null,
      annotations: newAnnotations,
    });

    stopSpraying();
  }

  _toggleTrackingMode() {
    const { startSpraying, stopSpraying, spray } = this.props;
    if (this.props.spray.spray) {

      this._stopSpraying();
    } else {
      startSpraying(spray);
    }
  }

  _getLineAnnotation(spray: SprayState, section: Section) {
    return {
      type: 'polyline',
      coordinates: [],
      strokeColor: '#00FB00',
      strokeWidth: 4,
      strokeAlpha: .5,
      id: section.id,
    };
  }

  _getAnnotationsFromSection(section: Section) {
    let annotations = [{
      type: 'polyline',
      coordinates: [],
      strokeColor: '#00FB00',
      strokeWidth: 4,
      strokeAlpha: .5,
      id: section.id,
    }]
    return section.line.coordinates.reduce((previous, current, index) => {
      const longitude = current[0];
      const latitude = current[1];
      const coordinates = [latitude, longitude];
      previous[0].coordinates.push(coordinates)
      return previous
/*            .concat({
              type: 'point',
              coordinates: coordinates,
              // TODO - make index better
              id: index.toString(),
              annotationImage: { // optional. Marker image for type=point
                source: {
                  uri: 'https://cldup.com/7NLZklp8zS.png'
                },
                height: 20,
                width: 20,
              },
            })*/
    }, annotations)
  }

  /**
   * On component mount, get the annotations for all the points in the current day
   */
  _getInitialAnnotations(location: LocationState) {
    const todays_list = getTodaysList(location);
    const annotations_list = todays_list.reduce((prev, section: Section) => {
      const list = this._getAnnotationsFromSection(section);
      return [...prev, ...list];
    }, []);
    return annotations_list;
  }

  _setLocation(position: Position) {
    const { setLocation } = this.props;
    setLocation(position);
  }

  render() {
    const { location } = this.props;
    const today = getToday();

    let todays_list = getTodaysList(location);
    let annotations = [...this.state.annotations];
    // push the current annotations onto the main array
    // these will be merged permanently once spraying is stopped
    if (this.state.currentAnnotationsPath !== null) {
      annotations.push({...this.state.currentAnnotationsPath});
    }
    if (this.state.currentAnnotationsSwath !== null) {
      annotations.push({...this.state.currentAnnotationsSwath});
    }
    
    let trackingButton;
    let trackingButtonClass = 'tracking-button';
    if (this._isTracking()) {
      trackingButton = (
        <Button style={styles.trackingButton} onPress={() => this._toggleTrackingMode()} success>
          <Text>
            Tracking
          </Text>
        </Button>
      )
    } else {
      trackingButton = (
        <Button style={styles.trackingButton} onPress={() => this._toggleTrackingMode()} outline warning bordered>
          <Text>
            Not Tracking
          </Text>
        </Button>
      )
    }
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>

          <Body>
            <Title>Map</Title>
          </Body>

          <Right>
            <Button transparent onPress={this.props.openDrawer}>
              <Icon name="ios-menu" />
            </Button>
          </Right>
        </Header>

        <View style={styles.mapContainer}>
          <MapView
            ref={map => { this._map = map; }}
            style={styles.map}
            initialZoomLevel={ this.state.defaultZoom }
            userTrackingMode={ this._getTrackingMode() }
            annotations={ annotations }
          />
        </View>
        <View style={styles.buttonContainer}>
          { trackingButton }
        </View>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    setLocation: location => dispatch(setLocation(location)),
    setSpray: spray => dispatch(setSpray(spray)),
    startSpraying: spray => dispatch(startSpraying(spray)),
    stopSpraying: spray => dispatch(stopSpraying()),
  };
}

const mapStateToProps = state => ({
  name: state.user.name,
  navigation: state.cardNavigation,
  location: state.location,
  spray: state.spray,
});

export default connect(mapStateToProps, bindAction)(MapContainer);
