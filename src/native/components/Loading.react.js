import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import Component from './Component.react';

const styles = StyleSheet.create({
  text: {
    color: '#fff'
  }
})

export default class Loading extends Component {
  render() {
    return (
      <View>
        <Text style={styles.text}>Loading...</Text>
      </View>
    )
  }
}