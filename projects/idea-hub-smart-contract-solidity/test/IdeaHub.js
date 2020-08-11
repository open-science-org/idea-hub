// WARNING: the tests withinn the  block
//
// contract('IdeaHub', (accounts) => {
//      it("test1",..)
//      it("test2",...)
// })
//
// are executed sequentially and may depend on the changes made by previous test within the block
// When changing a test make sure that it doesn't interfere with the tests below it on the same block.
//
const assert = require('chai').assert;
const IdeaHub = artifacts.require("IdeaHub");
const IssuableErc20 = artifacts.require("IssuableErc20")
var abi = require('ethereumjs-abi')
var utils = require('ethereumjs-utils')

async function isCallOk(_execution) {
    try {
        await _execution;
        return true;
    } catch (e) {
        if (e.message.includes("VM Exception while processing transaction: revert") || e.message.includes("VM Exception while processing transaction: invalid opcode")) {
            return false;
        }
        throw e;
    }
}

function randomHex(byteCount) {
    var _random = "0x"
    while (byteCount >= 5) {
        _random += Math.random().toString(16).slice(2, 12)
        byteCount -= 5;
    }
    if (byteCount > 0) {
        _random += Math.random().toString(16).slice(2, 2 + byteCount * 2)
    }
    return _random
}

async function getSignatureParams(data, account) {
    let signature = await web3.eth.sign(data, account);
    let r = signature.slice(0, 66)
    let s = "0x" + signature.slice(66, 130)
    let v = parseInt(signature.slice(130, 132), 16)
    return [r, s, v];
}

