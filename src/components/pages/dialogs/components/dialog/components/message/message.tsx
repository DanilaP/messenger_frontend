import { Dropdown, type MenuProps } from 'antd';
import type { IDialog, IMessage, IOpponent } from '../../../../../../../models/dialogs/dialogs-interface';
import type { IUser } from '../../../../../../../models/user/user-interface';
import { deleteMessage } from '../../../../../../../models/dialogs/dialogs-api';
import FileList from '../../../../../../partials/file-list/file-list';
import './message.scss';

interface IMessageProps {
    senderInfo: Partial<IUser> | IOpponent,
    message: IMessage,
    user: Partial<IUser>,
    dialogInfo: IDialog,
    handleDeleteMessage: (message_id: number) => void
}

const DialogMessage = ({ senderInfo, message, user, dialogInfo, handleDeleteMessage }: IMessageProps) => {

    const items: MenuProps['items'] = [
        {
            label: 'Редактировать',
            key: '1',
        },
        {
            label: 'Удалить',
            key: '2',
        }
    ];

    const deleteMessageFromDialog = async () => {
        await deleteMessage(dialogInfo.dialog_id, message.message_id)
        .then(() => {
            handleDeleteMessage(message.message_id);
        })
        .catch((error: unknown) => {
            console.error(error);
        })
    }

    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        if (key === '2') {
            deleteMessageFromDialog();
        }
    };

    return (
        <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['contextMenu']}>
            <div className={`message-wrapper ${ senderInfo.id === user.id ? `user-message` : `opponent-message` }`}>
                <div className="message">
                    <div className={`text-content ${ senderInfo.id === user.id ? `user-message` : `opponent-message` }`}>
                        <div className="avatar">
                            <img className='image' src = {senderInfo.avatar} />
                        </div>
                        <div className="text">{message.text}</div>
                    </div>
                    <FileList files={ message.files } />
                    <div className="date">{message.date}</div>
                </div>
            </div>
        </Dropdown>
    );
};

export default DialogMessage;