import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { registration } from '../../../../models/user/user-api';
import type { IRegistrationResponse } from '../../../../models/user/user-interface';
import FormItem from "antd/es/form/FormItem";
import userStore from '../../../../stores/user/user';

interface ISignUpForm {
    login: string,
    password: string,
    name: string,
    surname: string
};

function SignUp() {

    const [form] = Form.useForm();
    const [isSubmited, setIsSubmited] = useState<boolean>(false);
    const [passVisible, setPassVisible] = useState<boolean>(false);

    const navigate = useNavigate();
    
    const onFinish = (values: ISignUpForm) => {
        registration(values)
        .then((res: IRegistrationResponse) => {
            userStore.dispatch({ type: "SET_USER", payload: res.data.user });
            navigate("/main/dialogs");
        })
        .catch((error: unknown) => {
            console.error(error);
        })
    };

    const onFinishFailed = () => {
        setIsSubmited(true);
    };

    return (
        <div className="signin-form-container">
            <div className="title">
                Регистрация
            </div>
            <Form
                className="signin-form"
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <FormItem
                    name="name"
                    label="Имя"
                    required={false}
                    validateTrigger={isSubmited ? "onChange" : "onSubmit"}
                    rules={[{
                        required: true,
                        message: "Это обязательное поле"
                    }, {
                        type: 'string',
                        min: 3,
                        message: "Минимальная длина 3 символа"
                    }]}
                >
                    <Input className='form-input' placeholder="Введите имя" />
                </FormItem>
                <FormItem
                    name="surname"
                    label="Фамилия"
                    required={false}
                    validateTrigger={isSubmited ? "onChange" : "onSubmit"}
                    rules={[{
                        required: true,
                        message: "Это обязательное поле"
                    }, {
                        type: 'string',
                        min: 6,
                        message: "Минимальная длина 5 символов"
                    }]}
                >
                    <Input className='form-input' placeholder="Введите фамилию" />
                </FormItem>
                <FormItem
                    name="login"
                    label="Логин"
                    required={false}
                    validateTrigger={isSubmited ? "onChange" : "onSubmit"}
                    rules={[{
                        required: true,
                        message: "Это обязательное поле"
                    }, {
                        type: 'email',
                        min: 6,
                        message: "Некорректный email"
                    }]}
                >
                    <Input className='form-input' placeholder="Введите логин" />
                </FormItem>
                <FormItem
                    name="password"
                    label="Пароль"
                    required={false}
                    validateTrigger={isSubmited ? "onChange" : "onSubmit"}
                    rules={[{
                        required: true,
                        message: "Это обязательное поле"
                    }, {
                        type: 'string',
                        min: 6,
                        message: "Длина не менее 6 символов"
                    }]}
                >
                    <Input.Password
                        className='form-input'
                        placeholder="Введите пароль"
                        visibilityToggle={{ visible: passVisible, onVisibleChange: setPassVisible }}
                    />
                </FormItem>
                <FormItem className='form-submit'>
                    <Button className='form-submit-btn' type="primary" htmlType="submit">
                        Зарегестрироваться
                    </Button>
                </FormItem>
            </Form>
            <div className="link-wrapper">
                <Link className='link' to={"/auth/signin"}>Уже есть аккаунт?</Link>
            </div>
        </div>
    )
}

export default SignUp;