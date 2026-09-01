import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { rootStore } from "./stores/root/root.ts";
import ruRu from "antd/locale/ru_RU";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<Provider store={ rootStore }>
		<BrowserRouter>
			<ConfigProvider 
				locale={ ruRu }
				theme={ {
					token: {
						fontFamily: "Nunito"
					}
				} }
			>
				<App />
			</ConfigProvider>
		</BrowserRouter>
	</Provider>
);
