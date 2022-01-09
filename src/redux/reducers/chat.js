import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
    chatId : null,
    contacto: '',
    messages: [],
};

const updateChatDetails = (state, action) => {
    return updateObject(state, {
        chatId: action.chatId,
        contacto: action.contacto
    });
};

function ChatReducer (state = initialState, action) {
    switch (action.type) {
        case actionTypes.UPDATE_CHAT_DETAILS:
            return updateChatDetails(state, action);       
        default:
            return state;
    }
};
  
export default ChatReducer;