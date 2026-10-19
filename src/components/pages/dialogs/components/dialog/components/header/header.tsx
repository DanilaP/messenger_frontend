import { IoSearchOutline } from "react-icons/io5";
import { memo, useState } from "react";
import { RxDotsVertical } from "react-icons/rx";
import { Dropdown, Modal, type MenuProps } from "antd";
import { MdAttachFile, MdDelete  } from "react-icons/md";
import { ChatInfoModal } from "../../../../../../partials/chat-info-modal/chat-info-modal";
import { useParams } from "react-router";
import "./header.scss";

interface IDialogHeaderProps {
	headerType: "chat" | "dialog",
	name: string,
	avatar: string,
	handleChangeProfileModalVisibility: () => void,
}

const DialogHeader = memo(({
	headerType,
	name,
	avatar,
	handleChangeProfileModalVisibility
}: IDialogHeaderProps) => {

	const { id } = useParams<{ id: string }>();
	const [chatInfoModalOpen, setChatInfoModalOpen] = useState<boolean>(false);

	const items: MenuProps["items"] = [
		{
			label: "Медиа",
			key: "1",
			icon: <MdAttachFile />,
		},
		{
			label: "Удалить диалог",
			key: "2",
			icon: <MdDelete  />,
		},
	];

	const handleMenuClick: MenuProps["onClick"] = (info) => {
		info.domEvent.stopPropagation();
		const { key } = info;
		if (key === "1") {
			console.log("Просмотр медиа");
		}
		else if (key === "2") {
			console.log("Удаление диалога");
		}
	};

	const handleAvatarClick = () => {
		if (headerType === "dialog") {
			handleChangeProfileModalVisibility();
		}
		else if (headerType === "chat") {
			handleChangeChatInfoModalVisibility();
		}
	}

	const handleChangeChatInfoModalVisibility = () => {
		setChatInfoModalOpen(!chatInfoModalOpen);
	}

	return (
		<div className='dialog-header'>
			<div onClick={ handleAvatarClick } className="dialog-image-wrapper">
				<img src={ `${import.meta.env.VITE_APP_SERVER_API}${avatar}` } className='dialog-image'/>
			</div>
			<div className="dialog-name">{ name }</div>
			<div className="dialog-settings">
				<IoSearchOutline className="icon" />
				<Dropdown menu={ { items, onClick: handleMenuClick } } trigger={ ["click"] }>
					<RxDotsVertical className="icon" />
				</Dropdown>
			</div>
			{
				<Modal
					centered
					destroyOnHidden
					footer={ null }
					open={ chatInfoModalOpen }
					onCancel={ handleChangeChatInfoModalVisibility }
				>
					<ChatInfoModal chatId={ Number(id) }/>
				</Modal>
			}
		</div>
	);
});

export default DialogHeader;