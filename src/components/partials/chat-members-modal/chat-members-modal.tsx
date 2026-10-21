import { MembersList } from './components/members-list/members-list';
import './chat-members-modal.scss';

interface IChatMembersModalProps {
    userRole: string,
}

export const ChatMembersModal = ({ userRole }: IChatMembersModalProps) => {
    return (
        <div className='chat-members'>
            <MembersList userRole={ userRole } />
        </div>
    );
};