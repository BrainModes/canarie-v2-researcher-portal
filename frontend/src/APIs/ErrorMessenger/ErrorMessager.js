import namespace from "./namespace";
import { message } from "antd";

/**
 * Create a error message object to trigger the error message
 * @param {string} name the namespace of the API
 */
export default function ErrorMessager(name) {
	const _namespaces = {
		[namespace.login.auth]: {
			403: (err, params) => {
				message.error(
					"Sorry, the username and password are not correct",
				);
			},
			500: (err, params) => {
				message.error(
					"Internal error occurs when trying to login, please try again later",
				);
			},
			default: (err, params) => {
				message.error("Something went wrong when logging in");
			},
		},
		[namespace.container.addUser]: {
			404: (err, params) => {
				message.error(
					"Sorry, this user does not exist on the platform. Please contact platform admin to invite this user.",
					10,
				);
			},
			403: (err, params) => {
				message.error("This user already exists in this study.");
			},
			406: (err, params) => {
				message.error("Sorry, this container doesn not exist");
			},
			400: (err, params) => {
				message.error(err);
			},
			default: (err, params) => {
				message.error("Something went wrong when adding this user");
			},
		},
		[namespace.container.getUsers]: {
			default: (err, params) => {
				message.error("Something went wrong when getting users list");
			},
		},
		[namespace.container.createContainer]: {
			default: (err, params) => {
				message.error(err);
			},
		},
	};

	this.messageObj = _namespaces[name];

	if (this.messageObj === undefined) {
		throw new Error(`the namespace doesn't exist`);
	}

	if (!this.messageObj["401"]) {
		this.messageObj["401"] = () => {};
	}
}
/**
 * the method to trigger the message
 *
 * @param {string | number} errorCode typically the HTTP status code. you can also define your own under the corresponding namespace.
 * @param {object} err the error object from axios. If the message needs some arguments, you can get from here.
 * @param {object} params some other useful context. If the message needs some arguments besides err, you can get from here.
 */
ErrorMessager.prototype.triggerMsg = function (errorCode, err, params) {
	if (typeof errorCode !== "string") {
		errorCode = String(errorCode);
	}
	const messageFunc =
		this.messageObj[errorCode] !== undefined
			? this.messageObj[errorCode]
			: this.messageObj["default"];
	messageFunc(err, params);
};
