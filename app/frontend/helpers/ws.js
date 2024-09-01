import { w3cwebsocket as W3CWebSocket } from "websocket";

export const establishConnection = (client, url) => {

    client = new W3CWebSocket(url);

    return client;
}