import React from 'react';
import LocalVideo from './LocalVideo';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';

class UpdateStatus extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return null;
	}
}

function mapStateToProps(state) {
	return {
		status: state.status
	};
}

function mapDispatchToProps() {
	return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateStatus);