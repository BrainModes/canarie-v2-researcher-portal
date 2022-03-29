import React, { useState, useEffect } from "react";
import {
	Layout,
	PageHeader,
	Button,
	Card,
	Table,
	Badge,
	Space,
	Row,
} from "antd";
import { Link, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import styles from "./index.module.scss";
import moment from "moment-timezone";
import InviteUser from "./InviteUserToContainer";
import { getUserlistInContainer } from "../../../APIs";
import { ErrorMessager, namespace } from "../../../APIs/ErrorMessenger";

const { Content } = Layout;

const fakeUsers = [
	{
		username: "canarie-admin",
		enabled: true,
		firstname: "samantha",
		lastname: "zhang",
		email: "zhangzhiqin7+2@gmail.com",
		role: ["instance-admin"],
	},
	{
		username: "coral0",
		enabled: false,
		firstname: "corla0",
		lastname: "he",
		email: "hxth2018+0@gmail.com",
		role: ["instance-admin"],
	},
];
function Landing() {
	const [cookies] = useCookies(["user"]);
	const [inviteUser, setInviteUser] = useState(false);
	const [userlist, setUserlist] = useState(null);
	let { containerId } = useParams();

	const columns = [
		{
			title: "Username",
			dataIndex: "username",
			key: "username",
		},
		// {
		// 	title: "Status",
		// 	dataIndex: "enabled",
		// 	key: "enabled",
		// 	render: (text) => {
		// 		return text ? (
		// 			<Badge status="success" text="Active" />
		// 		) : (
		// 			<Badge status="error" text="Disabled" />
		// 		);
		// 	},
		// },
		{ title: "Role", dataIndex: "role", key: "labels" },
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
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
			dataIndex: "time_created",
			key: "time_created",
			render: (text) => {
				return moment.tz(text, "America/Toronto").format();
			},
		},
		/* {
			title: "Actions",
			key: "action",
			render: (text, record) => (
				<Space size="middle">
					<Link to={`/user/${record.id}`}>View</Link>
				</Space>
			),
		}, */
	];

	useEffect(() => {
		getUsers();
	}, []);

	function getUsers() {
		getUserlistInContainer(containerId, {})
			.then((res) => {
				const users = res.data.result;
				const researchers = users.filter(
					(user) => user.role !== "patient",
				);
				setUserlist(researchers);
			})
			.catch((err) => {
				if (err.response) {
					const errorMessager = new ErrorMessager(
						namespace.container.getUsers,
					);
					errorMessager.triggerMsg(
						err.response.status,
						err.response.data?.result,
					);
				}
			});
	}

	function onInviteUserCancel() {
		setInviteUser(false);
	}
	const routes = [
		{
			path: "/containers",
			breadcrumbName: "Containers",
		},
		{
			path: `/container/${containerId}/landing`,
			breadcrumbName: "Container Name",
		},
		{
			path: `/container/${containerId}/teams`,
			breadcrumbName: "Team",
		},
	];

	function itemRender(route, params, routes, paths) {
		const index = routes.indexOf(route);
		if (index === 0) {
			return <Link to={route.path}>{route.breadcrumbName}</Link>;
		} else if (index === 1) {
			return (
				<span
					style={{
						maxWidth: "calc(100% - 74px)",
						display: "inline-block",
						verticalAlign: "bottom",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					<Link to={route.path}>{route.breadcrumbName}</Link>
				</span>
			);
		} else {
			return <>{route.breadcrumbName}</>;
		}
	}
	return (
		<>
			<Content className={styles.container}>
				<PageHeader
					ghost={false}
					onBack={() => window.history.back()}
					title="Teams"
					subTitle="Your role is container admin"
					breadcrumb={{ routes, itemRender }}
					style={{ marginBottom: "10px" }}
				/>
				<Card>
					<Row
						style={{ marginBottom: "15px" }}
						onClick={() => setInviteUser(true)}
					>
						<Button>Add A User</Button>
					</Row>
					<Table
						columns={columns}
						dataSource={userlist}
						rowKey={(record) => record.username}
					/>
				</Card>
				<InviteUser
					inviteUser={inviteUser}
					onInviteUserCancel={onInviteUserCancel}
					getUsers={getUsers}
				/>
			</Content>
		</>
	);
}
export default Landing;
