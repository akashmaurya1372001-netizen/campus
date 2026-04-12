import jwt from 'jsonwebtoken';
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret', {
        expiresIn: '30d',
    });
};
export default generateToken;
//# sourceMappingURL=generateToken.js.map