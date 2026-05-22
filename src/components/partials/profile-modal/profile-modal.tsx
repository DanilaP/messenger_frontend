import { useEffect, useState } from "react";
import { changeUserProfileInfo, getUserProfileInfo } from "../../../models/user-profile/user-profile-api";
import { getPublications } from "../../../models/publication/publication-api";
import { useSelector } from "react-redux";
import type { IGetUserProfileInfoResponse, IUserProfileInfo } from "../../../models/user-profile/user-profile-interface";
import type { IGetPublicationsResponse, IPublication } from "../../../models/publication/publication-interface";
import type { RootState } from "../../../stores/root/root";
import UserInfo from "./components/user-info/user-info";
import ProfileSettings from "./components/profile-settings/profile-settings";
import Publications from "./components/publications/publications";
import useDebouncedCallback from "../../../hooks/use-debounced-callback";
import "./profile-modal.scss";

interface IProfileModalProps {
	userId: number
}

const ProfileModal = ({ userId }: IProfileModalProps) => {
	
	const user = useSelector((state: RootState) => state.user.user);
	const [userProfileInfo, setUserProfileInfo] = useState<IUserProfileInfo>();
	const [publications, setPublications] = useState<IPublication[]>([]);
	
	const handleModifyUserInfoField = useDebouncedCallback((fieldName: string, fieldValue: string | number) => {
		if (userProfileInfo) {
			changeUserProfileInfo(fieldName, fieldValue)
				.then(() => {
					setUserProfileInfo({
						...userProfileInfo,
						[fieldName]: fieldValue
					});
				})
				.catch(error => {
					console.error(error);
				});
		}
	}, 300);

	useEffect(() => {
		Promise.all([getUserProfileInfo(), getPublications(userId)])
			.then(([profileRes, publicationsRes]: [IGetUserProfileInfoResponse, IGetPublicationsResponse]) => {
				setUserProfileInfo(profileRes.data.user);
				setPublications(publicationsRes.data.publications);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	if (userProfileInfo && publications && user) {
		return (
			<div className='profile'>
				<UserInfo 
					handleModifyUserInfoField={ handleModifyUserInfoField }
					userInfo={ userProfileInfo }
					user={ user } 
				/>
				<ProfileSettings 
					handleModifyUserInfoField={ handleModifyUserInfoField }
					userInfo={ userProfileInfo } 
					user={ user }
				/>
				<Publications 
					publications={ publications } 
					user={ user }
					userProfileInfo={ userProfileInfo }
				/>
			</div>
		);
	}
};

export default ProfileModal;