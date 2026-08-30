import "./publications-header.scss";

interface IPublicationsHeaderProps {
    currentTitle: string,
    handleTitleClick: (title: string) => void
}

const PublicationsHeader = ({ 
	currentTitle, 
	handleTitleClick 
}: IPublicationsHeaderProps) => {
	return (
		<div className="title">
			<div 
				onClick={ () => handleTitleClick("Публикации") } 
				className={ `publications-title ${ currentTitle === "Публикации" ? `active` : `` }` }
			>
                    Публикации
			</div>
		</div>
	);
};

export default PublicationsHeader;