import { Button, Input } from 'antd';
import { sendMessage } from '../../../../../../../models/dialogs/dialogs-api';
import { memo, useState } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';
import type { IDialog, IMessage, ISendMessageResponse } from '../../../../../../../models/dialogs/dialogs-interface';
import FileUploader from '../file-uploader/file-uploader';
import EmojiPicker from '../../../../../../partials/emoji-picker/emoji-picker';
import './footer.scss';

interface IDialogFooterProps {
    dialogInfo: IDialog,
    handleSendMessage: (message: IMessage) => void 
}

const DialogFooter = memo(({ 
    dialogInfo, 
    handleSendMessage
}: IDialogFooterProps) => {

    const [messageText, setMessageText] = useState<string>("");

    const handleSendButtonClick = async () => {
        if (messageText !== "") {
            const formData = new FormData();
            formData.append('opponentId', dialogInfo.opponent.id.toString());
            formData.append('text', messageText);

            await sendMessage(formData)
            .then((res: ISendMessageResponse) => {
                handleClearMessageText();
                handleSendMessage(res.data.createdMessage);
            })
            .catch((error: unknown) => {
                console.error(error);
            })
        }
    }

    const handleSendMessageWithFiles = async (text: string, files: UploadFile[]) => {
        if (text !== "") {
            const formData = new FormData();
            formData.append('opponentId', dialogInfo.opponent.id.toString());
            formData.append('text', text);
            
            files.forEach(file => {
                if (file.originFileObj) {
                    formData.append('files', file.originFileObj);
                }
            });

            await sendMessage(formData)
            .then((res: ISendMessageResponse) => {
                handleSendMessage(res.data.createdMessage);
            })
            .catch((error: unknown) => {
                console.error(error);
            })
        }
    }

    const handleClearMessageText = () => {
        setMessageText("");
    }

    return (
        <div className='dialog-footer'>
            <Input 
                value={messageText} 
                onChange = {(e) => setMessageText(e.target.value)} 
                onPressEnter={handleSendButtonClick}
                placeholder='Введите текст сообщения' 
            />
            {   
                <FileUploader
                    handleSendMessageWithFiles = {handleSendMessageWithFiles}
                    handleClearMessageText = {handleClearMessageText}
                    message = {messageText} 
                /> 
            }
            {
                <EmojiPicker />
            }
            <Button onClick={handleSendButtonClick} type='primary'>Отправить</Button>
        </div>
    );
});

export default DialogFooter;