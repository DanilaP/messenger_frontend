export interface IUserProfileInfo {
    id: number,
    name: string,
    surname: string,
    lastname: string,
    username: string,
    date_of_birth: string,
    status: string,
    avatar: string
}

export interface IGetUserProfileInfoResponse {
    data: {
        message: string,
        user: IUserProfileInfo
    }
}

export interface IChangeUserAvatarResponse {
    data: {
        message: string,
        avatar: string
    }
}