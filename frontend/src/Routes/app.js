import Login from "../Views/Login/Login";
import ForgetPw from "../Views/Login/ForgetPw";
import Activate from "../Views/Login/ActivateUser";
import Confirmation from "../Views/Login/ActivationConfirmation";
import Home from "../Views/Home/Home";
import Containers from "../Views/Containers/Containers";
import Container from "../Views/Container/Container";
import CreateContainer from "../Views/Create/CreateContainer";
import ContainerConfirmation from "../Views/Create/ContainerConfirmation";
import Admin from "../Views/Admin/Admin";
import ErrorPage from "../Views/ErrorPage/ErrorPage";
import ForgetPassword from "../Views/ForgetPassword";

const routes = [
	{
		path: "/",
		component: Home,
		exact: true,
	},
	{
		path: "/login",
		component: Login,
		exact: true,
	},
	{
		path: "/forget-password",
		component: ForgetPw,
		exact: true,
	},
	{
		path: "/self-registration",
		component: Activate,
	},
	{
		path: "/pwdreset",
		component: ForgetPassword,
	},
	{
		path: "/activate-confirmation",
		component: Confirmation,
		exact: true,
	},
	{
		path: "/create-container",
		component: CreateContainer,
		exact: true,
		protected: true,
	},
	{
		path: "/create-container-confirmation",
		component: ContainerConfirmation,
		exact: true,
		protected: true,
	},
	{
		path: "/containers",
		component: Containers,
		exact: true,
		protected: true,
	},
	{
		path: "/container/:containerId",
		component: Container,
		protected: true,
	},
	{
		path: "/admin",
		component: Admin,
		protected: true,
	},
	{ path: "/error", component: ErrorPage },
];

export default routes;
