import React from 'react';
import { connect } from "react-redux";
import { StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView, Image, ActivityIndicator, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as actions from '../../redux/actions/chat';
import { HOST_URL } from "../../setting";

class Contactos extends React.Component {

  constructor(props) {
    super(props)
    this.state = {refreshing: false, loading: true, contacts: []}    
    this.setChatsList();
  }

  async setChatsList () {
    try {
      var chats_list = await AsyncStorage.getItem('chats_list');
      if (chats_list != null) {
        chats_list = JSON.parse(chats_list);
        this.setState({contacts: chats_list, loading: false});
        try {
          const response = await fetch(`${ HOST_URL }/api/chat/contactos/${ this.props.username }/`);
          const json = await response.json();          
          if (chats_list.length != json.chats_list.length) {
            this.saveChatsList(json.chats_list);
            this.setState({contacts: json.chats_list});
          }
        } catch (error) {
          console.log(error);
        };
      } else {
        try {
          const response = await fetch(`${ HOST_URL }/api/chat/contactos/${ this.props.username }/`);
          const json = await response.json();
          this.saveChatsList(json.chats_list);
          this.setState({contacts: json.chats_list});
        } catch (error) {
          console.log(error);
        }
      }
    } catch(e) {
      console.log(e)
    }
  };

  setContacts(contacts) {
    this.setState({ contacts: contacts});
    this.saveChatsList(contacts);
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
    this.setChatsList();
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
                <Text style={styles.postTime}>"0"</Text>
              </View>
              <Text style={styles.messageText}>"mensaje aqui"</Text>
            </View>
          </View>
        </TouchableOpacity>
      ));
    } else {
      console.log("renderContacts " + contacts);
    }    
  };

  render() {
    const { loading, contacts } = this.state;
    const token = this.props.token;
    return (
      <View style={styles.container}>
      <StatusBar backgroundColor='#694fad' barStyle='light-content' />
        { token ?
        loading ? <ActivityIndicator size="large" /> : (
          <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {this.renderContacts(contacts)}
        </ScrollView>
        )
        :
        <View style={styles.container}>
          <Text>Debe autenticarse para user el chat!</Text>
          <TouchableOpacity style={{marginTop: 30}}
            onPress={() => this.props.navigation.navigate('Login')}>
            <Text>Entrar!</Text>
          </TouchableOpacity>
        </View>
        }        
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
    justifyContent: 'center',
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