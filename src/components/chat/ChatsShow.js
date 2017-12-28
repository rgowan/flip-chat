import React from 'react';
import axios from 'axios';

import Auth from '../../lib/Auth';
import Navbar from '../utility/Navbar';

class ChatsShow extends React.Component {
  constructor() {
    super();

    this.state = {
      chat: {},
      message: {
        content: ''
      }
    }
  }

  componentDidMount() {
    axios
      .get(`/api/chats/${this.props.match.params.id}`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}`}
      })
      .then(res => this.setState({ chat: res.data }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
       { this.state.chat.id && <Navbar title={this.state.chat.participants[1].first} /> }
       <div className="container">
        <div className="chat-show">
          <div className="messages-container">
            { this.state.chat.id && <ul>
              { this.state.chat.messages.map(message => 
                <li key={message.id} className={"message-container " + (message.createdBy.id === Auth.getPayload() .id ? 'right': 'left') }>
                  <p>{ message.content }</p>
                </li>
              )}
            </ul> }
          </div>
          <hr />
          <div className="new-message-container">
              <form>
                <textarea></textarea>
                <button className="submit">Send</button>
              </form>
          </div>
        </div>
       </div>
      </div>
    );
  }
}

export default ChatsShow;