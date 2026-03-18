import type { IMessage, IOpponent } from '../../../../../../../models/dialogs/dialogs-interface';
import type { IUser } from '../../../../../../../models/user/user-interface';
import FileList from '../../../../../../partials/file-list/file-list';
import './message.scss';

interface IMessageProps {
    senderInfo: Partial<IUser> | IOpponent,
    message: IMessage,
    user: Partial<IUser>
}

const DialogMessage = ({ senderInfo, message, user }: IMessageProps) => {
    return (
        <div className={`message-wrapper ${ senderInfo.id === user.id ? `user-message` : `opponent-message` }`}>
            <div className="message">
                <div className={`text-content ${ senderInfo.id === user.id ? `user-message` : `opponent-message` }`}>
                    <div className="avatar">
                        <img className='image' src = {senderInfo.avatar} />
                    </div>
                    <div className="text">{message.text}</div>
                </div>
                <FileList files={ message.files } />
                <div className="date">{message.date}</div>
            </div>
        </div>
    );
};

export default DialogMessage;