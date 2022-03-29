import axios from "axios";
import { message } from "antd";

// Function to returns the value of a specified cookie
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return undefined;
}

// Fetch token from cookies
const token = getCookie("access_token");

// Axios request basic settings
const kongAPI = "https://vhg.indocresearch.org";
// const kongAPI = "http://0.0.0.0:5000";
const serverAxios = axios.create({
	baseURL: kongAPI,
});

// serverAxios.defaults.withCredentials = true;
serverAxios.defaults.headers.post["Content-Type"] = "application/json";
serverAxios.defaults.timeout = 10000;
if (token) {
	serverAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
const CancelToken = axios.CancelToken;

//Adding a interceptor to axios, so it handles expire issue before .then and .error
serverAxios.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		if (error.response) {
			const { status } = error.response;
			// The request was made and the server responded with a status code
			// If status 401, logout the platform
			switch (status) {
				case 401: {
					// clear all cookies
					var cookies = document.cookie.split(";");
					for (var i = 0; i < cookies.length; i++) {
						var cookie = cookies[i];
						var eqPos = cookie.indexOf("=");
						var name =
							eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
						document.cookie =
							name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
					}
					if (window.location.pathname === "/") {
						window.location.reload();
					} else {
						window.location = `${window.location.origin}`;
					}
					message.error("Token Expired. Please Login Again.");
					break;
				}
			}
		} else if (error.request) {
			console.log(
				"TCL: handleApiFailure -> error.request",
				error.request,
			);
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			message.error("Error network: cannot receive a response");
		} else {
			// The request has no response nor request -
			// Something happened in setting up the request that triggered an Error
			console.log("handleApiFailure -> error", error);

			// If caused by axios canceltoken, it will have an error message.
			if (error.message) {
				message.error("The input data is invalid");
			} else {
				// Else, print the vague message.
				message.error("The input data is invalid");
			}
		}
		return new Promise((resolve, reject) => reject(error));
	},
);

/**
 * executes the api calling function
 * and returns both the cancel object of the axios call and the promise.
 * you can cancel this API request by calling source.cancel()
 * @param {function} requestFunction the
 * @param {*} arg other payloads of the request function
 * @returns   request: the axios result, source: the axios cancellation object
 */
function cancelRequestReg(requestFunction, ...arg) {
	const source = CancelToken.source();
	return {
		request: requestFunction(...arg, source.token),
		source,
	};
}

export { serverAxios, cancelRequestReg };
