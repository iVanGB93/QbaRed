
class WebSocketService {
    static instance = null;
    callbacks = {};

    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    constructor() {
        this.socketRef = null;
    }

    connect(chatId) {
        const path = `ws://172.20.24.10:8000/ws/chat/${ chatId }/`;
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen = () => {
            console.log("WEBSOCKET OPEN");
        };
        this.socketRef.onmessage = e => {
            this.socketNewMessage(e.data);
        };
        this.socketRef.onerror = e => {
            console.log(e.message);
        };
        this.socketRef.onclose = () => {
            console.log("WebSocket closed let's reopen");
            /* this.connect(chatId); */
        };
    }

    disconnect() {
        this.socketRef.close();
    }

    socketNewMessage(data) {
        const parsedData = JSON.parse(data);
        const command = parsedData.accion;
        if (Object.keys(this.callbacks).length === 0) {
            return;
        }
        if (command === "chats") {
            this.callbacks[command](parsedData.chats_list);
        }
        if (command === "mensajes") {
            this.callbacks[command](parsedData.mensajes);
        }
        if (command === "mensaje_nuevo") {
            this.callbacks[command](parsedData.mensaje);
        }
    }
    
    chats_list(username) {
        this.sendMessage({
            'accion': 'chats',
            'data': {
                'usuario': username
            }
        })
    }

    messages(username, chat_id) {
        this.sendMessage({
            'accion': 'mensajes',
            'data': {
                'usuario': username,
                'id': chat_id,
            }
        })
    }

    addCallbacks(chats_list, mensajes, mensaje) {
        this.callbacks["chats"] = chats_list;
        this.callbacks["mensajes"] = mensajes;
        this.callbacks["mensaje_nuevo"] = mensaje;
    }

    sendMessage(data) {
        try {
          this.socketRef.send(JSON.stringify({ ...data }));
        } catch (err) {
          console.log(err.message);
        }
    }

    state() {
        return this.socketRef.readyState;
    }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;