import React from 'react';
import { 
    View, 
    ScrollView,
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

export default function Register ({navigation}) {

  const { token, error, loading } = useSelector(state => state.authReducer);
  const dispatch = useDispatch();

  const [data, setData] = React.useState({
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    checkEmailInputChange: false,
    checkUserInputChange: false,
    secureTextEntry: true,
    secureTextEntryConfirm: true
  })

  const handleEmailChange = (value) => {
    if (value.length != 0) {
      setData({
        ...data,
        email: value,
        checkEmailInputChange: true
      });
    } else {
      setData({
        ...data,
        email: value,
        checkEmailInputChange: false
      });
    }
  }

  const handleUserChange = (value) => {
    if (value.length != 0) {
      setData({
        ...data,
        username: value,
        checkUserInputChange: true
      });
    } else {
      setData({
        ...data,
        username: value,
        checkUserInputChange: false
      });
    }
  }

  const handlePasswordChange = (value) => {
    setData({
      ...data,
      password: value,
    });
  }

  const handlePasswordConfirmChange = (value) => {
    setData({
      ...data,
      passwordConfirm: value,
    });
  }

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
    });
  }

  const updateSecureTextEntryConfirm = () => {
    setData({
      ...data,
      secureTextEntryConfirm: !data.secureTextEntryConfirm
    });
  }

  const signUpHandler = () => {
    if (data.username.length === 0 || data.password.length === 0) {
      Alert.alert('Atención!', 'Escriba su usuario y contraseña.')
    } else {
      dispatch(authSignup(data.username, data.email, data.password, data.passwordConfirm));
      if (token != null) {
        navigation.navigate('Main');
      }
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#009d93' barStyle='light-content' />
      <View style={styles.header}>
        <Text style={styles.text_header}>Registrarme!</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.text_footer}>Correo</Text>
        <View style={styles.action}>
          <Ionicons name="mail"/>
          <TextInput onChangeText={(value)=> handleEmailChange(value)} placeholder='su correo...' style={styles.textInput} autoCapitalize='none'/>
          { data.checkEmailInputChange ?
          <Ionicons style={{color: '#009d93'}} name="checkmark-circle-outline" />
          : null}
        </View>
        <Text style={[styles.text_footer, { marginTop: 30 }]}>Usuario</Text>
        <View style={styles.action}>
          <Ionicons name="person"/>
          <TextInput onChangeText={(value)=> handleUserChange(value)} placeholder='nombre de usuario...' style={styles.textInput} autoCapitalize='none'/>
          { data.checkUserInputChange ?
          <Ionicons style={{color: '#009d93'}} name="checkmark-circle-outline" />
          : null}
        </View>
        <Text style={[styles.text_footer, { marginTop: 30 }]}>Contraseña</Text>
        <View style={styles.action}>
          <Ionicons name="lock-closed"/>
          <TextInput onChangeText={(value)=> handlePasswordChange(value)} placeholder='contraseña...' secureTextEntry={data.secureTextEntry ? true : false} style={styles.textInput} autoCapitalize='none'/>
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? <Ionicons size={15} name="eye-off-outline"/> : <Ionicons size={15} name="eye-outline"/>}
          </TouchableOpacity>
        </View>
        <Text style={[styles.text_footer, { marginTop: 30 }]}>Confirmar contraseña</Text>
        <View style={styles.action}>
          <Ionicons name="lock-closed"/>
          <TextInput onChangeText={(value)=> handlePasswordConfirmChange(value)} placeholder='repita la contraseña...' secureTextEntry={data.secureTextEntryConfirm ? true : false} style={styles.textInput} autoCapitalize='none'/>
          <TouchableOpacity onPress={updateSecureTextEntryConfirm}>
            {data.secureTextEntryConfirm ? <Ionicons size={15} name="eye-off-outline"/> : <Ionicons size={15} name="eye-outline"/>}
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.signUp} onPress={signUpHandler}>
            <Text style={styles.textSign}>Registrarme</Text> 
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.signUp}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.textSign}>Ya tengo cuenta, entrar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.signUp}
            onPress={() => navigation.navigate('Main')}>
            <Text style={styles.textSign}>Seguir sin registrarme</Text>            
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create ({
  container: {
    flex: 1, 
    backgroundColor: '#009d93'
  },
  header: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 20
  },
  footer: {
      flex: 6,
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
      marginTop: 5,
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
  signUp: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009d93',
    borderRadius: 10
  },
  textSign: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold'
  }
})