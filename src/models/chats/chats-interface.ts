import type { IFile } from "../../interfaces/files";

export interface IBasicChatInfo {
    id: number,
    type: "chat",
    name: string,
    image: string,
    lastMessage: {
        id: number,
        text: string,
        date: string
    } | null
}

export interface IChat {
    id: number,
    name: string,
    image: string,
    messages: IChatMessage[]
}

export interface IChatMessage {
    id: number,
    text: string,
    date: string,
    isRead: boolean,
    sender: IChatMessageSender,
    repliedMessage: IRepliedMessage | null,
    files: IFile[]
}

export interface IRepliedMessage {
    id: number,
    text: string,
    sender: IChatMessageSender
}

export interface IChatMessageSender {
    id: number,
    name: string,
    surname: string,
    avatar: string
}

export interface IGetChatResponse {
    data: {
        message: string,
        chat: {
            id: number,
            name: string,
            image: string,
            messages: IChatMessage[]
        }
    }
}

export interface IGetChatsListResponse {
    data: {
        message: string,
        chats: IBasicChatInfo[]
    }
}

export interface ISendChatMessageResponse {
    data: {
        message: string,
        createdMessage: IChatMessage
    }
}

export interface IChangeChatMessageResponse {
    data: {
        message: string,
        modifiedMessageInfo: {
            id: string,
            text: string,
            files: IFile[]
        }
    }
}

export interface IScrollToChatMessageResponse {
    data: {
        message: string,
        messages: IChatMessage[]
    }
}
