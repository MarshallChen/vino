import Component from '../components/Component.react';
import {
  Image,
  Text,
  View,
  ScrollView,
} from 'react-native';
import Loading from '../components/Loading.react';

export default class Project extends Component {

  async componentDidMount() {
    const { params: { id }, actions } = this.props;
    const {payload} = await actions.project(id);
    if (payload) {
      //
    }
  }

  render() {
    const { projects: { detail }} = this.props;
    if (!detail) return <Loading />;
    return (
      <ScrollView>
        <View>
          <Text>{detail.title}</Text>
        </View>
      </ScrollView>
    )
  }
}