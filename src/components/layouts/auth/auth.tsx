import * as React from 'react';
import { IoLogoElectron } from "react-icons/io5";
import './auth.scss';

interface AuthLayoutProps {
    children: React.ReactElement | null
}

export default function AuthLayout (props: AuthLayoutProps) {

    const { children } = props;

    return (
        <div className='auth-wrapper'>
            <div className="logo-wrapper">
                <IoLogoElectron className='logo' />
            </div>
            <div className="auth-form">
                <div className="auth-form-header">

                </div>
                <div className="auth-form-content">{ children }</div>
                <div className="auth-form-footer">

                </div>
            </div>
        </div>
    );
}