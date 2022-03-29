import React from "react";
import { withRouter } from "react-router-dom";
import { forgotPassword } from "../../APIs";
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
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { StandardLayout } from "../../Components/Layout";
import styles from "./index.module.scss";

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

function Login() {
	const config = {
		observationVars: [],
		initFunc: () => {},
	};

	const onFinish = (values) => {
		forgotPassword(values.email).then((res) => {
			if (res.status === 200) {
				message.success(
					"You will be contacted shortly by email with instructions to reset your password",
				);
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
						Forgot my password
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
								label="Email"
								name="email"
								rules={[
									{
										required: true,
										message: "Please input your email!",
									},
								]}
							>
								<Input
									prefix={
										<UserOutlined className="site-form-item-icon" />
									}
								/>
							</Form.Item>
							<Row>
								<Col xs={{ span: 0 }} sm={{ span: 5 }}></Col>
								<Col xs={{ span: 24 }} sm={{ span: 19 }}>
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

export default withRouter(Login);
