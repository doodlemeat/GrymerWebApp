import * as EventEmitter from 'wolfy87-eventemitter';
import axios from './axios';

class Session extends EventEmitter {
	constructor(options) {
		super();
		this.options = options;
		
		this.closed = false;
		this._started = false;
		this._pc = null;
		this._localStream = null;
		this._remoteStream = null;
		this.peerConnectionConfig = {};
		this._isConnected = false;
		
		this._handleAddStream = this._handleAddStream.bind(this);
	}
	
	_onInitiateOffer() {
		this._initConnection();
		
		return this._pc.createOffer()
			.then(offer => {
				this._pc.setLocalDescription(offer);
				return Promise.resolve(this._pc.localDescription);
			})
			.catch(error => console.error(error.name, ':', error.message));
	}
	
	_onReceiveOffer(sdp) {
		this._initConnection();
		return this._pc.setRemoteDescription(sdp)
			.then(() => this._pc.createAnswer())
			.then(answer => {
				this._pc.setLocalDescription(answer);
				return Promise.resolve(this._pc.localDescription);
			})
			.catch(error => console.error(error.name, ':', error.message));
	}
	
	_onReceiveAnswer(sdp) {
		if(!this._pc) return;
		this._pc.setRemoteDescription(sdp).catch(error => console.error(error.name, ':', error.message));
	}
	
	_onReceiveIceCandidate(candidate) {
		if(!this._pc) return;
		
		this._pc.addIceCandidate(new RTCIceCandidate(candidate))
			.catch(error => console.error(error.name, ':', error.message));
	}
	
	setLocalVideoElement(videoEl) {
		this._localVideo = videoEl;
	}
	
	setRemoteVideoElement(videoEl) {
		this._remoteVideo = videoEl;
	}
	
	startLocalVideo(options) {
		if(!this._localVideo) {
			return console.error('Has no local video element set');
		}
		
		const mediaConstraints = { video: true, audio: true };
		return navigator.mediaDevices.getUserMedia(mediaConstraints).then(stream => {
			this._localStream = stream;
			this._localVideo.srcObject = this._localStream;
			this._localVideo.onloadedmetadata = e => {
				if(options.muteLocalAudio) {
					this.toggleLocalAudio();
				}
				
				if(options.muteLocalVideo) {
					this.toggleLocalVideo();
				}
				this.emit('local-video-dimensions', e.target.videoWidth, e.target.videoHeight);
			};
		});
	}
	
	refreshLocalVideo() {
		this._localVideo.srcObject = this._localStream;
	}
	
	getIceServers() {
		axios.get('/ice-servers').then(response => {
			this.peerConnectionConfig.iceServers = response.data; 
		});
	}
	
	toggleLocalVideo() {
		if(!this._localStream) return;
		
		const tracks = this._localStream.getVideoTracks();
		tracks.forEach(track => track.enabled = !track.enabled);
	}
	
	toggleLocalAudio() {
		if(!this._localStream) return;
		
		const tracks = this._localStream.getAudioTracks();
		tracks.forEach(track => track.enabled = !track.enabled);
	}
	
	_initConnection() {
		if(this._pc) return;
		
		if(!this._localStream) {
			return console.error('Local stream is not set');
		}
		this._pc = new RTCPeerConnection(this.peerConnectionConfig);
		this._pc.addStream(this._localStream);
		this._pc.onaddstream = this._handleAddStream;
		
		this._pc.onicecandidate = (event) => {
			if(event.candidate) {
				this.emit('ice-candidate', event.candidate);
			}
		};
	}
	
	_handleAddStream(event) {
		if(this._remoteStream) return;
		if(!this._remoteVideo) return;
		
		this._remoteStream = event.stream;
		this._remoteVideo.srcObject = event.stream;
		
		console.log(event.stream);
		
		this.emit('remote-stream', this._remoteStream);
	}
	
	close() {
		if(this._pc) {
			this._pc.close();
			this._pc = null;
			
			this._closeRemoteStream();
		}
	}
	
	_closeRemoteStream() {
		if(!this._remoteStream) return;
		
		this._remoteStream.getTracks().forEach(track => track.stop());
		
		this._remoteVideo.srcObject = undefined;
		this._remoteStream = null;
		this.emit('remote-hangup');
	}
}

export default new Session();