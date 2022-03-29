import React from "react";
import { StandardLayout } from "../../Components/Layout";
import { withRouter } from "react-router-dom";
import ContainersContent from "./Containers/ContainersContent";
function Containers(props) {
	const {
		match: { path, params },
	} = props;
	const config = {
		observationVars: [],
		initFunc: () => {},
	};
	return (
		<StandardLayout {...config}>
			<ContainersContent />
		</StandardLayout>
	);
}

export default withRouter(Containers);
