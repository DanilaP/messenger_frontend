export interface WebSocketState {
    connection: WebSocket | null;
    isConnected: boolean;
    lastMessage: any;
}

const initialState: WebSocketState = {
    connection: null,
    isConnected: false,
    lastMessage: null,
};

export const websocketReducer = (
    state = initialState,
    action: { type: string; payload: any }
): WebSocketState => {
    switch (action.type) {
        case 'WS_CONNECT':
            return { ...state, connection: action.payload, isConnected: true };
        case 'WS_MESSAGE':
            return { ...state, lastMessage: action.payload };
        default:
            return state;
    }
};