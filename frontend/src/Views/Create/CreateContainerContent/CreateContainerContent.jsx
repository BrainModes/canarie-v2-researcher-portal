import React, { useState, useEffect } from "react";
import { Typography, Card, Steps, Button, Form, message } from "antd";
import { withRouter, Link } from "react-router-dom";
import styles from "./index.module.scss";
import Step0 from "./Step0";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import ReviewContainer from "./ReviewContainer";
import _ from "lodash";
import { ErrorMessager, namespace } from "../../../APIs/ErrorMessenger";

import { createContainer } from "../../../APIs";

const { Title } = Typography;
const { Step } = Steps;
const layout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 16,
	},
};

class CreateContainerContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current: 0,
			formValue: {},
			locationError: null,
		};
		this.formRef = React.createRef();
	}

	onChange = (current) => {
		this.setState({
			current: current,
			// formValue: {},
		});
	};

	onClickPrev = () => {
		this.setState({
			current: this.state.current - 1,
		});
	};

	onClickNext = () => {
		const { current } = this.state;
		this.formRef.current
			.validateFields()
			.then((res) => {
				this.setState(
					(prevState) => ({
						current: prevState.current + 1,
						formValue: { ...prevState.formValue, ...res },
					}),
					() => {
						console.log(this.state.formValue);
					},
				);
			})
			.catch((err) => {
				if (current === 1) {
					this.setState({
						locationError: err.errorFields[0].errors,
					});
				}
			});
	};

	onSubmit = async () => {
		const { history } = this.props;
		const { formValue } = this.state;
		const containerData = _.pick(formValue, ["name", "type", "admin"]);
		containerData.metadatas = _.omit(formValue, ["name", "type", "admin"]);
		const containerId = formValue.parent_id;
		if (!containerData.metadatas.tools && containerData.type === "study") {
			containerData.metadatas.tools = [];
		}
		createContainer(containerData, containerId)
			.then((res) => {
				history.push("/create-container-confirmation");
			})
			.catch((err) => {
				if (err.response) {
					const errorMessager = new ErrorMessager(
						namespace.container.createContainer,
					);
					errorMessager.triggerMsg(
						err.response.status,
						err.response.data?.result,
					);
				}
			});
	};

	render() {
		const { current, formValue, locationError } = this.state;
		return (
			<div className={styles.wrapper}>
				<Title level={2} className={"mt-3"}>
					New Container Request
				</Title>
				<Card className={styles.card}>
					<Steps
						type="navigation"
						current={current}
						// onChange={this.onChange}
						className="site-navigation-steps"
					>
						<Step title="General Information" />
						<Step title="Location" />
						<Step title="Additional Details" />
						<Step title="Options" />
						{/* <Step title="Options" /> */}
						<Step title="Review" />
					</Steps>
					<Form
						ref={this.formRef}
						className={styles.formWrapper}
						{...layout}
						defaultValue={formValue}
					>
						{(() => {
							switch (current) {
								case 0:
									return <Step0 formValue={formValue} />;
								case 1:
									return (
										<Step1
											form={this.formRef}
											error={locationError}
										/>
									);
								case 2:
									return <Step2 />;
								case 3:
									return <Step3 />;
								case 4:
									return (
										<ReviewContainer
											formValue={formValue}
											onChange={this.onChange}
										/>
									);
								default:
									return null;
							}
						})()}
					</Form>

					<div>
						{current > 0 && (
							<Button type="primary" onClick={this.onClickPrev}>
								Previous
							</Button>
						)}
						{current < 4 && (
							<Button
								type="primary"
								style={{ float: "right" }}
								onClick={this.onClickNext}
							>
								Next
							</Button>
						)}
						{current === 4 && (
							<Button
								type="primary"
								style={{ float: "right" }}
								onClick={this.onSubmit}
							>
								{/* <Link to="/create-container-confirmation"> */}
								Submit
								{/* </Link> */}
							</Button>
						)}
					</div>
				</Card>
			</div>
		);
	}
}

export default withRouter(CreateContainerContent);
