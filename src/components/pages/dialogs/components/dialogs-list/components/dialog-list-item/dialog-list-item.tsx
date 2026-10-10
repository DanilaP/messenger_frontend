import { Dropdown, type MenuProps } from "antd";
import { TiPin } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import type { IChatsAndDialogsList } from "../../../../dialogs";
import "./dialog-list-item.scss";

interface IDialogListItemProps {
    dialogListItem: IChatsAndDialogsList,
	handleDeleteChatOrDialog: (info: IChatsAndDialogsList) => void,
}

const DialogListItemWrapper = ({ dialogListItem, handleDeleteChatOrDialog }: IDialogListItemProps) => {

	const handleDeleteDialog = () => {
		handleDeleteChatOrDialog(dialogListItem);
	}

	const items: MenuProps["items"] = [
		{
			label: "Закрепить",
			key: "1",
			icon: <TiPin />,
		},
		{
			label: "Удалить для всех",
			key: "2",
			icon: <MdDelete />,
		}
	];

	const handleMenuClick: MenuProps["onClick"] = (info) => {
		info.domEvent.stopPropagation();
		const { key } = info;
		if (key === "1") {
			console.log("закрепление диалога")
		}
		if (key === "2") {
			handleDeleteDialog();
		}
	};

	return (
		<Dropdown menu={ { items, onClick: handleMenuClick } } trigger={ ["contextMenu"] }>
			<div className='dialog-list-item-wrapper'>
				<div className="dialog-avatar-wrapper">
					<img className='image' src = { `${import.meta.env.VITE_APP_SERVER_API}${dialogListItem.image}` }/>
				</div>
				<div className="dialog-info">
					<div className="dialog-name">{ dialogListItem.name }</div>
					<div className="dialog-last-message">
						{ dialogListItem.lastMessage?.text }
					</div>
				</div>
				<div className="last-message-info">
					<div className="time">{ dialogListItem.lastMessage?.date }</div>
				</div>
			</div>
		</Dropdown>
	);
};

export default DialogListItemWrapper;