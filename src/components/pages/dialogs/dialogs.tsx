import { useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDialogInfo, getDialogsList } from "../../../models/dialogs/dialogs-api";
import { parseCustomDate } from "../../../helpers/parsers/parsers";
import { useLocation, useNavigate, useParams } from "react-router";
import { Modal } from "antd";
import { getChatInfoById, getChatsList } from "../../../models/chats/chats-api";
import type { IDialog, IGetDialogResponse, IMessage } from "../../../models/dialogs/dialogs-interface";
import type { RootState } from "../../../stores/root/root";
import type { IFile } from "../../../interfaces/files";
import type { IChat } from "../../../models/chats/chats-interface";
import DialogsList from "./components/dialogs-list/dialogs-list";
import Dialog from "./components/dialog/dialog";
import Loader from "../../partials/loader/loader";
import ProfileModal from "../../partials/profile-modal/profile-modal";
import "./dialogs.scss";

export interface IChatsAndDialogsList {
	id: number,
	type: "dialog" | "chat",
	name: string, 
	image: string, 
	lastMessage: {
		id: number,
		text: string,
		date: string
	} | null
}

const Dialogs = () => {
    
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const currentType = useRef<string>(null);
	const [dialogsList, setDialogsList] = useState<IChatsAndDialogsList[]>([]);
	const [dialogInfo, setDialogInfo] = useState<IDialog | null>(null);
	const [chatInfo, setChatInfo] = useState<IChat | null>(null);
	const [currentReplyMessage, setCurrentReplyedMessage] = useState<IMessage | null>(null);
	const [scrollToMessageRequest, setScrollToMessageRequest] = useState<{ messageId: number; token: number } | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const [userProfileModalInfo, setUserProfileModalInfo] = useState<{ open: boolean}>({ open: false });
	const [isDialogListUpdatingAllowed, setIsDialogListUpdatingAllowed] = useState<boolean>(true);

	const user = useSelector((state: RootState) => state.user.user);
	const scrollRequestTokenRef = useRef(0);
	const navigate = useNavigate();

	const handleSendMessage = (message: IMessage) => {
		if (dialogInfo) {
			setDialogInfo({
				...dialogInfo,
				messages: [...dialogInfo.messages, message]
			});
		}
		handleUpdateLastMessageBeforeSending(message);
	};

	const handleDeleteMessage = (messagesIds: number[]) => {
		if (dialogInfo) {
			const updatedDialogInfo = {
				...dialogInfo,
				messages: dialogInfo.messages.filter(message => {
					if (messagesIds.find(id => message.id === id)) {
						return false;
					}
					return true;
				})
			};
			setDialogInfo(updatedDialogInfo);
			handleUpdateLastMessageBeforeDeleting(updatedDialogInfo);
		}
	};

	const handleChangeMessage = (message: IMessage, files: IFile[]) => {
		if (dialogInfo) {
			const updatedDialogInfo = {
				...dialogInfo,
				messages: dialogInfo.messages.map(msg => {
					if (msg.id === message.id) {
						return {
							...msg,
							text: message.text,
							files: files
						};
					}
					return msg;
				})
			};
			setDialogInfo(updatedDialogInfo);
			handleUpdateLastMessageBeforeChanging(message, updatedDialogInfo);
		}
	};
	
	const handleChooseMessageForReplying = (message: IMessage | null) => {
		setCurrentReplyedMessage(message);
	};

	const handleScrollToMessage = (messages: IMessage[], targetMessageId: number) => {
		setDialogInfo(prev => {
			if (!prev) return prev;
			return {
				...prev,
				messages
			};
		});
		scrollRequestTokenRef.current += 1;
		setScrollToMessageRequest({
			messageId: targetMessageId,
			token: scrollRequestTokenRef.current
		});
	};

	const handleScrollToMessageHandled = () => {
		setScrollToMessageRequest(null);
	};

	const handleUpdateLastMessageBeforeChanging = (message: IMessage, updatedDialogInfo: IDialog) => {
		const lastDialogMessage = updatedDialogInfo.messages[updatedDialogInfo.messages.length - 1];
		setDialogsList(prev => {
			const updatedList = prev.map(dialogListItem => {
				if (dialogListItem.id === dialogInfo?.id) {
					if (lastDialogMessage) {
						if (lastDialogMessage.id === message.id) {
							return {
								...dialogListItem,
								lastMessage: {
									id: lastDialogMessage.id,
									text: message.text !== "" ? message.text : "Файл",
									date: message.date
								}
							};
						}
					}
					return dialogListItem;
				}
				return dialogListItem;
			});
			return handleSortDialogsListByLastMessageDate(updatedList);
		});
	};

	const handleUpdateLastMessageBeforeSending = (message: IMessage) => {
		setDialogsList(prev => {
			const updatedList = prev.map(dialogListItem => {
				if (dialogListItem.id === dialogInfo?.id) {
					return {
						...dialogListItem,
						lastMessage: dialogListItem.lastMessage 
							? {
								id: dialogListItem.lastMessage.id,
								text: message.text !== "" ? message.text : "Файл",
								date: message.date
							} 
							: null
					};
				}
				return dialogListItem;
			});
			return handleSortDialogsListByLastMessageDate(updatedList);
		});
	};

	const handleUpdateLastMessageBeforeDeleting = (dialogInfo: IDialog) => {
		const lastMessage = dialogInfo.messages.sort()[dialogInfo.messages.length - 1] || null;
		setDialogsList(prev => {
			const updatedList = prev.map(dialogListItem => {
				if (dialogListItem.id === dialogInfo?.id) {
					return {
						...dialogListItem,
						lastMessage: lastMessage 
							? {
								id: lastMessage.id,
								text: lastMessage.text !== "" ? lastMessage.text : "Файл",
								date: lastMessage.date
							}
							: null
					};
				}
				return dialogListItem;
			});
			return handleSortDialogsListByLastMessageDate(updatedList);
		});
	};

	const handleSortDialogsListByLastMessageDate = (currentDialogList: IChatsAndDialogsList[]) => {
		const result = [...currentDialogList];
		result.sort((a, b) => {
			const dateA = parseCustomDate(a.lastMessage!.date);
			const dateB = parseCustomDate(b.lastMessage!.date);
			return dateB.getTime() - dateA.getTime();
		});
		return result;
	};

	const handleGetNextMessages = async (mode: "prev" | "next") => {
		if (!dialogInfo) return;
		let currentMessage = null;
		if (mode === "prev") {
			currentMessage = dialogInfo.messages[0];
		}
		else if (mode === "next") {
			currentMessage = dialogInfo.messages[dialogInfo.messages.length - 1];
		}
		const dialogRes: IGetDialogResponse = await getDialogInfo(Number(id), currentMessage?.id, mode);
		if (dialogRes.data.dialog.messages.length !== 0) {
			if (isDialogListUpdatingAllowed) {
				setDialogInfo(prev => {
					if (!prev) return prev;
					return {
						...prev,
						messages: 
							mode === "prev" 
								? [...dialogRes.data.dialog.messages, ...prev.messages]
								: [...prev.messages, ...dialogRes.data.dialog.messages]
					};
				});
			}
		}
	};

	const handleFetchDataBeforeScrollToBottom = useCallback(async () => {
		setIsDialogListUpdatingAllowed(false);
		const dialogRes: IGetDialogResponse = await getDialogInfo(Number(id));
		if (dialogRes.data.dialog.messages.length !== 0) {
			if (dialogInfo) {
				setDialogInfo({
					...dialogInfo,
					messages: dialogRes.data.dialog.messages
				});
				setIsDialogListUpdatingAllowed(true);
			}
		}
	}, [dialogInfo, id]);

	const handleChangeDialog = (dialogId: number, type: "chat" | "dialog") => {
		if (type === "chat") {
			navigate(`/main/chats/${dialogId}`);
		}
		else if (type === "dialog") {
			navigate(`/main/dialogs/${dialogId}`);
		}
	};

	const handleChangeProfileModalVisibility = () => {
		setUserProfileModalInfo({
			...userProfileModalInfo,
			open: !userProfileModalInfo.open
		});
	};

	useEffect(() => {

		if (location.pathname.includes("/main/dialogs")) {
			currentType.current = "dialog";
		}
		else if (location.pathname.includes("/main/chats")) {
			currentType.current = "chat";
		}

		const fetchData = async () => {
			setIsLoading(false);

			try {
				const [chatsRes, dialogsRes] = await Promise.all([
					getChatsList(),
					getDialogsList()
				]);
				const modifiedDialogsRes: IChatsAndDialogsList[] = dialogsRes.data.dialogs.map(dialog => {
					return {
						id: dialog.id,
						name: `${dialog.opponent.name} ${dialog.opponent.surname}`,
						image: dialog.opponent.avatar,
						lastMessage: dialog.lastMessage,
						type: "dialog"
					};
				});
				const modifiedChatsRes: IChatsAndDialogsList[] = chatsRes.data.chats.map(chat => {
					return {
						...chat,
						type: "chat"
					};
				});
				const finalDialogsAndChatsList = [...modifiedDialogsRes, ...modifiedChatsRes];
				setDialogsList(handleSortDialogsListByLastMessageDate(finalDialogsAndChatsList));

				if (id) {
					if (isDialogListUpdatingAllowed) {
						if (currentType.current === "dialog") {
							const dialogRes = await getDialogInfo(Number(id));
							setDialogInfo({
								id: dialogRes.data.dialog.id,
								messages: dialogRes.data.dialog.messages,
								opponent: dialogRes.data.dialog.opponent,
							});
						}
						else if (currentType.current === "chat") {
							const chatRes = await getChatInfoById(Number(id));
							setChatInfo(chatRes.data);
						}
					}
				}
			} 
			catch {
				setDialogInfo(null);
			} 
			finally {
				setIsLoading(true);
			}
		};
		fetchData();
	}, [id]);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.outerWidth <= 1100);
		};
		window.addEventListener("resize", handleResize);
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	if (!isLoading) {
		return (
			<Loader />
		);
	}
	return (
		<div className={ isMobile ? "dialogs-wrapper-mobile" : "dialogs-wrapper" }>
			{ 
				!isMobile || (isMobile && !dialogInfo) 
					?
					<DialogsList 
						dialogsList={ dialogsList } 
						isMobile={ isMobile }
						handleChangeDialog={ handleChangeDialog }
					/>
					: null
			}
			{  
				user ? 
					!isMobile || (isMobile && dialogInfo)
						?
						<Dialog 
							user={ user } 
							dialogInfo={ dialogInfo } 
							currentReplyMessage={ currentReplyMessage }
							isMobile={ isMobile }
							scrollToMessageRequest={ scrollToMessageRequest }
							handleChangeProfileModalVisibility={ handleChangeProfileModalVisibility }
							handleChangeMessage={ handleChangeMessage }
							handleSendMessage={ handleSendMessage } 
							handleDeleteMessage={ handleDeleteMessage }
							handleGetNextMessages={ handleGetNextMessages }
							handleChooseMessageForReplying={ handleChooseMessageForReplying }
							handleScrollToMessage={ handleScrollToMessage }
							handleScrollToMessageHandled={ handleScrollToMessageHandled }
							handleFetchDataBeforeScrollToBottom={ handleFetchDataBeforeScrollToBottom }
						/>
						: null
					: null
			}
			{ 
				dialogInfo &&
					<Modal
						centered
						destroyOnHidden
						footer={ null }
						open={ userProfileModalInfo.open }
						onCancel={ handleChangeProfileModalVisibility }
					>
						<ProfileModal userId={ dialogInfo.opponent.id } />
					</Modal>
			}
		</div>
	);
};

export default Dialogs;