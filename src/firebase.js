import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyASCSxxLCxWwG4ws-Y4YMUe2HbqdqcfRNU",
  authDomain: "project-375188582360995913.firebaseapp.com",
  databaseURL: "https://project-375188582360995913.firebaseio.com",
  projectId: "project-375188582360995913",
  storageBucket: "project-375188582360995913.appspot.com",
  messagingSenderId: "672192168399"
};

firebase.initializeApp(config);

export const database = firebase.database();

export const auth = firebase.auth();
export const storage = firebase.storage();
