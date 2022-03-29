import React from "react";
import { StandardLayout } from "../../Components/Layout";
import AppFooter from "../../Components/Layout/Footer";
import { adminRoutes as routes } from "../../Routes/index";
import { withRouter, Switch, Route } from "react-router-dom";

function Admin(props) {
	const {
		match: { path, params },
	} = props;
	const config = {
		observationVars: [params.containerId],
		initFunc: () => {},
	};
	console.log(routes);
	return (
		<StandardLayout {...config}>
			<Switch>
				{routes.map((item) => (
					<Route
						exact={item.exact || false}
						path={path + item.path}
						key={item.path}
						render={() => (
							<item.component containerId={params.containerId} />
						)}
					></Route>
				))}
			</Switch>
			<AppFooter />
		</StandardLayout>
	);
}

export default withRouter(Admin);
