let DEBUG = true;
let HOST_URL = "https://qbared.com";
let SOCKET_URL = "wss://qbared.com";
if (DEBUG) {
  HOST_URL = "http://10.0.0.98:8000";
  SOCKET_URL = "ws://10.0.0.98:8000";
}

export { HOST_URL, SOCKET_URL };