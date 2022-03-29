import { useState, useEffect } from "react";
import { getContainers } from "../APIs";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import _ from "lodash";

/**
 * get containerlist. If not exist, fetch
 *
 * @returns array - containerList
 */
function useUserRole() {
	const [role, setRole] = useState(null);
	const [cookies] = useCookies(["user"]);
	let { containerId } = useParams();

	useEffect(() => {
		getContainers()
			.then((res) => {
				const listData = res.data.result.node;
				const role = getRole(listData);

				/**
				 *
				 * see whether the user is an platform admin or prject admin
				 * @param {*} containerList
				 * @returns
				 */
				function getRole(containerList) {
					if (cookies.role === "instance-admin") return "admin";
					const userName = cookies.username;
					const thisContainer = _.find(
						containerList,
						(container) => container.id === parseInt(containerId),
					);
					return thisContainer.admin === userName ? "admin" : "user";
				}

				setRole(role);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return role;
}

export default useUserRole;
