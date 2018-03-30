'use strict'

// this site has solution
// https://github.com/ipfs/js-ipfs-api#cors
var ipfsAPI = require('ipfs-api')

// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'}) // leaving out the arguments will default to these values

// Listen for form submit
document.getElementById("ipfsForm").addEventListener('submit', submitForm);

function submitForm(e){
  e.preventDefault();

  // Get values
  var name = getInputVal('name');
  var message = getInputVal('message');

  // save message
  saveMessage(message);

  var linkMessage = getInputVal('linkMessage');
  linkMessages(message, linkMessage);
}

// function to get form values
function getInputVal(id){
  return document.getElementById(id).value;
}


// Save message to firebase
function saveMessage(message){

  var obj = {
    Data: message,
    Links: [],
  }

  ipfs.object.put(obj, (err, result) => {
    if (err) {
      throw err
    }

    document.getElementById('hash').value = result.toJSON().multihash

  })

}


function linkMessages(message, linkMessage) {

  var obj = {
    Data: message,
    Links: [],
  }

  ipfs.object.put(obj, (err, result) => {
    if (err) {
      throw err
    }

    ipfs.object.patch.addLink(result, {
      name: "new-link"
    }, (err, res) => {
      if (err) {
        throw err
      }
      console.log(res.toJSON())
    })

    document.getElementById('hash').value = result.toJSON().multihash

  })

}
