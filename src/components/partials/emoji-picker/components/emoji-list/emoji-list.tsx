import { emojis, type EmojiItem } from './emojis';
import './emoji-list.scss';

interface IEmojiListProps {
    handleChangeValue: (str: string) => void,
}

const EmojiList = ({ handleChangeValue }: IEmojiListProps) => {

    const handleEmojiClick = (emoji: EmojiItem) => {
        handleChangeValue(emoji.char);
    };

    return (
        <div className="emoji-list">
            {
                emojis.map((emoji, index) => (
                    <button
                        key={index}
                        className="emoji-item"
                        onClick={() => handleEmojiClick(emoji)}
                        title={emoji.name}
                    >
                        {emoji.char}
                    </button>
                ))
            }
        </div>
    );
};

export default EmojiList;