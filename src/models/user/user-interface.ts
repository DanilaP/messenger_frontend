export interface IUser {
    id: number,
    login: string,
    name: string,
    surname: string,
    lastname: string | null,
    status: string,
    avatar: string
}

export interface ILoginResponse {
    data: {
        message: string,
        user: Partial<IUser>
    }
}

export interface IRegistrationResponse {
    data: {
        message: string,
        user: Partial<IUser>
    }
}

export interface IGetUserInfoResponse {
    data: {
        message: string,
        user: Partial<IUser>
    }
}