import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {FormattedHTMLMessage} from 'react-intl';
import {Link} from 'react-router';
import fetch from '../components/fetch';
import { projects } from '../../common/projects/actions';

class Page extends Component {

  static propTypes = {
    // Why not PropTypes.object.isRequired? Because:
    // https://github.com/rackt/react-router/issues/1505
    msg: PropTypes.object
  }

  more(e) {
    e.preventDefault();
    let { actions, projects: { currentPage }} = this.props;
    currentPage++;
    actions.fetchProjectsByPage({ page: currentPage });
  }

  render() {
    const {msg: {home: msg}, projects: { list }} = this.props;
    const styles = {
      width: '24%',
      margin: '0 .5% 1rem',
      verticalAlign: 'top'
    }

    return (
      <DocumentTitle title={msg.title}>
        <div className="home-page">
          {list.toJS().map((project, key) => {
            return (
              <Link to={`/project/${project.id}`}>
                <img src={project.images[0].replace(/large_jpg/, 'medium_jpg')} style={styles} key={key} />
              </Link>
            )
          })}
          <button onClick={e => this.more(e)}>Load More</button>
        </div>
      </DocumentTitle>
    );
  }

}

export default fetch(projects)(Page);
