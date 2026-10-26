import type { IChatMessageSenderWithRole } from '../../../../../models/chats/chats-interface';
import { MemberCard } from './components/member-card/member-card';
import './members-list.scss';

export interface IMember {
    id: number,
    name: string,
    surname: string,
    avatar: string
}

interface IMembersListProps {
    userRole: string,
    members: IChatMessageSenderWithRole[]
}

export const MembersList = ({ userRole, members }: IMembersListProps) => {
    
    return (
        <div className='members-list'>
            {
                members.map(member => {
                    return <MemberCard key={ member.id } member={ member } />
                })
            }
        </div>
    );
};