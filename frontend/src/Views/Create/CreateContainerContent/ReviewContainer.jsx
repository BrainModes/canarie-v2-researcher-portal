import React from "react";
import { Statistic, Typography, Row, Col, Divider } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function ReviewContainer({ formValue, onChange }) {
	function printValue(value) {
		return value ? value : "-";
	}
	function capitalize(s) {
		return s[0].toUpperCase() + s.slice(1);
	}
	function formatArrayValues(value) {
		if (value && value.length) {
			return value
				.map((item) => {
					return item
						.split("_")
						.map((v) => capitalize(v))
						.join(" ");
				})
				.join(", ");
		} else {
			return "-";
		}
	}
	return (
		<>
			<Text>Here is a review of the container information</Text>

			<Title level={3}>
				General Information{" "}
				<a onClick={() => onChange(0)}>
					<EditOutlined />
				</a>
			</Title>
			<Divider />
			<Row gutter={16} className="mb-1">
				<Col span={12}>
					<Statistic
						title="Container Name"
						value={printValue(formValue.name)}
					/>
				</Col>
				<Col span={12}>
					<Statistic
						title="Type"
						value={printValue(formValue.type)}
					/>
				</Col>
			</Row>
			<Row gutter={16} className="mb-1">
				<Col span={12}>
					<Statistic
						title="Official Study Title"
						value={printValue(formValue.title)}
					/>
				</Col>
				<Col span={12}>
					<Statistic
						title="Study Admin Username"
						value={printValue(formValue.admin)}
					/>
				</Col>
			</Row>
			{formValue.type === "study" && (
				<>
					<Row gutter={16} className="mb-1">
						<Col span={12}>
							<Statistic
								title="Data Capture Tools"
								value={formatArrayValues(formValue.tools)}
							/>
						</Col>
						<Col span={12}>
							<Statistic
								title="Data Modalities"
								value={formatArrayValues(formValue.modalities)}
							/>
						</Col>
					</Row>
					<Row gutter={16} className="mb-1">
						<Col span={12}>
							<Statistic
								title="Study Investigator"
								value={printValue(formValue.investigator)}
							/>
						</Col>
						<Col span={12}>
							<Statistic
								title="Study Sponsor"
								value={printValue(formValue.sponsor)}
							/>
						</Col>
					</Row>
				</>
			)}
			<br />
			<br />

			<Title level={3}>
				Location{" "}
				<a onClick={() => onChange(1)}>
					<EditOutlined />
				</a>
			</Title>
			<Divider />
			<Row gutter={16}>
				<Col span={12}>
					<Statistic
						title="Parent Name"
						value={printValue(formValue.parent_name)}
					/>
				</Col>
			</Row>
			<br />
			<br />

			<Title level={3}>
				Additional Details{" "}
				<a onClick={() => onChange(2)}>
					<EditOutlined />
				</a>
			</Title>
			<Divider />

			<br />
			<br />

			<Title level={3}>
				Options{" "}
				<a onClick={() => onChange(3)}>
					<EditOutlined />
				</a>
			</Title>
			<Divider />
			<Row gutter={16}>
				<Col span={12}>
					<Statistic
						title="Inherit Type"
						value={printValue(formValue.inherit)}
					/>
				</Col>
			</Row>
		</>
	);
}

export default ReviewContainer;
