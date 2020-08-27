const IdeaHub = artifacts.require("IdeaHub");
const util = require('../util/testutil')

contract('IdeaHub', (accounts) => {
    const author1 = util.randomHex(32);
    const idea1 = util.randomHex(32);
    const idea1Content1 = util.randomHex(32)

    it("Should Register and Return ideas correctly When called by author", async () => {
        const ideaHub = await IdeaHub.deployed();
        await ideaHub.methods['registerAuthor(bytes32)'](author1, {from: accounts[0]});
        await ideaHub.register(idea1, idea1Content1)

        let idea1Response = await ideaHub.ideas(1)
        assert.equal(idea1Response.id, idea1)
        assert.equal(idea1Response.author, author1)
        assert.equal(idea1Response.isPublished, false)
        assert.equal(idea1Response.revisionCount, 1);

        let revision1Response = await ideaHub.ideaRevision(1, 1);
        assert.equal(revision1Response.contentHash, idea1Content1);
        assert.equal(revision1Response.validations, 0)
    })

    it("Should add revision to idea when called by author", async () => {
        const ideaHub = await IdeaHub.deployed();
        const idea1Content2 = util.randomHex(32);
        const idea1Content3 = util.randomHex(32);
        await ideaHub.register(idea1, idea1Content2)

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

        await ideaHub.register(idea1, idea1Content3)
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

        assert.isFalse(await util.isCallOk(ideaHub.ideaRevision(1, 4)))
    });

    it("Shouldn't register same ideaHash twice", async () => {
        const ideaHub = await IdeaHub.deployed();
        const content = util.randomHex(32);
        assert.isFalse(await util.isCallOk(ideaHub.methods['register(bytes32,bytes32)'](idea1, content, {from: accounts[1]})));
    })

    it("Shouldn't register 0x00 as idea or idea Content", async () => {
        const ideaHub = await IdeaHub.deployed();
        const randomHash = util.randomHex(32)
        const zeros = "0x0000000000000000000000000000000000000000000000000000000000000000"
        assert.isFalse(await util.isCallOk(ideaHub.register(zeros, zeros)))
        assert.isFalse(await util.isCallOk(ideaHub.register(randomHash, zeros)))
        assert.isFalse(await util.isCallOk(ideaHub.register(zeros, randomHash)))

        // can register when not zero
        assert.isNotFalse(await util.isCallOk(ideaHub.register(randomHash, randomHash)))

        // cannot create new revision with zeros
        assert.isFalse(await util.isCallOk(ideaHub.register(randomHash, zeros)))
    })

});