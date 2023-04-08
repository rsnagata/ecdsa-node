const getAddress = require("./getAddress");
const { signMessage } = require("./signMessage");
const { recoverKey } = require("./recoveryKey");
const { toHex } = require("ethereum-cryptography/utils");


async function verifyPublicKey(publicKey, privateKey) {
    message = ''
    
    const [signature, recoveryBit] = await signMessage(message, privateKey);
    const publicKeyRecovered = await recoverKey(message, signature, recoveryBit);

    return toHex(getAddress(publicKeyRecovered)) === publicKey;
}

module.exports = { verifyPublicKey };
