import { HiOutlineEmojiHappy } from "react-icons/hi";
import { Popover } from "antd";
import EmojiList from "./components/emoji-list/emoji-list";
import './emoji-picker.scss';

interface IEmojiPickerProps {
    handleChangeValue: (str: string) => void,
}

const EmojiPicker = ({ handleChangeValue }: IEmojiPickerProps) => {
    return (
        <div className='emoji-picker'>
            <Popover 
                placement="top" 
                content={
                    <EmojiList handleChangeValue={handleChangeValue} />
                }
            >
                <HiOutlineEmojiHappy />
            </Popover>
        </div>
    );
};

export default EmojiPicker;