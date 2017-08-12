import React from 'react';
import Drawer from 'material-ui/Drawer';
import { connect } from 'react-redux';
import Subheader from 'material-ui/Subheader';
import {List, ListItem, makeSelectable } from 'material-ui/List';
import VideoCamIcon from 'material-ui/svg-icons/av/videocam';
import MicIcon from 'material-ui/svg-icons/av/mic';
import SelectedIcon from 'material-ui/svg-icons/action/done';
import PropTypes from 'prop-types';
import { selectVideoDevice, selectAudioDevice } from '../../actions';

let SelectableList = makeSelectable(List);

class ControlPanel extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.handleChangeVideoDevice = this.handleChangeVideoDevice.bind(this);
		this.handleChangeAudioDevice = this.handleChangeAudioDevice.bind(this);
	}
	
	onClickAudioDevice(event) {
		console.log(event);
	}
	
	onClickVideoDevice(event) {
		console.log(event);
	}
	
	getAudioDevices() {
		return this.props.audioDevices.map((device, index) => {
			return (
				<ListItem value={device.deviceId} key={index} primaryText={device.label} />
			);
		});
	}
	
	getVideoDevices() {
		return this.props.videoDevices.map((device, index) => {
			return (
				<ListItem value={device.deviceId} key={index} primaryText={device.label} />
			);
		});
	}
	
	handleChangeAudioDevice(event, value) {
		if(value) {
			this.props.selectAudioDevice(value);
		}
	}
	
	handleChangeVideoDevice(event, value) {
		if(value) {
			this.props.selectVideoDevice(value);
		}
	}
	
	render() {
		const {
			open
		} = this.props;
		
		return (
			<Drawer open={open} docked={false} onRequestChange={this.props.onRequestChangeNavDrawer}>
				<List>
					<Subheader>Inställningar</Subheader>
					<SelectableList value={this.props.selectedVideoDevice} onChange={this.handleChangeVideoDevice} style={{ padding: 0 }}>
						<ListItem
							primaryText="Välj kamera"
							leftIcon={<VideoCamIcon />}
							initiallyOpen={false}
							primaryTogglesNestedList={true}
							nestedItems={this.getVideoDevices()}
						/>
					</SelectableList>
					<SelectableList value={this.props.selectedAudioDevice} onChange={this.handleChangeAudioDevice} style={{ padding: 0 }}>
						<ListItem
							primaryText="Välj mikrofon"
							leftIcon={<MicIcon />}
							initiallyOpen={false}
							primaryTogglesNestedList={true}
							nestedItems={this.getAudioDevices()}
						/>
					</SelectableList>
				</List>
			</Drawer>
		);
	}
};

function mapStateToProps(state) {
	return {
		audioDevices: state.audioDevices,
		videoDevices: state.videoDevices,
		selectedAudioDevice: state.selectedAudioDevice,
		selectedVideoDevice: state.selectedVideoDevice
	};
}

function mapDispatchToProps(dispatch) {
	return {
		selectVideoDevice: (deviceId) => dispatch(selectVideoDevice(deviceId)),
		selectAudioDevice: (deviceId) => dispatch(selectAudioDevice(deviceId))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);