// user registration related
contract('IdeaHub', (accounts) => {
    // uses account 0&1 for test
    it("Should Register and Show Author correctly, When called by the author", async () => {
        const ideaHub = await IdeaHub.deployed();
        const authorId1 = randomHex(32);
        const authorId2 = randomHex(32);
        assert.equal(await ideaHub.authorAddress(authorId1), "0x0000000000000000000000000000000000000000", "1. AuthorAddress lookup should return 0x00.. when author doesn't exist ")
        assert.equal(await ideaHub.authorAddress(authorId2), "0x0000000000000000000000000000000000000000", "2. AuthorAddress lookup should return 0x00.. when authro doesn't exist")

        // as this one says https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts#invoking-overloaded-methods
        // The current implementation of Truffle's contract abstraction can mistakenly infer the signature of an overloaded method even though it exists in the contract ABI
        // this maneuver prevents that from happening
        await ideaHub.methods['registerAuthor(bytes32)'](authorId1, {from: accounts[0]})
        assert.equal(await ideaHub.authorAddress(authorId1), accounts[0], "1. Author should be lookupable after registering")
        assert.equal(await ideaHub.authorId(accounts[0]), authorId1, "2. Author should be lookupable after registering")
        assert.equal(await ideaHub.authorAddress(authorId2), "0x0000000000000000000000000000000000000000", "3. AuthorAddress lookup should return 0x00.. when authro doesn't exist")

        await ideaHub.methods['registerAuthor(bytes32)'](authorId2, {from: accounts[1]})
        assert.equal(await ideaHub.authorAddress(authorId1), accounts[0], "4. Author should be lookupable after registering")
        assert.equal(await ideaHub.authorId(accounts[0]), authorId1, "5. Author should be lookupable after registering")
        assert.equal(await ideaHub.authorAddress(authorId2), accounts[1], "6. Author should be lookupable after registering")
        assert.equal(await ideaHub.authorId(accounts[1]), authorId2, "7. Author should be lookupable after registering")


    });
    // users account 2&3 for test
    it("Should Register and Show Validators correctly", async () => {
        const ideaHub = await IdeaHub.deployed();
        const validatorId1 = randomHex(32);
        const validatorId2 = randomHex(32);
        assert.equal(await ideaHub.validatorAddress(validatorId1), "0x0000000000000000000000000000000000000000", "1. AuthorAddress lookup should return 0x00.. when author doesn't exist ")
        assert.equal(await ideaHub.validatorAddress(validatorId2), "0x0000000000000000000000000000000000000000", "2. AuthorAddress lookup should return 0x00.. when authro doesn't exist")


        await ideaHub.registerValidator(validatorId1, accounts[1])
        assert.equal(await ideaHub.validatorAddress(validatorId1), accounts[1], "1. Author should be lookupable after registering")
        assert.equal(await ideaHub.validatorId(accounts[1]), validatorId1, "2. Author should be lookupable after registering")
        assert.equal(await ideaHub.validatorAddress(validatorId2), "0x0000000000000000000000000000000000000000", "3. AuthorAddress lookup should return 0x00.. when authro doesn't exist")

        await ideaHub.registerValidator(validatorId2, accounts[2])
        assert.equal(await ideaHub.validatorAddress(validatorId1), accounts[1], "4. Author should be lookupable after registering")
        assert.equal(await ideaHub.validatorId(accounts[1]), validatorId1, "5. Author should be lookupable after registering")
        assert.equal(await ideaHub.validatorAddress(validatorId2), accounts[2], "6. Author should be lookupable after registering")
        assert.equal(await ideaHub.validatorId(accounts[2]), validatorId2, "7. Author should be lookupable after registering")
    });
    it("Cannot register validator without permission", async () => {
        const ideaHub = await IdeaHub.deployed();
        const validator = randomHex(32);
        const validatorAddress = randomHex(20)

        assert.equal(await ideaHub.validatorAddress(validator), "0x0000000000000000000000000000000000000000", "1. AuthorAddress lookup should return 0x00.. when author doesn't exist ")
        // registerValidator should fail when called from accounts[3]
        assert.isFalse(await isCallOk(ideaHub.methods['registerValidator(bytes32,address)'](validator, validatorAddress, {from: accounts[3]})))

        await ideaHub.setAuthenticated(accounts[3], true)

        // registerValidator should succeed after the accounts[3] is given permission
        await ideaHub.methods['registerValidator(bytes32,address)'](validator, validatorAddress, {from: accounts[3]})

    })


})
// idea registration related
contract('IdeaHub', (accounts) => {
    const author1 = randomHex(32);
    const idea1 = randomHex(32);
    const idea1Content1 = randomHex(32)
    it("Can register and view idea details", async () => {
        const ideaHub = await IdeaHub.deployed();
        const idea1Content2 = randomHex(32);
        await ideaHub.methods['registerAuthor(bytes32)'](author1, {from: accounts[0]});
        let tx = await ideaHub.register(idea1, idea1Content1)

        let idea1Response = await ideaHub.ideas(1)
        assert.equal(idea1Response.id, idea1)
        assert.equal(idea1Response.author, author1)
        assert.equal(idea1Response.isPublished, false)
        assert.equal(idea1Response.revisionCount, 1);

        let revision1Response = await ideaHub.ideaRevision(1, 1);
        assert.equal(revision1Response.contentHash, idea1Content1);
        assert.equal(revision1Response.validations, 0)
    })

    it("Can add new revision to idea", async () => {
        const ideaHub = await IdeaHub.deployed();
        const idea1Content2 = randomHex(32);
        const idea1Content3 = randomHex(32);
        let tx = await ideaHub.register(idea1, idea1Content2)

        let idea1Response = await ideaHub.ideas(1)
        assert.equal(idea1Response.id, idea1)
        assert.equal(idea1Response.author, author1)
        assert.equal(idea1Response.isPublished, false)
        assert.equal(idea1Response.revisionCount, 2);

        let revision1Response = await ideaHub.ideaRevision(1, 1);
        assert.equal(revision1Response.contentHash, idea1Content1);
        assert.equal(revision1Response.validations, 0)

        let revision2Response = await ideaHub.ideaRevision(1, 2);
        assert.equal(revision2Response.contentHash, idea1Content2);
        assert.equal(revision2Response.validations, 0)

        tx = await ideaHub.register(idea1, idea1Content3)
        assert.equal(idea1Response.id, idea1)
        assert.equal(idea1Response.author, author1)
        assert.equal(idea1Response.isPublished, false)
        assert.equal(idea1Response.revisionCount, 2);

        revision1Response = await ideaHub.ideaRevision(1, 1);
        assert.equal(revision1Response.contentHash, idea1Content1);
        assert.equal(revision1Response.validations, 0)

        revision2Response = await ideaHub.ideaRevision(1, 2);
        assert.equal(revision2Response.contentHash, idea1Content2);
        assert.equal(revision2Response.validations, 0)

        let revision3Response = await ideaHub.ideaRevision(1, 3);
        assert.equal(revision3Response.contentHash, idea1Content3);
        assert.equal(revision3Response.validations, 0)

        assert.isFalse(await isCallOk(ideaHub.ideaRevision(1, 4)))
    });

    it("Cannot register same ideaHash by another author", async () => {
        const ideaHub = await IdeaHub.deployed();
        const content = randomHex(32);
        assert.isFalse(await isCallOk(ideaHub.methods['register(bytes32,bytes32)'](idea1, content, {from: accounts[1]})));
    })
    it("Cannot register 0x00 as idea or idea Content", async () => {
        const ideaHub = await IdeaHub.deployed();
        const randomHash = randomHex(32)
        const zeros = "0x0000000000000000000000000000000000000000000000000000000000000000"
        assert.isFalse(await isCallOk(ideaHub.register(zeros, zeros)))
        assert.isFalse(await isCallOk(ideaHub.register(randomHash, zeros)))
        assert.isFalse(await isCallOk(ideaHub.register(zeros, randomHash)))
        // can register when not zero
        assert.isNotFalse(await isCallOk(ideaHub.register(randomHash, randomHash)))
        // cannot create new revision with zeros
        assert.isFalse(await isCallOk(ideaHub.register(randomHash, zeros)))

        const idea = randomHex(32);

    })

});

