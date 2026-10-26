import type { IChatMessageSenderWithRole } from '../../../../../../../models/chats/chats-interface';
import './member-card.scss';

interface IMemberCardProps {
    member: IChatMessageSenderWithRole
}

export const MemberCard = ({ member } : IMemberCardProps) => {
    return (
        <div className='member-card'>
            <div 
                style={{ backgroundImage: `url(${ import.meta.env.VITE_APP_SERVER_API }${ member.avatar })` }} 
                className="member-avatar"
            >
            </div>
            <div className="member-name-and-surname">
                <div className="member-name">{ member.name }</div>
                <div className="member-surname">{ member.surname }</div>
            </div>
            <div className="member-role">{ member.role }</div>
        </div>
    );
};