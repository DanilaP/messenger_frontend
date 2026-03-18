import { memo } from 'react';
import type { IDialogListItem, IOpponent } from '../../../../../models/dialogs/dialogs-interface';
import DialogListItemWrapper from './components/dialog-list-item/dialog-list-item';
import './dialogs-list.scss';

interface IDialogsListProps {
    dialogsList: IDialogListItem[],
    handleFetchDialogInfo: (dialogId: number, opponent: IOpponent) => void
}

const DialogsList = memo(({ dialogsList, handleFetchDialogInfo }: IDialogsListProps) => {

    const handleDialogListItemClick = (dialogId: number, opponent: IOpponent) => {
        handleFetchDialogInfo(dialogId, opponent);
    }

    return (
        <div className='dialogs-list-wrapper'>
            {
                dialogsList.map(dialogListItem => {
                    return (
                        <div 
                            key={ dialogListItem.dialog_id }
                            onClick={ () => handleDialogListItemClick(dialogListItem.dialog_id, dialogListItem.opponent) } 
                            className="dialog-list-item-wrapper-main"
                        >
                            <DialogListItemWrapper  
                                dialogListItem = { dialogListItem } 
                            />
                        </div>
                    )
                })
            }
        </div>
    );
});

export default DialogsList;