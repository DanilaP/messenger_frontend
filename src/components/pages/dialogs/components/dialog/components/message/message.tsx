import { Dropdown, Modal, type MenuProps, type UploadFile } from "antd";
import { message as messageAntd } from "antd";
import { deleteMessage, editMessage } from "../../../../../../../models/dialogs/dialogs-api";
import { Fragment, memo, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import type { IDialog, IEditMessageResponse, IMessage, IOpponent } from "../../../../../../../models/dialogs/dialogs-interface";
import type { IFile } from "../../../../../../../interfaces/files";
import type { IUser } from "../../../../../../../models/user/user-interface";
import FileList from "../../../../../../partials/file-list/file-list";
import MessageEditor from "../message-editor/message-editor";
import "./message.scss";

interface IMessageProps {
    senderInfo: Partial<IUser> | IOpponent,
    message: IMessage,
    user: Partial<IUser>,
    dialogInfo: IDialog,
    isSelected: boolean,
    handleDeleteMessage: (messagesIds: number[]) => void,
    handleChangeMessage: (message: IMessage, files: IFile[]) => void,
    handleChooseMessage: (message: IMessage) => void
}

const DialogMessage = memo(({ 
	senderInfo, 
	message, 
	user, 
	dialogInfo, 
	isSelected,
	handleDeleteMessage,
	handleChangeMessage,
	handleChooseMessage
}: IMessageProps) => {

	const [isModifyMessageModalOpen, setIsModifyMessageModalOpen] = useState<boolean>(false);
	const [messageApi, contextHolder] = messageAntd.useMessage();

	const items: MenuProps["items"] = [
		{
			label: "Копировать",
			key: "3",
			icon: <MdContentCopy />,
		},
		...(senderInfo.id === user.id ? [
			{
				label: "Редактировать",
				key: "1",
				icon: <MdEdit />,
			},
			{
				label: "Удалить",
				key: "2",
				icon: <MdDeleteOutline />,
			},
		] : []),
	];

	const handleMenuClick: MenuProps["onClick"] = (info) => {
		info.domEvent.stopPropagation();
		const { key } = info;
		if (key === "1") {
			handleChangeModifyMessageModalVisibility();
		}
		if (key === "2") {
			deleteMessageFromDialog();
		}
		if (key === "3") {
			handleCopyMessageText();
		}
	};

	const deleteMessageFromDialog = async () => {
		await deleteMessage(dialogInfo.dialog_id, [message.message_id])
			.then(() => {
				handleDeleteMessage([message.message_id]);
			})
			.catch((error: unknown) => {
				console.error(error);
			});
	};

	const handleChangeModifyMessageModalVisibility = () => {
		setIsModifyMessageModalOpen(!isModifyMessageModalOpen);
	};

	const changeMessage = async (modifiedMessage: IMessage, files: UploadFile[]) => {
		const formData = new FormData();
		formData.append("dialogId", dialogInfo.dialog_id.toString());
		formData.append("messageId", modifiedMessage.message_id.toString());
		formData.append("text", modifiedMessage.text);

		files.forEach(file => {
			if (file.originFileObj) {
				formData.append("files", file.originFileObj);
			}
		});

		await editMessage(formData)
			.then((res: IEditMessageResponse) => {
				const updatedFiles = files.length > 0 ? res.data.modifiedMessageInfo.files : modifiedMessage.files;
				handleChangeMessage(modifiedMessage, updatedFiles);
			})
			.catch((error: unknown) => {
				console.error(error);
			});
	};

	const handleCopyMessageText = async () => {
		if (!message.text) return;
		try {
			await navigator.clipboard.writeText(message.text);
			messageApi.open({
				type: "success",
				content: "Текст успешно скопирован",
			});   
		} catch (error) {
			messageApi.open({
				type: "error",
				content: "Ошибка при копировании текста",
			});   
			console.error(error);
		}
	};

	const handleMessageWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (message.sender_id === user.id) {
			e.stopPropagation();
			handleChooseMessage(message);
		}
	};

	const handleMessageClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
	};

	return (
		<Fragment>
			{ contextHolder } 
			<div 
				onClick={ handleMessageWrapperClick } 
				className={ `message-wrapper ${ senderInfo.id === user.id ? `user-message` : `opponent-message` } ${ isSelected ? `selected-wrapper` : "" }` }
			>
				<Dropdown menu={ { items, onClick: handleMenuClick } } trigger={ ["contextMenu"] }>
					<div onClick={ handleMessageClick } className="message">
						<div className={ `text-content ${ senderInfo.id === user.id ? `user-message` : `opponent-message` }` }>
							<div className="avatar">
								<img className='image' src = { senderInfo.avatar } />
							</div>
							<div className="text">{ message.text }</div>
						</div>
						<FileList files={ message.files } />
						<div className="date">{ message.date }</div>
						{ 
							senderInfo.id === user.id &&
                                <div className="read-status">
                                	<IoCheckmarkDoneOutline color={ `${ message.isread ? `var(--default-color)` : `` }` } />
                                </div>
						}
					</div>
				</Dropdown>
				{
					senderInfo.id === user.id &&
                        <div className={ `select-button ${ isSelected ? `selected` : "" } ` }>
                        	<CiCircleCheck />
                        </div>
				}
			</div>
			{
				<Modal
					centered
					destroyOnHidden
					footer={ null }
					title="Редактирование сообщения"
					open={ isModifyMessageModalOpen }
					onCancel={ handleChangeModifyMessageModalVisibility }
				>
					<MessageEditor 
						message={ message }
						handleChangeMessage={ changeMessage }
						handleCloseModal={ handleChangeModifyMessageModalVisibility }
					/>
				</Modal>
			}
		</Fragment>
	);
});

export default DialogMessage;