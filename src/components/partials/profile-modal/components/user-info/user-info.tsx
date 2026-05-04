import { Input, Upload } from "antd";
import { changeUserAvatar } from "../../../../../models/user-profile/user-profile-api";
import { useState } from "react";
import { useSelector } from "react-redux";
import { rootStore, type RootState } from "../../../../../stores/root/root";
import type { IChangeUserAvatarResponse, IUserProfileInfo } from "../../../../../models/user-profile/user-profile-interface";
import Cropper from "../../../cropper/cropper";
import "./user-info.scss";

export interface IUserInfoProps {
    userInfo: IUserProfileInfo;
}

const UserInfo = ({ userInfo }: IUserInfoProps) => {
	const [avatarUrl, setAvatarUrl] = useState<string>(userInfo.avatar);
	const [cropModalOpen, setCropModalOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const user = useSelector((state: RootState) => state.user.user);

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

	return (
		<div className="user-info">
			<div className="avatar">
				<Upload
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
					<Input prefix="@" defaultValue={ userInfo.username } />
				</div>
				<div className="user-info-item">
					<label className="input-name">Дата рождения: </label>
					<Input defaultValue={ userInfo.date_of_birth } />
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