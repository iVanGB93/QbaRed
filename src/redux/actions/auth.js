import * as actionTypes from './actionTypes';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authStart = () => {
    return {
      type: actionTypes.AUTH_START
    };
};

export const authSuccess = (username, token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username: username
    };
};

export const authFail = error => {
    return {
      type: actionTypes.AUTH_FAIL,
      error: error
    };
};

const removeData = async () => {
    try {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("username");
    } catch (e) {
        dispatch(authFail(e))
    }
}

export const logout = () => {
    removeData();
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

const saveData = async (username, token, expirationDate) => {
    try {   
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('token', token);
    } catch (e) {
        console.log(e)
    }
}

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
  
  
  

export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());       
        postData('http://10.0.0.98:8000/api/users/auth/login/', { username: username, password: password })
        .then(data => {
            const token = data.key;
            if (token) {
                saveData(username, token);
                dispatch(authSuccess(username, token));
            } else if (data.non_field_errors) {
                dispatch(authFail("Credenciales incorrectas."));
            } else {
                dispatch(authFail("Ocurrió un error en la obtención del token."));
            }  
        })
        .catch((error) => {
            dispatch(authFail(error));
            console.log("catch error ", + error);
        });
    };
};



export const authSignup = (username, email, password1, password2) => {
    return dispatch => {
        dispatch(authStart());
        postData('http://172.20.24.10:8000/api/users/auth/registration/', { username: username, password1: password1, password2: password2, email: email })
        .then(data => {
            const token = data.key;
            if (token) {
                saveData(username, token);
                dispatch(authSuccess(username, token));
            } else {
                dispatch(authFail(error));
                console.log(error);
            } 
        })
        .catch((error) => {
            dispatch(authFail(error));
            console.log("catch error ", + error);
        });
    };
};

const getData = async () => {
    try {   
        const username = await AsyncStorage.getItem('username');
        const token = await AsyncStorage.getItem('token');
        return [username, token]
    } catch (e) {
        console.log(e)
    }
}

export const authCheckState = () => {
    return dispatch => {
        const data = getData();
        const username = data[0];
        const token = data[1];
        if (token === null) {
            dispatch(logout());
        } else {             
            dispatch(authSuccess(username, token));
        }
    };
};