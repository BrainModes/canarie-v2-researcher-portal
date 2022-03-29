import React from "react";
import { List, Space, Table } from "antd";
import { Link } from "react-router-dom";

import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import moment from "moment-timezone";

function ContainerList({ listData }) {
	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			sorter: (a, b) => a.name.localeCompare(b.name),
			render: (text, record) => (
				<Link to={`/container/${record.id}/landing`}>{text}</Link>
			),
		},
		// {
		// 	title: "Admin",
		// 	dataIndex: "admin",
		// 	sorter: (a, b) => a.admin.localeCompare(b.admin),
		// 	key: "admin",
		// },
		{
			title: "Created Time",
			dataIndex: "time_created",
			sorter: (a, b) => {
				return new Date(a.time_created) - new Date(b.time_created);
			},
			sortOrder: 'descend',
			key: "time_created",
			render: (text) => {
				return moment.tz(text, "America/Toronto").format();
			},
		},
		{
			title: "Type",
			dataIndex: "labels",
			sorter: (a, b) => a.labels[0].localeCompare(b.labels[0]),
			key: "type",
		},
	];
	return (
		<Table
			dataSource={listData}
			columns={columns}
			rowKey={(record) => record.id}
		/>
	);
}

export default ContainerList;
