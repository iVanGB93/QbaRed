import React from 'react';
import { connect } from "react-redux";
import { StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView, Image, ActivityIndicator, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as actions from '../../redux/actions/chat';
import { HOST_URL } from "../../setting";

class Usuarios extends React.Component {

  constructor(props) {
    super(props)
    this.state = {refreshing: false, loading: true, users: []}    
    this.setUsersList();
  }

  async setUsersList () {
    try {
      var users_list = await AsyncStorage.getItem('users_list');
      if (users_list != null) {
        users_list = JSON.parse(users_list);
        this.setState({users: users_list, loading: false});
        try {
          const response = await fetch(`${ HOST_URL }/api/chat/new_chat/${this.props.username}/${this.props.username}/`);
          const json = await response.json();          
          if (users_list.length != json.users_list.length) {
            this.saveUsersList(json.users_list);
            this.setState({users: json.users_list});
          }
        } catch (error) {
          console.log(error);
        };
      } else {
        try {
          const response = await fetch(`${ HOST_URL }/api/chat/new_chat/${this.props.username}/${this.props.username}/`);
          const json = await response.json();          
          this.saveUsersList(json.users_list);
          this.setState({users: json.users_list, loading: false});
        } catch (error) {
          console.log(error);
        };
      }
    } catch(e) {
      console.log(e)
    }    
  };

  saveUsersList = async (users_list) => {
    try {
      const jsonCL = JSON.stringify(users_list)
      await AsyncStorage.setItem('users_list', jsonCL)
    } catch(e) {
      console.log(e)
    }
  }
  
  newChatRoom = async (contact) => {
    this.setState({loading: true});
    try {
      const response = await fetch(`${ HOST_URL }/api/chat/new_chat/${this.props.username}/${contact}/`, {
        method: 'POST',  
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Token " + this.props.token
        }               
      });
      const json = await response.json();
      const chat_id = json.chat_id;
      this.props.updateChatDetails(chat_id, contact);    
      this.setState({loading: false});
      this.props.navigation.navigate('ChatRoom');
    } catch (error) {
      console.log(error);
    };
  }

  onRefresh = () => {
    this.setState({ refreshing: true});
    this.setUsersList();
    this.setState({ refreshing: false});
  };

  renderUsers = users => {
    if (users != undefined) {
      return users.map((user) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => this.newChatRoom(user.username)}
          key={user.id}
        >
          <View style={styles.userInfo}>
            <View style={styles.userImageWrapper}>
              <Image source={require('../../../assets/defaultUserImage.jpg')} style={styles.userImage}></Image>
            </View>
            <View style={styles.textSection}>
              <View style={styles.userInfoText}>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.postTime}>"0"</Text>
              </View>
              <Text style={styles.messageText}>"escribe algo el mio"</Text>
            </View>
          </View>
        </TouchableOpacity>
      ));
    } else {
      console.log("renderUsers " + users);
    }    
  };

  render() {
    const { loading, users } = this.state;
    const token = this.props.token;
    return (
      loading ? 
      <View style={styles.containerActivity}>
        <ActivityIndicator size="large" color='#694fad' />
      </View>
      :
      <View style={styles.container}>
      <StatusBar backgroundColor='#694fad' barStyle='light-content' />
        { token ?          
          <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {this.renderUsers(users)}
        </ScrollView>        
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
  containerActivity: {
    flex: 1, 
    backgroundColor: '#0034',
    justifyContent: 'center',
    alignItems: 'center',
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

export default connect(mapStateToProps, mapDispatchToProps)(Usuarios);