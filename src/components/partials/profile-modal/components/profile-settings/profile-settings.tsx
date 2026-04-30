import { Button, Input } from "antd";
import type { IUserProfileInfo } from "../../../../../models/user-profile/user-profile-interface";
import TextArea from "antd/es/input/TextArea";
import "./profile-settings.scss";

interface IProfileSettingsProps {
	userInfo: IUserProfileInfo
}

const ProfileSettings = ({ userInfo }: IProfileSettingsProps) => {
	return (
		<div className="profile-settings">
			<div className="profile-setting-item">
				<label className="input-name">Имя: </label>
				<Input defaultValue={ userInfo.name } />
			</div>
			<div className="profile-setting-item">
				<label className="input-name">Фамилия: </label>
				<Input defaultValue={ userInfo.surname } />
			</div>
			<div className="profile-setting-item">
				<label className="input-name">О себе: </label>
				<TextArea 
					style={ { resize: "none" } } 
					defaultValue={ userInfo.status } 
					maxLength={ 110 }
				/>
			</div>
		</div>
	);
};

export default ProfileSettings;