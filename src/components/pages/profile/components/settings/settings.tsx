import { MdModeEdit } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { IoExit } from "react-icons/io5";
import { logout } from "../../../../../models/user/user-api";
import { useNavigate } from "react-router";
import './settings.scss';

const ProfileSettings = () => {

    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout()
        .then(() => {
            navigate("/auth/signin");
        })
        .catch((error: unknown) => {
            console.error(error);
        })
    }

    return (
        <div className='profile-settings-wrapper'>
            <div className="item">
                <div className="item-icon">
                    <MdModeEdit fontSize={20} />
                </div>
                <div className="item-text">Редактировать</div>
            </div>
            <div className="item">
                <div className="item-icon">
                    <IoIosSettings fontSize={20} />
                </div>
                <div className="item-text">Настройки</div>
            </div>
            <div onClick={ handleLogout } className="item">
                <div className="item-icon">
                    <IoExit fontSize={20} />
                </div>
                <div className="item-text">Выйти</div>
            </div>
        </div>
    );
};

export default ProfileSettings;