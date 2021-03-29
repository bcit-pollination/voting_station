const pbkdf2 = require('pbkdf2')

const SALT_LENGTH = 32
const ITERATIONS = 150000
const KEY_LENGTH = 32
const HASH_ALGO = 'sha256'

/**
 * Hashes the given string and compares it against the given checkHash. The salt value at the start
 * of the checkHash is used to hash the password string.
 * 
 * @param {string} password 
 * @param {Buffer} checkHash 
 * @returns {boolean} if password matches the checkHash 
 */
function checkPassword(password, checkHash) {
    let salt = checkHash.toString().substr(0, SALT_LENGTH);

    passwordHash = pbkdf2.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, HASH_ALGO);

    return Buffer.compare(passwordHash, checkHash.slice(SALT_LENGTH)) === 0;
}

/**
 * Takes a base64 encoded string and returns a Buffer
 * 
 * @param {string} password 
 * @returns {Buffer} decoded string
 */
function decodeBase64(password) {
    return Buffer.from(password, 'base64');
}

module.exports = {
    checkPassword,
    decodeBase64
}