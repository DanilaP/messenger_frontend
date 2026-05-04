import { Input } from "antd";
import type { IUserProfileInfo } from "../../../../../models/user-profile/user-profile-interface";
import TextArea from "antd/es/input/TextArea";
import "./profile-settings.scss";

interface IProfileSettingsProps {
	userInfo: IUserProfileInfo,
	handleModifyUserInfoField: (fieldName: string, fieldValue: string | number) => void
}

const ProfileSettings = ({ 
	userInfo,
	handleModifyUserInfoField
}: IProfileSettingsProps) => {

	const handleFieldChange = (fieldName: string, fieldValue: string | number) => {
		handleModifyUserInfoField(fieldName, fieldValue);
	};

	return (
		<div className="profile-settings">
			<div className="profile-setting-item">
				<label className="input-name">Имя: </label>
				<Input 
					onChange={ (e) => handleFieldChange("name", e.target.value) } 
					defaultValue={ userInfo.name } 
				/>
			</div>
			<div className="profile-setting-item">
				<label className="input-name">Фамилия: </label>
				<Input 
					onChange={ (e) => handleFieldChange("surname", e.target.value) } 
					defaultValue={ userInfo.surname } 
				/>
			</div>
			<div className="profile-setting-item">
				<label className="input-name">О себе: </label>
				<TextArea 
					onChange={ (e) => handleFieldChange("status", e.target.value) } 
					style={ { resize: "none" } } 
					defaultValue={ userInfo.status } 
					maxLength={ 110 }
				/>
			</div>
		</div>
	);
};

export default ProfileSettings;