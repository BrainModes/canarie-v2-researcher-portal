import React, { Component, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import IdleTimer from "react-idle-timer";

import { appRoutes as routes } from "./Routes";
import "./App.css";

import { withCookies } from "react-cookie";
import { connect } from "react-redux";

import { message } from "antd";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

import { userAuthManager } from "./Service/userAuthManager";
import { tokenManager } from "./Service/tokenManager";
import RefreshModal from "./Components/Modals/RefreshModal";

message.config({
	maxCount: 2,
});

class App extends Component {
	constructor(props) {
		super(props);
		const { cookies } = props;
		this.state = {
			cookies: { ...cookies.cookies },
		};

		this.idleTimer = null;
		this.handleOnAction = this.handleOnAction.bind(this);
		this.handleOnActive = this.handleOnActive.bind(this);
		this.handleOnIdle = this.handleOnIdle.bind(this);
	}

	componentDidMount() {
		userAuthManager.init();
	}

	handleOnAction(event) {
		if (this.props.isLogin) {
			const remainTime = tokenManager.getTokenTimeRemain();
			if (remainTime < 100) {
				userAuthManager.extendAuth();
			}
		}
	}

	handleOnActive(event) {
		console.log("user is active", event);
		console.log("time remaining", this.idleTimer.getRemainingTime());
	}

	handleOnIdle(event) {
		console.log("user is idle", event);
		console.log("last active", this.idleTimer.getLastActiveTime());
	}

	render() {
		console.log(this.state.cookies);
		return (
			<>
				<IdleTimer
					ref={(ref) => {
						this.idleTimer = ref;
					}}
					timeout={1000 * 60 * 15}
					onActive={this.handleOnActive}
					onIdle={this.handleOnIdle}
					onAction={this.handleOnAction}
					debounce={250}
				/>
				<Suspense fallback="loading">
					<Switch>
						{routes.map((item) => {
							return item.protected ? (
								<ProtectedRoute
									path={item.path}
									key={item.path}
									exact={item.exact || false}
									component={item.component}
								/>
							) : (
								<Route
									path={item.path}
									key={item.path}
									exact={item.exact || false}
									component={item.component}
								></Route>
							);
						})}
					</Switch>
					<RefreshModal />
				</Suspense>
			</>
		);
	}
}

export default connect((state) => ({
	isLogin: state.isLogin,
	refreshTokenModal: state.refreshTokenModal,
}))(withCookies(App));
