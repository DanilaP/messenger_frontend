import type { ReactElement } from "react";
import "./item.scss";

interface IMenuItemProps {
    title: string,
	subtitle: string,
    icon: ReactElement,
    handleClick: () => void
}

const MenuItem = ({ 
	title,
	subtitle, 
	icon,
	handleClick 
}: IMenuItemProps) => {
	return (
		<div onClick={ handleClick } className="menu-item">
			<div className="icon">
				{ icon }
			</div>
			<div className="info">
				<div className="text">{ title }</div>
				<div className="subtitle">{ subtitle }</div>
			</div>
		</div>
	);
};

export default MenuItem;