import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getDialogsList } from '../../../models/dialogs/dialogs-api';
import { type IDialogListItem, type IGetDialogsListResponse, type IMessage } from '../../../models/dialogs/dialogs-interface';
import { type UserStore } from '../../../stores/user/user';
import DialogsList from './components/dialogs-list/dialogs-list';
import Dialog from './components/dialog/dialog';
import './dialogs.scss';

const Dialogs = () => {

    const user = useSelector((state: UserStore) => state.user);
    const [dialogsList, setDialogsList] = useState<IDialogListItem[]>([]);
    const [dialog, setDialog] = useState<IMessage[]>([]);

    useEffect(() => {
        getDialogsList()
        .then((res: IGetDialogsListResponse) => {
            setDialogsList(res.data.dialogs);
        })
        .catch((error: unknown) => {
            console.error(error);
        })
    }, []);
    
    return (
        <div className='dialogs-wrapper'>
            <DialogsList dialogsList = { dialogsList } />
            <Dialog />
        </div>
    );
};

export default Dialogs;