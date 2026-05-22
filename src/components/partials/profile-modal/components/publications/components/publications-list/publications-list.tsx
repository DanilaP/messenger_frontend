import type { IPublication } from "../../../../../../../models/publication/publication-interface";
import Publication from "../publication/publication";
import "./publications-list.scss";

interface IPublicationsListProps {
    publications: IPublication[],
	isModificationAllowed: boolean
}

const PublicationsList = ({ 
	publications,
	isModificationAllowed 
}: IPublicationsListProps) => {

	return (
		<div className={ `publications-list ${publications.length !== 0 ? `` : `flex-cont`}` }>
			{
				publications.length === 0
					? 
					<div className="empty-publication-list-banner">
						<div className="publications-list-title">Публикаций пока нет...</div>
						{ 
							isModificationAllowed &&
								<div className="publications-list-subtitle">
									Публикуйте фотографии и видео в своём профиле
								</div>
						}
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