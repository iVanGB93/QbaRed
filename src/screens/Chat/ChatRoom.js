import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Image } from 'react-native';
import { connect } from "react-redux";
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WebSocketInstance from '../../websocket';


class ChatRoom extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loading: true, refreshing: false, messages: []};
    WebSocketInstance.connect(this.props.chatId);
    this.setMessages();
    this.waitForSocketConnection(() => {
      WebSocketInstance.addCallbacks(
        this.messages.bind(this),
        this.newMessage.bind(this));      
        WebSocketInstance.messages(this.props.username, this.props.chatId);
    });
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

  async setMessages() {
    try {
      var messages = await AsyncStorage.getItem(`messages_${ this.props.chatId }`);
      if (messages != null) {
        messages = JSON.parse(messages);
        this.setState({messages: messages, loading: false});
        WebSocketInstance.messages(this.props.username, this.props.chatId);
      } else {
        WebSocketInstance.messages(this.props.username, this.props.chatId);          
      }
    } catch(e) {
      console.log("error obteniendo mensajes asyncstorage", e)
    }
  };

  transformMessage = (message) => {
    return (
      {
        _id: message.id,
        text: message.contenido,
        createdAt: this.setDate(message.fecha),
        user: {
          _id: message.autor === this.props.username ? 1 : 2,
        },
        sent: true,
      }
    );
  };

  saveMessages = async (messages) => {
    var messages = messages.reverse();
    try {
      const jsonM = JSON.stringify(messages)
      await AsyncStorage.setItem(`messages_${ this.props.chatId }`, jsonM);
      this.setState({
        messages : messages,
        loading: false
      });
    } catch(e) {
      console.log("Error guardando los mensajes", e)
    }
  };

  messages(messages) {
    if (messages.length != this.state.messages.length) {
      this.saveMessages(messages.map((message) => (this.transformMessage(message))));    
    } else {
      this.setState({loading: false})
    }
  }

  newMessage(message) {
    if (message.autor != this.props.username) {
      this.setState({
        messages : [this.transformMessage(message), ...this.state.messages]
      });
    } else {
      let newMessages = [...this.state.messages];
      let index = newMessages.findIndex(msg => msg.text === message.contenido);
      newMessages[index] = {...newMessages[index], 'pending': false, 'received': true, '_id': message.id};
      this.setState({messages: newMessages});
      //aqui se envia el informe de entrega//
    };    
  }

  onRefresh = () => {
    this.setState({ refreshing: true});
    WebSocketInstance.messages(this.props.username, this.props.chatId);
    this.setState({ refreshing: false});
  };

  setDate = (date) =>{
    if (date) {
      return new Date(date.slice(0, 10) + "T" +date.slice(11, 19))
    } else {
      return "NaN"
    }
  };

  sendMessage = async (messages) => {
    var message = messages[0];
    message['pending'] = true;
    this.setState({
      messages : [message, ...this.state.messages]
    });
    try {
      const jsonM = JSON.stringify(this.state.messages);
      await AsyncStorage.setItem(`messages_${ this.props.chatId }`, jsonM);
    } catch(e) {
      console.log("Error agregando un mensaje al storage", e)
    };
    WebSocketInstance.sendMessage({
      accion: 'mensaje_nuevo',
        data: {
            usuario: this.props.username,
            id: this.props.chatId,
            mensaje: message['text']
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
      this.state.loading ?
      <View style={styles.containerActivity}>
        <ActivityIndicator size="large" color='#694fad' />
      </View>
      :
      <View style={styles.container}>
        <View style={styles.contacto}>
          <View style={styles.userImageWrapper}>
            <Image source={require('../../../assets/defaultUserImage.jpg')} style={styles.userImage}></Image>
          </View>
          <Text style={styles.text}>{this.props.contacto}</Text>
        </View>
        <GiftedChat
          messages={this.state.messages}
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
          renderAvatar={null}
        />    
      </View>
    )  
  };
};

const mapStateToProps = (state) => {
  return {
    username: state.authReducer.username,
    chatId: state.chatReducer.chatId,
    contacto: state.chatReducer.contacto
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
    flex: 1,
    padding: 0,
    margin: 0,
  },
  containerActivity: {
    flex: 1, 
    backgroundColor: '#0034',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contacto: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: '#0034',
    alignItems: 'center',
    borderBottomColor : '#000',
    borderBottomWidth: 2
  },
  text: {
    color: '#694fad',
    marginLeft: 5,
    fontSize: 20,
  },
  userImageWrapper: {
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 5,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
  }
})