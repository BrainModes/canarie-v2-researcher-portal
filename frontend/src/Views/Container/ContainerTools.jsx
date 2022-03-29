import React, { useState } from "react";
import { Menu } from "antd";
import {
	PieChartOutlined,
	UploadOutlined,
	TeamOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { useUserRole } from "../../Hooks";

const ToolBar = ({ location: { pathname }, match: { params } }) => {
	const role = useUserRole();

	return (
		<>
			<Menu mode="inline" selectedKeys={[pathname.split("/")[3]]}>
				<Menu.Item key="landing">
					<Link to="landing">
						<PieChartOutlined />
						<span>Landing Page</span>
					</Link>
				</Menu.Item>

				{/* <Menu.Item
					key="uploader"
					onClick={() => {
						console.log("hello");
					}}
				>
					<UploadOutlined />
					<span>Uploader</span>
				</Menu.Item> */}

				{/* hide if normal user */}
				{role === "admin" && (
					<Menu.Item key="teams">
						<Link to="teams">
							<TeamOutlined />
							<span>Teams</span>
						</Link>
					</Menu.Item>
				)}
			</Menu>
		</>
	);
};

export default withRouter(ToolBar);
