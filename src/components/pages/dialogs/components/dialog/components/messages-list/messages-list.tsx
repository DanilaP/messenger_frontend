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
	currentReplayMessage: IMessage | null,
	scrollToMessageRequest: { messageId: number; token: number } | null,
    handleDeleteMessage: (messagesIds: number[]) => void,
    handleChangeMessage: (message: IMessage, files: IFile[]) => void,
    handleGetNextMessages: (mode: "prev" | "next") => void,
    onSelectedMessagesChange?: (selectedMessages: IMessage[]) => void,
	handleChooseMessageForReplaying: (message: IMessage) => void,
	handleScrollToMessage: (messages: IMessage[], targetMessageId: number) => void,
	handleScrollToMessageHandled: () => void,
	handleFetchDataBeforeScrollToBottom: () => Promise<void>,
}

const MESSAGE_GAP = 10;

const DialogsMessages = ({ 
	dialogInfo, 
	user, 
	currentReplayMessage,
	scrollToMessageRequest,
	handleDeleteMessage, 
	handleChangeMessage,
	handleGetNextMessages,
	onSelectedMessagesChange,
	handleChooseMessageForReplaying,
	handleScrollToMessage,
	handleScrollToMessageHandled,
	handleFetchDataBeforeScrollToBottom
}: IDialogsMessages) => {
    
	const listRef = useRef<VirtualizedListRef>(null);
	const [selectedMessages, setSelectedMessages] = useState<IMessage[]>([]);
	const [isScrollAtBottom, setIsScrollAtBottom] = useState(true);
	const [containerHeight, setContainerHeight] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const isProcessingRef = useRef(false);
	const restoreTopTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
	const activeScrollRequestTokenRef = useRef<number | null>(null);
	const bottomLoadLockRef = useRef(false);
	const isLoadingMoreRef = useRef(false);
	const isLoadingNextBatchRef = useRef(false);

	const initialScrollDoneRef = useRef(false);
	const prevMessagesLengthRef = useRef(dialogInfo.messages.length);
	const prevFirstMessageIdRef = useRef(dialogInfo.messages[0]?.message_id);

	const scrollToBottom = useCallback(() => {
		listRef.current?.scrollToBottom();
	}, []);

	const handleScrollDownButtonClick = useCallback(async () => {
		if (isLoadingMoreRef.current) return;
		isLoadingMoreRef.current = true;
		try {
			await handleFetchDataBeforeScrollToBottom();
			scrollToBottom();
		} finally {
			isLoadingMoreRef.current = false;
		}
	}, [handleFetchDataBeforeScrollToBottom, scrollToBottom]);

	const clearRestoreTopTimers = useCallback(() => {
		restoreTopTimersRef.current.forEach((id) => clearTimeout(id));
		restoreTopTimersRef.current = [];
	}, []);

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

	const handleScroll = useCallback(async (event: React.UIEvent<HTMLDivElement>) => {
		if (isProcessingRef.current) return;
		if (activeScrollRequestTokenRef.current !== null) return;

		const target = event.currentTarget;
		const { scrollTop, scrollHeight, clientHeight } = target;
		const atBottom = scrollHeight - scrollTop - clientHeight < 5;
		setIsScrollAtBottom(atBottom);
		if (!atBottom) {
			bottomLoadLockRef.current = false;
		}

		const atTop = scrollTop === 0;
		if (atTop && !isLoadingMoreRef.current && dialogInfo.messages.length > 0) {
			clearRestoreTopTimers();
			isProcessingRef.current = true;
			const oldScrollHeight = target.scrollHeight;
			const oldScrollTop = target.scrollTop;

			isLoadingMoreRef.current = true;
			await handleGetNextMessages("prev");
			isLoadingMoreRef.current = false;

			const restoreScrollPosition = () => {
				const scrollElement = listRef.current?.getScrollElement();
				if (!scrollElement) return;
				const newScrollHeight = scrollElement.scrollHeight;
				const heightAdded = newScrollHeight - oldScrollHeight;
				scrollElement.scrollTop = oldScrollTop + Math.max(0, heightAdded);
			};

			requestAnimationFrame(() => {
				restoreScrollPosition();
				[24, 64, 140].forEach((delay) => {
					const timerId = setTimeout(restoreScrollPosition, delay);
					restoreTopTimersRef.current.push(timerId);
				});
				isProcessingRef.current = false;
			});
		}
		else if (atBottom && !isLoadingMoreRef.current && dialogInfo.messages.length > 0) {
			if (bottomLoadLockRef.current) return;
			bottomLoadLockRef.current = true;
			isProcessingRef.current = true;
			isLoadingMoreRef.current = true;
			isLoadingNextBatchRef.current = true;
			await handleGetNextMessages("next");
			isLoadingMoreRef.current = false;
			isProcessingRef.current = false;
		}
	}, [handleGetNextMessages, dialogInfo.messages.length, clearRestoreTopTimers]);

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
					isSelected={ isSelected }
					handleDeleteMessage={ handleDeleteMessage }
					handleChangeMessage={ handleChangeMessage }
					handleChooseMessage={ handleChooseMessage }
					handleChooseMessageForReplaying={ handleChooseMessageForReplaying }
					handleScrollToMessage={ handleScrollToMessage }
				/>
			</div>
		);
	}, [
		selectedMessages, 
		user, 
		dialogInfo, 
		handleDeleteMessage, 
		handleChangeMessage, 
		handleChooseMessage, 
		handleChooseMessageForReplaying,
		handleScrollToMessage
	]);

	useEffect(() => {
		if (!scrollToMessageRequest || dialogInfo.messages.length === 0) return;
		let cancelled = false;
		let attempts = 0;
		activeScrollRequestTokenRef.current = scrollToMessageRequest.token;
		isProcessingRef.current = true;
		clearRestoreTopTimers();

		const runScroll = () => {
			if (cancelled) return;
			if (activeScrollRequestTokenRef.current !== scrollToMessageRequest.token) return;
			const isScrolled = listRef.current?.scrollToItemByKey(scrollToMessageRequest.messageId, "start") ?? false;
			attempts += 1;
			if (isScrolled || attempts >= 8) {
				activeScrollRequestTokenRef.current = null;
				isProcessingRef.current = false;
				handleScrollToMessageHandled();
				return;
			}
			const timerId = setTimeout(runScroll, 40);
			restoreTopTimersRef.current.push(timerId);
		};

		requestAnimationFrame(runScroll);
		return () => {
			cancelled = true;
			if (activeScrollRequestTokenRef.current === scrollToMessageRequest.token) {
				activeScrollRequestTokenRef.current = null;
				isProcessingRef.current = false;
			}
		};
	}, [scrollToMessageRequest, dialogInfo.messages, handleScrollToMessageHandled, clearRestoreTopTimers]);

	// Автоскролл при добавлении новых сообщений в конец
	useEffect(() => {
		const currentLength = dialogInfo.messages.length;
		const currentFirstId = dialogInfo.messages[0]?.message_id;
		const isNewMessageAddedToEnd = 
            currentLength > prevMessagesLengthRef.current && 
            currentFirstId === prevFirstMessageIdRef.current;
		const shouldAutoScrollToBottom = isNewMessageAddedToEnd && !isLoadingNextBatchRef.current;
        
		if (shouldAutoScrollToBottom) {
			setTimeout(() => scrollToBottom(), 0);
		}
		isLoadingNextBatchRef.current = false;
        
		prevMessagesLengthRef.current = currentLength;
		prevFirstMessageIdRef.current = currentFirstId;
	}, [dialogInfo.messages, scrollToBottom]);

	// Измерение высоты контейнера
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

	// Первоначальный скролл вниз
	useEffect(() => {
		if (containerHeight > 0 && dialogInfo.messages.length > 0 && !initialScrollDoneRef.current) {
			const timer = setTimeout(() => {
				scrollToBottom();
				initialScrollDoneRef.current = true;
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [containerHeight, dialogInfo.messages.length, scrollToBottom]);

	useEffect(() => {
		return () => clearRestoreTopTimers();
	}, [clearRestoreTopTimers]);

	return (
		<div 
			style={ { height: `${ currentReplayMessage ? `calc(100vh - 242px)` : `calc(100vh - 166px)` }` } } 
			className='messages-list' 
			ref={ containerRef }
		>
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
				<div onClick={ handleScrollDownButtonClick } className="scroll-down-button">
					<FaCircleChevronDown fontSize={ 30 } />
				</div>
			) }
		</div>
	);
};

export default DialogsMessages;