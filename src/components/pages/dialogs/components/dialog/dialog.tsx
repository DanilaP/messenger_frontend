import { memo } from 'react';
import type { IDialog } from '../../../../../models/dialogs/dialogs-interface';
import type { IUser } from '../../../../../models/user/user-interface';
import DialogHeader from './components/header/header';
import DialogFooter from './components/footer/footer';
import DialogsMessages from './components/messages-list/messages-list';
import './dialog.scss';

interface IDialogProps {
    dialogInfo: IDialog,
    user: Partial<IUser>
}

const Dialog = memo(({ dialogInfo, user }: IDialogProps) => {

    return (
        <div className='dialog-wrapper'>
            <DialogHeader opponent={dialogInfo.opponent} />
            <DialogsMessages user = { user } dialogInfo = { dialogInfo } />
            <DialogFooter />
        </div>
    );
});

export default Dialog;