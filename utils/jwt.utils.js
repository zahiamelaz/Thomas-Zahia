// Imports
const jwt = require('jsonwebtoken')
const JWT_SIGN_SECRET = 'g5s46g5s44g5s4geq87j4gy8k7sf5d154hwr8dw45e(4-qt45hwègs66w'
// Export function
module.exports = {
    generateTokenForUser: (userData) => {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    }
}