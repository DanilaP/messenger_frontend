import { memo, useState } from "react";
import { Input, Modal } from "antd";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
import { AddChatModal } from "./components/add-dialog-modal/add-chat-modal";
import type { IChatsAndDialogsList } from "../../dialogs";
import DialogListItemWrapper from "./components/dialog-list-item/dialog-list-item";
import EmptyDialogsList from "./components/empty-dialogs-list/empty-dialogs-list";
import "./dialogs-list.scss";

interface IDialogsListProps {
    dialogsList: IChatsAndDialogsList[],
    isMobile: boolean,
    handleChangeDialog: (dialogId: number, type: "chat" | "dialog") => void
	handleAddNewChat: (chat: Partial<IChatsAndDialogsList>) => void
}

const DialogsList = memo(({ 
	dialogsList, 
	isMobile,
	handleChangeDialog,
	handleAddNewChat
}: IDialogsListProps) => {

	const [modal, setModal] = useState<{ name: string, open: boolean }>({ name: "", open: false });

	const handleDialogListItemClick = (dialogId: number, type: "chat" | "dialog") => {
		handleChangeDialog(dialogId, type);
	};

	const handleOpenModal = (modalName: string) => {
		setModal({ name: modalName, open: true });
	}

	const handleCloseModal = () => {
		setModal({ name: "", open: false });
	}

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
								onClick={ () => handleDialogListItemClick(dialogListItem.id, dialogListItem.type) } 
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
			<div className="add-dialog-icon">
				<IoIosAddCircle onClick={ () => handleOpenModal("addDialogModal") } fontSize={40} />
			</div>
			{ 
				modal.name === "addDialogModal" &&
					<Modal
						title="Создание чата"
						centered
						destroyOnHidden
						footer={ null }
						open={ modal.open }
						onCancel={ handleCloseModal }
					>
						<AddChatModal 
							handleCloseModal={ handleCloseModal } 
							handleAddNewChat={ handleAddNewChat }
						/>
					</Modal>
			}
		</div>
	);
});

export default DialogsList;