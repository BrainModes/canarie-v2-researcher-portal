import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { Card, Form, Input, Button, Typography, Row, Col, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { decodeResetLink, resetPassword } from "../../APIs";

const { Title } = Typography;

const layout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
	},
};
const tailLayout = {
	wrapperCol: {
		span: 24,
	},
};

function ForgetPassword(props) {
	const [user, setUser] = useState({});
	const [isExpired, setExpired] = useState(false);
	const [form] = Form.useForm();

	const {
		match: { path, params },
	} = props;
	const config = {
		observationVars: [],
		initFunc: () => {},
	};
	const onFinish = (values) => {
		console.log("Success:", values);
		resetPassword(props.hashCode, values.password).then((res) => {
			message.success("Password Reset Successfully!");
			setTimeout(() => {
				window.location.href = "/";
			}, 1500);
		});
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	useEffect(() => {
		decodeResetLink(props.hashCode)
			.then((res) => {
				const { user_info } = res.data;
				setUser(user_info);
				form.setFieldsValue(user_info);
			})
			.catch((e) => {
				setExpired(true);
			});
	}, []);

	return (
		<>
			<Card>
				<Row style={{ marginBottom: "24px" }}>
					<Col xs={{ span: 0 }} sm={{ span: 6 }}></Col>
					<Col xs={{ span: 24 }} sm={{ span: 18 }}>
						<Title level={3}>Reset Password</Title>
					</Col>
				</Row>
				<Form
					{...layout}
					name="basic"
					initialValues={{
						remember: true,
					}}
					form={form}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
				>
					<Form.Item
						label="Username"
						name="username"
						value={user.username}
						rules={[
							{
								required: true,
								message: "Please enter a username",
							},
						]}
					>
						<Input prefix={<UserOutlined />} disabled />
					</Form.Item>
					<Form.Item
						label="Email"
						name="email"
						value={user.email}
						rules={[
							{
								required: true,
								message: "Please enter a valid email address",
							},
							{
								type: "email",
								message: "Please enter a valid email address.",
							},
						]}
					>
						<Input disabled />
					</Form.Item>

					<Form.Item
						label="New Password"
						name="password"
						rules={[
							{
								required: true,
								message: "Please input your password.",
							},
							{
								pattern: new RegExp(
									/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_!%&/()=?*+#,.;])[A-Za-z\d-_!%&/()=?*+#,.;]{11,30}$/g,
								),
								message:
									"Password guidelines: Passwords must contain 11-30 characters and include at least one letter, one special character(-_!%&/()=?*+#,.;), and one number.",
							},
						]}
					>
						<Input.Password prefix={<LockOutlined />} />
					</Form.Item>

					<Form.Item
						label="Confirm Password"
						name="password_confirm"
						rules={[
							{
								required: true,
								message: "Please confirm your password",
							},

							({ getFieldValue }) => ({
								validator(rule, value) {
									if (
										!value ||
										getFieldValue("password") === value
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
						<Input.Password
							onCopy={(e) => e.preventDefault()}
							onPaste={(e) => e.preventDefault()}
							autoComplete="off"
							prefix={<LockOutlined />}
						/>
					</Form.Item>

					<Row>
						<Col xs={{ span: 0 }} sm={{ span: 6 }}></Col>
						<Col xs={{ span: 24 }} sm={{ span: 18 }}>
							<Form.Item {...tailLayout}>
								<Button type="primary" htmlType="submit">
									Submit
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Card>
		</>
	);
}

export default withRouter(ForgetPassword);
