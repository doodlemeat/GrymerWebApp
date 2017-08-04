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
import { connect } from 'react-redux';
import { sendICECandidate, setupRemoteVideoElement } from '../actions';

//import { Session, RemoteStatus } from './session';

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

	constructor() {
		super();
		
		this.state = {
			clientVideoWidth: 90,
			clientVideoHeight: 90,
			orientationAngle: false,
			windowHeight: $(window).height(),
			navDrawerOpen: false
		};
		this.onResize = this.onResize.bind(this);
		this.onOrientationChange = this.onOrientationChange.bind(this);
		this.onLocalVideoDimensions = this.onLocalVideoDimensions.bind(this);
		this.handleChangRequestChatDrawer = this.handleChangRequestChatDrawer.bind(this);
		this.handleOnChatToggle = this.handleOnChatToggle.bind(this);
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
				<Typography.Body2>Välkommen till Grymer.se</Typography.Body2>
				<Typography.Body1>En social plattform för anonyma och sociala.</Typography.Body1>
				<Typography.Body1>Du har ingen partner.<br />Tryck på START för att börja.</Typography.Body1>
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
	
	handleChangRequestChatDrawer(open) {
		this.setState({ navDrawerOpen: open });
	}

	render() {
		return (
			<div>
				<WebRTCSupport>
					{this.renderMinimal()}
					<ChatDrawer open={this.state.navDrawerOpen} onRequestChangeNavDrawer={this.handleChangRequestChatDrawer} />
				</WebRTCSupport>
				<WebRTCNoSupport>
					<NotSupported />
				</WebRTCNoSupport>
			</div>
		);
	}
	
	handleOnChatToggle() {
		this.setState({
			navDrawerOpen: !this.state.navDrawerOpen
		});
	}
	
	renderMinimal() {
		const { windowHeight } = this.state;
		styleMinimal.base.height = windowHeight;
		return (
			<div style={styleMinimal.base}>
				<div style={{ height: '100%', backgroundColor: '#222', position: 'relative' }}>
					{this.renderRemoteOverlay()}
					<video style={[styles.video]} ref={el => this.otherVideoEl = el } autoPlay />
					
					<div style={{ position: 'absolute', top: 0, right: 0 }}>
						<Badge
							primary={true}
							badgeContent=""
							badgeStyle={{width: 8, height: 8, top: 30, right: 30}}
							>
							<IconButton onClick={this.handleOnChatToggle}>
								<ChatIcon color="#FFF" />
							</IconButton>
						</Badge>
					</div>
					
					<Toolbar videoWidth={this.state.clientVideoWidth} 
							 videoHeight={this.state.clientVideoHeight} />
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		isSearching: state.isSearching,
		hasPartner: state.hasPartner
	};
}

function mapDispatchToProps(dispatch) {
	return {
		sendICECandidate: candidate => dispatch(sendICECandidate(candidate)),
		setupRemoteVideoElement: (videoEl) => dispatch(setupRemoteVideoElement(videoEl))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Grymer));
