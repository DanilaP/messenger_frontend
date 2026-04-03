import { useNavigate } from 'react-router';
import type { 
    IChangeMessageData, 
    IDeleteMessageData, 
    INewMessageData, 
    IReadMessageData 
} from '../../../interfaces/socket-messages';
import './socket-message-wrapper.scss';

interface ISocketMessageWrapperProps {
    data: INewMessageData | IDeleteMessageData | IChangeMessageData | IReadMessageData
}

const SocketMessageWrapper = ({ data }: ISocketMessageWrapperProps) => {

    const navigate = useNavigate();

    const navigateToDialog = () => {
        if (data.type === 'new_message_dialog') {
            navigate(`/main/dialogs/${data.dialogId}`);
        }
    }

    if (data.type === 'new_message_dialog') {
        return (
            <div onClick={navigateToDialog} className='socket-message-wrapper'>
                <div className="sender-info">
                    <img className='avatar-image' src = {data.senderInfo.avatar} />
                    <div className="name">{data.senderInfo.name} {data.senderInfo.surname}</div>
                </div>
                <div className="text">{data.message.text}</div>
            </div>
        );
    }
};

export default SocketMessageWrapper;