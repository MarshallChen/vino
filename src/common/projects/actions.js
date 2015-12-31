export const FETCH_PROJECTS = 'FETCH_PROJECTS';
export const FETCH_PROJECTS_SUCCESS = 'FETCH_PROJECTS_SUCCESS';
export const FETCH_PROJECTS_ERROR = 'FETCH_PROJECTS_ERROR';
export const FETCH_PROJECTS_BY_PAGE = 'FETCH_PROJECTS_BY_PAGE';
export const FETCH_PROJECTS_BY_PAGE_SUCCESS = 'FETCH_PROJECTS_BY_PAGE_SUCCESS';
export const FETCH_PROJECTS_BY_PAGE_ERROR = 'FETCH_PROJECTS_BY_PAGE_ERROR';
export const FETCH_SPECIFIC_PROJECT = 'FETCH_SPECIFIC_PROJECT';
export const FETCH_SPECIFIC_PROJECT_SUCCESS = 'FETCH_SPECIFIC_PROJECT_SUCCESS';
export const FETCH_SPECIFIC_PROJECT_ERROR = 'FETCH_SPECIFIC_PROJECT_ERROR';
export const CHANGE_PAGE = 'CHANGE_PAGE';

export function projects() {
  return ({ fetch }) => {
    return {
      type: FETCH_PROJECTS,
      payload: {
        promise: fetch(`/api/v1/projects/`)
          .then(res => res.json())
      }
    }
  }
}

export function fetchProjectsByPage({ page }) {
  return ({ fetch }) => {
    return {
      type: FETCH_PROJECTS_BY_PAGE,
      payload: {
        promise: fetch(`/api/v1/projects/?page=${page}`)
          .then(res => res.json())
          .then(json => {
            return {
              projects: json,
              page
            }
          })
      }
    }
  }
}

export function project({params}) {
  const { id } = params;
  return ({ fetch }) => {
    return {
      type: FETCH_SPECIFIC_PROJECT,
      payload: {
        promise: fetch(`/api/v1/projects/${id}`)
          .then(res => res.json())
      }
    }
  }
}