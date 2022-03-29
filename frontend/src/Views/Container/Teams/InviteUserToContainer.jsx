import React from "react";
import { Modal, Form, Input, Tooltip, Radio, message } from "antd";
import { useParams } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
import { addUserToContainer } from "../../../APIs";
import { ErrorMessager, namespace } from "../../../APIs/ErrorMessenger";

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

// const options = [
// 	{ label: "Container User", value: "member" },
// 	{ label: "Container Admin", value: "admin" },
// ];

function InviteUserToContainer(props) {
	let { containerId } = useParams();

	const onFinish = async () => {
		formRef.current.validateFields().then((values) => {
			const data = Object.assign({ relation: "None" }, values);

			addUserToContainer(parseInt(containerId), data)
				.then((res) => {
					props.onInviteUserCancel();
					message.success(
						`The user with email ${values.email} is added successfully.`,
					);
					formRef.current.resetFields();
					props.getUsers();
				})
				.catch((err) => {
					if (err.response) {
						const errorMessager = new ErrorMessager(
							namespace.container.addUser,
						);
						errorMessager.triggerMsg(
							err.response.status,
							err.response.data?.result,
						);
					}
				});
		});
	};
	// const roleTip = (
	// 	<>
	// 		<p>Container User: A user with read-only access to the container</p>
	// 		<p>
	// 			Container Admin: A user with access to add users to this
	// 			container
	// 		</p>
	// 	</>
	// );

	return (
		<Modal
			title="Add A User"
			visible={props.inviteUser}
			onOk={onFinish}
			onCancel={props.onInviteUserCancel}
		>
			<Form
				{...layout}
				name="basic"
				initialValues={{
					role: "container-user",
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				ref={formRef}
			>
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
					]}
					extra="Only users on the platform can be invited to this container."
				>
					<Input />
				</Form.Item>

				{/* <Form.Item
					label={
						<Tooltip placement="top" title={roleTip}>
							Role <QuestionCircleOutlined />
						</Tooltip>
					}
					name="relation"
					rules={[
						{
							required: true,
							message: "Please select user role!",
						},
					]}
				>
					<Radio.Group options={options} />
				</Form.Item> */}
			</Form>
		</Modal>
	);
}

export default InviteUserToContainer;
