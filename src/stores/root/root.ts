import { createStore, combineReducers } from "redux";
import { userReducer } from "../user/user";
import { websocketReducer } from "../socket/socket";
import { connectedClientsReducer } from "../connected-clients/connected-clients";

const rootReducer = combineReducers({
	user: userReducer,
	websocket: websocketReducer,
	connectedCliens: connectedClientsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export const rootStore = createStore(rootReducer);