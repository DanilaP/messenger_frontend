import type { IMessage } from "../models/dialogs/dialogs-interface";
import type { IFile } from "./files";

interface INewMessage extends IMessage {
    dialog_id: number,
}

export type INewMessageData = {
    type: "new_message_dialog",
    dialogId: number,
    message: INewMessage,
    senderInfo: {
        id: number,
        name: string,
        surname: string,
        avatar: string
    }
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