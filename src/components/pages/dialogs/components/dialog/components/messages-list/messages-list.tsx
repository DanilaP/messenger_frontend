import { Fragment } from 'react/jsx-runtime';
import type { IDialog } from '../../../../../../../models/dialogs/dialogs-interface';
import type { IUser } from '../../../../../../../models/user/user-interface';
import DialogMessage from '../message/message';
import './messages-list.scss';

interface IDialogsMessages {
    dialogInfo: IDialog,
    user: Partial<IUser>
}

const DialogsMessages = ({ dialogInfo, user }: IDialogsMessages) => {

    return (
        <div className='messages-list'>
            {
                dialogInfo.messages.map(message => {
                    const senderInfo = message.sender_id === user.id ? user : dialogInfo.opponent
                    return (
                        <Fragment key={ message.message_id }>
                            <DialogMessage 
                                user={user} 
                                senderInfo = {senderInfo} 
                                message = {message} 
                            />
                        </Fragment>
                    )
                })
            }
        </div>
    );
};

export default DialogsMessages;