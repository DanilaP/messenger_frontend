import { publicRoutes, routes } from './routes';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getUserInfo } from './models/user/user-api';
import type { UserStore } from './stores/user/user';
import userStore from './stores/user/user';
import './App.css';
import './styles/themes/dark.scss';
import './styles/themes/white.scss';
import './styles/ui-lib/ui-lib.scss';
import './styles/main/main.scss';

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const user = useSelector((state: UserStore) => state.user);
    
    useEffect(() => {
        getUserInfo()
        .then((res) => {
            setIsLoading(true);
            userStore.dispatch({ type: "SET_USER", payload: res.data.user });
            
            if (location.pathname === "/") {
                navigate("/main/dialogs");
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

    return (
        <>
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