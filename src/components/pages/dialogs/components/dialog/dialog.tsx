import { memo } from 'react';
import type { IDialog, IMessage } from '../../../../../models/dialogs/dialogs-interface';
import type { IUser } from '../../../../../models/user/user-interface';
import DialogHeader from './components/header/header';
import DialogFooter from './components/footer/footer';
import DialogsMessages from './components/messages-list/messages-list';
import './dialog.scss';

interface IDialogProps {
    dialogInfo: IDialog | null,
    user: Partial<IUser>,
    handleSendMessage: (message: IMessage) => void,
    handleDeleteMessage: (message_id: number) => void
}

const Dialog = memo(({ dialogInfo, user, handleSendMessage, handleDeleteMessage }: IDialogProps) => {

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
                user = {user} 
                dialogInfo = {dialogInfo} 
                handleDeleteMessage = {handleDeleteMessage}
            />
            <DialogFooter handleSendMessage = {handleSendMessage} dialogInfo={dialogInfo} />
        </div>
    );
});

export default Dialog;