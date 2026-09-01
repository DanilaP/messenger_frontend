import $api from "../../configs/axios";
import type { IUser } from "./user-interface";

export const registration = async (userInfo: Partial<IUser>) => {
	const response = $api.post("/auth/registration", { ...userInfo });
	return response;
};

export const login = async (login: string, password: string) => {
	const response = $api.post("/auth/login", { login, password });
	return response;
};

export const logout = async () => {
	const response = $api.post("/auth/logout");
	return response;
};

export const getUserInfo = async () => {
	const response = $api.get("/users/profile");
	return response;
};