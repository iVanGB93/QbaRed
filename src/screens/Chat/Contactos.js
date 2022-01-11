import React from 'react';
import { connect } from "react-redux";
import { StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSelector, useDispatch } from 'react-redux';
import WebSocketInstance from '../../websocket';
import * as actions from '../../redux/actions/chat';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

class Contactos extends React.Component {

  constructor(props) {
    super(props)
    this.state = {refreshing: false, contacts: []}
    /* WebSocketInstance.connect('usuarios');
    this.waitForSocketConnection(() => {
      WebSocketInstance.addCallbacks(
        this.setContacts.bind(this));
      WebSocketInstance.chats_list('iVan');
    }) */
    this.getChatsList();
  }

  /* waitForSocketConnection(callback) {
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
  } */

  setContacts(contacts) {
    this.setState({ contacts: contacts});
    this.saveChatsList(contacts);
  }

  getChatsList = async () => {
    try {
      var chats_list = await AsyncStorage.getItem('chats_list')
      if (chats_list != null) {
        chats_list = JSON.parse(chats_list);
        this.setState({contacts : chats_list});
      } else {
        return
      }
    } catch(e) {
      console.log(e)
    }
  }

  saveChatsList = async (chats_list) => {
    try {
      const jsonCL = JSON.stringify(chats_list)
      await AsyncStorage.setItem('chats_list', jsonCL)
    } catch(e) {
      console.log(e)
    }
  }
  
  chatRoom = (chatId, contacto) => {
    this.props.updateChatDetails(chatId, contacto);
    this.props.navigation.navigate('ChatRoom');
  }

  onRefresh = () => {
    this.setState({ refreshing: true});
    WebSocketInstance.chats_list(this.props.username);
    this.setState({ refreshing: false});
  };

  renderContacts = contacts => {
    if (contacts != undefined) {
      return contacts.map((contact) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => this.chatRoom(contact.id, contact.contacto)}
          key={contact.id}
        >
          <View style={styles.userInfo}>
            <View style={styles.userImageWrapper}>
              <Image source={require('../../../assets/defaultUserImage.jpg')} style={styles.userImage}></Image>
            </View>
            <View style={styles.textSection}>
              <View style={styles.userInfoText}>
                <Text style={styles.username}>{contact.contacto}</Text>
                <Text style={styles.postTime}>{contact.mensajes_nuevos}</Text>
              </View>
              <Text style={styles.messageText}>{contact.ultimo_mensaje}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ));
    } else {
      console.log("renderContacts " + contacts);
    }    
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {this.renderContacts(this.state.contacts)}
        </ScrollView>
      </View> 
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.authReducer.username,
    token: state.authReducer.token,
    chatId: state.chatReducer.chatId
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
    flex: 1,
    padding: 0,
    margin: 0,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  card: {
    
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    paddingLeft: 0,
    marginLeft: 10,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  userInfoText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  postTime: {
    fontSize: 12,
    color: '#666',
  },
  messageText: {
    fontSize: 14,
    color: '#333333',
  },
  userImageWrapper: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Contactos);