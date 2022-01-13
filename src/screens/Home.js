import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/actions/auth';

export default function Home({navigation}) {

  const { username, token } = useSelector(state => state.authReducer);
  const dispatch = useDispatch();

  const probando = () => {
    console.log(username, token)
  }

  return (
    <View style={styles.container}>
    <StatusBar backgroundColor='#009d93' barStyle='light-content' />
      { token ?
      <View>     
        <Text style={styles.text}>Hola {username}</Text>
        <View style={styles.button}>
          <TouchableOpacity style={styles.touchable}
            onPress={() => dispatch(logout())}>
            <Text style={styles.text}>Salir</Text> 
          </TouchableOpacity>
        </View>
      </View>
      :
      <View style={styles.button}>
        <TouchableOpacity style={styles.touchable}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.text}>ENTRAR!</Text>
        </TouchableOpacity>
      </View>
      }      
      <View style={styles.button}>
        <TouchableOpacity style={styles.touchable}
          onPress={probando}>
          <Text style={styles.text}>Probando!</Text>
        </TouchableOpacity>      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10
  },
  text: {
    fontSize: 20,
    alignItems: 'center',
    marginTop: 20
  },
  button: {
    alignItems: 'center',
    marginTop: 50
  },
  touchable: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009d93',
    borderRadius: 10
  },
});