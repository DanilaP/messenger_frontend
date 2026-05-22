import { useState } from "react";
import type { IPublication } from "../../../../../models/publication/publication-interface";
import type { IUser } from "../../../../../models/user/user-interface";
import type { IUserProfileInfo } from "../../../../../models/user-profile/user-profile-interface";
import PublicationsHeader from "./components/publications-header/publications-header";
import PublicationsList from "./components/publications-list/publications-list";
import "./publications.scss";

interface IPublicationsProps {
	publications: IPublication[],
	user: IUser,
	userProfileInfo: IUserProfileInfo
}

const Publications = ({ 
	publications,
	user,
	userProfileInfo
}: IPublicationsProps) => {

	const [isModificationAllowed, setIsModificationAllowed] = useState<boolean>(user.id === userProfileInfo.id);
	const [currentTitle, setCurrentTitle] = useState<string>("Публикации");

	const handleTitleClick = (title: string) => {
		setCurrentTitle(title);
	};

	return (
		<div className="publications">
			<PublicationsHeader 
				currentTitle={ currentTitle }
				handleTitleClick={ handleTitleClick } 
			/>
			<PublicationsList 
				isModificationAllowed={ isModificationAllowed }
				publications={ publications } 
			/>
		</div>
	);
};

export default Publications;