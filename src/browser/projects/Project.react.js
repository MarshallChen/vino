import Component from 'react-pure-render/component';
import React from 'react';
import DocumentTitle from 'react-document-title';
import fetch from '../components/fetch';
import { project } from '../../common/projects/actions';

class Project extends Component {
  render() {
    const { projects: { detail }} = this.props;
    let proj = detail.toJS();
    const style = {
      image: {
        width: '95%',
        margin: '.25%'
      }
    };
    return (
      <DocumentTitle title={proj.title}>
        <div className="project-page">
          <h1>{proj.title}</h1>
          <ul>
            {proj.summary.map((spec, key) => {
              return <li key={key}>{spec}</li>
            })}
          </ul>
          {proj.images.map((image, key) => {
            return <img src={image} style={style.image} key={key} />
          })}
          {proj.descriptions.map((desc, key) => {
            return <p key={key}>{desc}</p>
          })}
        </div>
      </DocumentTitle>
    )
  }
}

export default fetch(project)(Project);