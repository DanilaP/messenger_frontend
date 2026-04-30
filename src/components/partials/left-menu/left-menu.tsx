import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router";
import { logout } from "../../../models/user/user-api";
import { useSelector } from "react-redux";
import { RiAccountCircle2Fill } from "react-icons/ri";
import { IoNotificationsCircle } from "react-icons/io5";
import { MdFolder, MdOutlineLanguage } from "react-icons/md";
import { HiMiniChatBubbleLeftEllipsis } from "react-icons/hi2";
import type { RootState } from "../../../stores/root/root";
import MenuItem from "./components/item/item";
import "./left-menu.scss";

interface ILeftMenuProps {
    handleCloseMenu: () => void
}

const LeftMenu = ({ handleCloseMenu }: ILeftMenuProps) => {

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

	const menuItems = [
		{
			title: "Аккаунт",
			subtitle: "Аватар, имя пользователя, о себе",
			icon: <RiAccountCircle2Fill color="var(--default-color)" />,
			handleClick: handleDialogsClick
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
			icon: <MdFolder color="9406d6" />,
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
				<div className="menu-footer">
					<div className="avatar-wrapper">
						<img className="image" src={ user?.avatar } />
					</div>
					<div className="user-info">
						<div className="user-name">
							<div className="name">{ user?.name }</div>
							<div className="surname">{ user?.surname }</div>
						</div>
					</div>
					<div onClick={ handleExitClick } className="exit-icon-wrapper">
						<IoMdExit fontSize={ 30 } />
					</div>
				</div>
			</div>
		</div>
	);
};

export default LeftMenu;