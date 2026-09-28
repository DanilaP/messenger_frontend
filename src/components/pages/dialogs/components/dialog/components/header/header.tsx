import { IoSearchOutline } from "react-icons/io5";
import { memo } from "react";
import { RxDotsVertical } from "react-icons/rx";
import { Dropdown, type MenuProps } from "antd";
import { MdAttachFile, MdDelete  } from "react-icons/md";
import "./header.scss";

interface IDialogHeaderProps {
	name: string,
	avatar: string,
	handleChangeProfileModalVisibility: () => void,
}

const DialogHeader = memo(({
	name,
	avatar,
	handleChangeProfileModalVisibility
}: IDialogHeaderProps) => {

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

	return (
		<div className='dialog-header'>
			<div onClick={ handleChangeProfileModalVisibility } className="dialog-image-wrapper">
				<img src={ `${import.meta.env.VITE_APP_SERVER_API}${avatar}` } className='dialog-image'/>
			</div>
			<div className="dialog-name">{ name }</div>
			<div className="dialog-settings">
				<IoSearchOutline className="icon" />
				<Dropdown menu={ { items, onClick: handleMenuClick } } trigger={ ["click"] }>
					<RxDotsVertical className="icon" />
				</Dropdown>
			</div>
		</div>
	);
});

export default DialogHeader;