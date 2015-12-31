import Component from '../components/Component.react';
import React, {
  PropTypes,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import icons from './icons.js';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F5FcFF',
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  icon: {
    width: 40,
    height: 40,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 400,
  },
  blur: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#fff',
  },
})

export default class Page extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired
  }

  render() {
    const {msg, device: { platform }} = this.props;

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Image source={{ uri: 'http://41.media.tumblr.com/5b1d24da718d31284f05d8fe414672f7/tumblr_nxjfa9yGAS1qij4o1o1_1280.jpg' }} style={styles.image}>
          </Image>
          <Image source={{ uri: 'http://static.tumblr.com/df7e43636ba031e8d651ba4ac0c3cc9e/nry5dil/O2Zmij8bp/tumblr_static_bodystocking_abr_4f54fba599e9b.jpg' }} style={styles.image}>
          </Image>
          <Image source={{ uri: 'http://41.media.tumblr.com/e15b4d74cd02949e1eaed22c407901e7/tumblr_nwe181gzTI1uyqjfso1_1280.jpg' }} style={styles.image}>
          </Image>
        </View>
      </ScrollView>
    );
  }

}
