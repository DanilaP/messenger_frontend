import type { IPublication } from "../../../../../../../models/publication/publication-interface";
import Publication from "../publication/publication";
import "./publications-list.scss";

interface IPublicationsListProps {
    publications: IPublication[]
}

const PublicationsList = ({ publications }: IPublicationsListProps) => {
	
	return (
		<div className="publications-list">
			{
				publications.length === 0
					? 
					<div className="empty-publication-list-banner">
						<div className="publications-list-title">Публикаций пока нет...</div>
						<div className="publications-list-subtitle">
							Публикуйте фотографии и видео в своём профиле
						</div>
					</div>
					: publications.map(publication => {
						return (
							<Publication 
								key={ publication.id } 
								publication={ publication } 
							/>
						);
					})
			}
		</div>
	);
};

export default PublicationsList;