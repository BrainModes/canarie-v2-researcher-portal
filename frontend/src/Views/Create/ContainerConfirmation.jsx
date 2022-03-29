import React from "react";
import { Link } from "react-router-dom";
import { StandardLayout } from "../../Components/Layout";
import { Card, Result, Button } from "antd";
import { withRouter } from "react-router-dom";

function ReviewContainer(props) {
	const config = {
		observationVars: [],
		initFunc: () => {},
	};
	return (
		<StandardLayout {...config}>
			<Card
				style={{
					maxWidth: "780px",
					margin: "16px auto 0",
					width: "100%",
				}}
			>
				<Result
					status="success"
					title="Successfully created the container!"
					extra={[
						<Button type="primary" key="console">
							<Link to="/containers">View Containers</Link>
						</Button>,
					]}
				/>
			</Card>
		</StandardLayout>
	);
}

export default ReviewContainer;
