import { Dropdown, Modal, type MenuProps, type UploadFile } from 'antd';
import type { IDialog, IMessage, IOpponent } from '../../../../../../../models/dialogs/dialogs-interface';
import type { IUser } from '../../../../../../../models/user/user-interface';
import { deleteMessage } from '../../../../../../../models/dialogs/dialogs-api';
import { Fragment, memo, useState } from 'react';
import FileList from '../../../../../../partials/file-list/file-list';
import MessageEditor from '../message-editor/message-editor';
import './message.scss';

interface IMessageProps {
    senderInfo: Partial<IUser> | IOpponent,
    message: IMessage,
    user: Partial<IUser>,
    dialogInfo: IDialog,
    handleDeleteMessage: (message_id: number) => void,
    handleChangeMessage: (message: IMessage, files: UploadFile[]) => void
}

const DialogMessage = memo(({ 
    senderInfo, 
    message, 
    user, 
    dialogInfo, 
    handleDeleteMessage,
    handleChangeMessage
}: IMessageProps) => {

    const [isModifyMessageModalOpen, setIsModifyMessageModalOpen] = useState<boolean>(false);

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

    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        if (key === '1') {
            handleChangeModifyMessageModalVisibility();
        }
        if (key === '2') {
            deleteMessageFromDialog();
        }
    };

    const deleteMessageFromDialog = async () => {
        await deleteMessage(dialogInfo.dialog_id, message.message_id)
        .then(() => {
            handleDeleteMessage(message.message_id);
        })
        .catch((error: unknown) => {
            console.error(error);
        })
    }

    const handleChangeModifyMessageModalVisibility = () => {
        setIsModifyMessageModalOpen(!isModifyMessageModalOpen);
    }

    const changeMessage = (modifiedMessage: IMessage, files: UploadFile[]) => {
        handleChangeMessage(modifiedMessage, files);
    }

    return (
        <Fragment>
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
            {
                <Modal
                    centered
                    destroyOnHidden
                    footer={null}
                    title="Редактирование сообщения"
                    open={isModifyMessageModalOpen}
                    onCancel={handleChangeModifyMessageModalVisibility}
                >
                    <MessageEditor 
                        message={message}
                        handleChangeMessage={changeMessage}
                        handleCloseModal={handleChangeModifyMessageModalVisibility}
                    />
                </Modal>
            }
        </Fragment>
    );
});

export default DialogMessage;