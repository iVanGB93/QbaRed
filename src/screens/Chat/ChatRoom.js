import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import WebSocketInstance from '../../websocket';


export default function ChatRoom () {

  const { username, token } = useSelector(state => state.authReducer);
  const { chatId, contacto } = useSelector(state => state.ChatReducer);
  const dispatch = useDispatch();

  React.useEffect(() => {
    /* WebSocketInstance.connect(chatId);
    WebSocketInstance.addCallbacks(welcome(), imprimir()); */
  }, []);

  const imprimir = () => {
    console.log("MEIMS")
  }

  const welcome = () => {
    console.log("mensajes");
  }

  return (
    <View style={styles.container}>
      <Text>CHAT ROOM # {chatId} hablando con { contacto }!</Text>
      <TouchableOpacity
        onPress={welcome}>
        <Text style={styles.textSign}>Print</Text>
      </TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});