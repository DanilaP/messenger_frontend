import * as React from 'react';
import './main.scss';

interface MainLayoutProps {
    children: React.ReactElement | null
}

export default function MainLayout (props: MainLayoutProps) {

    const { children } = props;

    return (
        <div className='main-wrapper'>
            <div className="main-header">

            </div>
            <div className="main-content">{ children }</div>
            <div className="main-footer">

            </div>
        </div>
    );
}