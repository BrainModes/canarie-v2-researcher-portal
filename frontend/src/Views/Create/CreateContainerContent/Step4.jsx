import React from "react";
import { Modal, Form, Input, Radio, message, Select } from "antd";
import styles from "./index.module.scss";
const { Option } = Select;

const formRef = React.createRef();
const layout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
	},
};

const options = [
	{ label: "Inherit permissions from parent", value: "inherit" },
	{ label: "Do not inherit permissions", value: "no-inherit" },
];

function Step2() {
	function handleChange(value) {
		console.log(`selected ${value}`);
	}
	return (
		<>
			<Form.Item
				label={"Type"}
				name="inherit"
				rules={[
					{
						required: true,
						message: "Please select container type!",
					},
				]}
			>
				<Radio.Group options={options} />
			</Form.Item>

			<Form.Item label={"Container Attribute"} name="option">
				<Select
					// defaultValue="option1"
					style={{ width: 120 }}
					onChange={handleChange}
				>
					<Option value="option1">Option 1</Option>
					<Option value="option2">Option 2</Option>
					<Option value="option3" disabled>
						Option 3
					</Option>
				</Select>
			</Form.Item>
		</>
	);
}

export default Step2;
