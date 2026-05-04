import { useEffect, useState } from "react";
import { changeUserProfileInfo, getUserProfileInfo } from "../../../models/user-profile/user-profile-api";
import type { IGetUserProfileInfoResponse, IUserProfileInfo } from "../../../models/user-profile/user-profile-interface";
import UserInfo from "./components/user-info/user-info";
import ProfileSettings from "./components/profile-settings/profile-settings";
import Publications from "./components/publications/publications";
import "./profile-modal.scss";

const ProfileModal = () => {

	const [userProfileInfo, setUserProfileInfo] = useState<IUserProfileInfo>();

	const handleModifyUserInfoField = async (fieldName: string, fieldValue: string | number) => {
		if (userProfileInfo) {
			changeUserProfileInfo(fieldName, fieldValue)
				.then((res) => {
					setUserProfileInfo({
						...userProfileInfo,
						[fieldName]: fieldValue
					});
					console.log(res);
				})
				.catch(error => {
					console.error(error);
				});
		}
	};

	useEffect(() => {
		getUserProfileInfo()
			.then((res: IGetUserProfileInfoResponse) => {
				setUserProfileInfo(res.data.user);
			})
			.catch((error: unknown) => {
				console.error(error);
			});
	}, []);

	if (userProfileInfo) {
		return (
			<div className='profile'>
				<UserInfo 
					handleModifyUserInfoField={ handleModifyUserInfoField }
					userInfo={ userProfileInfo } 
				/>
				<ProfileSettings 
					handleModifyUserInfoField={ handleModifyUserInfoField }
					userInfo={ userProfileInfo } 
				/>
				<Publications />
			</div>
		);
	}
};

export default ProfileModal;