import $api from "../../configs/axios";

export const getUserProfileInfo = async () => {
	const response = $api.get("/profile");
	return response;
};

export const changeUserAvatar = async (formData: FormData) => {
	const response = $api.post("/profile/change-avatar", formData);
	return response;
};

export const changeUserProfileInfo = async (fieldName: string, fieldValue: string | number) => {
	const response = $api.patch("/profile", { [fieldName]: fieldValue });
	return response;
};