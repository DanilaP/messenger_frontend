import { Button, Input } from "antd";
import { sendMessage } from "../../../../../../../models/dialogs/dialogs-api";
import { memo, useState } from "react";
import { IoMdShareAlt, IoMdClose } from "react-icons/io";
import type { UploadFile } from "antd/es/upload/interface";
import type { IDialog, IMessage, ISendMessageResponse } from "../../../../../../../models/dialogs/dialogs-interface";
import type { IUser } from "../../../../../../../models/user/user-interface";
import FileUploader from "../file-uploader/file-uploader";
import EmojiPicker from "../../../../../../partials/emoji-picker/emoji-picker";
import "./footer.scss";

interface IDialogFooterProps {
	user: Partial<IUser>,
    dialogInfo: IDialog,
	currentReplayMessage: IMessage | null,
    handleSendMessage: (message: IMessage) => void,
	handleChooseMessageForReplaying: (message: IMessage | null) => void
}

const DialogFooter = memo(({ 
	user,
	dialogInfo, 
	currentReplayMessage,
	handleSendMessage,
	handleChooseMessageForReplaying
}: IDialogFooterProps) => {

	const [messageText, setMessageText] = useState<string>("");

	const handleSendButtonClick = async () => {
		if (messageText !== "") {	
			const formData = new FormData();
			formData.append("opponentId", dialogInfo.opponent.id.toString());
			formData.append("text", messageText);
			if (currentReplayMessage) {
				formData.append("replayMessageId", currentReplayMessage.message_id.toString());
			}
			await sendMessage(formData)
				.then((res: ISendMessageResponse) => {
					handleClearMessageText();
					handleSendMessage(res.data.createdMessage);
					handleChooseMessageForReplaying(null);
				})
				.catch((error: unknown) => {
					console.error(error);
				});
		}
	};

	const handleSendMessageWithFiles = async (text: string, files: UploadFile[]) => {
		if (text !== "") {
			const formData = new FormData();
			formData.append("opponentId", dialogInfo.opponent.id.toString());
			formData.append("text", text);
			if (currentReplayMessage) {
				formData.append("replayMessageId", currentReplayMessage.message_id.toString());
			}
			files.forEach(file => {
				if (file.originFileObj) {
					formData.append("files", file.originFileObj);
				}
			});

			await sendMessage(formData)
				.then((res: ISendMessageResponse) => {
					handleSendMessage(res.data.createdMessage);
					handleChooseMessageForReplaying(null);
				})
				.catch((error: unknown) => {
					console.error(error);
				});
		}
	};

	const handleClearMessageText = () => {
		setMessageText("");
	};

	const handleAddEmojiToMessageText = (emoji: string) => {
		const modifiedMessageText = messageText + emoji;
		setMessageText(modifiedMessageText);
	};

	const handleClearCurrentReplayingMessage = () => {
		handleChooseMessageForReplaying(null);
	};

	return (
		<div className='dialog-footer'>
			{
				currentReplayMessage &&
					<div className="replayed-message-footer-wrapper">
						<div className="replayed-message-footer-info">
							<div className="icon">
								<IoMdShareAlt fontSize={ 30 } />
							</div>
							<div className="message-info">
								<div className="sender-info">
									{
										currentReplayMessage.sender_id === user.id
											? `${ user.name } ${ user.lastname }`
											: `${ dialogInfo.opponent.name } ${ dialogInfo.opponent.surname }`
									}
								</div>
								<div className="text">{ currentReplayMessage.text }</div>
							</div>
							<div onClick={ handleClearCurrentReplayingMessage } className="close-button">
								<IoMdClose fontSize={ 30 } />
							</div>
						</div>
					</div>
			}
			<div className="message-editor-footer-wrapper">
				<Input 
					value={ messageText } 
					onChange = { (e) => setMessageText(e.target.value) } 
					onPressEnter={ handleSendButtonClick }
					placeholder='Введите текст сообщения' 
				/>
				{   
					<FileUploader
						handleSendMessageWithFiles = { handleSendMessageWithFiles }
						handleClearMessageText = { handleClearMessageText }
						message = { messageText } 
					/> 
				}
				{
					<EmojiPicker handleChangeValue={ handleAddEmojiToMessageText } />
				}
				<Button onClick={ handleSendButtonClick } type='primary'>Отправить</Button>
			</div>
		</div>
	);
});

export default DialogFooter;