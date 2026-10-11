import { createStore, combineReducers } from "redux";
import { userReducer } from "../user/user";
import { websocketReducer } from "../socket/socket";
import { connectedClientsReducer } from "../connected-clients/connected-clients";
import { temporaryDialogInfo } from "../temporary-dialog-info/temporary-dialog-info";

const rootReducer = combineReducers({
	user: userReducer,
	websocket: websocketReducer,
	connectedCliens: connectedClientsReducer,
	temporaryDialogInfo: temporaryDialogInfo
});

export type RootState = ReturnType<typeof rootReducer>;

export const rootStore = createStore(rootReducer);