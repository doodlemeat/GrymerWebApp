import DetectRTC from 'detectrtc';
import React from 'react';

export default class extends React.Component {
	render() {
		const isSupported = DetectRTC.isWebRTCSupported;
		
		if(!isSupported) {
			return <div>{this.props.children}</div>;
		}
		
		return null;
	}
}