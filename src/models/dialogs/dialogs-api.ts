import $api from "../../configs/axios";

export const getDialogsList = async () => {
    const response = $api.get("/dialogs");
    return response;
}