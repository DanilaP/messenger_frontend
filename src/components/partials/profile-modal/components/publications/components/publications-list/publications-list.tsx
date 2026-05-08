import type { IPublication } from "../../../../../../../models/publication/publication-interface";
import "./publications-list.scss";

interface IPublicationsListProps {
    publications: IPublication[]
}

const PublicationsList = ({ publications }: IPublicationsListProps) => {
	return (
		<div className="publications-list">
			<div className="publications-list-title">Публикаций пока нет...</div>
			<div className="publications-list-subtitle">
                Публикуйте фотографии и видео в своём профиле
			</div>
		</div>
	);
};

export default PublicationsList;