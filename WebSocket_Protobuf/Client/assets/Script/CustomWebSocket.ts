import { decodePerson, encodePerson, Person } from "./protobuf/Custom";

export enum SOCKET_STATE {
    OPEN,
    CLOSE
}

export default class CustomWebSocket {
    
    private static _instance: CustomWebSocket = null;

    public static get instance() {
        if (!CustomWebSocket._instance) {
            CustomWebSocket._instance = new CustomWebSocket();
        }

        return CustomWebSocket._instance;
    }

    private _webSocket: WebSocket;

    socketState: SOCKET_STATE;

    private constructor() {
        this.socketState = SOCKET_STATE.CLOSE;

        this._webSocket = new WebSocket("ws://localhost:3000");
        this._webSocket.binaryType = "arraybuffer";
        
        this._webSocket.onopen = this._onOpen.bind(this);
        this._webSocket.onmessage = this._onMessage.bind(this);
        this._webSocket.onclose = this._onClose.bind(this);
        this._webSocket.onerror = this._onError.bind(this);
    }

    private _onOpen(ev: Event) {
        console.log("open");
        console.log(ev);
        this.socketState = SOCKET_STATE.OPEN;
    }

    private _onMessage(message: MessageEvent) {
        console.log(decodePerson(new Uint8Array(message.data)));
    }

    private _onClose(ev: CloseEvent) {
        console.log("close");
        console.log(ev);
        this.socketState = SOCKET_STATE.CLOSE;
    }

    private _onError(ev: Event) {
        console.log("error");
        console.log(ev);
        this.socketState = SOCKET_STATE.CLOSE;
    }

    send(message: Person) {
        if (this.socketState != SOCKET_STATE.OPEN) {
            console.error("Error: WebSocket is not available.");
            return;
        }
        this._webSocket.send(encodePerson(message));
    }
}
