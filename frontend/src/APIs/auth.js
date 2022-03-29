import { serverAxios as axios } from "./config";

/**
 * Login
 *
 * @param {*} data
 * @returns access token or failing message
 */
function login(data) {
	return axios({
		url: "v1/users/login",
		method: "POST",
		data: { ...data, realm: "canarie", user_role: "researcher" },
	});
}

export { login };
