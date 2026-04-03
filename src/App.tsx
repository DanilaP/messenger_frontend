import { publicRoutes, routes } from './routes';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { getUserInfo } from './models/user/user-api';
import { rootStore, type RootState } from './stores/root/root.ts';
import { message } from 'antd';
import SocketMessageWrapper from './components/partials/socket-message-wrapper/socket-message-wrapper.tsx';
import './App.css';
import './styles/themes/dark.scss';
import './styles/themes/white.scss';
import './styles/ui-lib/ui-lib.scss';
import './styles/main/main.scss';

function App() {

    const navigate = useNavigate();
    const location = useLocation();
    const locationPathRef = useRef(location.pathname);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const user = useSelector((state: RootState) => state.user.user);
    
    useEffect(() => {
        locationPathRef.current = location.pathname;
    }, [location.pathname]);

    useEffect(() => {
        getUserInfo()
        .then((res) => {
            setIsLoading(true);
            rootStore.dispatch({ type: "SET_USER", payload: res.data.user });
            
            if (location.pathname === "/") {
                navigate("/main/dialogs/initial");
            }
        })
        .catch((error) => {
            console.error(error);
            navigate("/auth/signin");
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, []);
    
    useEffect(() => {
        const theme = localStorage.getItem("theme");
        document.body.className = theme ? theme : "dark-theme";
    }, []);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:5000/");

        socket.onopen = function() {
            rootStore.dispatch({ type: "WS_CONNECT", payload: socket });
            console.log("Соединение с вебсокетом открыто");
        };

        socket.onmessage = function(event) {
            const parsedData = JSON.parse(event.data);
            rootStore.dispatch({ type: "WS_MESSAGE", payload: event.data });

            if (locationPathRef.current !== `/main/dialogs/${parsedData.dialogId}`) {
                messageApi.open({
                    type: 'info',
                    content: <SocketMessageWrapper data={parsedData} />,
                    className: 'custom-message-position',
                });
                console.log(event.data);
            }
        };

        socket.onclose = function() {
            console.log("Соединение с вебсокетом закрыто");
        };

        socket.onerror = function(error) {
            console.error(error);
        };
    }, [])

    return (
        <>
        {contextHolder}
            <Routes>
                {
                  routes.map(({ path, component: Component, children: Children }) => (
                        <Route
                              key={path}
                              path={path}
                              element={
                                    (user && Children) ? (
                                          <Component>
                                                <Children />
                                          </Component>
                                    ) : isLoading && <Navigate to="/auth/signin" />
                              }
                        />
                  ))
                }
                {
                    publicRoutes.map(({ path, component: Component, children: Children }) => (
                        <Route
                            key={path}
                            path={path}
                            element={
                                <Component>
                                    { Children && <Children /> }
                                </Component>
                            }
                        />
                    ))
                }
            </Routes>
        </>
    );
}

export default App;