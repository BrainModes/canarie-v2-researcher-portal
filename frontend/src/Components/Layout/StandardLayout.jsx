import React, { useEffect } from "react";
import { Layout } from "antd";
import AppHeader from "./Header";
import RightSlider from "./RightSlider";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const { Content } = Layout;

function StandardLayout(props) {
	const {
		observationVars = [],
		initFunc = () => {},
		rightContent,
		children,
	} = props;

	useEffect(initFunc, observationVars);

	return (
		<Layout>
			<AppHeader />
			<Content>
				<Layout style={{ minHeight: "calc(100vh - 64px)" }}>
					{children}
					{rightContent && <RightSlider>{rightContent}</RightSlider>}
				</Layout>
			</Content>
		</Layout>
	);
}

export default withRouter(connect(null, null)(StandardLayout));
