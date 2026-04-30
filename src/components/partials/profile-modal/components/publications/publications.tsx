import { useState } from "react";
import "./publications.scss";

const Publications = () => {

	const [currentTitle, setCurrentTitle] = useState<string>("Публикации");

	const handleTitleClick = (title: string) => {
		setCurrentTitle(title);
	};

	return (
		<div className="publications">
			<div className="title">
				<div 
					onClick={ () => handleTitleClick("Публикации") } 
					className={ `publications-title ${ currentTitle === "Публикации" ? `active` : `` }` }
				>
                    Публикации
				</div>
				<div 
					onClick={ () => handleTitleClick("Архивные публикации") } 
					className={ `publications-title ${ currentTitle === "Архивные публикации" ? `active` : `` }` }
				>
                    Архив публикаций
				</div>
			</div>
			<div className="publications-list">
				<div className="publications-list-title">Публикаций пока нет...</div>
				<div className="publications-list-subtitle">
                    Публикуйте фотографии и видео в своём профиле
				</div>
			</div>
		</div>
	);
};

export default Publications;