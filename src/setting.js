let DEBUG = true;
let HOST_URL = "https://qbared.com";
let SOCKET_URL = "wss://qbared.com";
if (DEBUG) {
  HOST_URL = "http://172.20.24.10:8000";
  SOCKET_URL = "ws://172.20.24.10:8000";
}

export { HOST_URL, SOCKET_URL };