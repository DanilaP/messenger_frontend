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
	currentReplyMessage: IMessage | null,
    handleSendMessage: (message: IMessage) => void,
	handleChooseMessageForReplying: (message: IMessage | null) => void
}

const DialogFooter = memo(({ 
	user,
	dialogInfo, 
	currentReplyMessage,
	handleSendMessage,
	handleChooseMessageForReplying
}: IDialogFooterProps) => {

	const [messageText, setMessageText] = useState<string>("");

	const handleSendButtonClick = async () => {
		if (messageText !== "") {	
			const formData = new FormData();
			formData.append("opponentId", dialogInfo.opponent.id.toString());
			formData.append("text", messageText);
			if (currentReplyMessage) {
				formData.append("replyMessageId", currentReplyMessage.id.toString());
			}
			await sendMessage(formData)
				.then((res: ISendMessageResponse) => {
					handleClearMessageText();
					handleSendMessage(res.data.createdMessage);
					handleChooseMessageForReplying(null);
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
			if (currentReplyMessage) {
				formData.append("replyMessageId", currentReplyMessage.id.toString());
			}
			files.forEach(file => {
				if (file.originFileObj) {
					formData.append("files", file.originFileObj);
				}
			});

			await sendMessage(formData)
				.then((res: ISendMessageResponse) => {
					handleSendMessage(res.data.createdMessage);
					handleChooseMessageForReplying(null);
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

	const handleClearCurrentReplyingMessage = () => {
		handleChooseMessageForReplying(null);
	};

	return (
		<div className='dialog-footer'>
			{
				currentReplyMessage &&
					<div className="replied-message-footer-wrapper">
						<div className="replied-message-footer-info">
							<div className="icon">
								<IoMdShareAlt fontSize={ 30 } />
							</div>
							<div className="message-info">
								<div className="sender-info">
									{
										currentReplyMessage.senderId === user.id
											? `${ user.name } ${ user.lastname }`
											: `${ dialogInfo.opponent.name } ${ dialogInfo.opponent.surname }`
									}
								</div>
								<div className="text">{ currentReplyMessage.text }</div>
							</div>
							<div onClick={ handleClearCurrentReplyingMessage } className="close-button">
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
				<Button className="send-message-button" onClick={ handleSendButtonClick } type='primary'>Отправить</Button>
			</div>
		</div>
	);
});

export default DialogFooter;