import * as authActions from '../auth/actions';
import * as todosActions from '../todos/actions';
import * as uiActions from '../ui/actions';
import * as projectsActions from '../projects/actions';
import {Map} from 'immutable';
import {bindActionCreators} from 'redux';

const actions = [
  authActions,
  todosActions,
  projectsActions,
  uiActions
];

export default function mapDispatchToProps(dispatch) {
  const creators = Map()
    .merge(...actions)
    .filter(value => typeof value === 'function')
    .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  };
}
