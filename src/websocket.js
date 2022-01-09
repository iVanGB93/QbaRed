


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

    connect() {
        const path = `ws://172.16.0.10:8000/ws/chat/usuarios/`;
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen = () => {
            console.log("WEBSOCKET OPEN");
        };
        this.socketRef.onmessage = e => {
            console.log(e.data);
            this.socketNewMessage(e.data);
        };
        this.socketRef.onerror = e => {
            console.log(e.message);
        };
        this.socketRef.onclose = () => {
            console.log("WebSocket closed let's reopen");
            this.connect();
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
        if (command === "new_message") {
          this.callbacks[command](parsedData.message);
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

    addCallbacks(chats_list, newMessageCallback) {
        this.callbacks["chats"] = chats_list;
        this.callbacks["new_message"] = newMessageCallback;
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