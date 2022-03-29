import React from "react";
import { withRouter, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { connect } from "react-redux";
import {
	message,
	Card,
	Form,
	Input,
	Button,
	Layout,
	Typography,
	Row,
	Col,
	Tooltip,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import jwtDecode from "jwt-decode";

import { serverAxios as axios } from "../../APIs/config";
import { StandardLayout } from "../../Components/Layout";
import styles from "./index.module.scss";
import { login } from "../../APIs";
import { ErrorMessager, namespace } from "../../APIs/ErrorMessenger";
import { setIsLoginCreator } from "../../Redux/actions";
import { tokenManager } from "../../Service/tokenManager";
import { userAuthManager } from "../../Service/userAuthManager";

const { Content } = Layout;
const { Title } = Typography;

const layout = {
	labelCol: {
		span: 5,
	},
	wrapperCol: {
		span: 19,
	},
};

const tailLayout = {
	wrapperCol: {
		span: 24,
	},
};

function Login(props) {
	const [_, setCookie] = useCookies(["isLogin"]);

	// const {
	// 	match: { path, params },
	// } = props;
	const config = {
		observationVars: [],
		initFunc: () => {},
	};

	const onFinish = (values) => {
		login({ ...values, user_role: "researcher" })
			.then((res) => {
				console.log(res);
				const { access_token, refresh_token } = res.data.result;
				// Need to specify path to avoid cookied been set to specific page,
				// which causes unexpected bugs
				//update role
				const decoded = jwtDecode(access_token);

				tokenManager.setCookies({
					isLogin: true,
					username: values.username,
					access_token: access_token,
					refresh_token: refresh_token,
					role: decoded.user_role,
				});
				props.setIsLoginCreator(true);

				userAuthManager.initRefreshModal();
				userAuthManager.initExpirationLogout();
				tokenManager.refreshToken(access_token);

				// attach access_token to axios header
				// because other api calls need the it to validate user's identity.
				axios.defaults.headers.common[
					"Authorization"
				] = `Bearer ${access_token}`;
				message.success(`Welcome back, ${values.username}`);
				props.history.push("/containers");
			})
			.catch((err) => {
				if (err.response) {
					const errorMessager = new ErrorMessager(
						namespace.login.auth,
					);
					errorMessager.triggerMsg(err.response.status);
				}
			});
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<StandardLayout {...config}>
			<Content className={"content"}>
				<div className={styles.container}>
					<Title level={3} className={styles.title}>
						Welcome to Canarie Researcher Portal
					</Title>
					<Card>
						<br />
						<Form
							{...layout}
							name="basic"
							initialValues={{
								remember: true,
							}}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
						>
							<Form.Item
								label="Username"
								name="username"
								rules={[
									{
										required: true,
										message: "Please input your username!",
									},
								]}
							>
								<Input
									prefix={
										<UserOutlined className="site-form-item-icon" />
									}
								/>
							</Form.Item>

							<Form.Item
								label="Password"
								name="password"
								rules={[
									{
										required: true,
										message: "Please input your password!",
									},
								]}
							>
								<Input.Password
									prefix={
										<LockOutlined className="site-form-item-icon" />
									}
								/>
							</Form.Item>
							<Row>
								<Col xs={{ span: 0 }} sm={{ span: 5 }}></Col>
								<Col xs={{ span: 24 }} sm={{ span: 19 }}>
									<Form.Item {...tailLayout}>
										<Tooltip
											title={
												<>
													You may{" "}
													<a href="mailto:admin@indocresearch.org">
														Contact an administrator
													</a>{" "}
													to request an account
												</>
											}
										>
											<Button
												type="link"
												style={{ paddingLeft: 0 }}
											>
												I don't have an account
											</Button>
										</Tooltip>

										<Link
											className={styles.forgot}
											style={{ paddingRight: 0 }}
											to="/forget-password"
										>
											Forgot password?
										</Link>
									</Form.Item>
								</Col>
							</Row>
							<Row>
								<Col xs={{ span: 0 }} sm={{ span: 5 }}></Col>
								<Col xs={{ span: 24 }} sm={{ span: 19 }}>
									<Form.Item>
										<Button
											type="primary"
											htmlType="submit"
										>
											Log In
										</Button>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</Card>
				</div>
			</Content>
		</StandardLayout>
	);
}

export default connect(
	(state) => ({
		isLogin: state.isLogin,
		refreshTokenModal: state.refreshTokenModal,
	}),
	{ setIsLoginCreator },
)(withRouter(Login));
