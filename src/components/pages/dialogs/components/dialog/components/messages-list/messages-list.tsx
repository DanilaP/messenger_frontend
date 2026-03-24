import { Fragment } from 'react/jsx-runtime';
import type { IDialog } from '../../../../../../../models/dialogs/dialogs-interface';
import type { IUser } from '../../../../../../../models/user/user-interface';
import { useEffect, useRef } from 'react';
import DialogMessage from '../message/message';
import './messages-list.scss';

interface IDialogsMessages {
    dialogInfo: IDialog,
    user: Partial<IUser>,
    handleDeleteMessage: (messageId: number) => void
}

const DialogsMessages = ({ dialogInfo, user, handleDeleteMessage }: IDialogsMessages) => {

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, []);

    return (
        <div ref={messagesEndRef} className='messages-list'>
            {
                dialogInfo.messages.map(message => {
                    const senderInfo = message.sender_id === user.id ? user : dialogInfo.opponent
                    return (
                        <Fragment key={ message.message_id }>
                            <DialogMessage 
                                user = {user} 
                                senderInfo = {senderInfo} 
                                message = {message} 
                                dialogInfo = {dialogInfo}
                                handleDeleteMessage = {handleDeleteMessage}
                            />
                        </Fragment>
                    )
                })
            }
        </div>
    );
};

export default DialogsMessages;