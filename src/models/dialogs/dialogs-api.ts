import $api from "../../configs/axios";

export const getDialogsList = async () => {
	const response = $api.get("/dialogs");
	return response;
};

export const getDialogInfo = async (dialogId: number, messageId?: number, mode?: "next" | "prev") => {
	const response = $api.get(`/dialogs?id=${dialogId}${messageId ? `&messageId=${messageId}` : ``}${mode ? `&mode=${mode}` : ``}`);
	return response;
};

export const sendMessage = async (formData: FormData) => {
	const response = $api.post("/dialogs/message/send", formData);
	return response;
};   

export const deleteMessage = async (dialogId: number, messagesIds: number[]) => {
	const response = $api.post("/dialogs/message/delete", { dialogId, messagesIds });
	return response;
};   

export const editMessage = async (formData: FormData) => {
	const response = $api.post("/dialogs/message/edit", formData);
	return response;
};   

export const readMessages = async (dialogId: number, opponentId: number) => {
	const response = $api.post("/dialogs/message/read", { dialogId, opponentId });
	return response;
};  

export const scrollToMessage = async (dialogId: number, messageId: number) => {
	const response = $api.post("/dialogs/message/scroll", { dialogId, messageId });
	return response;
};  