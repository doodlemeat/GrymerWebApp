import React from 'react';
import Store from 'store';
import $ from 'jquery';
import Radium from 'radium';
import Typography from '@react-mdc/typography';
import WebRTCSupport from './webrtc-support';
import WebRTCNoSupport from './webrtc-no-support';
import NotSupported from './not-supported.js';
import Toolbar from './components/Toolbar';

import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Checkbox from 'material-ui/Checkbox';

import { Session, RemoteStatus } from './session';

const styles = {
	base: {
		display: 'flex'
	},
	left: {
		width: '640px',
		display: 'flex',
		flexDirection: 'column'
	},
	right: {
		flexGrow: 1
	},
	videoContainer: {
		background: '#222',
		position: 'relative',
		overflow: 'hidden'
	},
	lastVideoContainer: {
		borderTop: '1px solid white'
	},
	video: {
		height: '100%',
		width: '100%',
		display: 'block'
	},
	videoOverlayText: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: 'white'
	},
	videoOverlay: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		padding: '16px',
		boxSizing: 'border-box'
	},
	chipsWrapper: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	overlayChip: {
		margin: '4px'
	},
	controlPanel: {
		margin: '16px',
		padding: '16px',
		display: 'flex',
		flexWrap: 'wrap'
	}
};

const styleMinimal = {
	base: {
	}
};

class ChatRoulette extends React.Component {

	constructor() {
		super();
		
		this.state = {
			isSearching: false,
			muteLocalAudio: Store.get('muteLocalAudio') || false,
			muteLocalVideo: Store.get('muteLocalVideo') || false,
			clientVideoWidth: 90,
			clientVideoHeight: 90,
			hasRemote: false,
			remoteStatus: RemoteStatus.NO_REMOTE,
			orientationAngle: false,
			windowHeight: $(window).height()
		};
		this.toggleStart = this.toggleStart.bind(this);
		this.handleNext = this.handleNext.bind(this);
		this.handleMuteMyAudio = this.handleMuteMyAudio.bind(this);
		this.handleMuteMyVideo = this.handleMuteMyVideo.bind(this);
		this.onResize = this.onResize.bind(this);
		this.onOrientationChange = this.onOrientationChange.bind(this);
		this.onLocalVideoDimensions = this.onLocalVideoDimensions.bind(this);
		this.getLocalVideoEl = this.getLocalVideoEl.bind(this);
	}
	
	onOrientationChange() {
		this.setState({
			orientationAngle: !this.state.orientationAngle
		});
		
		this.session.refreshLocalVideo();
	}
	
	onResize() {
		this.setState({
			windowHeight: $(window).height()
		});
	}
    
    componentWillUnmount() {
		window.removeEventListener('orientationchange', this.onOrientationChange);
        window.removeEventListener('resize', this.updateDimensions);
    }
  
	componentDidMount() {
		window.addEventListener('orientationchange', this.onOrientationChange);
		window.addEventListener('resize', this.onResize);
		this.session = new Session({
			localVideo: this.myVideoEl,
			remoteVideo: this.otherVideoEl,
			autoRequestMedia: true,
			muteLocalAudio: this.state.muteLocalAudio,
			muteLocalVideo: this.state.muteLocalVideo
		});
		this.session.on('ready', () => {
			this.setState({ ready: true });
		});
		this.session.on('local-video-dimensions', this.onLocalVideoDimensions);
		this.session.on('remote-connect', () => this.setState({ hasRemote: true }));
		this.session.on('remote-hangup', () => this.setState({ hasRemote: false }));
		this.session.on('disconnect', () => this.setState({ isSearching: false }));
		this.session.getIceServers();
	}
	
	onLocalVideoDimensions(videoWidth, videoHeight) {
		this.setState({
			clientVideoWidth: videoWidth,
			clientVideoHeight: videoHeight
		});
	}
	
	getLocalVideoEl(el) {
		return this.myVideoEl = el;
	}

