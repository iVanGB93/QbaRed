import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useSelector, useDispatch } from 'react-redux';
import { authLogin } from '../redux/actions/auth';


const Login = ({navigation}) => {

  const { username, token, error, loading } = useSelector(state => state.authReducer);
  const dispatch = useDispatch();

  const checkToken = () => {
    if (token != null) {
      navigation.navigate('Main');
    }
  }

  React.useEffect(() => {
    checkToken();
  }, [])

  const [data, setData] = React.useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true
  })

  const textInputChange = (value) => {
    if (value.length != 0) {
      setData({
        ...data,
        username: value,
        check_textInputChange: true
      });
    } else {
      setData({
        ...data,
        username: value,
        check_textInputChange: false
      });
    }
  }

  const handlePasswordChange = (value) => {
    setData({
      ...data,
      password: value,
    });
  }

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
    });
  }

  const logginHandler = () => {
    if (data.username.length === 0 || data.password.length === 0) {
      Alert.alert('Atención!', 'Escriba su usuario y contraseña.')
    } else {
      dispatch(authLogin(data.username, data.password));
      checkToken();
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#009387' barStyle='light-content' />
      <View style={styles.header}>
        <Text style={styles.text_header}>Bienvenido!</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.text_footer}>Usuario</Text>
        <View style={styles.action}>
          <Ionicons name="person"/>
          <TextInput onChangeText={(value)=> textInputChange(value)} placeholder={username ? username : 'nombre de usuario...'} style={styles.textInput} autoCapitalize='none'/>
          { data.check_textInputChange ?
          <Ionicons style={{color: '#009387'}} name="checkmark-circle-outline" />
          : null}
        </View>
        <Text style={[styles.text_footer, { marginTop: 35 }]}>Contraseña</Text>
        <View style={styles.action}>
          <Ionicons name="lock-closed"/>
          <TextInput onChangeText={(value)=> handlePasswordChange(value)} placeholder='contraseña...' secureTextEntry={data.secureTextEntry ? true : false} style={styles.textInput} autoCapitalize='none'/>
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? <Ionicons size={15} name="eye-off-outline"/> : <Ionicons size={15} name="eye-outline"/>}
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.signIn} onPress={logginHandler}>
            <Text style={styles.textSign}>Entrar</Text> 
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.signIn}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.textSign}>Registrarse</Text> 
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.signIn}
            onPress={() => navigation.navigate('Main')}>
            <Text style={styles.textSign}>Cancelar</Text> 
            <Ionicons name="arrow-back"/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create ({
  container: {
    flex: 1, 
    backgroundColor: '#009387'
  },
  header: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 50
  },
  footer: {
      flex: 3,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 30
  },
  text_header: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 30
  },
  text_footer: {
      color: '#05375a',
      fontSize: 18
  },
  action: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5
  },
  actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5
  },
  textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      color: '#05375a',
  },
  errorMsg: {
      color: '#FF0000',
      fontSize: 14,
  },
  button: {
      alignItems: 'center',
      marginTop: 50
  },
  signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
  },
  textSign: {
      fontSize: 18,
      fontWeight: 'bold'
  }
})