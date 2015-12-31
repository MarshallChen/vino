import Component from '../components/Component.react';
import Header from './Header.react';
import Menu from './Menu.react';
import React, {Navigator, PropTypes, StatusBarIOS, View} from 'react-native';
import SideMenu from 'react-native-side-menu';
import mapDispatchToProps from '../../common/app/mapDispatchToProps';
import mapStateToProps from '../../common/app/mapStateToProps';
import routes from '../routes';
import styles from './styles';
import {connect} from 'react-redux/native';

class App extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
  }

  static configureScene(route) {
    return route.animationType || Navigator.SceneConfigs.FloatFromRight;
  }

  // TODO: Fluxify routing and make it universal with redux-router.
  // Store current route in storage.
  // https://github.com/rackt/redux-router/issues/63
  onRouteChange(route, isSideMenuTouch) {
    const {actions} = this.props;
    if (route === 'project') {
      this.navigator.push(routes[route]);
    } else if (route === 'back') {
      this.navigator.pop();
    } else {
      this.navigator.replace(routes[route]);
    }
    if (isSideMenuTouch)
      actions.toggleSideMenu();
  }

  onSideMenuChange(isOpen) {
    const {actions, device} = this.props;
    if (device.platform === 'ios') {
      StatusBarIOS.setHidden(isOpen, true);
    }
    actions.onSideMenuChange(isOpen);
  }

  getTitle(route) {
    const {msg: {app: {links}}} = this.props;
    switch (route) {
      case routes.home: return links.home;
      case routes.todos: return links.todos;
      case routes.project: return 'Project';
    }
  }

  render() {
    const {actions, msg, ui} = this.props;

    const renderScene = route =>
      <View style={[styles.sceneView, route.style]}>
        <Header
          title={this.getTitle(route)}
          toggleSideMenu={actions.toggleSideMenu}
          goBack={() => this.navigator.pop()}
        />
        <route.Page {...this.props} onRouteChange={route => this.onRouteChange(route, false)} />
      </View>;

    const menu =
      <Menu msg={msg} onRouteChange={route => this.onRouteChange(route, true)} />;

    return (
      <SideMenu
        disableGestures
        isOpen={ui.isSideMenuOpen}
        menu={menu}
        onChange={isOpen => this.onSideMenuChange(isOpen)}
        style={styles.container}
      >
        <Navigator
          configureScene={App.configureScene}
          initialRoute={routes.home}
          ref={c => this.navigator = c}
          renderScene={renderScene}
          style={styles.container}
        />
      </SideMenu>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(App);