import * as actions from './actions';
import { List, Record, Map } from 'immutable';

const InitialState = Record({
  list: List(),
  currentPage: 0,
  detail: new Map()
});
const initialState = new InitialState;
const revive = ({ list, detail }) => {
  return initialState.merge({
    list: List(list),
    currentPage: 0,
    detail: new Map(detail)
  });
}

export default function projectsReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {
    case actions.FETCH_PROJECTS_SUCCESS: {
      const projects = action.payload;
      return state.set('list', List(projects));
    }
    case actions.FETCH_PROJECTS_BY_PAGE_SUCCESS: {
      let { projects, page } = action.payload;
      return state.set('currentPage', page).update('list', list => {
        return list.push(...projects)
      })
    }
    case actions.FETCH_SPECIFIC_PROJECT_SUCCESS: {
      const project = action.payload;
      return state.set('detail', new Map(project))
    }
  }

  return state;
}