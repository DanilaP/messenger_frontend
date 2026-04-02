import { memo, useEffect } from 'react';
import { readMessages } from '../../../../../models/dialogs/dialogs-api';
import type { IDialog, IMessage } from '../../../../../models/dialogs/dialogs-interface';
import type { IUser } from '../../../../../models/user/user-interface';
import type { IFile } from '../../../../../interfaces/interfaces';
import DialogHeader from './components/header/header';
import DialogFooter from './components/footer/footer';
import DialogsMessages from './components/messages-list/messages-list';
import './dialog.scss';


interface IDialogProps {
    dialogInfo: IDialog | null,
    user: Partial<IUser>,
    handleSendMessage: (message: IMessage) => void,
    handleDeleteMessage: (messagesIds: number[]) => void,
    handleChangeMessage: (message: IMessage, files: IFile[]) => void
}

const Dialog = memo(({ 
    dialogInfo, 
    user, 
    handleSendMessage, 
    handleDeleteMessage,
    handleChangeMessage
}: IDialogProps) => {

    useEffect(() => {
        if (dialogInfo) {
            readMessages(dialogInfo?.dialog_id, dialogInfo?.opponent.id)
            .then(res => {
                console.log(res);
            })
            .catch((error) => {
                console.error(error);
            })
        }
    }, [dialogInfo]);

    if (!dialogInfo) {
        return (
            <div className="dialog-wrapper-empty">
                <div className="message">Здесь пока ничего нет...</div>
            </div>
        )
    }
    return (
        <div className='dialog-wrapper'>
            <DialogHeader opponent={dialogInfo.opponent} />
            <DialogsMessages 
                user={user} 
                dialogInfo={dialogInfo} 
                handleDeleteMessage={handleDeleteMessage}
                handleChangeMessage={handleChangeMessage}
            />
            <DialogFooter handleSendMessage = {handleSendMessage} dialogInfo={dialogInfo} />
        </div>
    );
});

export default Dialog;