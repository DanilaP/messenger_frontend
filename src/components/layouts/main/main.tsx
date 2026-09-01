import * as React from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import LeftMenu from "../../partials/left-menu/left-menu";
import "./main.scss";

interface MainLayoutProps {
    children: React.ReactElement | null
}

export default function MainLayout (props: MainLayoutProps) {

	const [isLeftMenuOpen, setIsLeftMenuOpen] = useState<boolean>(false);
	const { children } = props;

	const handleChangeMenuVisibility = () => {
		setIsLeftMenuOpen(!isLeftMenuOpen);
	};

	return (
		<div className='main-wrapper'>
			<div className="main-header">
				<RxHamburgerMenu 
					onClick={ handleChangeMenuVisibility } 
					className='left-menu-icon' 
					fontSize={ 30 } 
				/>
			</div>
			<div className="main-content">{ children }</div>
			<div className="main-footer">

			</div>
			{ isLeftMenuOpen && <LeftMenu handleCloseMenu={ handleChangeMenuVisibility } /> }
		</div>
	);
}