import { useState } from "react";
import type { IPublication } from "../../../../../models/publication/publication-interface";
import PublicationsHeader from "./components/publications-header/publications-header";
import PublicationsList from "./components/publications-list/publications-list";
import "./publications.scss";

interface IPublicationsProps {
	publications: IPublication[]
}

const Publications = ({ publications }: IPublicationsProps) => {

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
				publications={ publications } 
			/>
		</div>
	);
};

export default Publications;