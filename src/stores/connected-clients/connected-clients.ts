interface IInitialState {
    clients: number[]
};

const initialState: IInitialState = {
	clients: [],
};

export const connectedClientsReducer = (state = initialState, action: { type: string; payload: number[] }): IInitialState => {
	switch (action.type) {
	case "SET_CONNECTED_CLIENTS":
		return { ...state, clients: action.payload };
	default:
		return state;
	}
};