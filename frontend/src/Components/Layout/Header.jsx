import React, { Component } from "react";
import { Layout, Menu, Button, message } from "antd";
import {
	ContainerOutlined,
	AppstoreOutlined,
	PlusOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import { userAuthManager } from "../../Service/userAuthManager";
const { Header } = Layout;
const { SubMenu } = Menu;

class AppHeader extends Component {
	logout = () => {
		// Need to specify path to avoid cookied been set to specific page,
		// which causes unexpected bugs
		userAuthManager.receivedLogout();
		this.props.history.push("/");
		message.success(`Logout successfully!`);
	};

	render() {
		const { isLogin, role } = this.props.allCookies;
		const isCreator =
			role === "instance-admin" || role === "container-requester";
		return (
			<Header
				className="header"
				style={{
					background: "#001529",
					boxShadow: "0 0 14px 1px rgba(0, 0, 0, 0.1)",
					position: "sticky",
					top: "0",
					zIndex: "100",
					width: "100%",
					height: "100%",
				}}
			>
				<Menu
					mode="horizontal"
					style={{ lineHeight: "64px" }}
					theme={"dark"}
				>
					<Menu.Item key="logo" style={{ marginRight: "27px" }}>
						<Link to="/">
							<img
								src={require("../../Images/indoc-icon-alt.png")}
								style={{ height: "30px" }}
								alt="icon"
							/>
						</Link>
					</Menu.Item>
					{/* {isLogin && (
						<Menu.Item key="containers">
							<Link to="/containers">
								<ContainerOutlined /> Discover
							</Link>
						</Menu.Item>
					)} */}
					{isLogin && role === "instance-admin" && (
						// Only platform admin creates container
						<SubMenu icon={<PlusOutlined />} title="New">
							<Menu.Item key="container">
								<Link to="/create-container">
									<AppstoreOutlined /> New Container Request
								</Link>
							</Menu.Item>
						</SubMenu>
					)}
					{isLogin && role === "instance-admin" && (
						// This is for platform admin
						<SubMenu
							icon={<SettingOutlined />}
							title="Admin console"
						>
							<Menu.Item key="users">
								<Link to="/admin/users">
									<AppstoreOutlined /> User Management
								</Link>
							</Menu.Item>
							{/* <Menu.Item key="requests">
								<Link to="/admin/requests">
									<AppstoreOutlined /> Requests
								</Link>
							</Menu.Item> */}
						</SubMenu>
					)}

					<Menu.Item key="5" style={{ float: "right" }}>
						{isLogin ? (
							<Button
								type="link"
								onClick={this.logout}
								style={{ color: "rgba(255, 255, 255, 0.65)" }}
							>
								Logout
							</Button>
						) : (
							<Link to="/login">
								<Button
									type="link"
									style={{
										color: "rgba(255, 255, 255, 0.65)",
									}}
								>
									Login
								</Button>
							</Link>
						)}
					</Menu.Item>
				</Menu>
			</Header>
		);
	}
}

export default withCookies(withRouter(AppHeader));
