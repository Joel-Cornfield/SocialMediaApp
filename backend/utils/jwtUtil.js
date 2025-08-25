const jwt = require("jsonwebtoken");

function generateToken(id, expiresIn='3d') {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn});
}

module.exports = {generateToken};