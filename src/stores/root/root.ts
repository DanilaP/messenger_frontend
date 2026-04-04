import { createStore, combineReducers } from "redux";
import { userReducer } from "../user/user";
import { websocketReducer } from "../socket/socket";

const rootReducer = combineReducers({
	user: userReducer,
	websocket: websocketReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const rootStore = createStore(rootReducer);