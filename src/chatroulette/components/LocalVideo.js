import React from 'react';
import OptimalResolution from '../optimal-resolution';
import FontIcon from 'material-ui/FontIcon';
import Checkbox from 'material-ui/Checkbox';

export default class extends React.Component {
	render() {
		const offsetFromEdge = this.props.offset;
		const { width, height } = OptimalResolution(this.props.videoWidth, this.props.videoHeight, this.props.maxSize);
		return (
			<div>
				<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', marginBottom: 16 }}>
					<div>
						<Checkbox
							onCheck={this.props.handleMuteMyAudio}
							defaultChecked={this.props.muteLocalAudio}
							iconStyle={{ color: '#FFF' }}
							style={{ flexGrow: 1 }}
							checkedIcon={<FontIcon className="material-icons">mic_off</FontIcon>}
							uncheckedIcon={<FontIcon className="material-icons">mic</FontIcon>} />
					</div>
					<div>					
						<Checkbox
							onCheck={this.props.handleMuteMyVideo}
							defaultChecked={this.props.muteLocalVideo}
							iconStyle={{ color: '#FFF' }}
							style={{ flexGrow: 1 }}
							checkedIcon={<FontIcon className="material-icons">videocam_off</FontIcon>}
							uncheckedIcon={<FontIcon className="material-icons">videocam</FontIcon>} />
					</div>
				</div>
				<video style={{width: width, height: height, marginRight: offsetFromEdge, marginBottom: offsetFromEdge, float: 'right', border: '1px solid white' }} 
					   ref={this.props.getVideo} 
					   autoPlay 
					   muted />
				<div style={{clear: 'both'}}></div>
			</div>
		);
	}
}