import { memo } from "react";
import { Input } from "antd";
import { IoSearchOutline } from "react-icons/io5";
import type { IChatsAndDialogsList } from "../../dialogs";
import DialogListItemWrapper from "./components/dialog-list-item/dialog-list-item";
import EmptyDialogsList from "./components/empty-dialogs-list/empty-dialogs-list";
import "./dialogs-list.scss";

interface IDialogsListProps {
    dialogsList: IChatsAndDialogsList[],
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
				dialogsList.length !== 0 
					?
					dialogsList.map(dialogListItem => {
						return (
							<div 
								key={ dialogListItem.id }
								onClick={ () => handleDialogListItemClick(dialogListItem.id) } 
								className="dialog-list-item-wrapper-main"
							>
								<DialogListItemWrapper  
									dialogListItem = { dialogListItem } 
								/>
							</div>
						);
					})
					: <EmptyDialogsList />
			}
		</div>
	);
});

export default DialogsList;