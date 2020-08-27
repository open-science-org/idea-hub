const IssuableErc20 = artifacts.require("IssuableErc20")
const IdeaHub = artifacts.require("IdeaHub");

module.exports = function (deployer, network, account) {
    deployer.deploy(IssuableErc20,"ERC20","Test Erc20",10000,18).then(function () {
        return IssuableErc20.deployed();
    }).then(function (token) {
        return deployer.deploy(IdeaHub, token.address, token.address)
    })
};
