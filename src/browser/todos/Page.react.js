import Buttons from './Buttons.react';
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import List from './List.react';
import NewTodo from './NewTodo.react';
import React, {PropTypes} from 'react';
import fetch from '../components/fetch';
import {fetchUserTodos} from '../../common/todos/actions';

// This decorator (higher order component) fetches todos both in browser and
// on server side. It's true isomorphic data fetching and rendering.

class Page extends Component {

  static propTypes = {
    actions: PropTypes.object,
    msg: PropTypes.object,
    todos: PropTypes.object
  }

  render() {
    const {actions, msg: {todos: msg}, todos: {newTodo, list}} = this.props;

    return (
      <DocumentTitle title={msg.title}>
        <div className="todos-page">
          <NewTodo {...{actions, msg, newTodo}} />
          <List {...{actions, list, msg}} />
          <Buttons clearAllEnabled={list.size > 0} {...{actions, msg}} />
        </div>
      </DocumentTitle>
    );
  }

}

export default fetch(fetchUserTodos)(Page)
