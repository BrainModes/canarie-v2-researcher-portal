import React, { Component } from "react";
import { Layout, PageHeader, Button, Card, Descriptions } from "antd";
import { Link, useParams } from "react-router-dom";
import { useContainerList } from "../../../Hooks";
import styles from "./index.module.scss";
const { Content } = Layout;
function capitalize(s) {
	return s[0].toUpperCase() + s.slice(1);
}
function formatArrayValues(value) {
	if (value) {
		return value
			.map((item) => {
				return item
					.split("_")
					.map((v) => capitalize(v))
					.join(" ");
			})
			.join(", ");
	} else {
		return "-";
	}
}
function Landing(props) {
	const containerList = useContainerList();
	let { containerId } = useParams();
	let containerDetail;
	if (containerList && containerList.length) {
		containerDetail = containerList.find((v) => v.id == containerId);
	}
	if (!containerDetail) {
		return null;
	}
	const routes = [
		{
			path: "/containers",
			breadcrumbName: "Containers",
		},
		{
			breadcrumbName: containerDetail.name,
		},
	];

	function itemRender(route, params, routes, paths) {
		const index = routes.indexOf(route);
		if (index === 0) {
			return <Link to={route.path}>{route.breadcrumbName}</Link>;
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
					title={containerDetail.name}
					subTitle={containerDetail.title}
					breadcrumb={{ routes, itemRender }}
					style={{ marginBottom: "10px" }}
				/>
				<Card>
					<Descriptions title="Container Info" column={3}>
						<Descriptions.Item label="Type">
							{containerDetail.labels &&
							containerDetail.labels.length
								? containerDetail.labels[0]
								: ""}
						</Descriptions.Item>
						<Descriptions.Item label="Study Sponsor">
							{containerDetail.sponsor}
						</Descriptions.Item>
						<Descriptions.Item label="Data Capture Tools">
							{containerDetail.tools
								? formatArrayValues(containerDetail.tools)
								: "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Inherit Permissions">
							{containerDetail.inherit}
						</Descriptions.Item>
						<Descriptions.Item label="Study Investigator">
							{containerDetail.investigator}
						</Descriptions.Item>

						<Descriptions.Item label="Data Modalities">
							{containerDetail.modalities
								? formatArrayValues(containerDetail.modalities)
								: "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Contact" span={3}>
							{containerDetail.contact || "-"}
						</Descriptions.Item>

						<Descriptions.Item label="Criteria" span={3}>
							{containerDetail.criteria || "-"}
						</Descriptions.Item>
						<Descriptions.Item label="Description" span={3}>
							{containerDetail.description || "-"}
						</Descriptions.Item>
					</Descriptions>
				</Card>
			</Content>
		</>
	);
}
export default Landing;
