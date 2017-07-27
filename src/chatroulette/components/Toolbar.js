import React from 'react';
import LocalVideo from './LocalVideo';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

export default class extends React.Component {
	render() {
		const { hasStarted, hasRemote } = this.props;
		return (
			<div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
			
				<LocalVideo offset={20}
							maxSize={90}
							videoWidth={this.props.videoWidth}
							videoHeight={this.props.videoHeight}
							getVideo={this.props.getVideo}
						    handleMuteMyAudio={this.props.handleMuteMyAudio}
						    handleMuteMyVideo={this.props.handleMuteMyVideo}
						    muteLocalAudio={this.props.muteLocalAudio}
						    muteLocalVideo={this.props.muteLocalVideo} />
							
				<div style={{ display: 'flex', overflow: 'hidden' }}>
					<RaisedButton
								style={{ flexGrow: '1', borderRadius: 0 }}
								onClick={this.props.handleStartStop}
								label={hasStarted ? 'Stop' : 'Start'}
								icon={<FontIcon className="material-icons">{hasStarted ? 'stop' : 'play_arrow'}</FontIcon>} />
					<RaisedButton  
								style={{ flexGrow: '1', borderRadius: 0 }}
								onClick={this.props.handleNext}
								label="Next"
								disabled={hasRemote ? false : true}
								icon={<FontIcon className="material-icons">skip_next</FontIcon>} />
				</div>
			</div>
		);
	}
}