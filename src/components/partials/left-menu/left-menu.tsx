import { FaUserCircle } from "react-icons/fa";
import { BiSolidMessageRounded } from "react-icons/bi";
import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router";
import { logout } from "../../../models/user/user-api";
import MenuItem from "./components/item/item";
import './left-menu.scss';

const LeftMenu = () => {

    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate("/main/profile");
    }

    const handleExitClick = () => {
        logout()
        .then(() => {
            navigate("/auth/signin");
        })
        .catch((error: unknown) => {
            console.error(error);
        })
    }

    const handleDialogsClick = () => {
        console.log("mock");
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
                <MenuItem 
                    title = "Выход" 
                    icon={ <IoMdExit /> }
                    handleClick={ handleExitClick }
                />
            </div>
        </div>
    );
};

export default LeftMenu;