import { FiUpload } from "react-icons/fi";
import { Button, Input, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import "./file-uploader.scss";

interface IFileUploaderProps {
    message: string,
    handleClearMessageText: () => void,
    handleSendMessageWithFiles: (text: string, file: UploadFile[]) => void
}

const FileUploader = ({ 
	message, 
	handleClearMessageText, 
	handleSendMessageWithFiles 
}: IFileUploaderProps) => {
    
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [messageText, setMessageText] = useState<string>("");
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const handleSendMessage = () => {
		handleSendMessageWithFiles(messageText, fileList);
		handleClearMessageText();
		handleChangeModalVisibility();
	};

	const handleChangeModalVisibility = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleUploadChange: UploadProps["onChange"] = ({ fileList }) => {
		setFileList(fileList);
	};

	const handleRemoveFile = (file: UploadFile) => {
		setFileList(prev => prev.filter(item => item.uid !== file.uid));
	};

	const beforeUpload = () => false;

	useEffect(() => {
		setMessageText(message);
	}, [message]);

	useEffect(() => {
		if (!isModalOpen) {
			setFileList([]);
			setMessageText(message);
		}
	}, [isModalOpen, message]);

	return (
		<div className="file-uploader">
			<FiUpload onClick={ handleChangeModalVisibility } />
			{ isModalOpen &&
                <Modal
                	destroyOnHidden
                	footer={ null }
                	title="Отправить файлы"
                	open={ isModalOpen }
                	onOk={ handleSendMessage }
                	onCancel={ handleChangeModalVisibility }
                >
                	<div className="file-uploader-content">
                		<Input
                			onChange={ (e) => setMessageText(e.target.value) }
                			value={ messageText }
                			onPressEnter={ handleSendMessage }
                			placeholder="Введите текст сообщения"
                		/>
                		<Upload
                			multiple
                			fileList={ fileList }
                			onChange={ handleUploadChange }
                			beforeUpload={ beforeUpload }
                			onRemove={ handleRemoveFile }
                			maxCount={ 5 }
                			accept="*/*"
                		>
                			<Button icon={ <UploadOutlined /> }>Выбрать файлы</Button>
                		</Upload>
                		<Button onClick={ handleSendMessage } type='primary'>Отправить</Button>
                	</div>
                </Modal>
			}
		</div>
	);
};

export default FileUploader;