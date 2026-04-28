import { memo, useEffect } from "react";
import { readMessages } from "../../../../../models/dialogs/dialogs-api";
import type { IDialog, IMessage } from "../../../../../models/dialogs/dialogs-interface";
import type { IUser } from "../../../../../models/user/user-interface";
import type { IFile } from "../../../../../interfaces/files";
import DialogHeader from "./components/header/header";
import DialogFooter from "./components/footer/footer";
import DialogsMessages from "./components/messages-list/messages-list";
import "./dialog.scss";

interface IDialogProps {
    dialogInfo: IDialog | null,
    user: Partial<IUser>,
	currentReplayMessage: IMessage | null,
    isMobile: boolean,
	scrollToMessageRequest: { messageId: number; token: number } | null,
    handleSendMessage: (message: IMessage) => void,
    handleDeleteMessage: (messagesIds: number[]) => void,
    handleChangeMessage: (message: IMessage, files: IFile[]) => void,
	handleGetNextMessages: (mode: "prev" | "next") => void,
	handleChooseMessageForReplaying: (message: IMessage | null) => void,
	handleScrollToMessage: (messages: IMessage[], targetMessageId: number) => void,
	handleScrollToMessageHandled: () => void,
	handleFetchDataBeforeScrollToBottom: () => Promise<void>
}

const Dialog = memo(({ 
	dialogInfo, 
	user, 
	currentReplayMessage,
	isMobile,
	scrollToMessageRequest,
	handleSendMessage, 
	handleDeleteMessage,
	handleChangeMessage,
	handleGetNextMessages,
	handleChooseMessageForReplaying,
	handleScrollToMessage,
	handleScrollToMessageHandled,
	handleFetchDataBeforeScrollToBottom
}: IDialogProps) => {

	useEffect(() => {
		if (dialogInfo) {
			readMessages(dialogInfo?.dialog_id, dialogInfo?.opponent.id)
				.catch((error) => {
					console.error(error);
				});
		}
	}, [dialogInfo]);

	if (!dialogInfo) {
		return (
			<div className="dialog-wrapper-empty">
				<div className="message">Здесь пока ничего нет...</div>
			</div>
		);
	}
	return (
		<div className={ isMobile ? "dialog-wrapper-mobile" : "dialog-wrapper" }>
			<DialogHeader opponent={ dialogInfo.opponent } />
			<DialogsMessages 
				user={ user } 
				dialogInfo={ dialogInfo } 
				currentReplayMessage={ currentReplayMessage }
				scrollToMessageRequest={ scrollToMessageRequest }
				handleDeleteMessage={ handleDeleteMessage }
				handleChangeMessage={ handleChangeMessage }
				handleGetNextMessages={ handleGetNextMessages }
				handleChooseMessageForReplaying={ handleChooseMessageForReplaying }
				handleScrollToMessage={ handleScrollToMessage }
				handleScrollToMessageHandled={ handleScrollToMessageHandled }
				handleFetchDataBeforeScrollToBottom={ handleFetchDataBeforeScrollToBottom }
			/>
			<DialogFooter 
				user={ user } 
				currentReplayMessage={ currentReplayMessage }
				dialogInfo={ dialogInfo } 
				handleSendMessage={ handleSendMessage } 
				handleChooseMessageForReplaying={ handleChooseMessageForReplaying }
			/>
		</div>
	);
});

export default Dialog;