import React from "react";
import { withRouter, Link } from "react-router-dom";
import { Card, Button, Layout, Result } from "antd";

import { StandardLayout } from "../../Components/Layout";
import styles from "./index.module.scss";

const { Content } = Layout;

function ActivateUser(props) {
	const {
		match: { path, params },
	} = props;
	const config = {
		observationVars: [],
		initFunc: () => {},
	};

	return (
		<StandardLayout {...config}>
			<Content className={"content"}>
				<div className={styles.container}>
					<Card>
						<Result
							status="success"
							title="Activation success!"
							subTitle="Your profile is set up successfully."
							extra={[
								<Button type="primary" key="console">
									<Link to="/login">Login</Link>
								</Button>,
							]}
						/>
					</Card>
				</div>
			</Content>
		</StandardLayout>
	);
}

export default withRouter(ActivateUser);
