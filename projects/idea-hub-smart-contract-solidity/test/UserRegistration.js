const IdeaHub = artifacts.require("IdeaHub");
const util = require('../util/testutil')


contract('IdeaHub', (accounts) => {
    // uses account 0&1 for test
    it("Should Register and Show Author correctly when called by the author", async () => {
        const ideaHub = await IdeaHub.deployed();
        const authorId1 = util.randomHex(32);
        const authorId2 = util.randomHex(32);
        assert.equal(await ideaHub.authorAddress(authorId1), "0x0000000000000000000000000000000000000000", "1. AuthorAddress lookup should return 0x00.. when author doesn't exist ")
        assert.equal(await ideaHub.authorAddress(authorId2), "0x0000000000000000000000000000000000000000", "2. AuthorAddress lookup should return 0x00.. when author doesn't exist")

        // as the documentation here says https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts#invoking-overloaded-methods
        // The current implementation of Truffle's contract abstraction can mistakenly infer the signature of an overloaded method even though it exists in the contract ABI
        // this maneuver prevents it from happening
        await ideaHub.methods['registerAuthor(bytes32)'](authorId1, {from: accounts[0]})
        assert.equal(await ideaHub.authorAddress(authorId1), accounts[0], "1. Author can be looked up after registering")
        assert.equal(await ideaHub.authorId(accounts[0]), authorId1, "2. Author can be looked up after registering")
        assert.equal(await ideaHub.authorAddress(authorId2), "0x0000000000000000000000000000000000000000", "3. AuthorAddress lookup should return 0x00.. when author doesn't exist")

        await ideaHub.methods['registerAuthor(bytes32)'](authorId2, {from: accounts[1]})
        assert.equal(await ideaHub.authorAddress(authorId1), accounts[0], "4. Author can be looked up after registering")
        assert.equal(await ideaHub.authorId(accounts[0]), authorId1, "5. Author can be looked up after registering")
        assert.equal(await ideaHub.authorAddress(authorId2), accounts[1], "6. Author can be looked up after registering")
        assert.equal(await ideaHub.authorId(accounts[1]), authorId2, "7. Author can be looked up after registering")


    });
    // users account 2&3 for test
    it("Should Register and Show Validators correctly", async () => {
        const ideaHub = await IdeaHub.deployed();
        const validatorId1 = util.randomHex(32);
        const validatorId2 = util.randomHex(32);
        assert.equal(await ideaHub.validatorAddress(validatorId1), "0x0000000000000000000000000000000000000000", "1. AuthorAddress lookup should return 0x00.. when author doesn't exist ")
        assert.equal(await ideaHub.validatorAddress(validatorId2), "0x0000000000000000000000000000000000000000", "2. AuthorAddress lookup should return 0x00.. when author doesn't exist")


        await ideaHub.registerValidator(validatorId1, accounts[1])
        assert.equal(await ideaHub.validatorAddress(validatorId1), accounts[1], "1. Author can be looked up after registering")
        assert.equal(await ideaHub.validatorId(accounts[1]), validatorId1, "2. Author can be looked up after registering")
        assert.equal(await ideaHub.validatorAddress(validatorId2), "0x0000000000000000000000000000000000000000", "3. AuthorAddress lookup should return 0x00.. when author doesn't exist")

        await ideaHub.registerValidator(validatorId2, accounts[2])
        assert.equal(await ideaHub.validatorAddress(validatorId1), accounts[1], "4. Author can be looked up after registering")
        assert.equal(await ideaHub.validatorId(accounts[1]), validatorId1, "5. Author can be looked up after registering")
        assert.equal(await ideaHub.validatorAddress(validatorId2), accounts[2], "6. Author can be looked up after registering")
        assert.equal(await ideaHub.validatorId(accounts[2]), validatorId2, "7. Author can be looked up after registering")
    });
    // uses account 3 for test
    it("Cannot register validator without permission", async () => {
        const ideaHub = await IdeaHub.deployed();
        const validator = util.randomHex(32);
        const validatorAddress = util.randomHex(20)

        assert.equal(await ideaHub.validatorAddress(validator), "0x0000000000000000000000000000000000000000", "1. AuthorAddress lookup should return 0x00.. when author doesn't exist ")
        // registerValidator should fail when called from accounts[3]
        assert.isFalse(await util.isCallOk(ideaHub.methods['registerValidator(bytes32,address)'](validator, validatorAddress, {from: accounts[3]})))

        await ideaHub.setAuthenticated(accounts[3], true)

        // registerValidator should succeed after the accounts[3] is given permission
        await ideaHub.methods['registerValidator(bytes32,address)'](validator, validatorAddress, {from: accounts[3]})

    })


})
