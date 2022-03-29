import { serverAxios as axios } from "./config";

/**
 * getContainers
 *
 * @param {*} params params - level:int, default to be empty, start:boolean
 * @returns
 */
// function getContainers(params = { start: true }, id = 371) {
// 	return axios({
// 		url: `/v1/node/${id}/parent`,
// 		method: "GET",
// 		params: params,
// 	});
// }

// /**
//  * getContainers
//  *
//  * @returns
//  */
function getContainers() {
	return axios({
		url: "/v1/containers",
		method: "GET",
		params: { relation: '["admin", "member"]' },
	});
}

/**
 * get children
 *
 * @param {object} params - level:int, start:boolean
 * @returns
 */
function getChildren(params = { level: 1, start: true }, id = 371) {
	return axios({
		url: `/v1/node/${id}/parent`,
		method: "GET",
		params: params,
	});
}

/**
 * create a Container
 *
 * @param {*} data
 * @returns
 */
function createContainer(data, containerId) {
	return axios({
		url: `v1/node/${containerId}/parent`,
		method: "POST",
		data,
	});
}

/**
 * Add a user into a container
 *
 * @param {Int} id the target contaienr_id
 * @param {Object} data {email,label,relation(role)}
 * @returns
 * @CPDGW-163
 */
function addUserToContainer(id, data) {
	return axios({
		url: `v1/${id}/users`,
		method: "POST",
		data,
	});
}

/**
 * get user list in a container
 *
 * @param {Int} id the target contaienr_id
 * @returns
 * @CPDGW-164
 */
function getUserlistInContainer(id) {
	return axios({
		url: `v1/${id}/users`,
		method: "GET",
		params: { relation: '["admin", "member", "patient"]' },
	});
}

export {
	getContainers,
	getChildren,
	createContainer,
	addUserToContainer,
	getUserlistInContainer,
};
