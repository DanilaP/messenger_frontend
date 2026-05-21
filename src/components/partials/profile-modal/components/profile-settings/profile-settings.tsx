import { Input } from "antd";
import type { IUserProfileInfo } from "../../../../../models/user-profile/user-profile-interface";
import type { IUser } from "../../../../../models/user/user-interface";
import TextArea from "antd/es/input/TextArea";
import "./profile-settings.scss";

interface IProfileSettingsProps {
	user: IUser,
	userInfo: IUserProfileInfo,
	handleModifyUserInfoField: (fieldName: string, fieldValue: string | number) => void
}

const ProfileSettings = ({ 
	user,
	userInfo,
	handleModifyUserInfoField
}: IProfileSettingsProps) => {

	const isModificationEnabled: boolean = user.id === userInfo.id;

	const handleFieldChange = (fieldName: string, fieldValue: string | number) => {
		handleModifyUserInfoField(fieldName, fieldValue);
	};

	return (
		<div className="profile-settings">
			<div className="profile-setting-item">
				<label className="input-name">Имя: </label>
				<Input
					disabled={ !isModificationEnabled } 
					onChange={ (e) => handleFieldChange("name", e.target.value) } 
					defaultValue={ userInfo.name } 
				/>
			</div>
			<div className="profile-setting-item">
				<label className="input-name">Фамилия: </label>
				<Input 
					disabled={ !isModificationEnabled } 
					onChange={ (e) => handleFieldChange("surname", e.target.value) } 
					defaultValue={ userInfo.surname } 
				/>
			</div>
			<div className="profile-setting-item">
				<label className="input-name">О себе: </label>
				<TextArea 
					disabled={ !isModificationEnabled } 
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