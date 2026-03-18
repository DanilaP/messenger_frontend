import $api from "../../configs/axios";

export const getDialogsList = async () => {
    const response = $api.get("/dialogs");
    return response;
}

export const getDialogInfo = async (dialogId: number) => {
    const response = $api.get(`/dialogs?id=${dialogId}`);
    return response;
}