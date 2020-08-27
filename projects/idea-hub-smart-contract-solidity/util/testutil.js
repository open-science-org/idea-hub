
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
module.exports={isCallOk:isCallOk,randomHex:randomHex,getSignatureParams:getSignatureParams}