import type { IMessage } from "../models/dialogs/dialogs-interface"

export interface IFile {
    name: string,
    size: number,
    type: string,
    url: string
}

export interface INewMessage extends IMessage {
    dialog_id: number,
}

export type INewMessageData = {
    type: "new_message_dialog",
    dialogId: number,
    message: INewMessage
}

export type IDeleteMessageData = {
    type: "delete_message_dialog",
    dialogId: number,
    deletedMessagesIds: number[]
}

export type IChangeMessageData = {
    type: "change_message_dialog",
    dialogId: number,
    message: {
        id: number,
        text: string,
        files: IFile[]
    }
}

export type IReadMessageData = {
    type: "read_message_dialog",
    dialogId: number,
    readMessages: {
        id: number, 
        isread: boolean
    }[]
}