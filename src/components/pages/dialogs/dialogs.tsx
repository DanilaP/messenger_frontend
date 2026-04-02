import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getDialogInfo, getDialogsList } from '../../../models/dialogs/dialogs-api';
import { parseCustomDate } from '../../../helpers/parsers/parsers';
import { useNavigate, useParams } from 'react-router';
import { type IDialog, type IDialogListItem, type IMessage } from '../../../models/dialogs/dialogs-interface';
import type { RootState } from '../../../stores/root/root';
import type { IFile } from '../../../interfaces/interfaces';
import DialogsList from './components/dialogs-list/dialogs-list';
import Dialog from './components/dialog/dialog';
import Loader from '../../partials/loader/loader';
import './dialogs.scss';

const Dialogs = () => {
    
    const { id } = useParams<{ id: string }>();
    const user = useSelector((state: RootState) => state.user.user);
    const [dialogsList, setDialogsList] = useState<IDialogListItem[]>([]);
    const [dialogInfo, setDialogInfo] = useState<IDialog | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSendMessage = (message: IMessage) => {
        if (dialogInfo) {
            setDialogInfo({
                ...dialogInfo,
                messages: [...dialogInfo.messages, message]
            });
        }
        handleUpdateLastMessageBeforeSending(message);
    }

    const handleDeleteMessage = (messagesIds: number[]) => {
        if (dialogInfo) {
            const updatedDialogInfo = {
                ...dialogInfo,
                messages: dialogInfo.messages.filter(message => {
                    if (messagesIds.find(id => message.message_id === id)) {
                        return false;
                    }
                    return true;
                })
            }
            setDialogInfo(updatedDialogInfo);
            handleUpdateLastMessageBeforeDeleting(updatedDialogInfo);
        }
    }

    const handleChangeMessage = (message: IMessage, files: IFile[]) => {
        if (dialogInfo) {
            const updatedDialogInfo = {
                ...dialogInfo,
                messages: dialogInfo.messages.map(msg => {
                    if (msg.message_id === message.message_id) {
                        return {
                            ...msg,
                            text: message.text,
                            files: files
                        }
                    }
                    return msg;
                })
            }
            setDialogInfo(updatedDialogInfo);
            handleUpdateLastMessageBeforeChanging(message);
        }
    }
    
    const handleUpdateLastMessageBeforeChanging = (message: IMessage) => {
        setDialogsList(prev => {
            const updatedList = prev.map(dialogListItem => {
                if (dialogListItem.dialog_id === dialogInfo?.dialog_id) {
                    if (dialogListItem.last_message.id === message.message_id) {
                        return {
                            ...dialogListItem,
                            last_message: {
                                id: dialogListItem.last_message.id,
                                text: message.text !== "" ? message.text : "Файл",
                                date: message.date
                            }
                        }
                    }
                    return dialogListItem;
                }
                return dialogListItem;
            });
            return handleSortDialogsListByLastMessageDate(updatedList);
        });
    }

    const handleUpdateLastMessageBeforeSending = (message: IMessage) => {
        setDialogsList(prev => {
            const updatedList = prev.map(dialogListItem => {
                if (dialogListItem.dialog_id === dialogInfo?.dialog_id) {
                    return {
                        ...dialogListItem,
                        last_message: {
                            id: dialogListItem.last_message.id,
                            text: message.text !== "" ? message.text : "Файл",
                            date: message.date
                        }
                    }
                }
                return dialogListItem;
            });
            return handleSortDialogsListByLastMessageDate(updatedList);
        });
    }

    const handleUpdateLastMessageBeforeDeleting = (dialogInfo: IDialog) => {
        const lastMessage = dialogInfo.messages.sort()[dialogInfo.messages.length - 1];
        setDialogsList(prev => {
            const updatedList = prev.map(dialogListItem => {
                if (dialogListItem.dialog_id === dialogInfo?.dialog_id) {
                    return {
                        ...dialogListItem,
                        last_message: {
                            id: dialogListItem.last_message.id,
                            text: lastMessage.text !== "" ? lastMessage.text : "Файл",
                            date: lastMessage.date
                        }
                    }
                }
                return dialogListItem;
            });
            return handleSortDialogsListByLastMessageDate(updatedList);
        });
    }

    const handleSortDialogsListByLastMessageDate = (currentDialogList: IDialogListItem[]) => {
        const result = [...currentDialogList];
        result.sort((a, b) => {
            const dateA = parseCustomDate(a.last_message.date);
            const dateB = parseCustomDate(b.last_message.date);
            return dateB.getTime() - dateA.getTime();
        });
        return result;
    };

    const handleChangeDialog = (dialogId: number) => {
        navigate(`/main/dialogs/${dialogId}`);
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(false);

            try {
                const dialogsRes = await getDialogsList();
                setDialogsList(handleSortDialogsListByLastMessageDate(dialogsRes.data.dialogs));

                if (id) {
                    const dialogRes = await getDialogInfo(Number(id));
                    setDialogInfo({
                        dialog_id: dialogRes.data.dialog.id,
                        messages: dialogRes.data.dialog.messages,
                        opponent: dialogRes.data.dialog.opponent,
                    });
                }
            } 
            catch (error) {
                console.error(error);
            } 
            finally {
                setIsLoading(true);
            }
        };
        fetchData();
    }, [id]);

    if (!isLoading) {
        return (
            <Loader />
        )
    }
    return (
        <div className='dialogs-wrapper'>
            <DialogsList 
                dialogsList={dialogsList} 
                handleChangeDialog={handleChangeDialog}
            />
            {  
                user && 
                    <Dialog 
                        user={user} 
                        dialogInfo={dialogInfo} 
                        handleChangeMessage={handleChangeMessage}
                        handleSendMessage={handleSendMessage} 
                        handleDeleteMessage={handleDeleteMessage}
                    /> 
            }
        </div>
    );
};

export default Dialogs;