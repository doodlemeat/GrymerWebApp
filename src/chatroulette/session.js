import * as EventEmitter from 'wolfy87-eventemitter';
import axios from './axios';
import io from 'socket.io-client';
import React from 'react';

export class Session extends EventEmitter {
	constructor(options) {
		super();
		this.options = options;
		
		this.io = io('https://dev.signaling.grymer.se');
		this.closed = false;
		this._started = false;
		this._pc = null;
		this._localStream = null;
		this._remoteStream = null;
		this._localVideo = options.localVideo;
		this._remoteVideo = options.remoteVideo;
		this.peerConnectionConfig = {};
		this._isConnected = false;
		
		this._onInitiateOffer = this._onInitiateOffer.bind(this);
		this._onReceiveOffer = this._onReceiveOffer.bind(this);
		this._onReceiveAnswer = this._onReceiveAnswer.bind(this);
		this._onReceiveIceCandidate = this._onReceiveIceCandidate.bind(this);
		this._onRemoteHangup = this._onRemoteHangup.bind(this);
		this._onSignalingDisconnect = this._onSignalingDisconnect.bind(this);
		this._handleTrack = this._handleTrack.bind(this);
		this._handleAddStream = this._handleAddStream.bind(this);
		
		this._setupSignalListeners();
		
		if(options.autoRequestMedia) {
			this._startLocalVideo();
		}
	}
	
	_setupSignalListeners() {
		this.io.on('initiate-offer', this._onInitiateOffer);
		this.io.on('create-answer', this._onReceiveOffer);
		this.io.on('answer', this._onReceiveAnswer);
		this.io.on('ice-candidate', this._onReceiveIceCandidate);
		this.io.on('remote-hangup', this._onRemoteHangup);
		this.io.on('disconnect', this._onSignalingDisconnect);
	}
	
	_onInitiateOffer() {
		this._initConnection();
		this._pc.createDataChannel('chat');
		
		this._pc.createOffer()
			.then(offer => this._pc.setLocalDescription(offer))
			.then(() => this.io.emit('offer-created', this._pc.localDescription))
			.catch(error => console.error(error.name, ':', error.message));
	}
	
	_onReceiveOffer(data) {
		this._initConnection();
		console.log(data);
		this._pc.setRemoteDescription(data)
			.then(() => this._pc.createAnswer())
			.then(answer => this._pc.setLocalDescription(answer))
			.then(() => this.io.emit('answer-created', this._pc.localDescription))
			.catch(error => console.error(error.name, ':', error.message));
	}
	
	_onReceiveAnswer(sdp) {
		if(!this._pc) return;
		console.log('Receive answer');
		this._pc.setRemoteDescription(sdp).catch((e) => {this._close(); console.log(e)});
	}
	
	_onReceiveIceCandidate(candidate) {
		if(!this._pc) return;
		
		this._pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {
			console.log(1, arguments);
		}).catch(() => console.log(998));
	}
	
	_onRemoteHangup() {
		console.log('Remote hangup');
		this._close();
	}
	
	_onSignalingDisconnect() {
		console.log('Signaling disconnect');
		this.emit('disconnect');
		this._close(false);
	}
	
	_startLocalVideo() {
		const mediaConstraints = { video: true, audio: true };
		return navigator.mediaDevices.getUserMedia(mediaConstraints).then(stream => {
			this._localStream = stream;
			this._localVideo.srcObject = this._localStream;
			this._localVideo.onloadedmetadata = e => {
				if(this.options.muteLocalAudio) {
					this.toggleLocalAudio();
				}
				
				if(this.options.muteLocalVideo) {
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
		const tracks = this._localStream.getVideoTracks();
		tracks.forEach(track => track.enabled = !track.enabled);
	}
	
	toggleLocalAudio() {
		const tracks = this._localStream.getAudioTracks();
		tracks.forEach(track => track.enabled = !track.enabled);
	}
	
	_initConnection() {
		if(this._pc) return;
		
		if(!this._localStream) {
			return console.error('Local stream is not set');
		}
		this._pc = new RTCPeerConnection(this.peerConnectionConfig);
		console.log(this._pc.connectionState);
		this._pc.addStream(this._localStream);
		this._pc.onaddstream = this._handleAddStream;
		this._pc.onnegotiationneeded = () => {
			if (this.connectionState === 'closed') {
				this.connectionState = 'connecting'
				this.socket.emit('look for peer')
			}
		};
		this._pc.onsignalingstatechange = (e) => {
			//console.log(this._pc.signalingState);
		};
		
		this._pc.onicecandidate = (event) => {
			if(event.candidate) {
			  this.io.emit('ice-candidate', {
				candidate: event.candidate
			  })
			}
		};
	}
	
	_handleTrack(event) {
		if(this._remoteStream) return;
		this._remoteStream = event.streams[0];
		this._remoteVideo.srcObject = event.streams[0];
		
		this.emit('remote-connect', this._remoteStream);
	}
	
	_handleAddStream(event) {
		if(this._remoteStream) return;
		this._remoteStream = event.stream;
		this._remoteVideo.srcObject = event.stream;
		
		this.emit('remote-connect', this._remoteStream);
	}
	
	_close() {
		if(this._pc) {
			this._pc.close();
			this._pc = null;
			
			this._closeRemoteStream();
		}
	}
	
	start() {
		this.io.emit('search');
	}
	
	stop() {
		this.io.emit('stop-search');
		this._close();
	}
	
	next() {
		this._close();
		this.io.emit('next');
	}
	
	_closeRemoteStream() {
		if(!this._remoteStream) return;
		
		this._remoteStream.getTracks().forEach(track => track.stop());
		
		this._remoteVideo.srcObject = undefined;
		this._remoteStream = null;
		this.emit('remote-hangup');
	}
}

export const RemoteStatus = {
	NO_REMOTE: (
		<span>Du har ingen partner.<br />Tryck på START för att börja.</span>
	),
	STARTED_NO_REMOTE: (
		<span>Söker efter en partner...</span>
	)
};