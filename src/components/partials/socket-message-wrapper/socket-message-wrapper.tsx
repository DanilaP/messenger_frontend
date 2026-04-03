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
    if (data.type !== 'read_message_dialog') {
        return (
            <div className='socket-message-wrapper'>
                { data.type }
            </div>
        );
    }
};

export default SocketMessageWrapper;