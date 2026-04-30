import { IoMdExit } from "react-icons/io";
import type { IUser } from "../../../../../models/user/user-interface";
import "./menu-footer.scss";

interface IMenuFooterProps {
    user: IUser,
    handleExitClick: () => void
}

const MenuFooter = ({ user, handleExitClick }: IMenuFooterProps) => {
	return (
		<div className="menu-footer">
			<div className="avatar-wrapper">
				<img className="image" src={ user?.avatar } />
			</div>
			<div className="user-info">
				<div className="user-name">
					<div className="name">{ user?.name }</div>
					<div className="surname">{ user?.surname }</div>
				</div>
			</div>
			<div onClick={ handleExitClick } className="exit-icon-wrapper">
				<IoMdExit fontSize={ 30 } />
			</div>
		</div>
	);
};

export default MenuFooter;