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

export interface IGetChatsListResponse {
    data: {
        message: string,
        chats: IBasicChatInfo[]
    }
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

export interface ICreateChatResponse {
    data: {
        message: string,
        chatInfo: {
            id: number,
            name: string,
            image: string,
            description: string,
            dateOfCreation: string
        }
    }
}

export interface IChangeChatInfoResponse {
    data: {
        message: string,
    }
}

export interface IChangeChatAvatarResponse {
    data: {
        message: string,
        updatedFileUrl: string
    }
}

export interface ISendInvitationToChatResponse {
    data: {
        message: string,
        invitation: {
            id: number,
            chatId: number,
            userId: number
        }
    }
}

export interface IDeclineInvitationToChatResponse {
    data: {
        message: string,
    }
}

export interface IAcceptInvitationToChatResponse {
    data: {
        message: string,
    }
}

export interface IDeleteChatMemberResponse {
    data: {
        message: string,
    }
}

export interface ISendChatMessageResponse {
    data: {
        message: string,
        createdMessage: IChatMessage
    }
}

export interface IDeleteChatMessageResponse {
    data: {
        message: string,
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

export interface IReadChatMessagesResponse {
    data: {
        message: string,
        readMessages: number[]
    }
}

export interface IScrollToChatMessageResponse {
    data: {
        message: string,
        messages: IChatMessage[]
    }
}

export interface IDeleteChatResponse {
    data: {
        message: string,
    }
}
