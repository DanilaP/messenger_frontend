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
    isMobile: boolean,
    handleSendMessage: (message: IMessage) => void,
    handleDeleteMessage: (messagesIds: number[]) => void,
    handleChangeMessage: (message: IMessage, files: IFile[]) => void,
	handleGetNextMessages: () => void
}

const Dialog = memo(({ 
	dialogInfo, 
	user, 
	isMobile,
	handleSendMessage, 
	handleDeleteMessage,
	handleChangeMessage,
	handleGetNextMessages
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
				handleDeleteMessage={ handleDeleteMessage }
				handleChangeMessage={ handleChangeMessage }
				handleGetNextMessages={ handleGetNextMessages }
			/>
			<DialogFooter handleSendMessage = { handleSendMessage } dialogInfo={ dialogInfo } />
		</div>
	);
});

export default Dialog;