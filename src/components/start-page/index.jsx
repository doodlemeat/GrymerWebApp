import React from 'react';
import { Link } from 'react-router-dom';

class StartPage extends React.Component {
  render() {
    return (
      <div className="columns">
        <div className="column is-half is-offset-one-quarter">
          <div className="field is-grouped" style={{ margin: '2rem 0' }}>
            <div className="field has-addons is-marginless">
              <p className="control">
                <input className="input is-medium" type="text" placeholder="Search for songs" />
              </p>
              <p className="control">
                <a className="button is-info is-medium">
                  <span className="icon">
                    <i className="fa fa-search"></i>
                  </span>
                </a>
              </p>
            </div>
            <p className="is-medium" style={{ fontSize: '1.25rem', margin: '0 0.75rem', alignSelf: 'center' }}>or</p>
            <p className="control">
              <Link to="/create-song" className="button is-primary is-medium">Create song</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default StartPage;
