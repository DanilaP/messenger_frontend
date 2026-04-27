import type { IFile } from "../../interfaces/files";

export interface IOpponent {
    id: number,
    name: string,
    surname: string,
    avatar: string
}

export interface IDialogListItem {
    dialog_id: number,
    last_message: {
        id: number,
        text: string,
        date: string
    } | null,
    opponent: IOpponent
}

export interface IMessage {
    message_id: number,
    text: string,
    date: string,
    isread: boolean,
    sender_id: number
    files: IFile[],
    replayMessage: {
        id: number,
        text: string,
        senderId: number
    } | null
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
        dialog: {
            id: number,
            messages: IMessage[],
            opponent: IOpponent
        }
    }
}

export interface ISendMessageResponse {
    data: {
        message: string,
        createdMessage: IMessage
    }
}

export interface IEditMessageResponse {
    data: {
        message: string,
        modifiedMessageInfo: {
            id: string,
            text: string,
            files: IFile[]
        }
    }
}

export interface IScrollToMessageResponse {
    data: {
        message: string,
        messages: IMessage[]
    }
}