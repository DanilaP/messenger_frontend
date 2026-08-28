import type { IChatsAndDialogsList } from "../../../../dialogs";
import "./dialog-list-item.scss";

interface IDialogListItemProps {
    dialogListItem: IChatsAndDialogsList
}

const DialogListItemWrapper = ({ dialogListItem }: IDialogListItemProps) => {
	return (
		<div className='dialog-list-item-wrapper'>
			<div className="dialog-avatar-wrapper">
				<img className='image' src = { dialogListItem.image }/>
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
	);
};

export default DialogListItemWrapper;