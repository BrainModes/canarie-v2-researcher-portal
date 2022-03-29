import React from "react";
import { Result, Button, Layout } from "antd";
import { Link, withRouter } from "react-router-dom";
const { Content } = Layout;
function Error404(props) {
	return (
		<Content>
			<Result
				status="404"
				title="404"
				subTitle="Sorry, the page you visited does not exist."
				extra={
					<Button type="primary">
						<Link to="/">Back Home</Link>
					</Button>
				}
			/>
		</Content>
	);
}

export default withRouter(Error404);
