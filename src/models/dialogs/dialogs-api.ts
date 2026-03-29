import $api from "../../configs/axios";

export const getDialogsList = async () => {
    const response = $api.get("/dialogs");
    return response;
}

export const getDialogInfo = async (dialogId: number) => {
    const response = $api.get(`/dialogs?id=${dialogId}`);
    return response;
}

export const sendMessage = async (formData: FormData) => {
    const response = $api.post("/dialogs/message/send", formData);
    return response;
}   

export const deleteMessage = async (dialogId: number, messageId: number) => {
    const response = $api.post("/dialogs/message/delete", {dialogId, messagesIds: [messageId]});
    return response;
}   

export const editMessage = async (formData: FormData) => {
    const response = $api.post("/dialogs/message/edit", formData);
    return response;
}   