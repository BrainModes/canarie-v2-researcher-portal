import { serverAxios as axios } from "./config";

/**
 * Admin Invite User
 *
 * @param {*} data
 * @returns success/fail
 */
function inviteUser(data) {
	return axios({
		url: "/v1/admin/invite",
		method: "POST",
		data,
	});
}

/**
 * Get user inforamtion with token
 *
 * @param {string} token
 * @returns {object} user information
 */
function getUserInformation(token) {
	return axios({
		url: `/v1/admin/invite/${token}`,
		method: "GET",
	});
}

/**
 * Register a user
 *
 * @param {object} data
 * @returns {string} user ID from keycloak
 */
function addUser(data) {
	return axios({
		url: `/v1/admin/users`,
		method: "POST",
		data: { ...data, realm: "canarie" },
	});
}

/**
 * List all users
 *
 * @param {object} data
 * @returns {array} array of users
 */
function getUsers() {
	return axios({
		url: `/v1/admin/userlist/canarie`,
		method: "GET",
	});
}

function getUsersV2() {
	return axios({
		url: `/v1/admin/userlist/neo4j`,
		method: "GET",
	});
}

/**
 * Verify user by email or username
 *
 * @param {object} data
 * @returns {Object} userinfo, or {}, if user not exist
 */
function checkUserInfo(data) {
	return axios({
		url: `/v1/admin/userinfo`,
		method: "POST",
		data: { ...data, realm: "canarie" },
	});
}

/**
 * Suspend user(s)
 *
 * @param {object} data an array of users
 * @returns {Object} userinfo, or {}, if user not exist
 */
function suspendUsers(users) {
	return axios({
		url: `/v1/admin/users`,
		method: "DELETE",
		data: { users, realm: "canarie" },
	});
}
/**
 * Activate user(s)
 *
 * @param {object} data an array of users
 * @returns {Object} successed_list, failed_list
 */
function activateUsers(users) {
	return axios({
		url: `/v1/admin/users`,
		method: "PUT",
		data: { users, realm: "canarie" },
	});
}

/**
 * Refresh users session
 *
 * @param {object} data {refreshtoken:<token>}
 * @returns {Object} with new refresh_token and access_token
 */
function refreshTokenAPI(data) {
	return axios({
		url: `/v1/users/refresh`,
		method: "POST",
		data: { ...data, realm: "canarie" },
	});
}

function forgotPassword(email) {
	return axios({
		url: `/v1/users/password/forget`,
		method: "PUT",
		data: {
			email,
			realm: "canarie",
			platform: "rp",
		},
	});
}

function decodeResetLink(code) {
	return axios({
		url: `v1/users/resetlink/status`,
		method: "GET",
		params: {
			reset_code: code,
			realm: "canarie",
		},
	});
}

function resetPassword(code, password) {
	return axios({
		url: `v1/users/password/set`,
		method: "POST",
		data: {
			reset_code: code,
			realm: "canarie",
			new_password: password,
		},
	});
}

export {
	inviteUser,
	getUserInformation,
	addUser,
	getUsers,
	checkUserInfo,
	suspendUsers,
	activateUsers,
	getUsersV2,
	forgotPassword,
	refreshTokenAPI,
	decodeResetLink,
	resetPassword,
};
