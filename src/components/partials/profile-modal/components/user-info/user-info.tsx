import { DatePicker, Input, Upload, type DatePickerProps } from "antd";
import { changeUserAvatar } from "../../../../../models/user-profile/user-profile-api";
import { useState } from "react";
import { rootStore } from "../../../../../stores/root/root";
import type { IUser } from "../../../../../models/user/user-interface";
import type { IChangeUserAvatarResponse, IUserProfileInfo } from "../../../../../models/user-profile/user-profile-interface";
import Cropper from "../../../cropper/cropper";
import dayjs from "dayjs";
import "./user-info.scss";

export interface IUserInfoProps {
	user: IUser;
    userInfo: IUserProfileInfo;
	handleModifyUserInfoField: (fieldName: string, fieldValue: string | number) => void
}

const UserInfo = ({ 
	user,
	userInfo, 
	handleModifyUserInfoField 
}: IUserInfoProps) => {
	
	const [avatarUrl, setAvatarUrl] = useState<string>(userInfo.avatar);
	const [cropModalOpen, setCropModalOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const isModificationEnabled: boolean = user.id === userInfo.id;

	const handleBeforeUpload = (file: File) => {
		setSelectedFile(file);
		setCropModalOpen(true);
		return false;
	};

	const handleSaveCropped = async (croppedFile: File) => {
		const formData = new FormData();
		formData.append("files", croppedFile);

		try {
			const res: IChangeUserAvatarResponse = await changeUserAvatar(formData);
			setAvatarUrl(res.data.avatar);
			setCropModalOpen(false);
			setSelectedFile(null);
			rootStore.dispatch({ type: "SET_USER", payload: { ...user, avatar: res.data.avatar } });
		} catch (error) {
			console.error("Ошибка при отправке файла", error);
		}
	};

	const handleCancelCropper = () => {
		setCropModalOpen(false);
		setSelectedFile(null);
	};

	const handleFieldChange = (fieldName: string, fieldValue: string | number) => {
		handleModifyUserInfoField(fieldName, fieldValue);
	};

	const handleDatePickerChange: DatePickerProps["onChange"] = (_, dateString) => {
		if (dateString) {
			const stringifiedDate = dateString.toString();
			handleFieldChange("dateOfBirth", stringifiedDate);
		}
	};

	return (
		<div className="user-info">
			<div className="avatar">
				<Upload
					disabled={ !isModificationEnabled }
					showUploadList={ false }
					beforeUpload={ handleBeforeUpload }
					accept="image/*"
				>
					<div  
						style={ { backgroundImage: `url("${avatarUrl}")` } }
						className="image"
					/>
				</Upload>
			</div>
			<div className="additional-info">
				<div className="user-info-item">
					<label className="input-name">Имя пользователя: </label>
					<Input 
						disabled={ !isModificationEnabled }
						onChange={ (e) => handleFieldChange("username", e.target.value) } 
						prefix="@" 
						defaultValue={ userInfo.username } 
					/>
				</div>
				<div className="user-info-item">
					<label className="input-name">Дата рождения: </label>
					<DatePicker 
						disabled={ !isModificationEnabled }
						format="DD.MM.YYYY"
						placeholder="Выберите дату"
						defaultValue={ dayjs(userInfo.date_of_birth, "DD.MM.YYYY") }
						onChange={ handleDatePickerChange } 
					/>
				</div>
			</div>
			<Cropper
				open={ cropModalOpen }
				file={ selectedFile }
				onClose={ handleCancelCropper }
				onSave={ handleSaveCropped }
				aspect={ 1 }
			/>
		</div>
	);
};

export default UserInfo;