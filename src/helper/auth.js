import jwt from 'jsonwebtoken'
const generateToken = (payload) => {
    const verifyOpts = {
        expiresIn: '6h',
        issuer: 'admintoken'
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, verifyOpts)
    return token
}

export default {
    generateToken
}