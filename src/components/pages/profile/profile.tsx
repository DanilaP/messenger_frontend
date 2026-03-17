import { useEffect, useState } from 'react';
import { getUserInfo } from '../../../models/user/user-api';
import type { IGetUserInfoResponse, IUser } from '../../../models/user/user-interface';
import Loader from '../../partials/loader/loader';
import ProfileSettings from './components/settings/settings';
import ProfileHeader from './components/header/header';
import './profile.scss';

const Profile = () => {

    const [user, setUser] = useState<Partial<IUser> | null>(null);

    const fetchUserInfo = async () => {
        getUserInfo()
        .then((res: IGetUserInfoResponse) => {
            setUser(res.data.user);
        })
        .catch((error: unknown) => {
            console.error(error);
        })
    }

    useEffect(() => {
        fetchUserInfo();
    }, []);

    if (user) {
        return (
            <div className='profile-wrapper'>
                <div className="profile-wrapper-header">
                    <ProfileHeader user={ user } />
                </div>
                <div className="profile-wrapper-settings">
                    <ProfileSettings />
                </div>
            </div>
        );
    }
    return <Loader />
};

export default Profile;