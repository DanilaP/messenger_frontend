import { Button, Input, Upload, type UploadFile, type UploadProps } from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { IMessage } from "../../../../../../../models/dialogs/dialogs-interface";
import FileList from "../../../../../../partials/file-list/file-list";
import "./message-editor.scss";

interface IMessageEditorProps {
    message: IMessage
    handleChangeMessage: (msg: IMessage, files: UploadFile[]) => void,
    handleCloseModal: () => void
}

const MessageEditor = ({ 
	message, 
	handleChangeMessage, 
	handleCloseModal 
}: IMessageEditorProps) => {

	const [modifiedMessage, setModifiedMessage] = useState<IMessage>(message);
	const [modifiedFileList, setModifiedFileList] = useState<UploadFile[]>([]);

	const handleConfirmButtonClick = () => {
		handleChangeMessage(modifiedMessage, modifiedFileList);
		handleCloseModal();
	};

	const handleUploadChange: UploadProps["onChange"] = ({ fileList }) => {
		setModifiedFileList(fileList);
		handleClearOldFileList();
	};

	const handleRemoveFile = (file: UploadFile) => {
		setModifiedFileList(prev => prev.filter(item => item.uid !== file.uid));
	};

	const handleClearOldFileList = () => {
		setModifiedMessage({
			...modifiedMessage,
			files: []
		});
	};

	const beforeUpload = () => false;

	return (
		<div className='message-editor'>
			<div className="files-number">Загружено файлов: { modifiedMessage.files.length }</div>
			<FileList files={ modifiedMessage.files } />
			<Input 
				defaultValue={ message.text }
				onChange={
					(e) => setModifiedMessage({ ...modifiedMessage, text: e.target.value })
				} 
				placeholder='Текст сообщения' 
			/>
			<Upload
				multiple
				fileList={ modifiedFileList }
				onChange={ handleUploadChange }
				beforeUpload={ beforeUpload }
				onRemove={ handleRemoveFile }
				maxCount={ 5 }
				accept="*/*"
			>
				<Button icon={ <UploadOutlined /> }>Заменить файлы</Button>
			</Upload>
			<Button onClick={ handleConfirmButtonClick } type="primary">Подтвердить</Button>
		</div>
	);
};

export default MessageEditor;