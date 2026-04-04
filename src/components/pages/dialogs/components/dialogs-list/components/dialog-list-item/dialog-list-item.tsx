import type { IDialogListItem } from "../../../../../../../models/dialogs/dialogs-interface";
import "./dialog-list-item.scss";

interface IDialogListItemProps {
    dialogListItem: IDialogListItem
}

const DialogListItemWrapper = ({ dialogListItem }: IDialogListItemProps) => {
	return (
		<div className='dialog-list-item-wrapper'>
			<div className="dialog-avatar-wrapper">
				<img className='image' src = { dialogListItem.opponent.avatar }/>
			</div>
			<div className="dialog-info">
				<div className="dialog-name">{ dialogListItem.opponent.name } { dialogListItem.opponent.surname }</div>
				<div className="dialog-last-message">
					{ dialogListItem.last_message.text }
				</div>
			</div>
			<div className="last-message-info">
				<div className="time">{ dialogListItem.last_message.date }</div>
			</div>
		</div>
	);
};

export default DialogListItemWrapper;