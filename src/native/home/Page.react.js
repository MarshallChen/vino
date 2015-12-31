import Component from '../components/Component.react';
import React, {
  Image,
  PropTypes,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ListView,
} from 'react-native';
import appStyles from '../app/styles';
import fetch from '../components/fetch';
import { projects } from '../../common/projects/actions';
import Project from './Project.react';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#333',
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  card: {
  },
  image: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 300,
    resizeMode: 'cover'
  },
  title: {
    backgroundColor: 'transparent',
    position: 'absolute',
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
    top: 230,
    left: 18,
    right: 18,
    fontWeight: '100',
  },
  summary: {
    flex: 1
  },
  summaryHead: {
    fontWeight: 'bold'
  },
})

class Page extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired
  }

  async next() {
    let { actions, projects: { currentPage, list }} = this.props;
    currentPage++;
    const {payload} = await actions.fetchProjectsByPage({ page: currentPage });
    if (payload) {
      // console.log(list.size)
    }
  }

  async show({ id }) {
    const { actions, onRouteChange } = this.props;
    const {error, payload} = await actions.project(id);
    if (!error) onRouteChange('project');
  }

  renderRow(project, sectionID, projectID) {
    if (!project.images.length || !project.title) {
      <View>
        <Text style={styles.title}>Loading...</Text>
      </View>
    }
    const hero = project.images[0].replace(/large_jpg/g, 'medium_jpg');
    return (
      <TouchableOpacity
        onPress={this.show.bind(this, { id: project.id })}>
        <View style={[styles.card]} key={project.id}>
          <Image source={{uri: hero}}
                 style={[styles.image]} />
          <Text style={[styles.title]}>{project.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const {msg, device: { platform }, projects: { list }} = this.props;
    const ds = new ListView.DataSource({
      rowHasChanged: (a, b) => a !== b
    })
    const source = ds.cloneWithRows(list.toJS());
    return (
      <ListView pageSize={10}
                removeClippedSubviews={true}
                dataSource={source}
                renderRow={this.renderRow.bind(this)}
                onEndReached={(e) => this.next()} />
    );
  }

}

export default fetch(projects)(Page);
