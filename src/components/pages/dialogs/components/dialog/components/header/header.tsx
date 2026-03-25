import type { IOpponent } from '../../../../../../../models/dialogs/dialogs-interface';
import { MdSearch } from "react-icons/md";
import './header.scss';

interface IDialogHeaderProps {
    opponent: IOpponent
}

const DialogHeader = ({ opponent }: IDialogHeaderProps) => {
    return (
        <div className='dialog-header'>
            <div className="dialog-image-wrapper">
                <img src={opponent.avatar} className='dialog-image'/>
            </div>
            <div className="dialog-name">{opponent.name} {opponent.surname}</div>
            <div className="dialog-settings">
                <MdSearch />
            </div>
        </div>
    );
};

export default DialogHeader;