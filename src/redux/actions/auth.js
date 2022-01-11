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
        /* const token = password
        const expirationDate = 'new Date(new Date().getTime() + 3600 * 1000)';
        saveData(username, token, expirationDate);
        dispatch(authSuccess(username, token)); */
        /* axios
            .post('http://172.16.0.10:80/api/users/auth/login/', {
            username: username,
            password: password
            })
            .then(res => {
                console.log(res);
                const token = res.data.key;
                const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                localStorage.setItem("token", token);
                localStorage.setItem("username", username);
                localStorage.setItem("expirationDate", expirationDate);
                dispatch(authSuccess(username, token));
                dispatch(checkAuthTimeout(3600));
                console.log(username, token);
            })
            .catch(err => {
                console.log(err);
                dispatch(authFail(err));
            }); */
        postData('http://172.20.24.10:8000/api/users/auth/login/', { username: username, password: password })
        .then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
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



/* export const authSignup = (username, email, password1, password2) => {
    return dispatch => {
      dispatch(authStart());
      axios
        .post(`${HOST_URL}/rest-auth/registration/`, {
          username: username,
          email: email,
          password1: password1,
          password2: password2
        })
        .then(res => {
          const token = res.data.key;
          const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
          localStorage.setItem("token", token);
          localStorage.setItem("username", username);
          localStorage.setItem("expirationDate", expirationDate);
          dispatch(authSuccess(username, token));
          dispatch(checkAuthTimeout(3600));
        })
        .catch(err => {
          dispatch(authFail(err));
        });
    };
}; */

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