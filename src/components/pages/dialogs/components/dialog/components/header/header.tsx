import { MdSearch } from "react-icons/md";
import { memo } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown, type MenuProps } from "antd";
import { MdAttachFile, MdDelete  } from "react-icons/md";
import type { IOpponent } from '../../../../../../../models/dialogs/dialogs-interface';
import './header.scss';

interface IDialogHeaderProps {
    opponent: IOpponent
}

const DialogHeader = memo(({ opponent }: IDialogHeaderProps) => {

    const items: MenuProps['items'] = [
        {
            label: 'Медиа',
            key: '1',
            icon: <MdAttachFile />,
        },
        {
            label: 'Удалить диалог',
            key: '2',
            icon: <MdDelete  />,
        },
    ];

    const handleMenuClick: MenuProps['onClick'] = (info) => {
        info.domEvent.stopPropagation();
        const { key } = info;
        if (key === '1') {
            console.log('Просмотр медиа');
        }
        else if (key === '2') {
            console.log('Удаление диалога');
        }
    };

    return (
        <div className='dialog-header'>
            <div className="dialog-image-wrapper">
                <img src={opponent.avatar} className='dialog-image'/>
            </div>
            <div className="dialog-name">{opponent.name} {opponent.surname}</div>
            <div className="dialog-settings">
                <MdSearch className="icon" />
                <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']}>
                    <BsThreeDotsVertical className="icon" />
                </Dropdown>
            </div>
        </div>
    );
});

export default DialogHeader;