import type { ReactElement } from 'react';
import './item.scss';

interface IMenuItemProps {
    title: string,
    icon: ReactElement,
    handleClick: () => void
}

const MenuItem = ({ 
    title, 
    icon,
    handleClick 
}: IMenuItemProps) => {
    return (
        <div onClick={ handleClick } className="menu-item">
            <div className="icon">
                {icon}
            </div>
            <div className="text">{title}</div>
        </div>
    );
};

export default MenuItem;