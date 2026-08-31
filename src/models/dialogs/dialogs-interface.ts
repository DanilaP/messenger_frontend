import type { IFile } from "../../interfaces/files";

export interface IOpponent {
    id: number,
    name: string,
    surname: string,
    avatar: string
}

export interface IDialogListItem {
    id: number,
    type: "dialog",
    name: string,
    image: string,
    lastMessage: {
        id: number,
        text: string,
        date: string
    } | null
}

export interface IMessage {
    id: number,
    text: string,
    date: string,
    isRead: boolean,
    sender: IDialogMessageSender
    files: IFile[],
    repliedMessage: {
        id: number,
        text: string,
        senderId: number
    } | null
}

export interface IDialogMessageSender {
    id: number,
    name: string,
    surname: string,
    avatar: string
}

export interface IDialog {
    id: number,
    messages: IMessage[],
    opponent: IOpponent
}

export interface IGetDialogsListResponse {
    data: {
        message: string,
        dialogs: {
            id: number,
            lastMessage: {
                id: number,
                text: string,
                date: string
            } | null
            opponent: IOpponent
        }[]
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