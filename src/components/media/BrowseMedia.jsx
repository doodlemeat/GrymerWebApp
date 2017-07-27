import React from 'react';
import { connect } from 'react-redux';

const styles = {
  spaceUnder: {
    marginBottom: '15px'
  }
}

class BrowseMedia extends React.Component {

  render() {
    const media = this.props.media.map((media) => {
      return (
        <div className="col-sm-6 col-md-4 col-lg-3" key={media.key}>
          <div className="card" style={styles.spaceUnder}>
            <img className="card-img-top" src="http://via.placeholder.com/350x150" alt="" />
            <div className="card-block">
              <h4 className="card-title">Card title</h4>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
      );
    })
    return (
      <div className="row">{media}</div>
    );
  }
}

const mapStateToProps = (state) => ({
  media: state.media
})

export default connect(mapStateToProps)(BrowseMedia);
