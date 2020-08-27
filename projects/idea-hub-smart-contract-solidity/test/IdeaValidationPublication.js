const IdeaHub = artifacts.require("IdeaHub");
const IssuableErc20 = artifacts.require("IssuableErc20")
const util = require('../util/testutil')


contract('IdeaHub', (accounts) => {
    const author1 = util.randomHex(32);
    const idea1 = util.randomHex(32);
    const idea1Content1 = util.randomHex(32);
    let validator1, validator2;

    it("Can validate idea and details is updated", async () => {
        const ideaHub = await IdeaHub.deployed();
        await ideaHub.methods['registerAuthor(bytes32)'](author1, {from: accounts[1]});
        await ideaHub.register(idea1, idea1Content1)

        validator1 = util.randomHex(32)
        validator2 = util.randomHex(32)
        await ideaHub.registerValidator(validator1, accounts[2])
        await ideaHub.registerValidator(validator2, accounts[3])

        await ideaHub.methods['validate(uint256,uint256)'](1, 1, {from: accounts[2]})

        let revisionResponse = await ideaHub.ideaRevision(1, 1)
        assert.equal(revisionResponse.contentHash, idea1Content1)
        assert.equal(revisionResponse.validations, 1)
        assert.equal(accounts[2], await ideaHub.ideaValidator(1, 1, 1))

        await ideaHub.methods['validate(uint256,uint256)'](1, 1, {from: accounts[3]})
        revisionResponse = await ideaHub.ideaRevision(1, 1)

        assert.equal(revisionResponse.contentHash, idea1Content1)
        assert.equal(2, revisionResponse.validations, 2)
        assert.equal(accounts[2], await ideaHub.ideaValidator(1, 1, 1))
        assert.equal(accounts[3], await ideaHub.ideaValidator(1, 1, 2))
    })

    it("Cannot validate idea when not a validator,Can when added to validator list, but cannot validate it twice", async () => {
        const ideaHub = await IdeaHub.deployed();
        let validator = util.randomHex(32)

        assert.isFalse(await util.isCallOk(ideaHub.methods['validate(uint256,uint256)'](1, 1, {from: accounts[4]})))
        await ideaHub.registerValidator(validator, accounts[4])
        assert.isNotFalse(await util.isCallOk(ideaHub.methods['validate(uint256,uint256)'](1, 1, {from: accounts[4]})))
        assert.isFalse(await util.isCallOk(ideaHub.methods['validate(uint256,uint256)'](1, 1, {from: accounts[4]})))

    })

    it("Cannot validate non existing idea", async () => {
        const ideaHub = await IdeaHub.deployed();

        assert.isFalse(await util.isCallOk(ideaHub.methods['validate(uint256,uint256)'](1, 5, {from: accounts[2]})))
        assert.isFalse(await util.isCallOk(ideaHub.methods['validate(uint256,uint256)'](2, 5, {from: accounts[2]})))
        assert.isFalse(await util.isCallOk(ideaHub.methods['validate(uint256,uint256)'](1, 0, {from: accounts[2]})))
        assert.isFalse(await util.isCallOk(ideaHub.methods['validate(uint256,uint256)'](-1, -1, {from: accounts[2]})))
    })
})

// Refresh the contract state by deploying new one
contract('IdeaHub', (accounts) => {

    it("Can publish only after reaching validationThreshold", async () => {
        const ideaHub = await IdeaHub.deployed()
        const erc20 = await IssuableErc20.deployed()
        var author = util.randomHex(32)
        var idea = util.randomHex(32)
        var content = util.randomHex(32)

        // make initial preparations
        await ideaHub.setPlatformParams(2, 5000, 3000, 2000)
        await erc20.setAuthenticated(ideaHub.address, true)
        // register account1 as author
        await ideaHub.methods['registerAuthor(bytes32)'](author, {from: accounts[1]})
        // register idea
        await ideaHub.methods['register(bytes32,bytes32)'](idea, content, {from: accounts[1]});

        // publication should fail with 0 validations
        assert.isFalse(await util.isCallOk(ideaHub.publish(1, 1)))

        // register 1 validator, validate the idea and try publish, it should fail.
        await ideaHub.registerValidator(util.randomHex(32), accounts[2])
        await ideaHub.methods['validate(uint256,uint256)'](1, 1, {from: accounts[2]})
        assert.isFalse(await util.isCallOk(ideaHub.publish(1, 1)))

        // register another validate and validate idea. It should succed.
        await ideaHub.registerValidator(util.randomHex(32), accounts[3])
        await ideaHub.methods['validate(uint256,uint256)'](1, 1, {from: accounts[3]})
        await ideaHub.publish(1, 1)

        // expect that the balance is transferred to all the entities.
        assert.equal(5000, await erc20.balanceOf(accounts[1]))
        assert.equal(1500, await erc20.balanceOf(accounts[2]))
        assert.equal(1500, await erc20.balanceOf(accounts[3]))
        assert.equal(2000, await erc20.balanceOf(erc20.address))

    })
});
