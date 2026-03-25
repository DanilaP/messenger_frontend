import type { IDialog } from '../../../../../../../models/dialogs/dialogs-interface';
import type { IUser } from '../../../../../../../models/user/user-interface';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { List, useDynamicRowHeight, type ListImperativeAPI, type RowComponentProps } from 'react-window';
import DialogMessage from '../message/message';
import './messages-list.scss';

interface IDialogsMessages {
    dialogInfo: IDialog,
    user: Partial<IUser>,
    handleDeleteMessage: (messageId: number) => void
}

interface IRowData {
    messages: IDialog['messages'],
    dialogInfo: IDialog,
    user: Partial<IUser>,
    handleDeleteMessage: (messageId: number) => void
}

const DEFAULT_MESSAGE_HEIGHT = 120;

type IMessageRowProps = RowComponentProps<IRowData>;

const MESSAGE_GAP = 30;

const MessageRow = ({ index, style, ...data }: IMessageRowProps) => {
    const message = data.messages[index];

    if (!message) {
        return null;
    }

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
                />
            </div>
        </div>
    );
};

const DialogsMessages = ({ dialogInfo, user, handleDeleteMessage }: IDialogsMessages) => {
    
    const listRef = useRef<ListImperativeAPI>(null);
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
            if (raf1 !== null) {
                window.cancelAnimationFrame(raf1);
            }
            if (raf2 !== null) {
                window.cancelAnimationFrame(raf2);
            }
        };
    }, [dialogInfo.dialog_id, dialogInfo.messages.length, forceScrollToBottom]);

    const rowData = useMemo<IRowData>(() => {
        return {
            messages: dialogInfo.messages,
            dialogInfo,
            user,
            handleDeleteMessage
        };
    }, [dialogInfo, user, handleDeleteMessage]);

    return (
        <div className='messages-list'>
            <List
                listRef={listRef}
                className='messages-list-virtualized'
                rowCount={dialogInfo.messages.length}
                rowHeight={rowHeightCache}
                rowComponent={MessageRow}
                rowProps={rowData}
                overscanCount={4}
                style={{ height: '100%' }}
            />
        </div>
    );
};

export default DialogsMessages;