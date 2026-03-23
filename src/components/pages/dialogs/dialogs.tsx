import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getDialogInfo, getDialogsList } from '../../../models/dialogs/dialogs-api';
import { type IDialog, type IDialogListItem, type IGetDialogResponse, type IGetDialogsListResponse, type IMessage, type IOpponent } from '../../../models/dialogs/dialogs-interface';
import { type UserStore } from '../../../stores/user/user';
import DialogsList from './components/dialogs-list/dialogs-list';
import Dialog from './components/dialog/dialog';
import Loader from '../../partials/loader/loader';
import './dialogs.scss';

const Dialogs = () => {

    const user = useSelector((state: UserStore) => state.user);
    const [dialogsList, setDialogsList] = useState<IDialogListItem[]>([]);
    const [dialogInfo, setDialogInfo] = useState<IDialog | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFetchDialogInfo = (choosenDialogId: number, opponent: IOpponent) => {
        setIsLoading(false);
        if (choosenDialogId) {
            getDialogInfo(choosenDialogId)
            .then((res: IGetDialogResponse) => {
                setIsLoading(true);
                setDialogInfo({
                    dialog_id: choosenDialogId,
                    messages: res.data.dialog,
                    opponent: opponent
                })
            })
            .catch((error: unknown) => {
                console.error(error);
            })
        }
    }

    const handleSendMessage = (message: IMessage) => {
        if (dialogInfo) {
            setDialogInfo({
                ...dialogInfo,
                messages: [...dialogInfo.messages, message]
            })
        }
        handleUpdateLastMessageBeforeSending(message);
    }

    const handleDeleteMessage = (message_id: number) => {
        if (dialogInfo) {
            const updatedDialogInfo = {
                ...dialogInfo,
                messages: dialogInfo.messages.filter(message => message.message_id !== message_id)
            }
            setDialogInfo(updatedDialogInfo);
            handleUpdatedLastMessageBeforeDeleting(updatedDialogInfo);
        }
    }

    const handleUpdateLastMessageBeforeSending = (message: IMessage) => {
        setDialogsList(prev => {
            return prev.map(dialogListItem => {
                if (dialogListItem.dialog_id === dialogInfo?.dialog_id) {
                    return {
                        ...dialogListItem,
                        last_message: {
                            text: message.text !== "" ? message.text : "Файл",
                            date: message.date
                        }
                    }
                }
                return dialogListItem;
            })
        });
    }

    const handleUpdatedLastMessageBeforeDeleting = (dialogInfo: IDialog) => {
        const lastMessage = dialogInfo.messages.sort()[dialogInfo.messages.length - 1];
        setDialogsList(prev => {
            return prev.map(dialogListItem => {
                if (dialogListItem.dialog_id === dialogInfo?.dialog_id) {
                    return {
                        ...dialogListItem,
                        last_message: {
                            text: lastMessage.text !== "" ? lastMessage.text : "Файл",
                            date: lastMessage.date
                        }
                    }
                }
                return dialogListItem;
            })
        });
    }

    useEffect(() => {
        getDialogsList()
        .then((res: IGetDialogsListResponse) => {
            setIsLoading(true);
            setDialogsList(res.data.dialogs);
        })
        .catch((error: unknown) => {
            console.error(error);
        })
    }, []);

    if (!isLoading) {
        return (
            <Loader />
        )
    }
    return (
        <div className='dialogs-wrapper'>
            <DialogsList handleFetchDialogInfo = {handleFetchDialogInfo} dialogsList = {dialogsList} />
            {  
                user && 
                    <Dialog 
                        handleSendMessage = {handleSendMessage} 
                        handleDeleteMessage = {handleDeleteMessage}
                        user = {user} 
                        dialogInfo={dialogInfo} 
                    /> 
            }
        </div>
    );
};

export default Dialogs;