import React from "react";
import PropTypes from "prop-types";
import IPFS from "ipfs";
import classes from "./IdeaForm.module.css";
import Dropzone from "react-dropzone-uploader";

const PUBLIC_GATEWAY = "https://ipfs.io/ipfs";
const ipfsClient = require("ipfs-http-client");

class IdeaForm extends React.Component {
  constructor(props, context) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.uploadIdeaTextToIPFS = this.uploadIdeaTextToIPFS.bind(this);
    this.uploadIdeaToIPFS = this.uploadIdeaToIPFS.bind(this);
    this.publishFileHash = this.publishFileHash.bind(this);
    this.ipfsClient = ipfsClient("/ip4/127.0.0.1/tcp/5001");
    this.saveToIpfs = this.saveToIpfs.bind(this);
    //node setup
    this.ipfsNode = new IPFS({
      EXPERIMENTAL: { pubsub: true },
      relay: { enabled: true, hop: { enabled: true } }
    });

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

  // called every time a file's `status` changes
  handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file);
  };

  // receives array of files that are done uploading when submit button is clicked
  handleSubmit = files => {
    files.map(file => {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file.file);
      reader.onloadend = () => {
        /* this.saveToIpfs(Buffer(reader.result)); */
        /* You must use file.file to get the blob  */
        this.uploadIdeaToIPFS(Buffer(reader.result));
      };
    });
  };

  saveToIpfs(file) {
    console.log("inside saveToIpfs");
    let ipfsId;
    this.ipfsClient
      .add(file)
      .then(response => {
        console.log(response);
        ipfsId = response[0].hash;
        console.log(ipfsId);
        this.setState({ added_file_hash: ipfsId });
      })
      .catch(err => {
        console.error(err);
      });
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

  uploadIdeaToIPFS(file) {
    /* const addr = */
    /* "/ip4/127.0.0.1/tcp/4001/ipfs/QmWtD6ifuSjs6sYfqtNKgNeJYCeyQDbSxpy51fVX1T64RC"; */
    const addr =
      "/ip4/104.248.122.220/tcp/4001/ipfs/QmPE7fixEYAwUnmeus3CDAESqZ3yMvNUyrZZMtQ8W66kXd";
    this.ipfsNode.swarm.connect(addr, function(err) {
      if (err) {
        throw err;
      }
      // if no err is present, connection is now open
      console.log("over here");
      this.ipfsNode.add(file, (err, filesAdded) => {
        if (err) {
          throw err;
        }

        const hash = filesAdded[0].hash;
        this.setState(
          {
            added_file_hash: hash
          },
          () => {
            this.publishFileHash();
          }
        );
      });
    });
  }

  publishFileHash() {
    console.log("inside publishFileHash");
    console.log("file hash is:");
    console.log(this.state.added_file_hash);

    const topic = "osoideahubtopic";
    const msg = Buffer.from(this.state.added_file_hash);

    this.ipfsNode.pubsub.publish(topic, msg, err => {
      if (err) {
        return console.error(`failed to publish to ${topic}`, err);
      }
      console.log(`published to ${topic}`);
    });
  }

  componentDidMount() {
    console.log("inspect ipfs node");
    console.log(this.ifpsNode);
    this.ipfsNode.once("ready", () => {
      this.ipfsNode.id((err, res) => {
        if (err) {
          throw err;
        }
        console.log(res);
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
      <div className={classes.UploadContainer}>
        <div className={classes.InfoBox}>
          <h1>Connected to ethereum and ipfs network!</h1>
          <p>Ethereum network: {this.context.web3.network}</p>
          <p>
            Your IPFS version is{" "}
            <strong>{this.state.ipfsOptions.version}</strong>
          </p>
          <p>
            Your IPFS protocol version is{" "}
            <strong>{this.state.ipfsOptions.protocol_version}</strong>
          </p>
          <hr />
          <p>
            Using your ethereum account: {this.context.web3.selectedAccount}
          </p>
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
        </div>
        <div className={classes.Upload}>
          <Dropzone
            styles={{
              dropzone: {
                overflow: "hidden",
                borderStyle: "none"
              }
            }}
            getUploadParams={this.getUploadParams}
            onChangeStatus={this.handleChangeStatus}
            onSubmit={this.handleSubmit}
            accept="image/*,audio/*,video/*"
          />
          <div className={classes.Square} />
        </div>
      </div>
    );
  }
}

IdeaForm.contextTypes = {
  web3: PropTypes.object
};

export default IdeaForm;
