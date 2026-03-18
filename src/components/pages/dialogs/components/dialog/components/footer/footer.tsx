import { Button, Input, type InputRef } from 'antd';
import { sendMessage } from '../../../../../../../models/dialogs/dialogs-api';
import { useRef } from 'react';
import type { IDialog, IMessage, ISendMessageResponse } from '../../../../../../../models/dialogs/dialogs-interface';
import './footer.scss';

interface IDialogFooterProps {
    dialogInfo: IDialog,
    handleSendMessage: (message: IMessage) => void 
}

const DialogFooter = ({ dialogInfo, handleSendMessage }: IDialogFooterProps) => {

    const messageInput = useRef<InputRef>(null);

    const handleSendButtonClick = async () => {
        if (messageInput.current) {
            if ('input' in messageInput.current && messageInput.current.input) {
                const text = messageInput.current.input.value;
                if (text !== "") {
                    const formData = new FormData();
                    formData.append('opponentId', dialogInfo.opponent.id.toString());
                    formData.append('text', text);

                    await sendMessage(formData)
                    .then((res: ISendMessageResponse) => {
                        handleSendMessage(res.data.createdMessage);
                    })
                    .catch((error: unknown) => {
                        console.error(error);
                    })
                }
            }
        }
    }

    return (
        <div className='dialog-footer'>
            <Input ref={messageInput} placeholder='Введите текст сообщения' />
            <Button onClick={handleSendButtonClick} type='primary'>Отправить</Button>
        </div>
    );
};

export default DialogFooter;