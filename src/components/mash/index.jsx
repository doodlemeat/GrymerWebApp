import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './style.css'
import $ from 'jquery'
import * as firebase from 'firebase';
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty, dataToJS } from 'react-redux-firebase'

@firebaseConnect([ '/songs' ])
@connect(
  ({ firebase }) => ({
    songs: dataToJS(firebase, '/songs'),
  })
)
class Mash extends React.Component {
  onClickInstrumental(instrumental) {
    console.log(instrumental);
  }

  componentDidMount() {
    $('.block-click-event').click((e) => {
      e.stopPropagation();
    });
  }

  onSubmit = (values) => {
    firebase.database().ref().child('songs').push(values).then((d) => {
    }).catch((e,b) => {
    });
  }

  render() {
    const { songs } = this.props;
    return (
      <Tabs style={{ padding: '1rem 0' }} selectedTabClassName="active">
        <TabList className="nav nav-tabs">
          <Tab className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#home" role="tab">Instrumental</a>
          </Tab>
          <Tab className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#home" role="tab">Mix</a>
          </Tab>
        </TabList>

        <TabPanel className="tab-pane p-3">
          <p>Choose an instrumental version of a song to use in your mash.</p>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Song</th>
                <th>Artist</th>
                <th>Vocals</th>
                <th>Instrumental</th>
              </tr>
            </thead>
            <tbody>
              {
                isLoaded(songs) && !isEmpty(songs) ?
                Object.keys(songs).map((key, id) => {
                  return (
                    <tr onClick={this.onClickInstrumental} key={key} style={{ cursor: 'pointer' }}>
                      <td>{songs[key].song_name}</td>
                      <td>{songs[key].artist_name}</td>
                      <td><a target="_blank" rel="noopener noreferrer" className="block-click-event" href={"https://www.youtube.com/watch?v=" + songs[key].instrumental_video_id}>Instrumental</a></td>
                      <td><a target="_blank" rel="noopener noreferrer" className="block-click-event" href={"https://www.youtube.com/watch?v=" + songs[key].vocals_video_id}>Vocals</a></td>
                    </tr>
                  );
                }) : ':D'
              }
            </tbody>
		  </table>
      <p>or add your own instrumental version</p>
        </TabPanel>
        <TabPanel className="tab-pane">
          <h2>Any content 2</h2>
          <video width="320" height="240" controls>
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <input type="text" defaultValue="0" onWheel={(d) => console.log(d.deltaY)} />
          <input type="text" defaultValue="0" onWheel={(d) => console.log(d.deltaY)} />
        </TabPanel>
      </Tabs>
    );
  }
}

export default Mash;
