import type { IGetChatsListResponse } from "./chats-interface";
import $api from "../../configs/axios";

interface IChatInfoForCreation {
    name: string,
    description: string
}

export const getChatsList = async (): Promise<IGetChatsListResponse> => {
	const response = $api.get("/chats");
	return response;
};

export const getChatInfoById = async (chatId: number, mode?: "prev" | "next", messageId?: number) => {
	const response = $api.get(`/chats?id=${chatId}${messageId ? `&targetMessageId=${messageId}` : ``}${mode ? `&mode=${mode}` : ``}`);
	return response;
};

export const createChat = async (chatInfo: IChatInfoForCreation) => {
	const response = $api.post("/chats", { ...chatInfo });
	return response;
};

export const changeChatInfo = async (chatId: number, chatInfo: IChatInfoForCreation) => {
	const response = $api.patch("/chats", { chatId, ...chatInfo });
	return response;
};

export const changeChatAvatar = async (formData: FormData) => {
	const response = $api.patch("/chats/avatar", formData);
	return response;
};

export const sendInvitationToChat = async (memberId: number, chatId: number) => {
	const response = $api.post("/chats/send-invitation", { memberId, chatId });
	return response;
};

export const declineInvitationToChat = async (invitationId: number) => {
	const response = $api.post("/chats/decline-invitation", { invitationId });
	return response;
};

export const acceptInvitationToChat = async (invitationId: number) => {
	const response = $api.post("/chats/accept-invitation", { invitationId });
	return response;
};

export const deleteChatMember = async (memberId: number, chatId: number) => {
	const response = $api.delete(`/chats/members?chatId=${chatId}&memberId=${memberId}`);
	return response;
};

export const sendChatMessage = async (formData: FormData) => {
	const response = $api.post("/chats/message/send", formData);
	return response;
};

export const deleteChatMessage = async (chatId: number, messagesIds: number[]) => {
	const response = $api.post("/chats/message/delete", { chatId, messagesIds });
	return response;
};

export const changeChatMessage = async (formData: FormData) => {
	const response = $api.post("/chats/message/edit", formData);
	return response;
};

export const readChatMessage = async (chatId: number) => {
	const response = $api.post("/chats/message/read", chatId);
	return response;
};