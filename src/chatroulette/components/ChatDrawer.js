import React from 'react';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import Typography from '@react-mdc/typography';
import { lightBlue800, grey300 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import SendIcon from 'material-ui/svg-icons/content/send';
import { connect } from 'react-redux';
import { writeMessage } from '../../actions';
import ChatListItem from './ChatListItem';

const styles = {
	chatItemStyle: {
		width: '80%',
		padding: 6,
		marginBottom: 6,
		backgroundColor: grey300
	},

	chatItemMyself: {
		float: 'right',
		backgroundColor: lightBlue800,
		color: 'white',
	},
	
	clearFix: {
		clear: 'both'
	},

	drawerStyle: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	
	chatItems: {
		flexGrow: 1,
		padding: 6,
		overflow: 'auto',
		background: 'blue'
	}
}

class ChatDrawer extends React.Component {
	constructor(props) {
		super(props);
		
		this.handleOnSend = this.handleOnSend.bind(this);
	}
	
	handleOnSend() {
		//if(!this.props.hasPartner) return;
		
		this.props.onWriteMessage(this.textField.input.refs.input.value);
		
		this.textField.input.refs.input.value = '';
	}
	
	renderChatItem(message, key) {
		return <ChatListItem key={key} from={message.from} message={message.message}></ChatListItem>;
	}
	
	componentDidUpdate() {
		this.scrollEl.scrollTop = this.scrollEl.scrollHeight;
	}
	
	render() {
		const {
			open
		} = this.props;
		
		const chatItems = this.props.messages.map((message, index) => this.renderChatItem(message, index));
		
		return (
			<Drawer openSecondary={true} open={open} docked={false} onRequestChange={this.props.onRequestChangeNavDrawer}>
				<div style={styles.drawerStyle}>
					<div style={styles.chatItems} ref={el => this.scrollEl = el}>{chatItems}</div>
					<div style={{ padding: 6, paddingBottom: 0, paddingTop: 0, flexShrink: 0, display: 'flex', alignItems: 'flex-end' }}>
						<div style={{ flexGrow: 1 }}>
							<TextField
							  hintText="Skriv ett meddelande..."
							  multiLine={true}
							  rows={1}
							  rowsMax={4}
							  fullWidth={true}
							  style={{ transition: 'none' }}
							  ref={el => this.textField = el}
							/>
						</div>
						<SendIcon color={lightBlue800} style={{ marginLeft: 6, marginBottom: 8 }} onClick={this.handleOnSend} />
					</div>
				</div>
			</Drawer>
		);
	}
};

function mapStateToProps(state) {
	return {
		messages: state.messages,
		hasPartner: state.hasPartner
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onWriteMessage: message => dispatch(writeMessage(message))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatDrawer);