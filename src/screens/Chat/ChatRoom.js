import React from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';

import WebSocketInstance from '../../websocket';


class ChatRoom extends React.Component {

  constructor(props) {
    super(props)
    this.state = {refreshing: false}
    WebSocketInstance.connect(this.props.chatId);
    this.waitForSocketConnection(() => {
      WebSocketInstance.addCallbacks(
        this.messages.bind(this),
        this.messages.bind(this),
        this.newMessage.bind(this));
      WebSocketInstance.messages(this.props.username, this.props.chatId);
    })    
  }

  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(
      function() {
        if (WebSocketInstance.state() === 1) {
          console.log('conexion segura');
          if (callback != null) {
            callback();
            return;
          }
        } else {
          console.log('esperando conexion');
          component.waitForSocketConnection(callback);
        }
      }, 100);    
  }

  messages(mensajes) {
    this.setState({messages: mensajes.reverse()});
  }

  newMessage(message) {
    /* if (message.autor != this.props.username) {
      this.setState({
        messages : [...this.state.messages, message]
      });
    }; */   
    this.setState({
      messages : [message, ...this.state.messages]
    });
  }

  onRefresh = () => {
    this.setState({ refreshing: true});
    WebSocketInstance.messages(this.props.username, this.props.chatId);
    this.setState({ refreshing: false});
  };

  setDate = (date) =>{
    return new Date(date.slice(0, 10) + "T" +date.slice(11, 19))
  }

  renderMessage = (message) => {
    return (
        {
          _id: message.id,
          text: message.contenido,
          createdAt: this.setDate(message.fecha),
          user: {
            _id: message.autor === this.props.username ? 1 : 2,
          },
          sent: true,
          received: true,
          pending: true
        }
      ) 
  };

  renderMessages = (messages) => {
    if (messages != undefined) {
      return messages.map((message) => (
        {
          _id: message.id,
          text: message.contenido,
          createdAt: this.setDate(message.fecha),
          user: {
            _id: message.autor === this.props.username ? 1 : 2,
          },
          sent: true,
          received: true,
          pending: true
        }
      ));
    } else {
      console.log("renderMessages " + messages);
    }    
  };

  sendMessage = (message) => {    
    WebSocketInstance.sendMessage({
      accion: 'mensaje_nuevo',
        data: {
            usuario: this.props.username,
            id: this.props.chatId,
            mensaje: message[0]['text']
        }
    });
  }

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#694fad',
          },
          left: {
            backgroundColor: '#0985',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },          
        }}
      />
    );
  }

  scrollToBottomComponent = () => {
    return(
      <Ionicons name="arrow-down-circle" size={22} />
    )
  }

  renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <Ionicons
            name="send"
            style={{marginBottom: 5, marginRight: 5}}
            size={32}
            color="#694fad"
          />
        </View>
      </Send>
    )
  }

  render () {
    return (
      <GiftedChat
        messages={this.renderMessages(this.state.messages)}
        onSend={messages => this.sendMessage(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={this.renderBubble}
        scrollToBottom
        scrollToBottomComponent={this.scrollToBottomComponent}
        placeholder='Escriba su mensaje...'
        alwaysShowSend
        renderSend={this.renderSend}
      />    
    )  
  };
};

const mapStateToProps = (state) => {
  return {
    username: state.authReducer.username,
    chatId: state.chatReducer.chatId
  }
};

const mapDispatchToProps = dispatch => {
  return {
    updateChatDetails: (chatId, contacto) =>
      dispatch(actions.updateChatDetails(chatId, contacto)),    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);