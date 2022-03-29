import React, { useState, useEffect } from "react";
import { Form, Input, Radio, Checkbox, Select } from "antd";
import { getUsersV2 } from "../../../APIs";

const options = [
	{ label: "Program", value: "program" },
	{ label: "Study", value: "study" },
	{ label: "Generic", value: "generic" },
];
const dataSources = [
	{ label: "Patient Data Gateway", value: "patient_data_gateway" },
	{ label: "Labkey", value: "labkey" },
	{ label: "Redcap", value: "redcap" },
];
const modalities = [
	{ label: "Clinical", value: "clinical" },
	{ label: "Imaging", value: "imaging" },
	{ label: "Eye tracking", value: "eye_tracking" },
];
const { Option } = Select;

function Step0({ formValue }) {
	const [type, setType] = useState(formValue && formValue.type);
	const [usersList, setUsersList] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchUsers();
	}, []);

	function onChange(checkedValues) {
		console.log("checked = ", checkedValues);
	}

	function fetchUsers() {
		setLoading(true);
		
		getUsersV2()
			.then((res) => {
				setLoading(false);
				const researchers = res.data.result.filter((user) => !user.role.includes('patient') && !user.role.includes('container-requester'));
				const usersElement = researchers.map((user) => {
					return <Option key={user.username}>{user.username}</Option>;
				});
				setUsersList(usersElement);
			})
			.catch((res) => {
				setLoading(false);
				console.log(res);
			});
	}
	function handleChange(value) {
		console.log(`selected ${value}`);
	}
	return (
		<>
			<Form.Item
				label="Container name"
				name="name"
				rules={[
					{
						required: true,
						message: "Please input a container name.",
					},
					{
						pattern: new RegExp(/^[a-z0-9]+$/g),
						message: "Only letters and numbers are acceptable.",
					},
					{
						pattern: new RegExp(/^[a-z]+/g),
						message: "First symbol has to be lowercased letter.",
					},
				]}
				extra="The container name can only include lowercase letters or numbers, and has to start with lowercased letters."
			>
				<Input />
			</Form.Item>

			<Form.Item
				label={"Type"}
				name="type"
				rules={[
					{
						required: true,
						message: "Please select container type!",
					},
				]}
				onChange={(e) => setType(e.target.value)}
			>
				<Radio.Group options={options} />
			</Form.Item>
			{type === "program" && (
				<>
					<Form.Item
						label={"Official Program Title"}
						name="title"
						rules={[
							{
								required: true,
								message: "Please input program title!",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Program Admin Username"
						name="admin"
						rules={[
							{
								required: true,
								message:
									"Please input program admin information.",
							},
						]}
					>
						<Select
							// mode="multiple"
							showSearch
							allowClear
							style={{ width: "100%" }}
							placeholder="Please select"
							onChange={handleChange}
						>
							{usersList}
						</Select>
					</Form.Item>
				</>
			)}
			{type === "study" && (
				<>
					<Form.Item
						label={"Official Study Title"}
						name="title"
						rules={[
							{
								required: true,
								message: "Please input study title!",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Study Admin Username"
						name="admin"
						rules={[
							{
								required: true,
								message:
									"Please input study admin information.",
							},
						]}
					>
						<Select
							// mode="multiple"
							showSearch
							allowClear
							style={{ width: "100%" }}
							placeholder="Please select"
							onChange={handleChange}
						>
							{usersList}
						</Select>
					</Form.Item>
					<Form.Item label="Data Capture Tools" name="tools">
						<Checkbox.Group
							options={dataSources}
							onChange={onChange}
						/>
					</Form.Item>
					<Form.Item label="Data Modalities" name="modalities">
						<Checkbox.Group
							options={modalities}
							onChange={onChange}
						/>
					</Form.Item>
					<Form.Item label={"Study Investigator"} name="investigator">
						<Input />
					</Form.Item>
					<Form.Item label={"Study Sponsor"} name="sponsor">
						<Input />
					</Form.Item>
				</>
			)}
			{type === "generic" && (
				<>
					<Form.Item
						label={"Official Title"}
						name="title"
						rules={[
							{
								required: true,
								message: "Please input title!",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Admin Username"
						name="admin"
						rules={[
							{
								required: true,
								message: "Please input admin information.",
							},
						]}
					>
						<Select
							// mode="multiple"
							showSearch
							allowClear
							style={{ width: "100%" }}
							placeholder="Please select"
							onChange={handleChange}
						>
							{usersList}
						</Select>
					</Form.Item>
				</>
			)}
		</>
	);
}

export default Step0;
