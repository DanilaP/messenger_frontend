import $api from "../../configs/axios";

export const getPublications = async (userId: number) => {
	const result = await $api.get(`/publications?userId=${userId}`);
	return result;
};

export const createPublication = async (formData: FormData) => {
	const result = await $api.post("/publications", formData);
	return result;
};

export const deletePublication = async (publicationId: number) => {
	const result = await $api.delete(`/publications?userId=${publicationId}`);
	return result;
};

export const changePublication = async (formData: FormData) => {
	const result = await $api.patch("/publications", formData);
	return result;
};