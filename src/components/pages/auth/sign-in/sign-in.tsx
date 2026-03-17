import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from "react-router";
import { useState } from 'react';
import { login } from '../../../../models/user/user-api';
import type { ILoginResponse } from '../../../../models/user/user-interface';
import FormItem from "antd/es/form/FormItem";
import userStore from '../../../../stores/user/user';

interface ISignInForm {
    login: string,
    password: string
};

function SignIn() {

    const [form] = Form.useForm();
    const [isSubmited, setIsSubmited] = useState<boolean>(false);
    const [passVisible, setPassVisible] = useState<boolean>(false);

    const navigate = useNavigate();

    const onFinish = (values: ISignInForm) => {
        login(values.login, values.password)
        .then((res: ILoginResponse) => {
            userStore.dispatch({ type: "SET_USER", payload: res.data.user });
            navigate("/main/profile");
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
                Авторизация
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
                    name="login"
                    label="Логин"
                    required={false}
                    validateTrigger={isSubmited ? "onChange" : "onSubmit"}
                    rules={[{
                        required: true,
                        type: "email",
                        message: "Введите корректный email"
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
                        Войти
                    </Button>
                </FormItem>
            </Form>
            <div className="link-wrapper">
                <Link className='link' to={"/auth/signup"}>Ещё нет аккаунта?</Link>
            </div>
        </div>
    )
}

export default SignIn;