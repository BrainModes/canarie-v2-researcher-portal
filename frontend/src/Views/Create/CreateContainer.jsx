import React from "react";
import { StandardLayout } from "../../Components/Layout";
import { withRouter } from "react-router-dom";
import CreateContainerContent from "./CreateContainerContent/CreateContainerContent";

function Containers(props) {
	// const {
	// 	match: { path, params },
	// } = props;
	const config = {
		observationVars: [],
		initFunc: () => {},
	};
	return (
		<StandardLayout {...config}>
			<CreateContainerContent />
		</StandardLayout>
	);
}

export default withRouter(Containers);
