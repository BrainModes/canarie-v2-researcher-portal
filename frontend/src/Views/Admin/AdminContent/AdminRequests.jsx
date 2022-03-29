import React, { Component } from "react";
import { Layout } from "antd";

const { Content } = Layout;

class AdminRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    render() {
        return (
            <>
                <Content className={"content"}>Hello! Admin Requests</Content>
            </>
        );
    }
}
export default AdminRequest;
