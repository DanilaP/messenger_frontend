import type { IAcceptInvitationToChatResponse, IChangeChatAvatarResponse, IChangeChatInfoResponse, IChangeChatMessageResponse, ICreateChatResponse, IDeclineInvitationToChatResponse, IDeleteChatMemberResponse, IDeleteChatMessageResponse, IDeleteChatResponse, IGetChatResponse, IGetChatsListResponse, IReadChatMessagesResponse, IScrollToChatMessageResponse, ISendChatMessageResponse, ISendInvitationToChatResponse } from "./chats-interface";
import $api from "../../configs/axios";

interface IChatInfoForCreation {
    name: string,
    description: string
}

export const getChatsList = async (): Promise<IGetChatsListResponse> => {
	const response = $api.get("/chats");
	return response;
};

export const getChatInfoById = async (chatId: number, mode?: "prev" | "next", messageId?: number): Promise<IGetChatResponse> => {
	const response = $api.get(`/chats?chatId=${chatId}${messageId ? `&targetMessageId=${messageId}` : ``}${mode ? `&mode=${mode}` : ``}`);
	return response;
};

export const createChat = async (chatInfo: IChatInfoForCreation): Promise<ICreateChatResponse> => {
	const response = $api.post("/chats", { ...chatInfo });
	return response;
};

export const changeChatInfo = async (chatId: number, chatInfo: IChatInfoForCreation): Promise<IChangeChatInfoResponse> => {
	const response = $api.patch("/chats", { chatId, ...chatInfo });
	return response;
};

export const changeChatAvatar = async (formData: FormData): Promise<IChangeChatAvatarResponse> => {
	const response = $api.patch("/chats/avatar", formData);
	return response;
};

export const sendInvitationToChat = async (memberId: number, chatId: number): Promise<ISendInvitationToChatResponse> => {
	const response = $api.post("/chats/send-invitation", { memberId, chatId });
	return response;
};

export const declineInvitationToChat = async (invitationId: number): Promise<IDeclineInvitationToChatResponse> => {
	const response = $api.post("/chats/decline-invitation", { invitationId });
	return response;
};

export const acceptInvitationToChat = async (invitationId: number): Promise<IAcceptInvitationToChatResponse> => {
	const response = $api.post("/chats/accept-invitation", { invitationId });
	return response;
};

export const deleteChatMember = async (memberId: number, chatId: number): Promise<IDeleteChatMemberResponse> => {
	const response = $api.delete(`/chats/members?chatId=${chatId}&memberId=${memberId}`);
	return response;
};

export const sendChatMessage = async (formData: FormData): Promise<ISendChatMessageResponse> => {
	const response = $api.post("/chats/message/send", formData);
	return response;
};

export const deleteChatMessage = async (chatId: number, messagesIds: number[]): Promise<IDeleteChatMessageResponse> => {
	const response = $api.post("/chats/message/delete", { chatId, messagesIds });
	return response;
};

export const changeChatMessage = async (formData: FormData): Promise<IChangeChatMessageResponse> => {
	const response = $api.post("/chats/message/edit", formData);
	return response;
};

export const readChatMessage = async (chatId: number): Promise<IReadChatMessagesResponse> => {
	const response = $api.post("/chats/message/read", chatId);
	return response;
};

export const scrollToChatMessage = async (chatId: number, messageId: number): Promise<IScrollToChatMessageResponse> => {
	const response = $api.post("/chats/message/scroll", { chatId, messageId });
	return response;
};

export const deleteChat = async (chatId: number): Promise<IDeleteChatResponse> => {
	const response = $api.post("/chats/message/scroll", { chatId });
	return response;
};