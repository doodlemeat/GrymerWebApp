import React, { Component } from 'react';
import LocalVideo from './LocalVideo';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { toggleSearch, searchNext } from '../../actions';

class Toolbar extends Component {
	render() {
		return (
			<div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
			
				<LocalVideo offset={20}
							maxSize={90}
							videoWidth={this.props.videoWidth}
							videoHeight={this.props.videoHeight} />
							
				<div style={{ display: 'flex', overflow: 'hidden' }}>
					<RaisedButton
								style={{ flexGrow: '1', borderRadius: 0 }}
								onClick={this.props.toggleSearch}
								disabled={this.props.hasSignalingConnection ? false : true}
								label={this.props.isSearching ? 'Stopp' : 'Start'}
								icon={<FontIcon className="material-icons">{this.props.isSearching ? 'stop' : 'play_arrow'}</FontIcon>} />
					<RaisedButton  
								style={{ flexGrow: '1', borderRadius: 0 }}
								onClick={this.props.searchNext}
								label="Nästa"
								disabled={this.props.hasPartner ? false : true}
								icon={<FontIcon className="material-icons">skip_next</FontIcon>} />
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		isSearching: state.isSearching,
		hasPartner: state.hasPartner,
		hasSignalingConnection: state.hasSignalingConnection
	};
}

function mapDispatchToProps(dispatch) {
	return {
		toggleSearch: () => dispatch(toggleSearch()),
		searchNext: () => dispatch(searchNext())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);