import { MembersList } from './components/members-list/members-list';
import { useEffect, useState } from 'react';
import { getChatMembers } from '../../../models/chats/chats-api';
import type { IChatMessageSenderWithRole } from '../../../models/chats/chats-interface';
import './chat-members-modal.scss';

interface IChatMembersModalProps {
    userRole: string,
    chatId: number
}

export const ChatMembersModal = ({ userRole, chatId }: IChatMembersModalProps) => {

    const [members, setMembers] = useState<IChatMessageSenderWithRole[]>([]);
    const [cursorId, setCursor] = useState<number | null>(null);
    const [mode, setMode] = useState<"prev" | "next">("next");

    useEffect(() => {
        getChatMembers(chatId, mode, cursorId)
        .then(res => {
            setMembers(res.data.members);
        })
        .catch(error => console.log(error));
    }, []);

    return (
        <div className='chat-members-modal'>
            <MembersList userRole={ userRole } members = { members } />
        </div>
    );
};