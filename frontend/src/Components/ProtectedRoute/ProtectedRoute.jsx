import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useCookies } from "react-cookie";

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const [cookies] = useCookies(["isLogin"]);

	return (
		<Route
			{...rest}
			render={(props) => {
				if (cookies.isLogin) {
					if (cookies.role === "patient") {
						return <Redirect to="/error/403" />;
					}
					return <Component {...rest} {...props} />;
				} else {
					return (
						<Redirect
							to={{
								pathname: "/login",
								state: {
									from: props.location,
								},
							}}
						/>
					);
				}
			}}
		/>
	);
};

export default ProtectedRoute;
