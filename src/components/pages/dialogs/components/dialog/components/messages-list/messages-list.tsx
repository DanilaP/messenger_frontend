import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { List, useDynamicRowHeight, type ListImperativeAPI, type RowComponentProps } from 'react-window';
import { Button } from 'antd';
import { deleteMessage } from '../../../../../../../models/dialogs/dialogs-api';
import { FaCircleChevronDown } from "react-icons/fa6";
import type { IFile } from '../../../../../../../interfaces/files';
import type { IDialog, IMessage } from '../../../../../../../models/dialogs/dialogs-interface';
import type { IUser } from '../../../../../../../models/user/user-interface';
import DialogMessage from '../message/message';
import './messages-list.scss';

interface IDialogsMessages {
    dialogInfo: IDialog,
    user: Partial<IUser>,
    handleDeleteMessage: (messagesIds: number[]) => void,
    handleChangeMessage: (message: IMessage, files: IFile[]) => void,
    // Опционально: колбэк, который будет вызываться при изменении выбранных сообщений
    onSelectedMessagesChange?: (selectedMessages: IMessage[]) => void,
}

interface IRowData {
    messages: IDialog['messages'],
    dialogInfo: IDialog,
    user: Partial<IUser>,
    selectedMessages: IMessage[],
    handleDeleteMessage: (messagesIds: number[]) => void,
    handleChangeMessage: (message: IMessage, files: IFile[]) => void,
    handleChooseMessage: (message: IMessage) => void,
}

const DEFAULT_MESSAGE_HEIGHT = 120;

type IMessageRowProps = RowComponentProps<IRowData>;

const MESSAGE_GAP = 10;

const MessageRow = ({ index, style, ...data }: IMessageRowProps) => {
    const message = data.messages[index];

    if (!message) {
        return null;
    }

    // Проверяем, выбрано ли текущее сообщение
    const isSelected = data.selectedMessages.some(
        selected => selected.message_id === message.message_id
    );

    const senderInfo = message.sender_id === data.user.id ? data.user : data.dialogInfo.opponent;

    return (
        <div style={style}>
            <div style={{ paddingBottom: MESSAGE_GAP }}>
                <DialogMessage
                    user={data.user}
                    senderInfo={senderInfo}
                    message={message}
                    dialogInfo={data.dialogInfo}
                    handleDeleteMessage={data.handleDeleteMessage}
                    handleChangeMessage={data.handleChangeMessage}
                    handleChooseMessage={data.handleChooseMessage}
                    isSelected={isSelected}
                />
            </div>
        </div>
    );
};

const DialogsMessages = ({ 
    dialogInfo, 
    user, 
    handleDeleteMessage, 
    handleChangeMessage,
    onSelectedMessagesChange,
}: IDialogsMessages) => {
    
    const listRef = useRef<ListImperativeAPI>(null);
    const [selectedMessages, setSelectedMessages] = useState<IMessage[]>([]);
    const [isScrollAtBottom, setIsScrollAtBottom] = useState(true);

    const rowHeightCache = useDynamicRowHeight({
        defaultRowHeight: DEFAULT_MESSAGE_HEIGHT,
        key: `${dialogInfo.dialog_id}-${dialogInfo.messages.length}`
    });

    const forceScrollToBottom = useCallback(() => {
        const element = listRef.current?.element;
        if (!element) {
            return;
        }
        element.scrollTop = element.scrollHeight;
    }, []);

    // Функция выбора/снятия выбора сообщения
    const handleChooseMessage = useCallback((message: IMessage) => {
        setSelectedMessages(prev => {
            const isAlreadySelected = prev.some(m => m.message_id === message.message_id);
            let newSelected: IMessage[];
            if (isAlreadySelected) {
                newSelected = prev.filter(m => m.message_id !== message.message_id);
            } else {
                newSelected = [...prev, message];
            }
            // Если родитель передал колбэк, уведомляем его об изменении
            onSelectedMessagesChange?.(newSelected);
            return newSelected;
        });
    }, [onSelectedMessagesChange]);

    const handleDeleteButtonClick = async () => {
        if (selectedMessages.length !== 0) {
            const selectedMessagesIds = selectedMessages.map(msg => msg.message_id);

            await deleteMessage(dialogInfo.dialog_id, selectedMessagesIds)
            .then(() => {
                setSelectedMessages([]);
                handleDeleteMessage(selectedMessagesIds);
            })
            .catch((error: unknown) => {
                console.error(error);
            })
        }
    }

    const rowData = useMemo<IRowData>(() => {
        return {
            messages: dialogInfo.messages,
            dialogInfo,
            user,
            selectedMessages,
            handleDeleteMessage,
            handleChangeMessage,
            handleChooseMessage,
        };
    }, [dialogInfo, user, selectedMessages, handleDeleteMessage, handleChangeMessage, handleChooseMessage]);

    // Скролл вниз при добавлении новых сообщений
    useEffect(() => {
        if (dialogInfo.messages.length === 0) {
            return;
        }

        let raf1: number | null = null;
        let raf2: number | null = null;
        const timeoutId = window.setTimeout(() => {
            forceScrollToBottom();

            raf1 = window.requestAnimationFrame(() => {
                forceScrollToBottom();
                raf2 = window.requestAnimationFrame(() => {
                    forceScrollToBottom();
                });
            });
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
            if (raf1 !== null) window.cancelAnimationFrame(raf1);
            if (raf2 !== null) window.cancelAnimationFrame(raf2);
        };
    }, [dialogInfo.dialog_id, dialogInfo.messages.length, forceScrollToBottom]);
    
    const handleScroll = useCallback(() => {
        const element = listRef.current?.element;
        if (!element) return;
        const { scrollTop, scrollHeight, clientHeight } = element;
        const atBottom = scrollHeight - scrollTop - clientHeight < 5;
        setIsScrollAtBottom(atBottom);
    }, []);

    return (
        <div className='messages-list'>
            <List
                onScroll={handleScroll}
                listRef={listRef}
                className='messages-list-virtualized'
                rowCount={dialogInfo.messages.length}
                rowHeight={rowHeightCache}
                rowComponent={MessageRow}
                rowProps={rowData}
                overscanCount={4}
                style={{ height: '100%' }}
            />
            {
                selectedMessages.length !== 0 &&
                    <div className="selected-messages-wrapper">
                        Выбранных сообщений: { selectedMessages.length }
                        <Button 
                            className='deleting-button' 
                            onClick={handleDeleteButtonClick} 
                            type='primary'
                        >
                            Удалить
                        </Button>
                    </div>
            }
            {   
                !isScrollAtBottom &&
                    <div onClick={forceScrollToBottom} className="scroll-down-button">
                        <FaCircleChevronDown fontSize={30} />
                    </div>
            }
        </div>
    );
};

export default DialogsMessages;