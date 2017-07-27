import React from 'react';
import AddMediaForm from '../forms/AddMediaForm.jsx'
import firebase from 'firebase';

class AddMedia extends React.Component {

  handleSubmit(values) {
    console.log(values);
    const mediaRef = firebase.database().ref().child('media').push();
    mediaRef.set({
      name: values.media_name
    });
  }

  render() {
    return (
      <AddMediaForm onSubmit={this.handleSubmit} />
    );
  }
}

export default AddMedia;
