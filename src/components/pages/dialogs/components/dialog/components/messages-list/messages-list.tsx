import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { deleteMessage } from "../../../../../../../models/dialogs/dialogs-api";
import { FaCircleChevronDown } from "react-icons/fa6";
import type { IFile } from "../../../../../../../interfaces/files";
import type { IDialog, IMessage } from "../../../../../../../models/dialogs/dialogs-interface";
import type { IUser } from "../../../../../../../models/user/user-interface";
import DialogMessage from "../message/message";
import VirtualizedList, { type VirtualizedListRef } from "../../../../../../partials/virtualized-list/virtualized-list";
import "./messages-list.scss";

interface IDialogsMessages {
    dialogInfo: IDialog,
    user: Partial<IUser>,
    handleDeleteMessage: (messagesIds: number[]) => void,
    handleChangeMessage: (message: IMessage, files: IFile[]) => void,
    handleGetNextMessages: () => void,
    onSelectedMessagesChange?: (selectedMessages: IMessage[]) => void,
}

const MESSAGE_GAP = 10;

const DialogsMessages = ({ 
	dialogInfo, 
	user, 
	handleDeleteMessage, 
	handleChangeMessage,
	handleGetNextMessages,
	onSelectedMessagesChange,
}: IDialogsMessages) => {
    
	const listRef = useRef<VirtualizedListRef>(null);
	const [selectedMessages, setSelectedMessages] = useState<IMessage[]>([]);
	const [isScrollAtBottom, setIsScrollAtBottom] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [containerHeight, setContainerHeight] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const savedScrollTopRef = useRef<number | null>(null);
	const savedScrollHeightRef = useRef<number | null>(null);
	// Флаг для первоначального скролла (чтобы не вызывать лишний раз)
	const initialScrollDoneRef = useRef(false);

	// Отслеживаем изменения для умного скролла
	const prevMessagesLengthRef = useRef(dialogInfo.messages.length);
	const prevFirstMessageIdRef = useRef(dialogInfo.messages[0]?.message_id);

	// Измеряем высоту контейнера
	useEffect(() => {
		const measureHeight = () => {
			if (containerRef.current) {
				setContainerHeight(containerRef.current.clientHeight);
			}
		};
		measureHeight();
		window.addEventListener("resize", measureHeight);
		const observer = new ResizeObserver(measureHeight);
		if (containerRef.current) observer.observe(containerRef.current);
		return () => {
			window.removeEventListener("resize", measureHeight);
			observer.disconnect();
		};
	}, []);

	const forceScrollToBottom = useCallback(() => {
		listRef.current?.scrollToBottom();
	}, []);

	// Скролл вниз при первом рендере (открытие диалога)
	useEffect(() => {
		if (containerHeight > 0 && dialogInfo.messages.length > 0 && !initialScrollDoneRef.current) {
			// Небольшая задержка для стабилизации виртуального списка
			const timer = setTimeout(() => {
				forceScrollToBottom();
				initialScrollDoneRef.current = true;
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [containerHeight, dialogInfo.messages.length, forceScrollToBottom]);

	const handleChooseMessage = useCallback((message: IMessage) => {
		setSelectedMessages(prev => {
			const isAlreadySelected = prev.some(m => m.message_id === message.message_id);
			let newSelected: IMessage[];
			if (isAlreadySelected) {
				newSelected = prev.filter(m => m.message_id !== message.message_id);
			} else {
				newSelected = [...prev, message];
			}
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
				});
		}
	};

	// Скролл вниз ТОЛЬКО когда новые сообщения добавлены в конец (не при подгрузке старых)
	useEffect(() => {
		const currentLength = dialogInfo.messages.length;
		const currentFirstId = dialogInfo.messages[0]?.message_id;
        
		const isNewMessageAddedToEnd = 
            currentLength > prevMessagesLengthRef.current && 
            currentFirstId === prevFirstMessageIdRef.current;
        
		if (isNewMessageAddedToEnd) {
			setTimeout(() => forceScrollToBottom(), 0);
		}
        
		prevMessagesLengthRef.current = currentLength;
		prevFirstMessageIdRef.current = currentFirstId;
	}, [dialogInfo.messages, forceScrollToBottom]);

	const adjustScrollAfterLoad = useCallback(() => {
		if (savedScrollTopRef.current !== null && savedScrollHeightRef.current !== null) {
			const container = listRef.current?.getScrollElement();
			if (container) {
				const newScrollHeight = container.scrollHeight;
				const addedHeight = newScrollHeight - savedScrollHeightRef.current;
				container.scrollTop = savedScrollTopRef.current + addedHeight;
			}
			savedScrollTopRef.current = null;
			savedScrollHeightRef.current = null;
		}
		setIsLoadingMore(false);
	}, []);

	const handleScroll = useCallback(async (event: React.UIEvent<HTMLDivElement>) => {
		const target = event.currentTarget;
		const { scrollTop, scrollHeight, clientHeight } = target;
		const atBottom = scrollHeight - scrollTop - clientHeight < 5;
		setIsScrollAtBottom(atBottom);

		const atTop = scrollTop <= 5;
		if (atTop && !isLoadingMore && dialogInfo.messages.length > 0) {
			const container = listRef.current?.getScrollElement();
			if (container) {
				savedScrollTopRef.current = container.scrollTop;
				savedScrollHeightRef.current = container.scrollHeight;
			}
			setIsLoadingMore(true);
			await handleGetNextMessages();
			// Даём время на обновление DOM и виртуального списка
			setTimeout(adjustScrollAfterLoad, 0);
		}
	}, [handleGetNextMessages, isLoadingMore, dialogInfo.messages.length, adjustScrollAfterLoad]);

	const renderMessage = useCallback((message: IMessage) => {
		const isSelected = selectedMessages.some(
			selected => selected.message_id === message.message_id
		);
		const senderInfo = message.sender_id === user.id ? user : dialogInfo.opponent;
		return (
			<div style={ { paddingBottom: MESSAGE_GAP } }>
				<DialogMessage
					user={ user }
					senderInfo={ senderInfo }
					message={ message }
					dialogInfo={ dialogInfo }
					handleDeleteMessage={ handleDeleteMessage }
					handleChangeMessage={ handleChangeMessage }
					handleChooseMessage={ handleChooseMessage }
					isSelected={ isSelected }
				/>
			</div>
		);
	}, [selectedMessages, user, dialogInfo, handleDeleteMessage, handleChangeMessage, handleChooseMessage]);

	return (
		<div className='messages-list' ref={ containerRef }>
			{ containerHeight > 0 && (
				<VirtualizedList
					ref={ listRef }
					items={ dialogInfo.messages }
					height={ containerHeight }
					renderItem={ renderMessage }
					getKey={ (msg) => msg.message_id }
					onScroll={ handleScroll }
				/>
			) }
			{ selectedMessages.length !== 0 && (
				<div className="selected-messages-wrapper">
                    Выбранных сообщений: { selectedMessages.length }
					<Button 
						className='deleting-button' 
						onClick={ handleDeleteButtonClick } 
						type='primary'
					>
                        Удалить
					</Button>
				</div>
			) }
			{ !isScrollAtBottom && (
				<div onClick={ forceScrollToBottom } className="scroll-down-button">
					<FaCircleChevronDown fontSize={ 30 } />
				</div>
			) }
		</div>
	);
};

export default DialogsMessages;