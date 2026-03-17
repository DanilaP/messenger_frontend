import type { IUser } from '../../../../../models/user/user-interface';
import './header.scss';

interface IProfileHeader {
    user: Partial<IUser>
}

const ProfileHeader = ({ user }: IProfileHeader) => {
    return (
        <div className="profile-header">
            <div className="profile-avatar">
                <img src = {user.avatar} className="profile-avatar-image"/>
            </div>
            <div className="profile-name">{user.name} {user.surname}</div>
            <div className="profile-status">{user.status}</div>
        </div>
    );
};

export default ProfileHeader;