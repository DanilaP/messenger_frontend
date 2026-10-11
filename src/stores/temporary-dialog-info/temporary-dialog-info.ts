import type { IDialog } from "../../models/dialogs/dialogs-interface";

interface IInitialState {
    dialog: IDialog | null
};

const initialState: IInitialState = {
	dialog: null,
};

export const temporaryDialogInfo = (
	state = initialState, 
	action: { type: string; payload: IDialog | null }
): IInitialState => {
	switch (action.type) {
		case "SET_DIALOG":
			return { ...state, dialog: action.payload };
		default:
			return state;
	}
};