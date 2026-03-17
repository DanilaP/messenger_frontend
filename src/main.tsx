import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import ruRu from 'antd/locale/ru_RU';
import userStore from './stores/user/user.ts';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <Provider store={ userStore }>
        <BrowserRouter>
            <ConfigProvider 
                locale={ruRu}
                theme={{
                    token: {
                        fontFamily: "Nunito"
                    }
                }}
            >
                <App />
            </ConfigProvider>
        </BrowserRouter>
    </Provider>
)
