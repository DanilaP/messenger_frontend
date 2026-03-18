import type { IFile } from "../../interfaces/interfaces"

export interface IOpponent {
    id: number,
    name: string,
    surname: string,
    avatar: string
}

export interface IDialogListItem {
    dialog_id: number,
    last_message: {
        text: string,
        date: string
    },
    opponent: IOpponent
}

export interface IMessage {
    message_id: number,
    text: string,
    date: string,
    sender_id: number
    files: IFile[]
}

export interface IDialog {
    dialog_id: number,
    messages: IMessage[],
    opponent: IOpponent
}

export interface IGetDialogsListResponse {
    data: {
        message: string,
        dialogs: IDialogListItem[]
    }
}

export interface IGetDialogResponse {
    data: {
        message: string,
        dialog: IMessage[]
    }
}

export interface ISendMessageResponse {
    data: {
        message: string,
        createdMessage: IMessage
    }
}