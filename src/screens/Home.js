import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { authSuccess, logout } from '../redux/actions/auth';
import { updateChatDetails } from '../redux/actions/chat';

export default function Home({navigation}) {

  const { username, token } = useSelector(state => state.authReducer);
  const dispatch = useDispatch();

  const salir = () => {
    dispatch(logout());
  }

  const probando = () => {
    console.log(username, token)
  }

  return (
    <View style={styles.container}>
      { token ?
      <View style={styles.container}>
      <TouchableOpacity style={styles.container}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.textSign}>Hola {username}, token { token }</Text> 
      </TouchableOpacity>
      <TouchableOpacity style={styles.container}
        onPress={salir}>
        <Text style={styles.textSign}>Salir</Text> 
      </TouchableOpacity>
      </View>
      :
      <TouchableOpacity style={styles.container}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.textSign}>ENTRAR!</Text>
      </TouchableOpacity>
      }      
      <TouchableOpacity style={styles.container}
        onPress={probando}>
        <Text style={styles.textSign}>Probando!</Text>
      </TouchableOpacity>      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});