import type { IUser } from '../../models/user/user-interface';

export interface UserState {
    user: IUser | null;
}

const initialState: UserState = {
    user: null,
};

export const userReducer = (state = initialState, action: { type: string; payload: any }): UserState => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        default:
            return state;
    }
};