// idea validation and publication related
contract('IdeaHub', (accounts) => {
    const author1 = randomHex(32);
    const idea1 = randomHex(32);
    const idea1Content1 = randomHex(32);
    var validator1, validator2;

    it("Can validate idea and details is updated", async () => {
        const ideaHub = await IdeaHub.deployed();
        const idea1Content2 = randomHex(32);
        await ideaHub.methods['registerAuthor(bytes32)'](author1, {from: accounts[1]});
        let tx = await ideaHub.register(idea1, idea1Content1)

        validator1 = randomHex(32)
        validator2 = randomHex(32)
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
        let validator = randomHex(32)

        assert.isFalse(await isCallOk(ideaHub.methods['validate(uint256,uint256)'](1, 1, {from: accounts[4]})))
        await ideaHub.registerValidator(validator, accounts[4])
        assert.isNotFalse(await isCallOk(ideaHub.methods['validate(uint256,uint256)'](1, 1, {from: accounts[4]})))
        assert.isFalse(await isCallOk(ideaHub.methods['validate(uint256,uint256)'](1, 1, {from: accounts[4]})))

    })
    it("Cannot validate non existing idea", async () => {
        const ideaHub = await IdeaHub.deployed();

        assert.isFalse(await isCallOk(ideaHub.methods['validate(uint256,uint256)'](1, 5, {from: accounts[2]})))
        assert.isFalse(await isCallOk(ideaHub.methods['validate(uint256,uint256)'](2, 5, {from: accounts[2]})))
        assert.isFalse(await isCallOk(ideaHub.methods['validate(uint256,uint256)'](1, 0, {from: accounts[2]})))
        assert.isFalse(await isCallOk(ideaHub.methods['validate(uint256,uint256)'](-1, -1, {from: accounts[2]})))
    })
})
contract('IdeaHub', (accounts) => {

    it("Can publish only after reaching validationThreshold", async () => {
        const ideaHub = await IdeaHub.deployed()
        const erc20 = await IssuableErc20.deployed()
        var author = randomHex(32)
        var idea = randomHex(32)
        var content = randomHex(32)

        // make initial preparations
        await ideaHub.setPlatformParams(2, 5000, 3000, 2000)
        await erc20.setAuthenticated(ideaHub.address, true)
        // register account1 as author
        await ideaHub.methods['registerAuthor(bytes32)'](author, {from: accounts[1]})
        // register idea
        await ideaHub.methods['register(bytes32,bytes32)'](idea, content, {from: accounts[1]});

        // publication should fail with 0 validations
        assert.isFalse(await isCallOk(ideaHub.publish(1, 1)))

        // register 1 validator, validate the idea and try publish, it should fail.
        await ideaHub.registerValidator(randomHex(32), accounts[2])
        await ideaHub.methods['validate(uint256,uint256)'](1, 1, {from: accounts[2]})
        assert.isFalse(await isCallOk(ideaHub.publish(1, 1)))

        // register another validate and validate idea. It should succed.
        await ideaHub.registerValidator(randomHex(32), accounts[3])
        await ideaHub.methods['validate(uint256,uint256)'](1, 1, {from: accounts[3]})
        await ideaHub.publish(1, 1)

        // expect that the balance is transferred to all the entities.

        assert.equal(5000, await erc20.balanceOf(accounts[1]))
        assert.equal(1500, await erc20.balanceOf(accounts[2]))
        assert.equal(1500, await erc20.balanceOf(accounts[3]))
        assert.equal(2000, await erc20.balanceOf(erc20.address))

    })
});
