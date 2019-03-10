import React from "react";
import PropTypes from "prop-types";
import IdeaForm from "../IdeaForm/IdeaForm";
import { Tabs, Tab } from "react-bootstrap";
import Warning from "../Warning/Warning";

class Dashboard extends React.Component {
  //const web3Context = context.web3;
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  /**
   * web3Context = {
   *   accounts: {Array<string>} - All accounts
   *   selectedAccount: {string} - Default ETH account address (coinbase)
   *   network: {string} - One of 'MAINNET', 'ROPSTEN', or 'UNKNOWN'
   *   networkId: {string} - The network ID (e.g. '1' for main net)
   * }
   */

  render() {
    return (
      <>
        <Warning />
        <h1>
          Idea Hub: <small>Submit and view ideas in OSO Idea Network</small>
        </h1>
        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="Submit an Idea">
            <IdeaForm />
          </Tab>
          <Tab eventKey={2} title="View your Ideas">
            Tab 2 content
          </Tab>
          <Tab eventKey={3} title="Explore the Idea network">
            Tab 3 content
          </Tab>
        </Tabs>
      </>
    );
  }
}

Dashboard.contextTypes = {
  web3: PropTypes.object
};

export default Dashboard;
