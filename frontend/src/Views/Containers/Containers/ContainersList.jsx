import React from "react";
import { List, Space } from "antd";
import { Link } from "react-router-dom";

import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

function ContainersList({ listData }) {
	const IconText = ({ icon, text }) => (
		<Space>
			{React.createElement(icon)}
			{text}
		</Space>
	);
	return (
		<List
			itemLayout="vertical"
			size="large"
			pagination={{
				onChange: (page) => {
					console.log(page);
				},
				pageSize: 5,
			}}
			dataSource={listData}
			footer={
				<div>
					<b>{listData.length}</b> containers
				</div>
			}
			renderItem={(item, i) => (
				<List.Item
					key={item.name}
					className={styles.card}
					actions={[
						<IconText
							icon={StarOutlined}
							text="156"
							key="list-vertical-star-o"
						/>,
						<IconText
							icon={LikeOutlined}
							text="156"
							key="list-vertical-like-o"
						/>,
						<IconText
							icon={MessageOutlined}
							text="2"
							key="list-vertical-message"
						/>,
					]}
				>
					<List.Item.Meta
						title={
							<Link to={`/container/${item.id}/landing`}>
								{item.name}
							</Link>
						}
						description={item.title}
					/>
					{item.description
						? item.description
						: `Lorem ipsum dolor sit, amet consectetur adipisicing elit.
					Voluptate assumenda quod ab sapiente laudantium commodi,
					nisi molestiae corporis ullam quo quis est maxime
					perspiciatis. Perferendis sapiente libero deserunt dicta
					pariatur?`}
				</List.Item>
			)}
		/>
	);
}

export default ContainersList;
