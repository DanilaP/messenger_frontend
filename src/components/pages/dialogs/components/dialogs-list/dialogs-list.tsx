import type { IDialogListItem } from '../../../../../models/dialogs/dialogs-interface';
import DialogListItemWrapper from './components/dialog-list-item/dialog-list-item';
import './dialogs-list.scss';

interface IDialogsListProps {
    dialogsList: IDialogListItem[]
}

const DialogsList = ({ dialogsList }: IDialogsListProps) => {
    return (
        <div className='dialogs-list-wrapper'>
            {
                dialogsList.map(dialogListItem => {
                    return <DialogListItemWrapper dialogListItem = { dialogListItem } />
                })
            }
        </div>
    );
};

export default DialogsList;