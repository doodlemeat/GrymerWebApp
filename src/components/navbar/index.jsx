import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import firebase from 'firebase';
import actions from '../../actions'

class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.signInWithGoogle = this.signInWithGoogle.bind(this);
  }

  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  renderDropdown() {
    if(this.props.user) {
      return (
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="/" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.props.user.displayName}</a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <button className="dropdown-item" onClick={this.props.signOut}>Sign out</button>
            </div>
          </li>
        </ul>
      );
    }
  }

  render() {

    const authButton = this.props.user ? null : <button className="btn btn-sm align-middle btn-outline-warning" type="button" onClick={this.signInWithGoogle}>Sign in with Google</button>;

    return (
      <nav className="navbar sticky-top navbar-toggleable-md navbar-inverse bg-inverse">
        <div className="container">
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
           <span className="navbar-toggler-icon"></span>
          </button>
          <Link to="/" className="navbar-brand">Navbar</Link>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav mr-auto">
              <NavLink exact activeClassName="active" to="/" className="nav-item nav-link">Home</NavLink>
              <NavLink activeClassName="active" to="/browse" className="nav-item nav-link">Browse</NavLink>
              <NavLink activeClassName="active" to="/mash" className="nav-item nav-link">Mash</NavLink>
              <NavLink activeClassName="active" to="/mix" className="nav-item nav-link">Mix</NavLink>
              <NavLink activeClassName="active" to="/media" className="nav-item nav-link">Media</NavLink>
            </div>
            {this.renderDropdown()}
            <form className="form-inline">{authButton}</form>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(actions.signOut())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

/**/
