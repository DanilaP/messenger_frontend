import { useEffect, useState } from "react";
import { getUserProfileInfo } from "../../../models/user-profile/user-profile-api";
import type { IGetUserProfileInfoResponse, IUserProfileInfo } from "../../../models/user-profile/user-profile-interface";
import UserInfo from "./components/user-info/user-info";
import ProfileSettings from "./components/profile-settings/profile-settings";
import Publications from "./components/publications/publications";
import "./profile-modal.scss";

const ProfileModal = () => {

	const [userProfileInfo, setUserProfileInfo] = useState<IUserProfileInfo>();

	useEffect(() => {
		getUserProfileInfo()
			.then((res: IGetUserProfileInfoResponse) => {
				setUserProfileInfo(res.data.user);
				console.log(res);
			})
			.catch((error: unknown) => {
				console.error(error);
			});
	}, []);

	if (userProfileInfo) {
		return (
			<div className='profile'>
				<UserInfo userInfo={ userProfileInfo } />
				<ProfileSettings userInfo={ userProfileInfo } />
				<Publications />
			</div>
		);
	}
};

export default ProfileModal;