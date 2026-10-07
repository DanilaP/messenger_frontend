import type { IDeleteMessageResponse, IEditMessageResponse, IGetDialogResponse, IGetDialogsListResponse, IReadMessagesResponse, IScrollToMessageResponse, ISendMessageResponse } from "./dialogs-interface";
import $api from "../../configs/axios";

export const getDialogsList = async (): Promise<IGetDialogsListResponse> => {
	const response = $api.get("/dialogs");
	return response;
};

export const getDialogInfo = async (dialogId: number, messageId?: number, mode?: "next" | "prev"): Promise<IGetDialogResponse> => {
	const response = $api.get(`/dialogs?id=${dialogId}${messageId ? `&messageId=${messageId}` : ``}${mode ? `&mode=${mode}` : ``}`);
	return response;
};

export const sendMessage = async (formData: FormData): Promise<ISendMessageResponse> => {
	const response = $api.post("/dialogs/message/send", formData);
	return response;
};   

export const deleteMessage = async (dialogId: number, messagesIds: number[]): Promise<IDeleteMessageResponse> => {
	const response = $api.post("/dialogs/message/delete", { dialogId, messagesIds });
	return response;
};   

export const editMessage = async (formData: FormData): Promise<IEditMessageResponse> => {
	const response = $api.post("/dialogs/message/edit", formData);
	return response;
};   

export const readMessages = async (dialogId: number, opponentId: number): Promise<IReadMessagesResponse> => {
	const response = $api.post("/dialogs/message/read", { dialogId, opponentId });
	return response;
};  

export const scrollToMessage = async (dialogId: number, messageId: number): Promise<IScrollToMessageResponse> => {
	const response = $api.post("/dialogs/message/scroll", { dialogId, messageId });
	return response;
};  