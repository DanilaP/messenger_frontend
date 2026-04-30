import { useNavigate } from "react-router";
import { logout } from "../../../models/user/user-api";
import { useSelector } from "react-redux";
import { RiAccountCircle2Fill, RiFolderChartFill } from "react-icons/ri";
import { IoNotificationsCircle } from "react-icons/io5";
import { MdOutlineLanguage } from "react-icons/md";
import { HiMiniChatBubbleLeftEllipsis } from "react-icons/hi2";
import { useState, type ReactNode } from "react";
import { Modal } from "antd";
import type { RootState } from "../../../stores/root/root";
import MenuItem from "./components/item/item";
import MenuFooter from "./components/menu-footer/menu-footer";
import ProfileModal from "../profile-modal/profile-modal";
import "./left-menu.scss";

interface ILeftMenuProps {
    handleCloseMenu: () => void
}

interface IMenuModal {
	open: boolean,
	component: ReactNode | null,
	title: string
}

const LeftMenu = ({ handleCloseMenu }: ILeftMenuProps) => {

	const [modalInfo, setModalInfo] = useState<IMenuModal>({
		open: false,
		component: null,
		title: ""
	});
	const user = useSelector((state: RootState) => state.user.user);
	const navigate = useNavigate();

	const handleExitClick = () => {
		logout()
			.then(() => {
				handleCloseMenu();
				navigate("/auth/signin");
			})
			.catch((error: unknown) => {
				console.error(error);
			});
	};

	const handleDialogsClick = () => {
		handleCloseMenu();
		navigate("/main/dialogs/initial");
	};

	const handleProfileClick = () => {
		setModalInfo({
			open: !modalInfo.open,
			component: <ProfileModal />,
			title: "Профиль"
		});
	};

	const menuItems = [
		{
			title: "Аккаунт",
			subtitle: "Аватар, имя пользователя, о себе",
			icon: <RiAccountCircle2Fill color="var(--default-color)" />,
			handleClick: handleProfileClick
		},
		{
			title: "Диалоги",
			subtitle: "Ваши сообщения, чаты и группы",
			icon: <HiMiniChatBubbleLeftEllipsis color="06d633" />,
			handleClick: handleDialogsClick
		},
		{
			title: "Уведомления",
			subtitle: "Звуки, звонки, счетчик сообщений",
			icon: <IoNotificationsCircle color="bad606" />,
			handleClick: handleDialogsClick
		},
		{
			title: "Данные и память",
			subtitle: "Файлы из ваших чатов и групп",
			icon: <RiFolderChartFill color="9406d6" />,
			handleClick: handleDialogsClick
		},
		{
			title: "Язык",
			subtitle: "Смена языка интерфейса",
			icon: <MdOutlineLanguage color="06bed6" />,
			handleClick: handleDialogsClick
		},
	];

	return (
		<div className='left-menu-wrapper'>
			<div className="menu">
				{
					menuItems.map((item, index) => {
						return (
							<MenuItem 
								key={ index }
								title={ item.title }
								subtitle={ item.subtitle }
								icon={ item.icon }
								handleClick={ item.handleClick }
							/>
						);
					})
				}
				{
					user && <MenuFooter user={ user } handleExitClick={ handleExitClick } />
				}
				<Modal
					destroyOnHidden
					footer={ null }
					open={ modalInfo.open }
					onCancel={ handleProfileClick }
					centered
				>
					{ modalInfo.component }
				</Modal>
				
			</div>
		</div>
	);
};

export default LeftMenu;