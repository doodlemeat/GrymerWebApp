import React from 'react';
import $ from 'jquery';
import Radium from 'radium';
import Typography from '@react-mdc/typography';
import WebRTCSupport from './webrtc-support';
import WebRTCNoSupport from './webrtc-no-support';
import NotSupported from './not-supported.js';
import Toolbar from './components/Toolbar';
import ChatDrawer from './components/ChatDrawer';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import ControlPanelIcon from 'material-ui/svg-icons/navigation/more-vert';
import { connect } from 'react-redux';
import { sendICECandidate, setupRemoteVideoElement, toggleChat, toggleControlPanel } from '../actions';
import Sound from 'react-sound';
import notification from '../notification.ogg';
import ControlPanel from './components/ControlPanel';

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

class Grymer extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = {
			clientVideoWidth: 90,
			clientVideoHeight: 90,
			orientationAngle: false,
			windowHeight: $(window).height(),
			playNotification: Sound.status.STOPPED,
			lastReceiveMessage: props.lastReceiveMessage
		};
		
		this.onResize = this.onResize.bind(this);
		this.onOrientationChange = this.onOrientationChange.bind(this);
		this.onLocalVideoDimensions = this.onLocalVideoDimensions.bind(this);
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
		
		this.props.setupRemoteVideoElement(this.otherVideoEl);
	}
	
	onLocalVideoDimensions(videoWidth, videoHeight) {
		this.setState({
			clientVideoWidth: videoWidth,
			clientVideoHeight: videoHeight
		});
	}
	
	handleNext() {
		this.session.close();
		this.props.onNext();
	}
	
	renderRemoteOverlay() {
		if(this.props.hasPartner) return null;
		
		let status = (
			<div>
				{/*<Typography.Body2>Välkommen till Grymer.se</Typography.Body2>
				<Typography.Body1>Perfekt för dig som är eller vill bli social.</Typography.Body1>*/}
				<Typography.Body1>Du har ingen partner.<br />Tryck på STARTA för att börja.</Typography.Body1>
			</div>
		);
		
		if(this.props.isSearching) {
			status = <Typography.Body1>Söker efter en partner...</Typography.Body1>;
		}
		
		return (
			<div style={[styles.videoOverlay, styles.videoOverlayText, { textAlign: 'center' }]}>
				{status}
			</div>
		);
	}
	
	componentWillReceiveProps(newProps) {
		if(this.state.lastReceiveMessage !== newProps.lastReceiveMessage) {
			this.setState({
				lastReceiveMessage: newProps.lastReceiveMessage,
				playNotification: Sound.status.PLAYING
			});
		}
	}

	render() {
		return (
			<div>
				<WebRTCSupport>
					{this.renderMinimal()}
					<ChatDrawer open={this.props.isChatDrawerOpen} onRequestChangeNavDrawer={this.props.toggleChat} />
					<ControlPanel open={this.props.isControlPanelOpen} onRequestChangeNavDrawer={this.props.toggleControlPanel} />
					<Sound
					  url={notification}
					  autoLoad={true}
					  onPlaying={() => this.setState({ playNotification: Sound.status.STOPPED })}
					  playStatus={this.state.playNotification}
					/>
				</WebRTCSupport>
				<WebRTCNoSupport>
					<NotSupported />
				</WebRTCNoSupport>
			</div>
		);
	}
	
	renderUnreadMessagesBadge() {
		if(!this.props.hasUnreadMessages)
			return this.renderToggleChatButton();
		
		return <Badge primary={true} badgeContent="" style={{ padding: 0 }} badgeStyle={{width: 8, height: 8, top: 8, right: 8}}>{this.renderToggleChatButton()}</Badge>;
	}
	
	renderToggleChatButton() {
		return (
			<IconButton onClick={this.props.toggleChat}>
				<ChatIcon color="#FFF" />
			</IconButton>
		);
	}
	
	renderToggleControlPanelButton() {
		return (
			<IconButton onClick={this.props.toggleControlPanel}>
				<ControlPanelIcon color="#FFF" /> 
			</IconButton>
		);
	}
	
	renderMinimal() {
		const { windowHeight } = this.state;
		styleMinimal.base.height = windowHeight;
		return (
			<div style={styleMinimal.base}>
				<div style={{ height: '100%', backgroundColor: '#222', position: 'relative' }}>
					{this.renderRemoteOverlay()}
					<video style={[styles.video]} ref={el => this.otherVideoEl = el } autoPlay />
					
					<div style={{ position: 'absolute', top: 0, left: 0 }}>{this.renderToggleControlPanelButton()}</div>
					<div style={{ position: 'absolute', top: 0, right: 0 }}>{this.renderUnreadMessagesBadge()}</div>
					
					<Toolbar videoWidth={this.state.clientVideoWidth} 
							 videoHeight={this.state.clientVideoHeight} />
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		hasUnreadMessages: state.hasUnreadMessages,
		isSearching: state.isSearching,
		hasPartner: state.hasPartner,
		isChatDrawerOpen: state.isChatDrawerOpen,
		isControlPanelOpen: state.isControlPanelOpen,
		lastReceiveMessage: state.lastReceiveMessage
	};
}

function mapDispatchToProps(dispatch) {
	return {
		sendICECandidate: candidate => dispatch(sendICECandidate(candidate)),
		setupRemoteVideoElement: (videoEl) => dispatch(setupRemoteVideoElement(videoEl)),
		toggleChat: (force) => dispatch(toggleChat(force)),
		toggleControlPanel: (force) => dispatch(toggleControlPanel(force))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Grymer));
