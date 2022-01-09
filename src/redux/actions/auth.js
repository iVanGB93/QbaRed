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
        await AsyncStorage.removeItem("expirationDate");
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

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
      setTimeout(() => {
        dispatch(logout());
      }, expirationTime * 1000);
    };
};

const saveData = async (username, token, expirationDate) => {
    try {   
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('expirationDate', expirationDate);
    } catch (e) {
        console.log(e)
    }
}

export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        console.log("EMPEZANDO");    
        const token = password
        const expirationDate = 'new Date(new Date().getTime() + 3600 * 1000)';
        saveData(username, token, expirationDate);
        dispatch(authSuccess(username, token));
        /* axios
            .post('http://172.16.0.10/api/users/auth/login/', {
            username: username,
            password: password
            })
            .then(res => {
            console.log(res)
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
            dispatch(authFail(err));
            }); */
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
        const expirationDate = await AsyncStorage.getItem('expirationDate');
        return [username, token, expirationDate]
    } catch (e) {
        console.log(e)
    }
}

export const authCheckState = async () => {
    return dispatch => {
        const data = getData();
        const username = data[0];
        const token = data[1];
        const expirationDate = data[2];
        if (token === null) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(expirationDate);
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(username, token));
                dispatch(
                    checkAuthTimeout(
                    (expirationDate.getTime() - new Date().getTime()) / 1000
                    )
                );
            }
        }
    };
};