import React from "react";
import { Button, Row, Col, Card, Carousel } from "antd";
import { StandardLayout } from "../../Components/Layout";
import { Link, withRouter } from "react-router-dom";

import AppFooter from "../../Components/Layout/Footer";
import styles from "./index.module.scss";

function Home(props) {
	//   const {
	//     match: { path, params },
	//   } = props;

	const config = {
		observationVars: [],
		initFunc: () => {},
	};
	return (
		<StandardLayout {...config} rightContent={""}>
			{/* Background container */}
			<div className={styles.gradient}>
				<section className={styles.hero}></section>
				{/* Hero content */}
				<section className={styles.heroContent}>
					<h1 className={styles.h1}>
						Canarie <br />
						Researcher Portal
					</h1>
					<p className={styles.subtitle}>
						Simplifies complex data organization and accessing
						process. <br></br>
						Supports research outcome.
					</p>
					<Link to={"/containers"}>
						<Button type="primary">Discover</Button>
					</Link>
				</section>
				<div className={styles.content_logo}>
					<Row type="flex" justify="center">
						<Col>
							<h2>Cooperate with</h2>
						</Col>
					</Row>
					<Row type="flex" justify="center">
						<Col span={3}>
							<img
								className=""
								alt="redcap"
								src={require("../../Images/logo-redcap.png")}
							/>
						</Col>
						<Col span={4}>
							<img
								className=""
								alt="spotfire"
								src={require("../../Images/logo-spotfire.png")}
							/>
						</Col>
					</Row>
				</div>
				<div className={styles.footer}>
					<AppFooter theme="dark" />
				</div>
			</div>
		</StandardLayout>
	);
}

export default withRouter(Home);
