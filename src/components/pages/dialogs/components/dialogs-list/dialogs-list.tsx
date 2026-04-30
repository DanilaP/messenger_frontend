import { memo } from "react";
import { Input } from "antd";
import { IoSearchOutline } from "react-icons/io5";
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

	const handleSearch = () => {

	};

	return (
		<div className={ isMobile ? "dialogs-list-wrapper-mobile" : "dialogs-list-wrapper" }>
			<div className="dialogs-list-search">
				<Input
					placeholder="Поиск"
					onPressEnter={ (e) => console.log("Enter нажат, значение:", e.currentTarget.value) }
					suffix={ 
						<IoSearchOutline 
							onClick={ handleSearch } 
							fontSize={ 20 }
						/> 
					}
				/>
			</div>
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