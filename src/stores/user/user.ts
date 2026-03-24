import { createStore } from 'redux';
import type { IUser } from '../../models/user/user-interface';

export interface UserStore {
    user: IUser | null,
}
const stateInitial: UserStore = {
    user: null,
}

function reducer(state = stateInitial, action: { type: string, payload: IUser | null }) {
    switch(action.type) {
        case "SET_USER": return { ...state, user: action.payload }
        default: return state;
    }
}

const userStore = createStore(reducer);

export default userStore;