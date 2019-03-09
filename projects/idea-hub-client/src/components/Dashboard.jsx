import React from "react";
import PropTypes from "prop-types";
import IdeaForm from "./IdeaForm";
import { Tabs, Tab, Container, Button, Modal } from "react-bootstrap";
import Warning from "./Warning";

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
    return <Warning />;
  }
}

Dashboard.contextTypes = {
  web3: PropTypes.object
};

export default Dashboard;
