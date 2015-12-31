import Component from '../components/Component.react';
import React, {
  Image,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Loading from '../components/Loading.react';
import fetch from '../components/fetch';
// import { project } from '../../common/projects/actions';


export default class Project extends Component {

  render() {
    const { projects: { detail }, onRouteChange } = this.props;
    const project = detail.toJS();
    return (
      <ScrollView style={styles.container}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{project.title.split('/')[0].trim()}</Text>
          <Text style={styles.title}>{`/ ${project.title.split('/')[1].trim()}`}</Text>
          {project.summary.map((spec, key) => {
            return <Text style={styles.summary} key={key}>{spec}</Text>
          })}
        </View>
        {project.images.map((image, key) => {
          return <View key={key} style={styles.images}>
            <Image style={styles.image} source={{ uri: image.split('?')[0] }} />
          </View>
        })}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: '#333'
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  titleWrapper: {
    width: Dimensions.get('window').width,
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  title: {
    color: '#fff',
    fontSize: 40
  },
  summary: {
    color: '#fff'
  },
  images: {
    width: Dimensions.get('window').width,
    paddingLeft: 10,
    paddingRight: 10,
  },
  image: {
    height: 300,
  }
})
