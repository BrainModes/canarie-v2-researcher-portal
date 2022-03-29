import { useState, useEffect } from "react";
import { getContainers } from "../APIs";

/**
 * get containerlist. If not exist, fetch
 *
 * @returns array - containerList
 */
function useContainerList() {
	const [containerList, setContainerList] = useState(null);

	useEffect(() => {
		getContainers()
			.then((res) => {
				const listData = res.data.result.node;
				setContainerList(listData);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return containerList;
}

export default useContainerList;
