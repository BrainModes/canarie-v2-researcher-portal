import React, { useState, useEffect } from "react";
import { Layout, List, Space, Radio, Table } from "antd";
import { useCookies } from "react-cookie";

import {
	UnorderedListOutlined,
	TableOutlined,
	ApartmentOutlined,
} from "@ant-design/icons";

import LeftSider from "../../../Components/Layout/LeftSider";
import styles from "./index.module.scss";
import ContainersList from "./ContainersList";
import ContainersTable from "./ContainersTable";
import ContainerDiagram from "./ContainerDiagram";
import { getContainers } from "../../../APIs";

const { Content } = Layout;

function ContainersContent() {
	const [collapsed, setCollapsed] = useState(true);
	const [mode, setMode] = useState("table");
	const [listData, setListData] = useState([]);
	const [cookies] = useCookies(["user"]);

	useEffect(() => {
		getContainers()
			.then((res) => {
				const listData = res.data.result.node;
				setListData(listData);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	function onModeChange(e) {
		console.log(e.target.value);
		setMode(e.target.value);
	}

	return (
		<>
			<LeftSider collapsed={collapsed} title={"Filter"}>
				Left sider
			</LeftSider>
			<Content className={collapsed ? "content" : "contentOpen"}>
				<div className={styles.container}>
					<Radio.Group
						defaultValue="table"
						style={{ marginBottom: 16 }}
						onChange={onModeChange}
					>
						<Radio.Button value="table">
							<TableOutlined />
						</Radio.Button>
						<Radio.Button value="list">
							<UnorderedListOutlined />
						</Radio.Button>
						{cookies.role === "instance-admin" && (
							<Radio.Button value="diagram">
								<ApartmentOutlined />
							</Radio.Button>
						)}
					</Radio.Group>

					{(() => {
						switch (mode) {
							case "list":
								return <ContainersList listData={listData} />;
							case "table":
								return <ContainersTable listData={listData} />;
							case "diagram":
								return <ContainerDiagram />;
							default:
								return "Opps, nothing's here";
						}
					})()}
				</div>
			</Content>
		</>
	);
}
export default ContainersContent;
