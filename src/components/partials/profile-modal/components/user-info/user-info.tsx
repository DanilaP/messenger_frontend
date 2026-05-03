import { Input, Upload } from "antd";
import { changeUserAvatar } from "../../../../../models/user-profile/user-profile-api";
import { useState } from "react";
import type { IChangeUserAvatarResponse, IUserProfileInfo } from "../../../../../models/user-profile/user-profile-interface";
import "./user-info.scss";

export interface IUserInfoProps {
    userInfo: IUserProfileInfo;
}

const UserInfo = ({ userInfo }: IUserInfoProps) => {
	
	const [avatarUrl, setAvatarUrl] = useState<string>(userInfo.avatar);

	const handleBeforeUpload = async (file: File) => {
		const formData = new FormData();
		formData.append("files", file);

		try {
			changeUserAvatar(formData)
				.then((res: IChangeUserAvatarResponse) => {
					setAvatarUrl(res.data.avatar);
					console.log(res);
				})
				.catch(error => {
					console.error(error);
				});
		} 
		catch (error) {
			console.error("Ошибка при отправке файла", error);
		}
		return false;
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
		</div>
	);
};

export default UserInfo;