import { Button, Input } from 'antd';
import './footer.scss';

const DialogFooter = () => {
    return (
        <div className='dialog-footer'>
            <Input placeholder='Введите текст сообщения' />
            <Button type='primary'>Отправить</Button>
        </div>
    );
};

export default DialogFooter;