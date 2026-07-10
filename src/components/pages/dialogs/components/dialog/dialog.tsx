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
	currentReplyMessage: IMessage | null,
    isMobile: boolean,
	scrollToMessageRequest: { messageId: number; token: number } | null,
	handleChangeProfileModalVisibility: () => void,
    handleSendMessage: (message: IMessage) => void,
    handleDeleteMessage: (messagesIds: number[]) => void,
    handleChangeMessage: (message: IMessage, files: IFile[]) => void,
	handleGetNextMessages: (mode: "prev" | "next") => void,
	handleChooseMessageForReplying: (message: IMessage | null) => void,
	handleScrollToMessage: (messages: IMessage[], targetMessageId: number) => void,
	handleScrollToMessageHandled: () => void,
	handleFetchDataBeforeScrollToBottom: () => Promise<void>
}

const Dialog = memo(({ 
	dialogInfo, 
	user, 
	currentReplyMessage,
	isMobile,
	scrollToMessageRequest,
	handleChangeProfileModalVisibility,
	handleSendMessage, 
	handleDeleteMessage,
	handleChangeMessage,
	handleGetNextMessages,
	handleChooseMessageForReplying,
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
			<DialogHeader 
				opponent={ dialogInfo.opponent } 
				handleChangeProfileModalVisibility={ handleChangeProfileModalVisibility }
			/>
			<DialogsMessages 
				user={ user } 
				dialogInfo={ dialogInfo } 
				currentReplyMessage={ currentReplyMessage }
				scrollToMessageRequest={ scrollToMessageRequest }
				handleDeleteMessage={ handleDeleteMessage }
				handleChangeMessage={ handleChangeMessage }
				handleGetNextMessages={ handleGetNextMessages }
				handleChooseMessageForReplying={ handleChooseMessageForReplying }
				handleScrollToMessage={ handleScrollToMessage }
				handleScrollToMessageHandled={ handleScrollToMessageHandled }
				handleFetchDataBeforeScrollToBottom={ handleFetchDataBeforeScrollToBottom }
			/>
			<DialogFooter 
				user={ user } 
				currentReplyMessage={ currentReplyMessage }
				dialogInfo={ dialogInfo } 
				handleSendMessage={ handleSendMessage } 
				handleChooseMessageForReplying={ handleChooseMessageForReplying }
			/>
		</div>
	);
});

export default Dialog;