	toggleStart() {
		let isSearching = !this.state.isSearching;
		let remoteStatus = this.state.remoteStatus;
		
		if(isSearching) {
			remoteStatus = RemoteStatus.STARTED_NO_REMOTE;
		} else {
			remoteStatus = RemoteStatus.NO_REMOTE;
		}
		
		this.setState({ isSearching: isSearching, remoteStatus: remoteStatus });
		
		if(isSearching) {
			this.session.start();
		} else {
			this.session.stop();
		}
	}
	
	handleNext() {
		this.session.next();
	}
  
  handleMuteMyAudio(e, isInputChecked) {
	  this.setState({ muteLocalAudio: !this.state.muteLocalAudio });
	  this.session.toggleLocalAudio();
	  Store.set('muteLocalAudio', isInputChecked);
  }
  
  handleMuteMyVideo(e, isInputChecked) {
	  this.setState({ muteLocalVideo: !this.state.muteLocalVideo });
	  this.session.toggleLocalVideo();
	  Store.set('muteLocalVideo', isInputChecked);
  }
  /*
	renderLocalOverlay() {
		const { muteLocalAudio, muteLocalVideo } = this.state;
		if(muteLocalAudio || muteLocalVideo) {
			return (
				<div style={styles.videoOverlay}>
				
					<div style={styles.chipsWrapper}>
						{muteLocalAudio ? 
							 <Chip backgroundColor={Color.lightBlue600} labelColor="white" style={styles.overlayChip}>
								<Avatar backgroundColor={Color.blue900} color={Color.lightBlue600} icon={<FontIcon className="material-icons">mic_off</FontIcon>} />
								Michrophone muted
							</Chip> :
							''
						}
						
						{muteLocalVideo ? 
							 <Chip backgroundColor={Color.lightBlue600} labelColor="white" style={styles.overlayChip}>
								<Avatar backgroundColor={Color.blue900} color={Color.lightBlue600} icon={<FontIcon className="material-icons">webcam_off</FontIcon>} />
								Camera muted
							</Chip> :
							''
						}
					</div>
				
				</div>
			);
		}
	}*/
	
	renderRemoteOverlay() {
		if(this.state.hasRemote) return null;
		
		const { muteLocalAudio, muteLocalVideo } = this.state;
		return (
			<div style={[styles.videoOverlay, styles.videoOverlayText, { webkitTapHighlightColor: 'rgba(0, 0, 0, 0)' }]}>
				<Typography.Body1>{this.state.remoteStatus}</Typography.Body1>
			</div>
		);
	}

	render() {
		return (
			<div>
				<WebRTCSupport>
					{this.renderMinimal()}
				</WebRTCSupport>
				<WebRTCNoSupport>
					<NotSupported />
				</WebRTCNoSupport>
			</div>
		);
	}
	
	renderMinimal() {
		const { hasRemote, optimalClientVideoWidth, windowHeight, isSearching, muteLocalAudio, muteLocalVideo } = this.state;
		styleMinimal.base.height = windowHeight;
		return (
			<div style={styleMinimal.base}>
				<div style={{ height: '100%', backgroundColor: '#222', position: 'relative' }}>
					{this.renderRemoteOverlay()}
					<video style={[styles.video]} ref={el => this.otherVideoEl = el } autoPlay />
					
					<Toolbar videoWidth={this.state.clientVideoWidth} 
							 videoHeight={this.state.clientVideoHeight}
							 handleStartStop={this.toggleStart}
							 handleNext={this.handleNext}
							 getVideo={this.getLocalVideoEl}
							 hasStarted={this.state.isSearching}
							 hasRemote={this.state.hasRemote}
							 handleMuteMyAudio={this.handleMuteMyAudio}
							 handleMuteMyVideo={this.handleMuteMyVideo}
							 muteLocalAudio={this.state.muteLocalAudio}
							 muteLocalVideo={this.state.muteLocalVideo} />
				</div>
			</div>
		);
	}
}

export default Radium(ChatRoulette);
