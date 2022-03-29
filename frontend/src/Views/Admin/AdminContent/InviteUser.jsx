import React from "react";
import { Modal, Form, Input, Tooltip, Radio, message } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import _ from "lodash";

import { inviteUser, checkUserInfo } from "../../../APIs";

const formRef = React.createRef();

const layout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
	},
};

const onFinishFailed = (errorInfo) => {
	console.log("Failed:", errorInfo);
};

const options = [
	// { label: "Container Requester", value: "container-requester" },
	{ label: "User", value: "registered-user" },
	{ label: "Admin", value: "instance-admin" },
];

function InviteUser(props) {
	const onFinish = async () => {
		const values = await formRef.current.validateFields();
		try {
			const user = Object.assign({}, values, { projectId: -1 });
			await inviteUser(user);
			message.success("Invitation successfully sent to user's email! ");
			props.onInviteUserCancel();
			formRef.current.resetFields();
		} catch (error) {
			if (error.response.data && error.response.data.code === 409) {
				message.error("User has been invited before!");
			}
		}
		//props.onInviteUserCancel();
		//formRef.current.resetFields();
		/* formRef.current.validateFields().then((values) => {
			const user = Object.assign({}, values, { projectId: -1 });
			inviteUser(user)
				.then((res) =>
					message.success(
						"Invitation successfully sent to user's email! ",
					),
				)
				.catch((err) => {
					console.log(err.code);
				});
			props.onInviteUserCancel();
			formRef.current.resetFields();
		}); */
	};
	const roleTip = (
		<p>
			Admin: A platform admin who oversees the site
			<br />
			Container Requester: A user who can request containers
			<br />
			User: A user who can be added to containers, with no special
			previliges
		</p>
	);
	/**
	 * Validate user with username or email
	 *
	 * @param {*} rule the
	 * @param {*} value
	 */
	const validateUser = async (rule, value) => {
		try {
			const query = {};
			query[rule.field] = value;
			const userInfo = await checkUserInfo(query);
			if (!_.isEmpty(userInfo.data.result)) {
				throw `${rule.field} ${value} is taken`;
			}
		} catch (err) {
			throw err;
		}
	};

	return (
		<Modal
			title="Invite Users"
			visible={props.inviteUser}
			onOk={onFinish}
			onCancel={props.onInviteUserCancel}
		>
			<Form
				{...layout}
				name="basic"
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				ref={formRef}
			>
				<Form.Item
					label="Username"
					name="username"
					validateTrigger="onBlur"
					rules={[
						{
							required: true,
							message: "Please input a username.",
						},
						/* { validator: validateUser }, */
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="First Name"
					name="firstname"
					rules={[
						{
							required: true,
							message: "Please input first name.",
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Last Name"
					name="lastname"
					rules={[
						{
							required: true,
							message: "Please input last name.",
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="User Email"
					name="email"
					validateTrigger="onBlur"
					rules={[
						{
							required: true,
							message: "Please input user email!",
						},
						{
							type: "email",
							message: "Please input a valid email address.",
						},
						/* { validator: validateUser }, */
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label={
						<Tooltip placement="top" title={roleTip}>
							Role <QuestionCircleOutlined />
						</Tooltip>
					}
					name="role"
					rules={[
						{
							required: true,
							message: "Please select user role!",
						},
					]}
				>
					<Radio.Group options={options} />
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default InviteUser;
