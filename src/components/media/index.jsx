import React from 'react';
import { connect } from 'react-redux';
import { Link, Switch, Route } from 'react-router-dom';
import AddMedia from './AddMedia.jsx'
import BrowseMedia from './BrowseMedia.jsx';
import ReactModal from 'react-modal';
import './index.css';

const styles = {
  spaceUnder: {
    marginBottom: '15px'
  }
}

class Media extends React.Component {

  constructor() {
    super();
    this.state = {
      showAddMediaModal: false
    };

    this.openAddMedia = this.openAddMedia.bind(this);
    this.closeAddMedia = this.closeAddMedia.bind(this);
  }

  openAddMedia() {
    this.setState({
      showAddMediaModal: true
    });
  }

  closeAddMedia() {
    this.setState({
      showAddMediaModal: false
    });
  }

  renderAddMediaModal() {
    return (
      <ReactModal
        isOpen={this.state.showAddMediaModal}
        contentLabel="Minimal Modal Example">
        <button onClick={this.closeAddMedia}>Close Modal</button>
        <div className="modal fade">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modal title</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Modal body text goes here.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary">Save changes</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
    );
  }

  renderMenu() {
    if(this.props.user) {
      return (
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <Link className="nav-link" to="/media">Browse media</Link>
          </li>
          <li className="nav-item">
            <button href="#" className="btn btn-primary" onClick={this.openAddMedia}>Add media</button>
            {this.renderAddMediaModal()}
          </li>
        </ul>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div>
        <div className="row" style={styles.spaceUnder}>
          <div className="col-sm-6">
            <h2>Media</h2>
          </div>
          <div className="col-sm-6">{this.renderMenu()}</div>
        </div>
        <Switch>
          <Route path="/media/add" component={AddMedia} />
          <Route component={BrowseMedia} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(Media);
