import AuthLayout from "./components/layouts/auth/auth";
import MainLayout from "./components/layouts/main/main";
import SignIn from "./components/pages/auth/sign-in/sign-in";
import SignUp from "./components/pages/auth/sign-up/sign-up";
import Dialogs from "./components/pages/dialogs/dialogs";

export const publicRoutes = [
	{
		path: "/auth/signin",
		component: AuthLayout,
		children: SignIn,
		authRequired: false,
	},
	{
		path: "/auth/signup",
		component: AuthLayout,
		children: SignUp,
		authRequired: false,
	}
];
export const routes = [
	{
		path: "/main/dialogs/:id",
		component: MainLayout,
		children: Dialogs,
		authRequired: true,
	}
];