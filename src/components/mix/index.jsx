import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import $ from 'jquery'
import * as firebase from 'firebase';
import { connect } from 'react-redux'
import MediaStreamRecorder from 'msr/MediaStreamRecorder'
const minimumVideoLength = 2;

class Mix extends React.Component {
  state = {
    startCut: 0,
    stopCut : minimumVideoLength,
    increment: 0.01,
    recording: false
  }

  constructor(props) {
    super(props);
    this.changeStart = this.changeStart.bind(this);
    this.changeStop = this.changeStop.bind(this);
    this.changeIncrement = this.changeIncrement.bind(this);
    this.save = this.save.bind(this);
  }

  changeStart(event) {
    const direction = event.deltaY > 0 ? -1 : 1;
    let startCut =  Math.round((this.state.startCut + direction * this.state.increment) * 1000) / 1000;
    let stopCut = this.state.stopCut;
    if(startCut > stopCut - minimumVideoLength) {
      stopCut = Math.round((startCut + minimumVideoLength) * 1000) / 1000;
    }

    if(startCut < 0) {
      startCut = 0;
    }
    this.setState({ startCut, stopCut });
  }

  changeStop(event) {
    const direction = event.deltaY > 0 ? -1 : 1;
    let stopCut = Math.round((this.state.stopCut + direction * this.state.increment) * 1000) / 1000;
    let startCut = this.state.startCut;
    if(stopCut < startCut + minimumVideoLength) {
      startCut = Math.round((stopCut - minimumVideoLength) * 1000) / 1000;
    }

    if(stopCut < minimumVideoLength) {
      stopCut = minimumVideoLength;
      startCut = 0;
    }
    this.setState({ stopCut, startCut });
  }

  changeIncrement(event) {
    const direction = event.deltaY > 0 ? -1 : 1;
    this.setState({
      increment: this.state.increment + direction * 0.01
    });
  }

  save() {
      this.recorder.start();
  }

  componentDidMount() {
    this.video = document.getElementById('video');
    this.video.onplay = () => {
      this.recorder = new MediaStreamRecorder(this.video.captureStream());
      this.recorder.ondataavailable = function(blob) {
        console.log(blob)
      };
      this.recorder.start();

      setTimeout(() => {
        try {
          this.recorder.stop();
        } catch(e) {
          console.log(e)
        }
      }, 1000)
    }

    /*setInterval(() => {
      if (this.video.currentTime >= this.state.stopCut) {
         this.video.currentTime = this.state.startCut;
      }
    }, 15);*/
  }

  componentDidUpdate() {
    this.video.currentTime = this.state.startCut
  }

  render() {
    return (
      <div>
        <h2>Any content 2</h2>
        <video autoPlay id="video" width="320" height="240" controls>
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <input type="text" value={this.state.startCut} onWheel={this.changeStart} />
        <input type="text" value={this.state.stopCut} onWheel={this.changeStop} />
        <input type="text" value={this.state.increment} onWheel={this.changeIncrement} />
        <button onClick={this.record}>record</button>
      </div>
    );
  }
}

export default Mix;
