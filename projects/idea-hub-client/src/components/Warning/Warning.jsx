import React from "react";
import { Button, Modal } from "react-bootstrap";
import classes from "./Warning.module.css";

class Warning extends React.Component {
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
      <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Welcome to OSO!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This app requires a web3 capable browser i.e, Mist, Metamask, etc.
            It uses web3 to interface with the Ethereum network.
          </p>
          <p>
            Currently, this app is under active development so{" "}
            <strong className={classes.Text}>
              {" "}
              please do not use it with your Ethereum Mainnet address{" "}
            </strong>
            . We suggest using Rinkeby test network. You can get Rinkeby
            Ethereum for free/ small effort from one of its faucets. Then you
            can use them to play around with this app.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="warning"
            onClick={this.handleClose}
            href="https://www.rinkeby.io/#faucet"
          >
            Get Eth from Rinkeby
          </Button>
          <Button variant="primary" onClick={this.handleClose}>
            I am not using my main address.
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Warning;
