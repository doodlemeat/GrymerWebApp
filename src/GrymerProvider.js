import { Component, Children } from 'react';
import PropTypes from 'prop-types';

class GrymerProvider extends Component {
	getChildContext() {
		return {
			grymer: this['grymer']
		};
	}
	
	constructor(props, context) {
		super(props, context);
		this['grymer'] = props.grymer;
	}
	
	render() {
		return Children.only(this.props.children);
	}
}

GrymerProvider.childContextTypes = {
	grymer: PropTypes.object.isRequired
};

export default GrymerProvider;