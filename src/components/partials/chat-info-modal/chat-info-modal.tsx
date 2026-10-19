import { useEffect, useState } from 'react';
import { getBasicChatInfo } from '../../../models/chats/chats-api';
import type { IChatInfo } from '../../../models/chats/chats-interface';
import './chat-info-modal.scss';

interface IChatInfoModalProps {
    chatId: number
}

export const ChatInfoModal = ({ chatId } : IChatInfoModalProps) => {

    const [chatInfo, setChatInfo] = useState<IChatInfo | null>(null);

    useEffect(() => {
        getBasicChatInfo(chatId)
        .then((res) => {
            setChatInfo(res.data.chat);
        })
        .catch(error => console.log(error));
    }, []);

    return (
        <div className='chat-info-modal'>
            <div className="header">
                <div style={{ backgroundImage: `url(${import.meta.env.VITE_APP_SERVER_API}${ chatInfo?.image })` }} className="chat-image"></div>
                <div className="chat-header-info">
                    <div className="chat-name">{ chatInfo?.name }</div>
                    <div className="members-count">Участники: { chatInfo?.members.length }</div>
                </div>
            </div>
            <div className="content">
                <div className="description">
                    <strong>Описание: </strong> 
                    { chatInfo?.description }
                </div>
                <div className="date-of-creation">
                    <strong>Дата создания: </strong>
                    { chatInfo?.dateOfCreation }
                </div>
            </div>
            <div className="footer"></div>
        </div>
    );
};