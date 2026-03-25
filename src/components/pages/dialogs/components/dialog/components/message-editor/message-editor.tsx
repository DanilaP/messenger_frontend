import { Button, Input } from 'antd';
import { useState } from 'react';
import type { IMessage } from '../../../../../../../models/dialogs/dialogs-interface';
import './message-editor.scss';

interface IMessageEditorProps {
    message: IMessage
    handleChangeMessage: (msg: IMessage) => void,
    handleCloseModal: () => void
}

const MessageEditor = ({ message, handleChangeMessage, handleCloseModal }: IMessageEditorProps) => {

    const [modifiedMessage, setModifiedMessage] = useState<IMessage>(message);

    const handleConfirmButtonClick = () => {
        handleChangeMessage(modifiedMessage);
        handleCloseModal();
    }

    return (
        <div className='message-editor'>
            <Input 
                defaultValue={message.text}
                onChange={
                    (e) => setModifiedMessage({...modifiedMessage, text: e.target.value})
                } 
                placeholder='Текст сообщения' 
            />
            <Button onClick={handleConfirmButtonClick} type="primary">Подтвердить</Button>
        </div>
    );
};

export default MessageEditor;