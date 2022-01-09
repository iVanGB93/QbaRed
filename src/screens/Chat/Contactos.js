import React from 'react';
import { connect } from "react-redux";
import { StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import WebSocketInstance from '../../websocket';
import * as actions from '../../redux/actions/chat';

class Contactos extends React.Component {

  constructor(props) {
    super(props)
    this.state = {refreshing: false}
    WebSocketInstance.connect();
    this.waitForSocketConnection(() => {
      WebSocketInstance.addCallbacks(
        this.setMessages.bind(this),
        this.addMessage.bind(this));
      WebSocketInstance.chats_list('iVan');
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

  setMessages(messages) {
    this.setState({ messages: messages.reverse()});
  }

  addMessage(message) {
    this.setState({
      messages: {...this.state.messages, message}
    })
  }
  
  chatRoom = (chatId, contacto) => {
    this.props.updateChatDetails(chatId, contacto);
    WebSocketInstance.disconnect();
    this.props.navigation.navigate('ChatRoom');
  }

  onRefresh = () => {
    this.setState({ refreshing: true});
    WebSocketInstance.chats_list('iVan');
    this.setState({ refreshing: false});
  };

  renderMessages = messages => {
    const currentUser = this.props.username;
    if (messages != undefined) {
      return messages.map((message) => (
        <TouchableOpacity
          style={styles.contacto}
          onPress={() => this.chatRoom(message.id, message.contacto)}
          key={message.id}
        >
          <Text>{message.contacto}</Text>
          <Text>{message.ultimo_mensaje}</Text>
        </TouchableOpacity>
      ));
    } else {
      console.log(messages);
    }    
  };

  render() {
    return (
      <ScrollView        
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
      {this.renderMessages(this.state.messages)}
      </ScrollView> 
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.username,
    token: state.token,
    chatId: state.chatId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateChatDetails: (chatId, contacto) =>
      dispatch(actions.updateChatDetails(chatId, contacto)),    
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contacto: {
    textAlign: 'center',
    margin: 10,
    backgroundColor: '#f222',
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Contactos);