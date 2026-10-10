import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { createChat } from "../../../../../../../models/chats/chats-api";
import type { IChatsAndDialogsList } from "../../../../dialogs";
import FormItem from "antd/es/form/FormItem";
import "./add-chat-modal.scss";

interface ICreateChatForm {
    name: string,
    description: string
}

interface IAddChatModalProps {
	handleCloseModal: () => void,
	handleAddNewChat: (chat: Partial<IChatsAndDialogsList>) => void
}

export const AddChatModal = ({ handleCloseModal, handleAddNewChat }: IAddChatModalProps) => {

    const [form] = Form.useForm();
	const [isSubmited, setIsSubmited] = useState<boolean>(false);
	const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: ICreateChatForm) => {
        await createChat(values)
		.then(res => {
			handleCloseModal();
			handleAddNewChat(res.data.chatInfo);
		})
		.catch(error => {
			messageApi.open({
				type: "error",
				content: "Ошибка при создании чата"
			});
			console.error(error);
		})
    };

    const onFinishFailed = () => {
        setIsSubmited(true);
    };

    return (
        <div className="add-chat-wrapper">
			{ contextHolder }
            <Form
				form={ form }
				layout="vertical"
				onFinish={ onFinish }
				onFinishFailed={ onFinishFailed }
				autoComplete="off"
			>
				<FormItem
					name="name"
					label="Наименовение чата"
					required={ false }
					validateTrigger={ isSubmited ? "onChange" : "onSubmit" }
					rules={ [{
						required: true,
						message: "Значение не должно быть пустым"
					}] }
				>
					<Input className='form-input' placeholder="Введите наименование чата" />
				</FormItem>
                <FormItem
					name="description"
					label="Описание чата"
					required={ false }
					validateTrigger={ isSubmited ? "onChange" : "onSubmit" }
					rules={ [{
						required: true,
						message: "Значение не должно быть пустым"
					}] }
				>
					<Input className='form-input' placeholder="Введите описание чата" />
				</FormItem>
				<FormItem className='form-submit'>
					<Button className='form-submit-btn' type="primary" htmlType="submit">
                        Создать чат
					</Button>
				</FormItem>
			</Form>
        </div>
    );
};