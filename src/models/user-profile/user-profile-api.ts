import $api from "../../configs/axios";

export const getUserProfileInfo = async () => {
	const response = $api.get("/profile");
	return response;
};