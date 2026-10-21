import { useEffect, useState } from 'react';
import { getBasicChatInfo } from '../../../models/chats/chats-api';
import { IoPeople } from "react-icons/io5";
import { MdDateRange, MdEdit, MdDescription } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { Button } from 'antd';
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
                    <div className="members-count">
                        <IoPeople /> Участники: { chatInfo?.members.length }
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="description">
                    <MdDescription />
                    <strong>Описание: </strong> 
                    { chatInfo?.description }
                </div>
                <div className="date-of-creation">
                    <MdDateRange />
                    <strong>Дата создания: </strong>
                    { chatInfo?.dateOfCreation }
                </div>
            </div>
            <div className="footer">
                <div className="settings">
                    <Button>
                        Редактировать
                        <MdEdit fontSize={15} />
                    </Button>
                    <Button>
                        Пригласить
                        <FaUserPlus fontSize={15} />
                    </Button>
                </div>
            </div>
        </div>
    );
};