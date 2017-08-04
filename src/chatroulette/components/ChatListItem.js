import React from 'react';
import Paper from 'material-ui/Paper';
import Typography from '@react-mdc/typography';
import { lightBlue800, grey300 } from 'material-ui/styles/colors';
import { style } from 'typestyle';

const className = style({
	width: '80%',
	padding: 6,
	marginBottom: 6
});

const styles = {
	base: {
		width: '80%',
		padding: 6,
		marginBottom: 6,
	},
	
	fromPartner: {
		backgroundColor: grey300,
		float: 'left'
	},
	
	fromMe: {
		float: 'right',
		backgroundColor: lightBlue800,
		color: 'white',
	},
	
	clear: {
		clear: 'both'
	},

	chatTextStyle: {
		margin: 0
	}
}

class ChatListItem extends React.Component {
	render() {
		return (
			<div>
				<Paper className={className}>
					<div style={[
						this.props.from === 'partner' && styles.fromPartner,
						this.props.from === 'me' && styles.fromMe			
					]}>
					<Typography.Body1 style={styles.chatTextStyle}>{this.props.message}</Typography.Body1>
					</div>
				</Paper>
				<div style={styles.clear} />
			</div>
		);
	}
};

export default ChatListItem;