import React from 'react';
import Typography from '@react-mdc/typography';

const styles = {
	base: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	},
	heading: {
		textAlign: 'center'
	}
};

export default class extends React.Component {
	render() {
		return (
			<div style={styles.base}>
				<Typography.Body2 style={styles.heading}>Din webbläsare stödjer inte WebRTC</Typography.Body2>
			</div>
		);
	}
}