import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Input, Modal } from "antd";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
import { AddChatModal } from "./components/add-dialog-modal/add-chat-modal";
import type { IChatsAndDialogsList } from "../../dialogs";
import DialogListItemWrapper from "./components/dialog-list-item/dialog-list-item";
import EmptyDialogsList from "./components/empty-dialogs-list/empty-dialogs-list";
import VirtualizedList, { type VirtualizedListRef } from "../../../../partials/virtualized-list/virtualized-list";
import "./dialogs-list.scss";

interface IDialogsListProps {
    dialogsList: IChatsAndDialogsList[],
    isMobile: boolean,
    handleChangeDialog: (dialogId: number, type: "chat" | "dialog") => void
	handleAddNewChat: (chat: Partial<IChatsAndDialogsList>) => void,
	handleSeatchDialog: (value: string) => void,
	handleDeleteChatOrDialog: (info: IChatsAndDialogsList) => void,
}

const DialogsList = memo(({ 
	dialogsList, 
	isMobile,
	handleChangeDialog,
	handleAddNewChat,
	handleSeatchDialog,
	handleDeleteChatOrDialog
}: IDialogsListProps) => {

	const [modal, setModal] = useState<{ name: string, open: boolean }>({ name: "", open: false });
	const [containerHeight, setContainerHeight] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<VirtualizedListRef>(null);

	const renderDialogListItem = useCallback((dialogListItem: IChatsAndDialogsList) => {
		return (
			<div 
				key={ dialogListItem.id }
				className="dialog-list-item-wrapper-main"
				onClick={ () => handleDialogListItemClick(dialogListItem.id, dialogListItem.type) } 
			>
				<DialogListItemWrapper  
					dialogListItem={ dialogListItem }
					handleDeleteChatOrDialog={ handleDeleteChatOrDialog } 
				/>
			</div>
		);
	}, [dialogsList]);

	const handleDialogListItemClick = (dialogId: number, type: "chat" | "dialog") => {
		handleChangeDialog(dialogId, type);
	};

	const handleOpenModal = (modalName: string) => {
		setModal({ name: modalName, open: true });
	}

	const handleCloseModal = () => {
		setModal({ name: "", open: false });
	}

	const handleSearch = (value: string) => {
		handleSeatchDialog(value);
	};

	// Измерение высоты контейнера
	useEffect(() => {
		const measureHeight = () => {
			if (containerRef.current) {
				setContainerHeight(containerRef.current.clientHeight);
			}
		};
		measureHeight();
		window.addEventListener("resize", measureHeight);
		const observer = new ResizeObserver(measureHeight);
		if (containerRef.current) observer.observe(containerRef.current);
		return () => {
			window.removeEventListener("resize", measureHeight);
			observer.disconnect();
		};
	}, []);

	return (
		<div className={ isMobile ? "dialogs-list-wrapper-mobile" : "dialogs-list-wrapper" }>
			<div className="dialogs-list-search">
				<Input
					placeholder="Поиск"
					onPressEnter={ (e) => handleSearch(e.currentTarget.value) }
					suffix={ 
						<IoSearchOutline 
							fontSize={ 20 }
						/> 
					}
				/>
			</div>
			<div ref={ containerRef } className="dialog-list-items">
				{

					dialogsList.length !== 0 
						?
							<VirtualizedList
								ref={ listRef }
								items={ dialogsList }
								height={ containerHeight }
								renderItem={ renderDialogListItem }
							/>
						: <EmptyDialogsList />
				}
			</div>
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