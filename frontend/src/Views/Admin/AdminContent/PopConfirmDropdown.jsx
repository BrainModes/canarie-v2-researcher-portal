import React, { useState } from "react";
import { Menu, Dropdown, Button, Popconfirm, message, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { suspendUsers, activateUsers } from "../../../APIs";

const { Title, Text } = Typography;

function PopconfirmDropdown({ record, fetchUsers }) {
	console.log(record.enabled);
	const [v, setV] = useState(false);
	const menu = (id) => {
		return record.enabled ? (
			<Menu>
				<Menu.Item key={id}>
					<Text type="danger" onClick={() => setV(true)}>
						Suspend
					</Text>
				</Menu.Item>
			</Menu>
		) : (
			<Menu>
				<Menu.Item key={id}>
					<Text type="danger" onClick={() => setV(true)}>
						Unsuspend
					</Text>
				</Menu.Item>
			</Menu>
		);
	};
	async function activateUser() {
		activateUsers([record.username])
			.then((res) => {
				message.success(`The user ${record.username} is unsuspended`);
				fetchUsers();
			})
			.then((error) => console.log(error));
	}
	async function suspendUser() {
		suspendUsers([record.username])
			.then((res) => {
				message.success(`The user ${record.username} is suspended`);
				fetchUsers();
			})
			.then((error) => console.log(error));
	}
	return (
		<Popconfirm
			title={`Are you sure to ${
				record.enabled ? "suspend" : "unsuspend"
			}  this user ${record.username}?`}
			cancelText="No"
			trigger="click"
			visible={v}
			onCancel={() => setV(false)}
			onConfirm={() => {
				if (record.enabled) {
					suspendUser();
				} else {
					activateUser();
				}

				setV(false);
			}}
		>
			<Dropdown
				overlay={menu(record._id, record.name)}
				placement="bottomLeft"
			>
				<Button
					className="ant-dropdown-link"
					type="link"
					style={{ paddingLeft: "0" }}
				>
					More <DownOutlined />
				</Button>
			</Dropdown>
		</Popconfirm>
	);
}

export default PopconfirmDropdown;
