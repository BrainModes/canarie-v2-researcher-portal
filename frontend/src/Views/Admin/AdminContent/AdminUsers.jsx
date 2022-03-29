import React, { useState, useEffect } from "react";
import {
	Typography,
	Table,
	Spin,
	Card,
	Button,
	Space,
	Dropdown,
	Menu,
	Modal,
	message,
	Badge,
} from "antd";
import {
	DownOutlined,
	UserOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import csv from "papaparse";
import PopConfirmDropdown from "./PopConfirmDropdown";

import InviteUser from "./InviteUser";
import styles from "./index.module.scss";
import BulkInviteUsers from "./BulkInviteUsers";
import { getUsers, suspendUsers } from "../../../APIs";

const { Title, Text } = Typography;
const { confirm } = Modal;

function AdminUsers() {
	const [cookies] = useCookies(["user"]);
	const [loading, setLoading] = useState(false);
	const [bulkEdit, setBulkEdit] = useState(false);
	const [bulkModal, setBulkModal] = useState(false);
	const [inviteUser, setInviteUser] = useState(false);
	const [users, setUsers] = useState(null);
	const [selectedUsers, setSelectedUsers] = useState(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);

	useEffect(() => {
		fetchUsers();
	}, []);

	function fetchUsers() {
		getUsers()
			.then((res) => {
				setLoading(false);

				const users = res.data.result;
				const researchers = users.filter(
					(user) =>
						user.role &&
						!user.role.includes("patient") &&
						!user.role.includes("container-requester"),
				);
				setUsers(researchers);
			})
			.catch((res) => {
				setLoading(false);
				console.log(res);
			});
	}

	const columns = [
		{
			title: "Username",
			dataIndex: "username",
			key: "username",
			sorter: (a, b) => (a.username > b.username ? 1 : -1),
		},
		{
			title: "Status",
			dataIndex: "enabled",
			key: "enabled",
			render: (text) => {
				return text ? (
					<Badge status="success" text="Active" />
				) : (
					<Badge status="error" text="Disabled" />
				);
			},
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			sorter: (a, b) => (a.email > b.email ? 1 : -1),
		},
		{
			title: "First Name",
			dataIndex: "firstname",
			key: "firstName",
		},
		{
			title: "Last Name",
			dataIndex: "lastname",
			key: "lastName",
		},
		{
			title: "Created at",
			dataIndex: "createdTimestamp",
			key: "createdTimestamp",
			sorter: (a, b) =>
				a.createdTimestamp > b.createdTimestamp ? 1 : -1,
			render: (text) => {
				return moment.tz(text, "America/Toronto").format();
			},
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
			render: (text) => {
				return (
					text &&
					text[0]
						.split("-")
						.map(
							(word) =>
								word[0].toUpperCase() +
								word.slice(1, word.length),
						)
						.join(" ")
				);
			},
		},
		{
			title: "Actions",
			key: "action",
			render: (text, record) => (
				<Space size="middle">
					{/* <Link to={`/user/${record._id}`}>View</Link> */}
					{cookies.username !== record.username && (
						<PopConfirmDropdown
							record={record}
							fetchUsers={fetchUsers}
						/>
					)}
				</Space>
			),
		},
	];

	const menu = (
		<Menu>
			<Menu.Item
				key="1"
				icon={<UserOutlined />}
				onClick={() => setInviteUser(true)}
			>
				Add One User
			</Menu.Item>
			<Menu.Item key="2" icon={<UserOutlined />} onClick={openBulkModal}>
				Bulk Add Users
			</Menu.Item>
		</Menu>
	);

	const bulkMenu = (
		<Menu>
			<Menu.Item key="1" onClick={() => showConfirm()}>
				<Text type="danger">Suspend</Text>
			</Menu.Item>
		</Menu>
	);

	function showConfirm() {
		confirm({
			title: "Do you want to suspend these users?",
			icon: <ExclamationCircleOutlined />,
			content: (
				<ul>
					{selectedUsers.map((user) => {
						return <li key={user.id}>{user.username}</li>;
					})}
				</ul>
			),
			onOk() {
				bulkSuspend();
			},
			onCancel() {
				console.log("Cancel");
			},
		});
	}

	function bulkSuspend() {
		setLoading(true);
		console.log("bulk suspend", selectedRowKeys, selectedUsers);
		suspendUsers(selectedRowKeys)
			.then((res) => {
				setLoading(false);
				message.success(`${selectedRowKeys.length} users suspended`);
				fetchUsers();
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	}

	function openBulkModal() {
		setBulkModal(true);
	}
	function closeBulkModal() {
		setBulkModal(false);
	}

	function onInviteUserCancel() {
		setInviteUser(false);
	}

	function downloadCSV() {
		console.log(users);
		var result = csv.unparse({
			fields: [
				"id",
				"username",
				"email",
				"firstName",
				"lastName",
				"createdTimestamp",
				"role",
			],
			data: users,
		});
		console.log("downloadCSV -> result", result);

		const currentTime = moment().format();
		const exportedFilename = `canarie-users-${currentTime}.csv`;
		const blob = new Blob([result], { type: "text/csv;charset=utf-8;" });
		if (navigator.msSaveBlob) {
			// IE 10+
			navigator.msSaveBlob(blob, exportedFilename);
		} else {
			const link = document.createElement("a");
			if (link.download !== undefined) {
				// feature detection
				// Browsers that support HTML5 download attribute
				const url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", exportedFilename);
				link.style.visibility = "hidden";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}
	function onSelectChange(selectedRowKeys, selectedRows) {
		console.log("selectedRowKeys changed: ", selectedRowKeys);
		setSelectedRowKeys(selectedRowKeys);
		setSelectedUsers(selectedRows);
	}

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		getCheckboxProps: (record) => {
			return {
				disabled: record.username === cookies.username, // Column configuration not to be checked
			};
		},
	};

	function onBulkEdit() {
		setBulkEdit(!bulkEdit);
	}

	return (
		<div className={styles.wrapper}>
			<Title level={2} className={"mt-3"}>
				Manage Users
			</Title>
			<Spin spinning={loading}>
				<Card>
					<div className={styles.toolbar}>
						<Space>
							<Button onClick={downloadCSV}>Download CSV</Button>
							<Dropdown overlay={menu}>
								<Button>
									Add <DownOutlined />
								</Button>
							</Dropdown>
							{selectedRowKeys.length > 0 &&
								selectedRowKeys.length + " users selected"}
						</Space>
						<Space>
							{bulkEdit && (
								<Dropdown
									overlay={bulkMenu}
									disabled={!(selectedRowKeys.length > 0)}
								>
									<Button>
										Bulk Actions <DownOutlined />
									</Button>
								</Dropdown>
							)}
							<Button onClick={onBulkEdit} type="primary" ghost>
								{bulkEdit ? "Cancel" : "Bulk Edit"}
							</Button>
						</Space>
					</div>

					<Table
						dataSource={users}
						columns={columns}
						rowKey={(record) => record.username}
						rowSelection={bulkEdit ? rowSelection : false}
					/>
				</Card>
			</Spin>
			<BulkInviteUsers
				closeBulkModal={closeBulkModal}
				visible={bulkModal}
			/>
			<InviteUser
				inviteUser={inviteUser}
				onInviteUserCancel={onInviteUserCancel}
			/>
		</div>
	);
}
export default AdminUsers;
