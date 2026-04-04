import { memo } from "react";
import type { IDialogListItem } from "../../../../../models/dialogs/dialogs-interface";
import DialogListItemWrapper from "./components/dialog-list-item/dialog-list-item";
import "./dialogs-list.scss";

interface IDialogsListProps {
    dialogsList: IDialogListItem[],
    isMobile: boolean,
    handleChangeDialog: (dialogId: number) => void
}

const DialogsList = memo(({ 
	dialogsList, 
	isMobile,
	handleChangeDialog
}: IDialogsListProps) => {

	const handleDialogListItemClick = (dialogId: number) => {
		handleChangeDialog(dialogId);
	};

	return (
		<div className={ isMobile ? "dialogs-list-wrapper-mobile" : "dialogs-list-wrapper" }>
			{
				dialogsList.map(dialogListItem => {
					return (
						<div 
							key={ dialogListItem.dialog_id }
							onClick={ () => handleDialogListItemClick(dialogListItem.dialog_id) } 
							className="dialog-list-item-wrapper-main"
						>
							<DialogListItemWrapper  
								dialogListItem = { dialogListItem } 
							/>
						</div>
					);
				})
			}
		</div>
	);
});

export default DialogsList;