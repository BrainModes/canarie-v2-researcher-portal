import React from "react";
import { StandardLayout } from "../../Components/Layout";
import { containerRoutes as routes } from "../../Routes/index";
import { withRouter, Switch, Route } from "react-router-dom";

import ContainerTools from "./ContainerTools";
function Container(props) {
	const {
		match: { path, params },
	} = props;
	const config = {
		observationVars: [params.containerId],
		initFunc: () => {},
	};
	return (
		<StandardLayout {...config} rightContent={<ContainerTools />}>
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
		</StandardLayout>
	);
}

export default withRouter(Container);
