import { Input } from "antd";
import type { IUserProfileInfo } from "../../../../../models/user-profile/user-profile-interface";
import "./user-info.scss";

export interface IUserInfoProps {
    userInfo: IUserProfileInfo
}

const UserInfo = ({ userInfo }: IUserInfoProps) => {
	return (
		<div className="user-info">
			<div className="avatar">
				<img className="image" src = { userInfo.avatar } />
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