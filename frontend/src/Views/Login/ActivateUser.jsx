import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Card, Form, Input, Button, Layout, Typography, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import { StandardLayout } from "../../Components/Layout";
import styles from "./index.module.scss";
import { getUserInformation, addUser } from "../../APIs";

const formRef = React.createRef();
const { Content } = Layout;
const { Title } = Typography;

const layout = {
	labelCol: {
		span: 7,
	},
	wrapperCol: {
		span: 17,
	},
};

function ActivateUser(props) {
	const {
		match: { path, params },
	} = props;
	const config = {
		observationVars: [],
		initFunc: () => {},
	};

	useEffect(() => {
		const token = window.location.pathname.split("/")[2];
		getUserInformation(token)
			.then((res) => {
				formRef.current.setFieldsValue(res.data.result);
			})
			.catch((err) => console.log);
	});

	const onFinish = () => {
		formRef.current.validateFields().then((values) => {
			console.log(values);
			// values.role = [values.role];
			// console.log("onFinish -> values", values);
			addUser(values)
				.then((res) => {
					props.history.push("/activate-confirmation");
				})
				.catch((err) => console.log);
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
						Activate your account
					</Title>
					<Card>
						<br />
						<Form
							{...layout}
							name="basic"
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							ref={formRef}
						>
							<Form.Item
								label="Role"
								name="role"
								rules={[
									{
										required: true,
										message: "Please input your role!",
									},
								]}
							>
								<Input disabled />
							</Form.Item>
							<Form.Item
								label="Email"
								name="email"
								rules={[
									{
										required: true,
										message: "Please input your email!",
									},
								]}
							>
								<Input disabled />
							</Form.Item>
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
								<Input disabled />
							</Form.Item>

							<Form.Item
								label="First Name"
								name="firstname"
								rules={[
									{
										required: true,
										message: "First name is required.",
									},
								]}
							>
								<Input disabled />
							</Form.Item>
							<Form.Item
								label="Last Name"
								name="lastname"
								rules={[
									{
										required: true,
										message: "Last name is required.",
									},
								]}
							>
								<Input disabled />
							</Form.Item>

							<Form.Item
								label="Password"
								name="password"
								validateTrigger="onBlur"
								rules={[
									{
										required: true,
										message: "Please input your password!",
									},
									{
										required: true,
										pattern: new RegExp(
											"^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*,>])(?=.{8,})",
										),
										message:
											"(8 character minimum) Include at least one letter, one special character, and one number.",
									},
								]}
							>
								<Input.Password prefix={<LockOutlined />} />
							</Form.Item>

							<Form.Item
								label="Confirm Password"
								name="confirm"
								dependencies={["password"]}
								validateTrigger="onBlur"
								rules={[
									{
										required: true,
										message:
											"Please confirm your password.",
									},
									({ getFieldValue }) => ({
										validator(rule, value) {
											if (
												!value ||
												getFieldValue("password") ===
													value
											) {
												return Promise.resolve();
											}
											return Promise.reject(
												"The two passwords that you entered do not match.",
											);
										},
									}),
								]}
							>
								<Input.Password prefix={<LockOutlined />} />
							</Form.Item>

							<Row>
								<Col xs={{ span: 0 }} sm={{ span: 7 }}></Col>
								<Col xs={{ span: 24 }} sm={{ span: 17 }}>
									<Form.Item>
										<Button
											type="primary"
											htmlType="submit"
										>
											Submit
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

export default withRouter(ActivateUser);
