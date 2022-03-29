import React from "react";
import { Modal, Form, Input, Radio, message, Select } from "antd";
import styles from "./index.module.scss";

const { Option } = Select;
function Step3() {
	const options = [
		{ label: "Inherit permissions from parent", value: "inherit" },
		{ label: "Do not inherit permissions", value: "no-inherit" },
	];

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
		</>
	);
}

export default Step3;
