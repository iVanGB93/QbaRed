import React from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { connect } from "react-redux";
import { useSelector, useDispatch } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';

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
    this.setState({messages: mensajes});
  }

  newMessage(message) {
    /* if (message.autor != this.props.username) {
      this.setState({
        messages : [...this.state.messages, message]
      });
    }; */   
    this.setState({
      messages : [...this.state.messages, message]
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

  renderMessages = (messages) => {
    if (messages != undefined) {
      messages.reverse();
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

  render () {
    return (
      <GiftedChat
        messages={this.renderMessages(this.state.messages)}
        onSend={messages => this.sendMessage(messages)}
        user={{
          _id: 1,
        }}
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

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    flex:1,
    textAlign: 'center',
    margin: 10,
    backgroundColor: '#f222',
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});