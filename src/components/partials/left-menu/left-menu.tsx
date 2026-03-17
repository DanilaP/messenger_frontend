import { FaUserCircle } from "react-icons/fa";
import { BiSolidMessageRounded } from "react-icons/bi";
import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router";
import { logout } from "../../../models/user/user-api";
import { useSelector } from "react-redux";
import type { UserStore } from "../../../stores/user/user";
import MenuItem from "./components/item/item";
import './left-menu.scss';

interface ILeftMenuProps {
    handleCloseMenu: () => void
}

const LeftMenu = ({ handleCloseMenu }: ILeftMenuProps) => {

    const user = useSelector((state: UserStore) => state.user);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        handleCloseMenu();
        navigate("/main/profile");
    }

    const handleExitClick = () => {
        logout()
        .then(() => {
            handleCloseMenu();
            navigate("/auth/signin");
        })
        .catch((error: unknown) => {
            console.error(error);
        })
    }

    const handleDialogsClick = () => {
        handleCloseMenu();
        navigate("/main/dialogs");
    }

    return (
        <div className='left-menu-wrapper'>
            <div className="menu">
                <MenuItem 
                    title = "Профиль" 
                    icon={ <FaUserCircle /> } 
                    handleClick={ handleProfileClick }
                />
                <MenuItem 
                    title = "Диалоги" 
                    icon={ <BiSolidMessageRounded /> } 
                    handleClick={ handleDialogsClick }
                />
                <div className="menu-footer">
                    <div className="avatar-wrapper">
                        <img className="image" src={ user?.avatar } />
                    </div>
                    <div className="user-info">
                        <div className="user-name">
                            <div className="name">{user?.name}</div>
                            <div className="surname">{user?.surname}</div>
                        </div>
                    </div>
                    <div onClick={handleExitClick} className="exit-icon-wrapper">
                        <IoMdExit fontSize={30} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftMenu;