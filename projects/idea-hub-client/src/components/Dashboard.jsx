import React from "react";
import PropTypes from "prop-types";
import IdeaForm from "./IdeaForm";
import { PageHeader, Tabs, Tab, Container } from "react-bootstrap";
import Warning from "./Warning";

class Dashboard extends React.Component {
  //const web3Context = context.web3;

  /**
   * web3Context = {
   *   accounts: {Array<string>} - All accounts
   *   selectedAccount: {string} - Default ETH account address (coinbase)
   *   network: {string} - One of 'MAINNET', 'ROPSTEN', or 'UNKNOWN'
   *   networkId: {string} - The network ID (e.g. '1' for main net)
   * }
   */

  static contextTypes = {};

  state = {
    modalShow: true
  };

  render() {
    let modalClose = () => this.setState({ ...this.state, modalShow: false });
    return (
      <Container fluid={true}>
        <header>
          Idea Hub: <small>Submit and view ideas in OSO Idea Network</small>
        </header>
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
        <Warning show={this.state.modalShow} onHide={modalClose} />
      </Container>
    );
  }
}

Dashboard.contextTypes = {
  web3: PropTypes.object
};

export default Dashboard;
