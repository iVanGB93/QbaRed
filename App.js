import 'react-native-gesture-handler';
import React from 'react';
import { Provider} from 'react-redux';

/* import Store from './src/redux/store'; */

import { createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import authReducer from './src/redux/reducers/auth';
import ChatReducer from './src/redux/reducers/chat';
import MainStackNavigator from './src/screens/navigators/MainNavigator';

const rootReducer = combineReducers({ authReducer, ChatReducer });

const Store = createStore(rootReducer, applyMiddleware(thunk));

export default function App() {

  return (
    <Provider store={Store}>
      <MainStackNavigator>        
      </MainStackNavigator>   
    </Provider> 
  );
};
