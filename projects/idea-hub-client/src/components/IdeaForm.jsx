import React from "react";
import PropTypes from "prop-types";
import IPFS from "ipfs";
import {
  FormGroup,
  FormControl,
  HelpBlock,
  Col,
  Button
} from "react-bootstrap";

const PUBLIC_GATEWAY = "https://ipfs.io/ipfs";

class IdeaForm extends React.Component {
  constructor(props, context) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.uploadIdeaTextToIPFS = this.uploadIdeaTextToIPFS.bind(this);
    this.ipfsNode = new IPFS();
    this.state = {
      ipfsOptions: {
        id: null,
        version: null,
        protocol_version: null
      },
      value: "",
      added_file_hash: "",
      added_file_contents: ""
    };
  }

  uploadIdeaTextToIPFS() {
    this.ipfsNode.files.add(
      [Buffer.from(this.state.value)],
      (err, filesAdded) => {
        if (err) {
          throw err;
        }

        const hash = filesAdded[0].hash;

        this.ipfsNode.files.cat(hash, (err, data) => {
          if (err) {
            throw err;
          }
          this.setState({
            added_file_hash: hash,
            added_file_contents: data.toString()
          });
        });
      }
    );
  }

  componentDidMount() {
    this.ipfsNode.once("ready", () => {
      this.ipfsNode.id((err, res) => {
        if (err) {
          throw err;
        }
        this.setState({
          ipfsOptions: {
            id: res.id,
            version: res.agentVersion,
            protocol_version: res.protocolVersion
          }
        });
      });
    });
  }

  getValidationState() {
    const length = this.state.value.length;
    if (length > 10) return "success";
    else if (length > 5) return "warning";
    else if (length > 0) return "error";
    return null;
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
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
      <div style={{ textAlign: "center" }}>
        <h1>Connected to ethereum and ipfs network!</h1>
        <p>Ethereum network: {this.context.web3.network}</p>
        <p>
          Your IPFS version is <strong>{this.state.ipfsOptions.version}</strong>
        </p>
        <p>
          Your IPFS protocol version is{" "}
          <strong>{this.state.ipfsOptions.protocol_version}</strong>
        </p>
        <hr />
        <p>Using your ethereum account: {this.context.web3.selectedAccount}</p>
        <p>
          Your IPFS ID is <strong>{this.state.ipfsOptions.id}</strong>
        </p>
        <hr />
        <p>Submitted Idea's IPFS hash: {this.state.added_file_hash}</p>
        <p>Submitted Idea's content: {this.state.added_file_contents}</p>
        <p>
          Checkout the uploaded idea at: {PUBLIC_GATEWAY}/
          {this.state.added_file_hash}
        </p>
        <hr />
        <form>
          <FormGroup
            controlId="formBasicText"
            validationState={this.getValidationState()}
          >
            <h1>Submit an Idea text to OSO Idea network</h1>
            <FormControl
              type="text"
              bsSize="small"
              value={this.state.value}
              placeholder="Enter text"
              onChange={this.handleChange}
            />
            <FormControl.Feedback>
              String should be more than 10 characters long
            </FormControl.Feedback>
          </FormGroup>
          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button onClick={this.uploadIdeaTextToIPFS}>Submit Idea</Button>
            </Col>
          </FormGroup>
        </form>
      </div>
    );
  }
}

IdeaForm.contextTypes = {
  web3: PropTypes.object
};

export default IdeaForm;
