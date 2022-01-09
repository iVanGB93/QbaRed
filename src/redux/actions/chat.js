import * as actionTypes from "./actionTypes";
import WebSocketInstance from "../../websocket";

const getChatsListSuccess = chatsList => {
    return {
        type: actionTypes.GET_CHATS_LIST,
        chatsList: chatsList
    }
}

export const getChatsList = username => {
    return dispatch => {
        WebSocketInstance.chatsList(username)
    }
}

export const updateChatDetails = (chatId, contacto) => {
    return {
        type: actionTypes.UPDATE_CHAT_DETAILS,
        chatId: chatId,
        contacto: contacto
    }
}